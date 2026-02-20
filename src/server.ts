import express from 'express';
import cors from 'cors';
import { config } from './lib/config';
import { corsOptions } from './lib/cors';
import {
    helmetSecurity,
    limiter,
    authLimiter,
    dataSanitizer,
    compressionMiddleware,
    customSecurityHeaders,
} from './lib/security';
import { connectDatabase } from './lib/database';
import logger from './lib/logger';

const app = express();

// Trust proxy
app.set('trust proxy', 1);

// Security middleware (order matters)
app.use(helmetSecurity);
app.use(customSecurityHeaders);
app.use(compressionMiddleware);
app.use(cors(corsOptions));
app.use(limiter);
app.use(express.json({ limit: '10kb' })); // Limit payload size
app.use(express.urlencoded({ limit: '10kb', extended: true }));
app.use(dataSanitizer);

// Health check endpoint (no auth required)
app.get('/health', (_req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Auth routes with stricter rate limiting
app.use('/api/auth', authLimiter);

// Routes will go here
// app.use('/api/users', userRoutes);
// app.use('/api/trust', trustRoutes);

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logger.error(err);

    // Don't expose internal error details in production
    const message = config.node_env === 'production'
        ? 'Internal server error'
        : err.message;

    res.status(err.statusCode || 500).json({ error: message });
});

// 404 handler
app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Start server
async function start() {
    try {
        await connectDatabase();

        app.listen(config.api_port, () => {
            logger.info(`Server running on port ${config.api_port}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

start();

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

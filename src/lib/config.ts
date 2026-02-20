import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Validate required environment variables
const requiredVars = [
    'JWT_SECRET',
    'DB_HOST',
    'DB_PORT',
    'NODE_ENV',
];

const missing = requiredVars.filter(v => !process.env[v]);
if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

export const config = {
    node_env: process.env.NODE_ENV || 'development',
    api_port: parseInt(process.env.API_PORT || '3000', 10),

    jwt: {
        secret: process.env.JWT_SECRET!,
        expiresIn: process.env.JWT_EXPIRATION || '24h',
    },

    database: {
        host: process.env.DB_HOST!,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        name: process.env.DB_NAME || 'kok_trust_ai',
        user: process.env.DB_USER!,
        password: process.env.DB_PASSWORD!,
    },

    security: {
        corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '15', 10),
        rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    },

    logging: {
        level: process.env.LOG_LEVEL || 'info',
    },
};

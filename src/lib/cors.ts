import { CorsOptions } from 'cors';
import { config } from './config';

const allowedOrigins = (config.security.corsOrigin || 'http://localhost:3000')
    .split(',')
    .map(origin => origin.trim());

export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS policy violation'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
    maxAge: 86400, // 24 hours
};

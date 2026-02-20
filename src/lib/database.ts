import mongoose from 'mongoose';
import { config } from './config';

const mongoUri = `mongodb://${config.database.user}:${encodeURIComponent(
    config.database.password
)}@${config.database.host}:${config.database.port}/${config.database.name}?authSource=admin&ssl=true`;

export async function connectDatabase() {
    try {
        await mongoose.connect(mongoUri, {
            // Security options
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            retryWrites: true,
            w: 'majority', // Require write acknowledgment from majority
            authSource: 'admin',
            maxPoolSize: 10,
            minPoolSize: 2,
        });

        console.log('Database connected securely');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}

// Connection error handling
mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
});

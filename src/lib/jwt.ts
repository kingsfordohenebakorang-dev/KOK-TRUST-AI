import jwt from 'jsonwebtoken';
import { config } from './config';
import { Request, Response, NextFunction } from 'express';

interface JWTPayload {
    userId: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}

export class JWTManager {
    static generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
        return jwt.sign(payload, config.jwt.secret, {
            expiresIn: config.jwt.expiresIn,
            algorithm: 'HS256',
        });
    }

    static verifyToken(token: string): JWTPayload {
        try {
            return jwt.verify(token, config.jwt.secret, {
                algorithms: ['HS256'],
            }) as JWTPayload;
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    static decodeToken(token: string): JWTPayload | null {
        return jwt.decode(token) as JWTPayload | null;
    }
}

// Authentication middleware
export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1]; // "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const decoded = JWTManager.verifyToken(token);
        (req as any).user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};

// Role-based authorization
export const authorize = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;

        if (!user || !allowedRoles.includes(user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        next();
    };
};

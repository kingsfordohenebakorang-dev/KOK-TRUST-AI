import { body, validationResult, param, query } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Validation error handler
export const handleValidationErrors = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};

// Common validation chains
export const validators = {
    email: body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid email format'),

    password: body('password')
        .isLength({ min: 12 })
        .withMessage('Password must be at least 12 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]/)
        .withMessage(
            'Password must contain uppercase, lowercase, number, and special character'
        ),

    username: body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be 3-30 characters')
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage('Username can only contain letters, numbers, underscore, and hyphen'),

    id: param('id')
        .isMongoId()
        .withMessage('Invalid ID format'),

    searchQuery: query('q')
        .trim()
        .isLength({ max: 100 })
        .withMessage('Search query too long'),
};

// XSS prevention
export const sanitizeInput = body('*')
    .trim()
    .escape()
    .withMessage('Invalid input');

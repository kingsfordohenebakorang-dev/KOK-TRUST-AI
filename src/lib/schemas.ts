import { z } from "zod";

// Auth validators
export const signUpSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(12, "Password must be at least 12 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]/,
            "Password must contain uppercase, lowercase, number, and special character"
        ),
    confirmPassword: z.string(),
    name: z.string().min(2).max(50),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
    name: z.string().min(2).max(50).optional(),
    bio: z.string().max(500).optional(),
});

// Trust & AI validators
export const trustScoreSchema = z.object({
    userId: z.string().uuid(),
    score: z.number().min(0).max(100),
    reason: z.string().min(10).max(1000),
});

export const aiAnalysisSchema = z.object({
    content: z.string().min(1).max(10000),
    type: z.enum(["document", "code", "text", "image"]),
});

// Export types
export type SignUpInput = z.infer<typeof signUpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type TrustScoreInput = z.infer<typeof trustScoreSchema>;
export type AIAnalysisInput = z.infer<typeof aiAnalysisSchema>;

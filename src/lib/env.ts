import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    NEXT_PUBLIC_API_URL: z.string().url(),
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
    OPENAI_API_KEY: z.string().optional(),
    NEXTAUTH_URL: z.string().url().optional(),
    API_PORT: z.string().default("3000"),
    LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

type Env = z.infer<typeof envSchema>;

let validatedEnv: Env | null = null;

export function getEnv(): Env {
    if (validatedEnv) return validatedEnv;

    try {
        validatedEnv = envSchema.parse(process.env);
        return validatedEnv;
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("❌ Environment validation failed:");
            const zErr = error as any;
            zErr.errors.forEach((err: any) => {
                console.error(`   ${err.path.join(".")}: ${err.message}`);
            });
        }
        throw new Error("Invalid environment variables - check .env file");
    }
}

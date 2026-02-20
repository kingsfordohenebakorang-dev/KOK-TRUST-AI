import { NextRequest, NextResponse } from "next/server";
import { signUpSchema } from "@/lib/schemas";
import {
    checkRateLimit,
    getClientIp,
    handleAPIError,
    sendSecurityHeaders,
} from "@/lib/api";
import { z } from "zod";

export async function POST(request: NextRequest) {
    try {
        // Rate limiting
        const ip = getClientIp(request);
        const { allowed, remaining } = checkRateLimit(ip, 5, 900000); // 5 per 15 min

        if (!allowed) {
            const response = NextResponse.json(
                { error: "Too many signup attempts. Try again later." },
                { status: 429 }
            );
            return sendSecurityHeaders(response);
        }

        // Parse request
        const body = await request.json();

        // Validate input
        const validatedData = signUpSchema.parse(body);

        // TODO: Hash password, create user, save to DB
        // const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        const response = NextResponse.json(
            {
                message: "Signup successful",
                // TODO: return user data and token
            },
            { status: 201 }
        );

        response.headers.set("X-RateLimit-Remaining", remaining.toString());
        return sendSecurityHeaders(response);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const zErr = error as any;
            return NextResponse.json(
                {
                    error: "Validation failed",
                    issues: zErr.errors.map((e: any) => ({
                        path: e.path.join("."),
                        message: e.message,
                    })),
                },
                { status: 400 }
            );
        }

        return handleAPIError(error, 500);
    }
}

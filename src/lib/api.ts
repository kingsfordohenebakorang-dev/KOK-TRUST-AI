import { NextRequest, NextResponse } from "next/server";

// Rate limiting (in-memory for dev, use Redis for production)
const rateLimitMap = new Map<
    string,
    { count: number; resetTime: number }[]
>();

export function getClientIp(request: NextRequest): string {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(";")[0] : request.ip || "unknown";
    return ip.trim();
}

export function checkRateLimit(
    ip: string,
    limit: number = 100,
    windowMs: number = 60000
): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const key = ip;

    if (!rateLimitMap.has(key)) {
        rateLimitMap.set(key, []);
    }

    const requests = rateLimitMap.get(key)!;

    // Clean old requests
    const validRequests = requests.filter((req) => req.resetTime > now);

    if (validRequests.length >= limit) {
        return { allowed: false, remaining: 0 };
    }

    // Add current request
    validRequests.push({ count: 1, resetTime: now + windowMs });
    rateLimitMap.set(key, validRequests);

    return {
        allowed: true,
        remaining: limit - validRequests.length,
    };
}

export function handleAPIError(
    error: unknown,
    statusCode: number = 500
) {
    console.error("API Error:", error);

    const isDevelopment = process.env.NODE_ENV === "development";

    if (error instanceof SyntaxError) {
        return NextResponse.json(
            {
                error: "Invalid request format",
                ...(isDevelopment && { details: error.message }),
            },
            { status: 400 }
        );
    }

    const message =
        isDevelopment && error instanceof Error
            ? error.message
            : "An error occurred processing your request";

    return NextResponse.json({ error: message }, { status: statusCode });
}

export function sendSecurityHeaders(response: NextResponse) {
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    return response;
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // Security headers
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "SAMEORIGIN");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set(
        "Referrer-Policy",
        "strict-origin-when-cross-origin"
    );
    response.headers.set(
        "Permissions-Policy",
        "geolocation=(), microphone=(), camera=()"
    );
    response.headers.set(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains"
    );

    // Remove server identification
    response.headers.delete("Server");
    response.headers.delete("X-Powered-By");

    return response;
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

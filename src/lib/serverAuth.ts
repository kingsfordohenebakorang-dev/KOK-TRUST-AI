import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export interface AuthPayload {
    userId: string;
    email: string;
    role: "user" | "admin" | "moderator";
}

export function verifyJWT(token: string): AuthPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
        return decoded;
    } catch (error) {
        return null;
    }
}

export function generateJWT(payload: AuthPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: "24h",
        algorithm: "HS256",
    });
}

export async function authenticateRequest(
    request: NextRequest
): Promise<{ user: AuthPayload | null; error: NextResponse | null }> {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
        return {
            user: null,
            error: NextResponse.json(
                { error: "Missing authorization header" },
                { status: 401 }
            ),
        };
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return {
            user: null,
            error: NextResponse.json(
                { error: "Invalid authorization format" },
                { status: 401 }
            ),
        };
    }

    const user = verifyJWT(parts[1]);
    if (!user) {
        return {
            user: null,
            error: NextResponse.json({ error: "Invalid token" }, { status: 403 }),
        };
    }

    return { user, error: null };
}

export function requireRole(user: AuthPayload | null, ...roles: string[]) {
    if (!user || !roles.includes(user.role)) {
        return NextResponse.json(
            { error: "Insufficient permissions" },
            { status: 403 }
        );
    }
    return null;
}

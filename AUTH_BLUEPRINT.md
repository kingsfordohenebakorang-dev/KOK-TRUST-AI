# Authentication & Identity System Blueprint

## 1. Auth Architecture (JWT + Refresh Token Rotation)

We will use a stateless **JWT (JSON Web Token)** strategy for API authorization, backed by **HTTP-Only Cookies** for secure session persistence. This prevents XSS attacks from stealing tokens (common with localStorage).

### **Flow:**
1.  **Login:** User sends credentials.
2.  **Server:** Validates & Issues:
    *   `accessToken` (Expiry: 15min) -> Sent in Response Body (for memory).
    *   `refreshToken` (Expiry: 7d) -> Sent in `Set-Cookie` header (HttpOnly, Secure, SameSite=Strict).
3.  **Client:** Stores `accessToken` in React Context/Memory.
4.  **Request:** Client sends `Authorization: Bearer <accessToken>`.
5.  **Expiry:** If 401 Unauthorized -> Client calls `/auth/refresh` (cookie sent automatically) -> Server issues new tokens.

---

## 2. Database Schema (PostgreSQL / Supabase Ready)

```sql
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'ta', 'instructor', 'institution_admin', 'super_admin');
END $$;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- Nullable for OAuth-only users
    full_name VARCHAR(100),
    role user_role DEFAULT 'student',
    institution_id UUID REFERENCES institutions(id),
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(100) UNIQUE, -- e.g., 'uwaterloo.ca'
    sso_provider VARCHAR(50), -- 'azure-ad', 'google-workspace'
    sso_metadata JSONB,
    plan_tier VARCHAR(20) DEFAULT 'standard'
);

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 3. Middleware Implementation (Next.js / Edge)

**`middleware.ts` Logic:**

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from '@/lib/auth/jwt';

const PROTECTED_ROUTES = ['/study', '/dashboard', '/upload'];
const ADMIN_ROUTES = ['/admin'];

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('accessToken')?.value; // Or header for API

  if (!token && PROTECTED_ROUTES.some(p => req.nextUrl.pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (token) {
    try {
      const payload = await verifyJwt(token);
      
      // RBAC Check
      if (ADMIN_ROUTES.some(p => req.nextUrl.pathname.startsWith(p))) {
        if (payload.role !== 'super_admin' && payload.role !== 'institution_admin') {
           return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
      }
      
      // Add user info to headers for downstream availability
      const response = NextResponse.next();
      response.headers.set('X-User-Id', payload.id);
      response.headers.set('X-User-Role', payload.role);
      return response;

    } catch (e) {
      // Token invalid/expired
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }
  
  return NextResponse.next();
}
```

---

## 4. API Routes Definition

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Create new student account. |
| `POST` | `/api/auth/login` | Public | Authenticate & set cookies. |
| `POST` | `/api/auth/logout` | Private | Clear cookies & revoke refresh token. |
| `POST` | `/api/auth/refresh` | Public | Use cookie to get new access token. |
| `GET` | `/api/auth/me` | Private | Get current user profile & role. |
| `POST` | `/api/auth/verify-email` | Public | Verify token from email link. |
| `POST` | `/api/auth/reset-password` | Public | Request password reset link. |

---

## 5. Security Checklist (Production)

*   [ ] **HTTPS Only**: Enforce TLS 1.2+ (Vercel/Cloudflare handles this).
*   [ ] **Cookie Policies**: `Secure`, `HttpOnly`, `SameSite=Strict`.
*   [ ] **Rate Limiting**: Use Upstash/Redis to limit login attempts (e.g., 5 per minute per IP).
*   [ ] **CSRF**: Next.js Server Actions automatically handle CSRF, or use `csurf` for API routes.
*   [ ] **Password Hashing**: Use `Argon2id` (preferred) or `bcrypt` with work factor 12+.
*   [ ] **Input Validation**: Zod schemas for all auth endpoints (`email`, `password` complexity).
*   [ ] **Audit Logs**: Log all `login_success`, `login_failed`, `password_change` events to a separate immutable log table.

---

## 6. Frontend Login UI Guidelines (Cinematic)

**Design Requirements:**
*   **Background**: Deep flowing gradient (Indigo/Black) matching the Hero.
*   **Card**: Glassmorphism (blur-xl, white/5 border).
*   **Inputs**: Minimalist, floating labels.
*   **Social Login**: "Continue with Google" (White button), "Institutional Login" (Outline button).
*   **Feedback**: Shake animation on error. Success confetti on registration.

**Component Structure:**
*   `LoginForm.tsx` (Client Component)
*   `SocialAuthButtons.tsx`
*   `AuthLayout.tsx` (Wraps login/register pages with the animated background)

This architecture ensures a **bank-grade security posture** suitable for handling proprietary actuarial data and university content, while maintaining the "Cinematic" user experience.

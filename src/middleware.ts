import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ?? "";

// In-memory cache so we don't call the backend on every navigation.
const sessionCache = new Map<string, { valid: boolean; expiry: number }>();
const CACHE_TTL_MS = 60_000; // re-verify every 60 s

/**
 * Three possible outcomes:
 *   true  — backend confirmed the session is valid
 *   false — backend explicitly rejected it (401)
 *   null  — network/timeout error; we don't know → caller should fail open
 */
async function checkSession(token: string, isBearer: boolean): Promise<boolean | null> {
    if (!BACKEND_URL) {
        console.warn("[middleware] BACKEND_URL is not set — failing open");
        return null;
    }

    // Serve from cache when possible
    const cached = sessionCache.get(token);
    if (cached && cached.expiry > Date.now()) {
        return cached.valid;
    }

    try {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (isBearer) {
            headers.Authorization = `Bearer ${token}`;
        } else {
            headers.Cookie = `session=${token}`;
        }

        // 8 s — generous enough to survive a cold-start backend wake-up
        const res = await fetch(`${BACKEND_URL}/api/auth/verify`, {
            method: "GET",
            headers,
            signal: AbortSignal.timeout(8000),
        });

        // Only cache definitive answers from the backend
        const valid = res.ok;
        sessionCache.set(token, { valid, expiry: Date.now() + CACHE_TTL_MS });

        // Evict expired entries to prevent unbounded growth
        if (sessionCache.size > 500) {
            const now = Date.now();
            for (const [key, entry] of sessionCache) {
                if (entry.expiry <= now) sessionCache.delete(key);
            }
        }

        return valid;
    } catch (err) {
        // Timeout or network failure — return null so caller can fail open.
        // Do NOT cache this: the next navigation should retry.
        console.error("[middleware] session verify failed (failing open):", err instanceof Error ? err.message : err);
        return null;
    }
}

export async function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get("session");
    const fallbackToken = request.cookies.get("sessionToken");
    const { pathname } = request.nextUrl;

    const isProtected = pathname.startsWith("/dashboard");
    const isAuthPage = pathname === "/login" || pathname === "/signup";

    const tokenToVerify = sessionCookie?.value ?? fallbackToken?.value;

    // No token at all — fast path, no backend call needed
    if (!tokenToVerify) {
        if (isProtected) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        return NextResponse.next();
    }

    const result = await checkSession(tokenToVerify, !sessionCookie && !!fallbackToken);

    if (result === false) {
        // Backend explicitly said the session is invalid — clean up and redirect
        const response = isProtected
            ? NextResponse.redirect(new URL("/login", request.url))
            : NextResponse.next();
        response.cookies.delete("session");
        response.cookies.delete("sessionToken");
        return response;
    }

    // result === true  → valid session
    // result === null  → backend unreachable; fail open (don't kick the user out)
    if (isAuthPage && result === true) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/signup"],
};

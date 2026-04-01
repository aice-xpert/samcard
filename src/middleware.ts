import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ?? "";

/**
 * Ask the backend whether the current session cookie is still valid.
 * We call a lightweight endpoint that just runs verifySession and returns 200/401.
 * If the network call itself fails we treat the session as invalid so the user
 * is never silently locked out.
 */
async function isSessionValid(sessionCookie: string): Promise<boolean> {
    if (!BACKEND_URL) return false;
    try {
        const res = await fetch(`${BACKEND_URL}/api/auth/verify`, {
            method: "GET",
            headers: {
                Cookie: `session=${sessionCookie}`,
                "Content-Type": "application/json",
            },
            // Edge runtime has no keepAlive — keep the timeout short
            signal: AbortSignal.timeout(3000),
        });
        return res.ok;
    } catch {
        // Network error or timeout — fail open so legitimate users aren't locked out
        // Change to `return false` if you'd rather fail closed
        return false;
    }
}

export async function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get("session");
    const { pathname } = request.nextUrl;

    const isProtected = pathname.startsWith("/dashboard");
    const isAuthPage = pathname === "/login" || pathname === "/signup";

    // No cookie at all — fast path, no backend call needed
    if (!sessionCookie) {
        if (isProtected) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        return NextResponse.next();
    }

    // Cookie exists — verify it's actually valid
    const valid = await isSessionValid(sessionCookie.value);

    if (!valid) {
        // Clear the stale cookie so the redirect loop doesn't repeat
        const response = isProtected
            ? NextResponse.redirect(new URL("/login", request.url))
            : NextResponse.next();

        response.cookies.delete("session");
        return response;
    }

    // Valid session — redirect away from auth pages
    if (isAuthPage) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/login", "/signup"],
};
/**
 * oauth.ts — Passport.js server-side OAuth for Google & Facebook
 *
 * Mount this router in your main app:
 *   app.use("/api/auth/oauth", oauthRouter);
 *
 * Required env vars:
 *   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
 *   FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET
 *   JWT_SECRET
 *   FRONTEND_URL  (e.g. http://localhost:3000)
 *   BACKEND_URL   (e.g. http://localhost:4000)
 */

import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy, Profile as GoogleProfile, VerifyCallback } from "passport-google-oauth20";
import { Strategy as FacebookStrategy, Profile as FacebookProfile } from "passport-facebook";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "5d";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 5 * 1000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

// ── Shared: upsert an OAuth user in Supabase & return a JWT ──────────────────
async function handleOAuthUser(profile: {
  id: string;
  email: string;
  name: string;
  provider: "google" | "facebook";
}): Promise<string> {
  const now = new Date().toISOString();

  const { data: existing } = await supabase
    .from("User")
    .select("id, email, name")
    .eq("email", profile.email)
    .maybeSingle();

  let user: { id: string; email: string; name: string } | null = null;

  if (existing) {
    const { data: updated, error } = await supabase
      .from("User")
      .update({ lastLoginAt: now, updatedAt: now })
      .eq("id", existing.id)
      .select("id, email, name")
      .single();

    if (error || !updated) {
      console.error(`[oauth] Supabase update failed for ${profile.provider}:`, error);
      throw new Error("Failed to sync OAuth user");
    }
    user = updated;
  } else {
    const { data: inserted, error } = await supabase
      .from("User")
      .insert({
        email: profile.email,
        name: profile.name,
        createdAt: now,
        updatedAt: now,
        lastLoginAt: now,
      })
      .select("id, email, name")
      .single();

    if (error || !inserted) {
      console.error(`[oauth] Supabase insert failed for ${profile.provider}:`, error);
      throw new Error("Failed to sync OAuth user");
    }
    user = inserted;
  }

  const payload = { uid: user.id, email: user.email, name: user.name };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// ── Helper: attach session cookie + redirect to frontend ─────────────────────
function sendSessionAndRedirect(
  res: express.Response,
  token: string,
  redirectPath = "/dashboard"
) {
  res.cookie("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  // Pass token in the URL fragment so the frontend can stash it in localStorage
  // for cross-origin Bearer-token use in dev. The fragment never reaches the server.
  return res.redirect(`${FRONTEND_URL}${redirectPath}#token=${token}`);
}

const googleConfigured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
const facebookConfigured = !!(process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET);

// ── Google Strategy ───────────────────────────────────────────────────────────
if (googleConfigured) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: `${BACKEND_URL}/api/auth/oauth/google/callback`,
      },
      async (_accessToken: string, _refreshToken: string, profile: GoogleProfile, done: VerifyCallback) => {
        try {
          const email =
            profile.emails?.[0]?.value ?? `${profile.id}@google.noemail`;
          const name = profile.displayName || profile.id;
          const token = await handleOAuthUser({ id: profile.id, email, name, provider: "google" });
          done(null, { token } as unknown as Express.User);
        } catch (err) {
          done(err as Error);
        }
      }
    )
  );
} else {
  console.warn("[oauth] Google OAuth disabled — GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not set");
}

// ── Facebook Strategy ─────────────────────────────────────────────────────────
if (facebookConfigured) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_CLIENT_ID!,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
        callbackURL: `${BACKEND_URL}/api/auth/oauth/facebook/callback`,
        profileFields: ["id", "displayName", "emails", "picture"],
      },
      async (_accessToken: string, _refreshToken: string, profile: FacebookProfile, done: (err: Error | null, user?: unknown) => void) => {
        try {
          const email =
            (profile.emails as { value: string }[] | undefined)?.[0]?.value ??
            `${profile.id}@facebook.noemail`;
          const name = profile.displayName || profile.id;
          const token = await handleOAuthUser({ id: String(profile.id), email, name, provider: "facebook" });
          done(null, { token } as unknown as Express.User);
        } catch (err) {
          done(err as Error);
        }
      }
    )
  );
} else {
  console.warn("[oauth] Facebook OAuth disabled — FACEBOOK_CLIENT_ID / FACEBOOK_CLIENT_SECRET not set");
}

// Passport needs these even if we're not using sessions
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user as Express.User));

const oauthNotConfigured = (provider: string) => (_req: express.Request, res: express.Response) =>
  res.status(503).json({ error: `${provider} OAuth is not configured on this server` });

// ── Google routes ─────────────────────────────────────────────────────────────
router.get(
  "/google",
  googleConfigured
    ? passport.authenticate("google", { scope: ["profile", "email"], session: false })
    : oauthNotConfigured("Google")
);

router.get(
  "/google/callback",
  ...(googleConfigured
    ? [
        passport.authenticate("google", { session: false, failureRedirect: `${FRONTEND_URL}/login?error=oauth_failed` }),
        (req: express.Request, res: express.Response) => {
          const { token } = req.user as unknown as { token: string };
          sendSessionAndRedirect(res, token);
        },
      ]
    : [oauthNotConfigured("Google")])
);

// ── Facebook routes ───────────────────────────────────────────────────────────
router.get(
  "/facebook",
  facebookConfigured
    ? passport.authenticate("facebook", { scope: ["email"], session: false })
    : oauthNotConfigured("Facebook")
);

router.get(
  "/facebook/callback",
  ...(facebookConfigured
    ? [
        passport.authenticate("facebook", { session: false, failureRedirect: `${FRONTEND_URL}/login?error=oauth_failed` }),
        (req: express.Request, res: express.Response) => {
          const { token } = req.user as unknown as { token: string };
          sendSessionAndRedirect(res, token);
        },
      ]
    : [oauthNotConfigured("Facebook")])
);

export default router;
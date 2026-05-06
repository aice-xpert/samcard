import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "5d";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 5 * 1000; // 5 days in ms

router.post("/", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: "Email and password are required" });
  }

  const emailTrimmed = email.trim().toLowerCase();
  const passwordTrimmed = password.trim();

  try {
    // ── Fetch user from Supabase ──────────────────────────────────────────────
    const { data: user, error: fetchError } = await supabase
      .from("User")
      .select("id, email, name, passwordHash, emailVerified")
      .eq("email", emailTrimmed)
      .maybeSingle();

    if (fetchError) {
      console.error("Supabase fetch error on login:", fetchError);
      return res.status(500).json({ success: false, error: "Something went wrong. Please try again." });
    }

    if (!user) {
      return res.status(404).json({ success: false, error: "No account found with this email. Please sign up first." });
    }

    const invalidCredentials = () =>
      res.status(401).json({ success: false, error: "Invalid email or password" });

    if (!user.emailVerified) {
      return res.status(403).json({ success: false, error: "Please verify your email before logging in." });
    }

    // ── Guard: social-only accounts have no password ──────────────────────────
    if (!user.passwordHash) {
      return res.status(400).json({
        success: false,
        error: "This account was created with Google or GitHub. Please sign in with that provider.",
      });
    }

    // ── Verify password ───────────────────────────────────────────────────────
    const passwordMatch = await bcrypt.compare(passwordTrimmed, user.passwordHash);
    if (!passwordMatch) return invalidCredentials();

    // ── Update lastLoginAt ────────────────────────────────────────────────────
    await supabase
      .from("User")
      .update({ lastLoginAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
      .eq("id", user.id);

    // ── Issue JWT ─────────────────────────────────────────────────────────────
    const payload = { uid: user.id, email: user.email, name: user.name };
    const sessionToken = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.cookie("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });

    console.log(`[login] User ${user.id} logged in`);

    return res.status(200).json({
      success: true,
      uid: user.id,
      email: user.email,
      name: user.name,
      sessionToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;
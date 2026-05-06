import express from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../config/supabase";
import { sendVerificationEmail } from "../services/email";

const router = express.Router();

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "5d";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 5 * 1000; // 5 days in ms

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Internal server error";

router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ── Validate required fields ──────────────────────────────────────────────
    const missingFields: string[] = [];
    if (!name) missingFields.push("name");
    if (!email) missingFields.push("email");
    if (!password) missingFields.push("password");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const nameTrimmed = name.trim();
    const emailTrimmed = email.trim().toLowerCase();
    const passwordTrimmed = password.trim();

    // ── Validate email format ─────────────────────────────────────────────────
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      return res.status(400).json({ success: false, error: "Invalid email format" });
    }

    // ── Validate password strength ────────────────────────────────────────────
    if (passwordTrimmed.length < 8) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 8 characters",
      });
    }

    // ── Check if email already exists ─────────────────────────────────────────
    const { data: existing } = await supabase
      .from("User")
      .select("id")
      .eq("email", emailTrimmed)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({ success: false, error: "Email already in use" });
    }

    // ── Hash password ─────────────────────────────────────────────────────────
    const passwordHash = await bcrypt.hash(passwordTrimmed, SALT_ROUNDS);

    // ── Insert user into Supabase ─────────────────────────────────────────────
    const now = new Date().toISOString();
    const { data: newUser, error: insertError } = await supabase
      .from("User")
      .insert({
        id: uuidv4(),
        email: emailTrimmed,
        name: nameTrimmed,
        passwordHash,
        createdAt: now,
        updatedAt: now,
        lastLoginAt: now,
      })
      .select("id, email, name")
      .single();

    if (insertError || !newUser) {
      console.error("Supabase insert error during signup:", insertError);
      return res.status(500).json({ success: false, error: "Failed to create user" });
    }

    // ── Send verification email ───────────────────────────────────────────────
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const { error: tokenInsertError } = await supabase.from("EmailToken").insert({
      userId: newUser.id,
      token: verificationToken,
      type: "email_verification",
      expiresAt: tokenExpiry,
    });
    if (tokenInsertError) {
      console.error("[signup] EmailToken insert failed:", tokenInsertError);
    } else {
      sendVerificationEmail(newUser.email, newUser.name ?? "there", verificationToken).catch((err) =>
        console.error("[signup] sendVerificationEmail failed:", err)
      );
    }

    // Do not issue a session token until the email is verified.
    console.log(`[signup] User created: ${newUser.id}, awaiting email verification.`);

    console.log(`[signup] User created: ${newUser.id}`);

    return res.status(201).json({
      success: true,
      message: "User created successfully. Please check your email to verify your account.",
      user: {
        uid: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (err: unknown) {
    console.error("Signup error:", err);
    return res.status(500).json({ success: false, error: getErrorMessage(err) });
  }
});

export default router;
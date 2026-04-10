import express from "express";
import admin from "../config/firebase";
import { supabase } from "../config/supabase";

const router = express.Router();

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Internal server error";

const getErrorCode = (error: unknown): string | undefined =>
  typeof error === "object" && error !== null && "code" in error
    ? String((error as { code: unknown }).code)
    : undefined;

router.post("/", async (req, res) => {
  try {
    const { name, email, password, company } = req.body;

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
    const emailTrimmed = email.trim();
    const passwordTrimmed = password.trim();
    const companyTrimmed = company?.trim() || "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format",
      });
    }

    if (passwordTrimmed.length < 8) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 8 characters",
      });
    }

    // 1. Create the user in Firebase
    const userRecord = await admin.auth().createUser({
      email: emailTrimmed,
      password: passwordTrimmed,
      displayName: nameTrimmed,
    });

    if (companyTrimmed) {
      await admin.auth().setCustomUserClaims(userRecord.uid, {
        company: companyTrimmed,
        role: "user",
      });
    }

    // 2. Sync to Supabase — log full error details so nothing is silently swallowed
    const now = new Date().toISOString();
    const { error: supabaseError } = await supabase
      .from("User")
      .upsert(
        {
          id: userRecord.uid,
          email: emailTrimmed,
          name: nameTrimmed,
          updatedAt: now,
          createdAt: now,
          lastLoginAt: now,
        },
        { onConflict: "id" }
      );

    if (supabaseError) {
      console.error("Supabase sync failed during signup:", {
        code: supabaseError.code,
        message: supabaseError.message,
        details: supabaseError.details,
        hint: supabaseError.hint,
      });
    } else {
      console.log(`[signup] User ${userRecord.uid} synced to Supabase`);
    }

    // 3. Create session cookie for the new user
    const customToken = await admin.auth().createCustomToken(userRecord.uid);
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await admin.auth().createSessionCookie(customToken, { expiresIn });

    const cookieOptions = {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" as const : "lax" as const,
      path: "/",
    };

    res.cookie("session", sessionCookie, cookieOptions);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
      },
      sessionToken: sessionCookie,
    });
  } catch (err: unknown) {
    console.error("Signup error:", err);

    const errorCode = getErrorCode(err);

    if (errorCode === "auth/email-already-exists") {
      return res.status(400).json({
        success: false,
        error: "Email already exists",
      });
    }

    if (errorCode === "auth/invalid-email") {
      return res.status(400).json({
        success: false,
        error: "Invalid email format",
      });
    }

    if (errorCode === "auth/weak-password") {
      return res.status(400).json({
        success: false,
        error: "Password is too weak",
      });
    }

    return res.status(500).json({
      success: false,
      error: getErrorMessage(err),
    });
  }
});

export default router;
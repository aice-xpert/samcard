import express from "express";
import crypto from "crypto";
import { supabase } from "../config/supabase";
import { sendPasswordResetEmail } from "../services/email";

const router = express.Router();

// Always return the same message to prevent user enumeration
const SUCCESS_MSG = "If an account with that email exists, you will receive a password reset link shortly.";

router.post("/", async (req, res) => {
  const { email } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ success: false, error: "Email is required" });
  }

  const emailTrimmed = email.trim().toLowerCase();

  try {
    const { data: user } = await supabase
      .from("User")
      .select("id, email, name, passwordHash")
      .eq("email", emailTrimmed)
      .maybeSingle();

    // No account or OAuth-only account — return success anyway
    if (!user || !user.passwordHash) {
      console.log(`[forgot-password] No user or no passwordHash for: ${emailTrimmed}`);
      return res.status(200).json({ success: true, message: SUCCESS_MSG });
    }

    console.log(`[forgot-password] Found user: ${user.id}`);

    // Invalidate existing unused reset tokens
    await supabase
      .from("EmailToken")
      .update({ usedAt: new Date().toISOString() })
      .eq("userId", user.id)
      .eq("type", "password_reset")
      .is("usedAt", null);

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    const { error: insertError } = await supabase
      .from("EmailToken")
      .insert({ userId: user.id, token, type: "password_reset", expiresAt });

    if (insertError) {
      console.error("[forgot-password] EmailToken insert failed:", insertError);
      return res.status(200).json({ success: true, message: SUCCESS_MSG });
    }

    console.log(`[forgot-password] Token inserted, sending email to: ${user.email}`);
    sendPasswordResetEmail(user.email, user.name ?? "there", token).catch(console.error);

    return res.status(200).json({ success: true, message: SUCCESS_MSG });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(200).json({ success: true, message: SUCCESS_MSG });
  }
});

export default router;

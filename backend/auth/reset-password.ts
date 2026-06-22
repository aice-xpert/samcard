import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET!;
const SALT_ROUNDS = 12;

router.post("/", async (req, res) => {
  const { code, email, newPassword } = req.body;

  if (!code || typeof code !== "string") {
    return res.status(400).json({ success: false, error: "Recovery code is required" });
  }

  if (!email || typeof email !== "string") {
    return res.status(400).json({ success: false, error: "Email is required" });
  }

  if (!newPassword || typeof newPassword !== "string" || newPassword.trim().length < 8) {
    return res.status(400).json({ success: false, error: "Password must be at least 8 characters" });
  }

  try {
    const emailTrimmed = email.trim().toLowerCase();
    const passwordTrimmed = newPassword.trim();

    console.log(`[reset-password] Processing reset for: ${emailTrimmed}`);

    // Verify the JWT reset token
    let payload: { uid: string; email: string; purpose: string };
    try {
      payload = jwt.verify(code, JWT_SECRET) as typeof payload;
    } catch {
      return res.status(400).json({ success: false, error: "Invalid or expired recovery link" });
    }

    if (payload.purpose !== "password-reset" || payload.email !== emailTrimmed) {
      return res.status(400).json({ success: false, error: "Invalid or expired recovery link" });
    }

    console.log(`[reset-password] Token verified for user: ${payload.uid}`);

    // Update the passwordHash in our User table (this is what login checks)
    const passwordHash = await bcrypt.hash(passwordTrimmed, SALT_ROUNDS);
    const { error: updateError } = await supabase
      .from("User")
      .update({ passwordHash, updatedAt: new Date().toISOString() })
      .eq("id", payload.uid);

    if (updateError) {
      console.error("[reset-password] User table password update error:", updateError);
      return res.status(500).json({ success: false, error: "Failed to update password" });
    }

    console.log(`[reset-password] Password reset successful for user: ${payload.uid}`);
    return res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now log in."
    });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;

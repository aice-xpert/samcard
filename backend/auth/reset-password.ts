import express from "express";
import bcrypt from "bcrypt";
import { supabase } from "../config/supabase";

const router = express.Router();

const SALT_ROUNDS = 12;

router.post("/", async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || typeof token !== "string") {
    return res.status(400).json({ success: false, error: "Reset token is required" });
  }

  if (!newPassword || typeof newPassword !== "string" || newPassword.trim().length < 8) {
    return res.status(400).json({ success: false, error: "Password must be at least 8 characters" });
  }

  try {
    const { data: emailToken, error: tokenError } = await supabase
      .from("EmailToken")
      .select("id, userId, expiresAt, usedAt")
      .eq("token", token)
      .eq("type", "password_reset")
      .maybeSingle();

    if (tokenError || !emailToken) {
      return res.status(400).json({ success: false, error: "Invalid or expired reset link" });
    }

    if (emailToken.usedAt) {
      return res.status(400).json({ success: false, error: "This reset link has already been used" });
    }

    if (new Date(emailToken.expiresAt) < new Date()) {
      return res.status(400).json({ success: false, error: "Reset link has expired. Please request a new one." });
    }

    const passwordHash = await bcrypt.hash(newPassword.trim(), SALT_ROUNDS);
    const now = new Date().toISOString();

    const { error: updateError } = await supabase
      .from("User")
      .update({ passwordHash, updatedAt: now })
      .eq("id", emailToken.userId);

    if (updateError) {
      console.error("Password update error:", updateError);
      return res.status(500).json({ success: false, error: "Failed to reset password" });
    }

    await supabase.from("EmailToken").update({ usedAt: now }).eq("id", emailToken.id);

    return res.status(200).json({ success: true, message: "Password reset successfully. You can now log in." });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;

import express from "express";
import { supabase } from "../config/supabase";

const router = express.Router();

router.get("/", async (req, res) => {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    return res.status(400).json({ success: false, error: "Verification token is required" });
  }

  try {
    const { data: emailToken, error: tokenError } = await supabase
      .from("EmailToken")
      .select("id, userId, expiresAt, usedAt")
      .eq("token", token)
      .eq("type", "email_verification")
      .maybeSingle();

    if (tokenError || !emailToken) {
      return res.status(400).json({ success: false, error: "Invalid or expired verification link" });
    }

    if (emailToken.usedAt) {
      return res.status(400).json({ success: false, error: "This verification link has already been used" });
    }

    if (new Date(emailToken.expiresAt) < new Date()) {
      return res.status(400).json({ success: false, error: "Verification link has expired. Please request a new one." });
    }

    const now = new Date().toISOString();

    await supabase
      .from("User")
      .update({ emailVerified: true, emailVerifiedAt: now, updatedAt: now })
      .eq("id", emailToken.userId);

    await supabase
      .from("EmailToken")
      .update({ usedAt: now })
      .eq("id", emailToken.id);

    return res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    console.error("Email verification error:", err);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;

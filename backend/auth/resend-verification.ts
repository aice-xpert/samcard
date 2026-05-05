import express from "express";
import crypto from "crypto";
import { supabase } from "../config/supabase";
import { verifySession, AuthRequest } from "../middleware/auth";
import { sendVerificationEmail } from "../services/email";

const router = express.Router();

router.post("/", verifySession, async (req, res) => {
  const userId = (req as AuthRequest).user?.uid;
  if (!userId) return res.status(401).json({ success: false, error: "Unauthorized" });

  try {
    const { data: user } = await supabase
      .from("User")
      .select("id, email, name, emailVerified")
      .eq("id", userId)
      .maybeSingle();

    if (!user) return res.status(404).json({ success: false, error: "User not found" });
    if (user.emailVerified) return res.status(400).json({ success: false, error: "Email is already verified" });

    await supabase
      .from("EmailToken")
      .update({ usedAt: new Date().toISOString() })
      .eq("userId", userId)
      .eq("type", "email_verification")
      .is("usedAt", null);

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    await supabase.from("EmailToken").insert({ userId, token, type: "email_verification", expiresAt });

    sendVerificationEmail(user.email, user.name ?? "there", token).catch(console.error);

    return res.status(200).json({ success: true, message: "Verification email sent" });
  } catch (err) {
    console.error("Resend verification error:", err);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;

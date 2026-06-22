import express from "express";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase";
import { sendPasswordResetEmail } from "../services/email";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET!;

const SUCCESS_MSG = "If an account with that email exists, you will receive a password reset link shortly.";

router.post("/", async (req, res) => {
  const { email } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ success: false, error: "Email is required" });
  }

  const emailTrimmed = email.trim().toLowerCase();

  try {
    console.log(`[forgot-password] Processing reset request for: ${emailTrimmed}`);

    const { data: user } = await supabase
      .from("User")
      .select("id, name")
      .eq("email", emailTrimmed)
      .maybeSingle();

    if (user) {
      // Generate a short-lived JWT reset token (1 hour)
      const resetToken = jwt.sign(
        { uid: user.id, email: emailTrimmed, purpose: "password-reset" },
        JWT_SECRET,
        { expiresIn: "1h" },
      );

      const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;
      sendPasswordResetEmail(emailTrimmed, user.name || "User", resetUrl).catch(err =>
        console.error("[forgot-password] Failed to send email:", err)
      );
    }

    return res.status(200).json({ success: true, message: SUCCESS_MSG });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(200).json({ success: true, message: SUCCESS_MSG });
  }
});

export default router;

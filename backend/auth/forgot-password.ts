import express from "express";
import { supabase } from "../config/supabase";

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
    console.log(`[forgot-password] Processing reset request for: ${emailTrimmed}`);

    // Use Supabase Auth to generate a recovery link
    // Supabase will automatically send the email with the recovery link
    const { data, error } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email: emailTrimmed,
      options: {
        redirectTo: `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password`,
      },
    });

    console.log(`[forgot-password] Supabase response:`, { data, error });

    if (error) {
      console.log(`[forgot-password] Generate link error (may be user not found): ${error.message}`);
      // Return success anyway to prevent user enumeration
      return res.status(200).json({ success: true, message: SUCCESS_MSG });
    }

    console.log(`[forgot-password] Recovery link generated for: ${emailTrimmed}`);
    console.log(`[forgot-password] Full response data:`, data);
    return res.status(200).json({ success: true, message: SUCCESS_MSG });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(200).json({ success: true, message: SUCCESS_MSG });
  }
});

export default router;

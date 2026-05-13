import express from "express";
import { supabase } from "../config/supabase";

const router = express.Router();

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
    
    console.log(`[reset-password] Processing reset for: ${emailTrimmed}`);

    // Verify the recovery OTP using the code and email
    const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
      email: emailTrimmed,
      token: code,
      type: "recovery",
    });

    console.log(`[reset-password] verifyOtp response:`, { verifyData, verifyError });
    console.log(`[reset-password] verifyData user:`, verifyData?.user);

    if (verifyError || !verifyData.user?.id) {
      console.error("[reset-password] Token verification error:", verifyError);
      return res.status(400).json({ success: false, error: "Invalid or expired recovery link" });
    }

    console.log(`[reset-password] Token verified for user: ${verifyData.user.id}`);

    // Now update the password for this user using the admin API
    const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
      verifyData.user.id,
      { password: newPassword.trim() }
    );

    console.log(`[reset-password] updateUserById response:`, { updateData, updateError });

    if (updateError) {
      console.error("[reset-password] Password update error:", updateError);
      return res.status(500).json({ success: false, error: "Failed to update password" });
    }

    console.log(`[reset-password] Password reset successful for user: ${updateData.user?.id}`);
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

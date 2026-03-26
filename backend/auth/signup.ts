import express, { Request, Response } from "express";
import admin from "../config/firebase";

const router = express.Router();

interface SignupRequest {
  name?: string;
  email?: string;
  password?: string;
  company?: string;
}

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

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
      },
    });
  } catch (err: any) {
    console.error("Signup error:", err);

    if (err.code === "auth/email-already-exists") {
      return res.status(400).json({
        success: false,
        error: "Email already exists",
      });
    }

    if (err.code === "auth/invalid-email") {
      return res.status(400).json({
        success: false,
        error: "Invalid email format",
      });
    }

    if (err.code === "auth/weak-password") {
      return res.status(400).json({
        success: false,
        error: "Password is too weak",
      });
    }

    return res.status(500).json({
      success: false,
      error: err.message || "Internal server error",
    });
  }
});

export default router;
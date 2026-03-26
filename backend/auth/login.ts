import express, { Request, Response } from "express";
import admin from "../config/firebase";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const { idToken } = req.body; // Client sends the Firebase ID Token

  if (!idToken) {
    return res.status(400).json({ error: "ID Token is required" });
  }

  // Set session expiration (e.g., 5 days)
  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  try {
    // Create the session cookie
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    // Set cookie options
    const options = {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in prod
      path: "/",
    };

    res.cookie("session", sessionCookie, options);
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Session Login Error:", error);
    return res.status(401).send("UNAUTHORIZED REQUEST!");
  }
});

export default router;
import express, { Request, Response } from "express";
import admin from "../config/firebase";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const sessionCookie = req.cookies.session || "";

    if (!sessionCookie) {
      return res.status(400).json({ error: "No session cookie found" });
    }

    // Verify the session cookie is valid before revoking
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    
    // Revoke the session
    await admin.auth().revokeRefreshTokens(decodedClaims.uid);

    // Clear the session cookie
    res.clearCookie("session", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: process.env.NODE_ENV === "production" ? "none" as const : "lax" as const,
    });

    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "LOGOUT FAILED!";
    console.error("Session Logout Error:", error);
    return res.status(401).json({ error: message });
  }
});

export default router;

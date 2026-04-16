import express, { Request, Response } from "express";

const router = express.Router();

router.post("/", (_req: Request, res: Response) => {
  // Clear the session cookie — that's all that's needed for logout.
  // Avoid revokeRefreshTokens: it sets tokensValidAfterTime which causes
  // clock-skew warnings on every subsequent API call until Firebase propagates.
  res.clearCookie("session", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: process.env.NODE_ENV === "production" ? "none" as const : "lax" as const,
  });

  return res.status(200).json({ success: true, message: "Logged out successfully" });
});

export default router;

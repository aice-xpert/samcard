import express, { Request, Response } from "express";

const router = express.Router();

router.post("/", (_req: Request, res: Response) => {
  res.clearCookie("session", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: process.env.NODE_ENV === "production" ? ("none" as const) : ("lax" as const),
  });

  return res.status(200).json({ success: true, message: "Logged out successfully" });
});

export default router;
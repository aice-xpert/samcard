import express, { Response } from "express";
import { verifySession } from "../middleware/auth";

const router = express.Router();

/**
 * GET /api/auth/verify
 * Lightweight endpoint used by the Next.js middleware to validate a session
 * cookie without fetching any user data. Returns 200 if valid, 401 if not.
 */
router.get("/", verifySession, (_req, res: Response) => {
    return res.status(200).json({ ok: true });
});

export default router;
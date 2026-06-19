import express, { Response } from "express";
import { AuthRequest, verifySession } from "../middleware/auth";
import { supabase } from "../config/supabase";

const router = express.Router();

/**
 * GET /api/auth/verify
 * Used by the Next.js middleware to validate a session.
 * Checks both JWT validity AND that the user still exists in the DB,
 * so deleted accounts are immediately rejected even with an unexpired token.
 */
router.get("/", verifySession, async (req: AuthRequest, res: Response) => {
    try {
        const { data, error } = await supabase
            .from("User")
            .select("id")
            .eq("id", req.user!.uid)
            .maybeSingle();

        if (error || !data) {
            return res.status(401).json({ error: "Session invalid — user no longer exists" });
        }

        return res.status(200).json({ ok: true });
    } catch {
        return res.status(401).json({ error: "Session invalid" });
    }
});

export default router;
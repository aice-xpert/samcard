import express, { Response } from "express";
import { supabase } from "../config/supabase";
import { AuthRequest, verifySession } from "../middleware/auth";

const router = express.Router();

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Internal server error";

router.get("/", verifySession, async (req: AuthRequest, res: Response) => {
  const { unreadOnly, page = "1", limit = "20" } = req.query;
  
  try {
    let query = supabase
      .from("Notification")
      .select("*", { count: "exact" })
      .eq("userId", req.user!.uid)
      .order("createdAt", { ascending: false });

    if (unreadOnly === "true") {
      query = query.eq("read", false);
    }

    const pageNum = Math.max(1, Number.parseInt(String(page), 10) || 1);
    const limitNum = Math.max(1, Number.parseInt(String(limit), 10) || 20);
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    const { data, error, count } = await query.range(from, to);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const { count: unreadCount } = await supabase
      .from("Notification")
      .select("id", { count: "exact", head: true })
      .eq("userId", req.user!.uid)
      .eq("read", false);

    return res.json({
      notifications: data || [],
      unreadCount: unreadCount || 0,
      total: count || 0,
      page: pageNum,
      limit: limitNum,
    });
  } catch (error: unknown) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

// Specific routes should come before parameterized routes
router.put("/read-all", verifySession, async (req: AuthRequest, res: Response) => {
  try {
    const { error } = await supabase
      .from("Notification")
      .update({ read: true, readAt: new Date().toISOString() })
      .eq("userId", req.user!.uid)
      .eq("read", false);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true });
  } catch (error: unknown) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.put("/:id/read", verifySession, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  try {
    const { data, error } = await supabase
      .from("Notification")
      .update({ read: true, readAt: new Date().toISOString() })
      .eq("id", id)
      .eq("userId", req.user!.uid)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error: unknown) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default router;

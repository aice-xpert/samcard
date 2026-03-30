import express, { Response } from "express";
import { supabase } from "../config/supabase";
import { AuthRequest, verifySession } from "../middleware/auth";

const router = express.Router();

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Internal server error";

router.get("/", verifySession, async (req: AuthRequest, res: Response) => {
  const { status, page = "1", limit = "20" } = req.query;
  
  try {
    const { data: profile } = await supabase
      .from("BusinessProfile")
      .select("id")
      .eq("userId", req.user!.uid)
      .maybeSingle();

    if (!profile) {
      return res.json({ leads: [], total: 0, page: 1, limit: 20 });
    }

    let query = supabase
      .from("Lead")
      .select("*", { count: "exact" })
      .eq("businessProfileId", profile.id)
      .order("createdAt", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const pageNum = Math.max(1, Number.parseInt(String(page), 10) || 1);
    const limitNum = Math.max(1, Number.parseInt(String(limit), 10) || 20);
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    const { data, error, count } = await query.range(from, to);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({
      leads: data || [],
      total: count || 0,
      page: pageNum,
      limit: limitNum,
    });
  } catch (error: unknown) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.put("/:id", verifySession, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, notes, tags, isFavorite, isArchived } = req.body;

  try {
    const { data: lead } = await supabase
      .from("Lead")
      .select("businessProfileId")
      .eq("id", id)
      .maybeSingle();

    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    const { data: profile } = await supabase
      .from("BusinessProfile")
      .select("id")
      .eq("id", lead.businessProfileId)
      .eq("userId", req.user!.uid)
      .maybeSingle();

    if (!profile) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (tags) updateData.tags = tags;
    if (isFavorite !== undefined) updateData.isFavorite = isFavorite;
    if (isArchived !== undefined) updateData.isArchived = isArchived;

    const { data, error } = await supabase
      .from("Lead")
      .update(updateData)
      .eq("id", id)
      .eq("businessProfileId", profile.id)
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

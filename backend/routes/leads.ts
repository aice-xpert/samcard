import express, { Response } from "express";
import { supabase } from "../config/supabase";
import { AuthRequest, verifySession } from "../middleware/auth";

const router = express.Router();

const getErrorMessage = (error: any): string => {
  if (error?.message) return error.message; 
  if (error instanceof Error) return error.message;
  return "Internal server error";
};

router.get("/", verifySession, async (req: AuthRequest, res: Response) => {
  const { status, page = "1", limit = "20", cardId } = req.query;

  try {
    const { data: cards } = await supabase
      .from("Card")
      .select("id")
      .eq("userId", req.user!.uid);

    const ownedCardIds = cards?.map((c: { id: string }) => c.id) || [];

    let query = supabase
      .from("Lead")
      .select("*", { count: "exact" })
      .eq("userId", req.user!.uid)
      .order("createdAt", { ascending: false });

    if (cardId && typeof cardId === "string" && ownedCardIds.includes(cardId)) {
      query = query.eq("cardId", cardId);
    }

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

    const leadsData = data || [];
    const cardIds = Array.from(
      new Set(leadsData.map((lead: any) => lead.cardId).filter(Boolean)),
    ) as string[];

    const cardsById: Record<string, { name: string; shareUrl: string }> = {};
    if (cardIds.length > 0) {
      const { data: cards } = await supabase
        .from("Card")
        .select("id, name, shareUrl")
        .in("id", cardIds);

      for (const card of cards || []) {
        cardsById[card.id] = { name: card.name, shareUrl: card.shareUrl };
      }
    }

    const leads = leadsData.map((lead: any) => {
      const cardMeta = lead.cardId ? cardsById[lead.cardId] : undefined;
      return {
        ...lead,
        cardName: cardMeta?.name ?? null,
        cardPublishedLink: cardMeta?.shareUrl ?? null,
      };
    });

    return res.json({
      leads,
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

import express, { Response } from "express";
import { supabase } from "../config/supabase";
import { AuthRequest, verifySession } from "../middleware/auth";

const router = express.Router();

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Internal server error";

router.get("/", verifySession, async (req: AuthRequest, res: Response) => {
  const { status, page = "1", limit = "20" } = req.query;

  try {
    let query = supabase
      .from("NfcCard")
      .select("*", { count: "exact" })
      .eq("userId", req.user!.uid)
      .order("createdAt", { ascending: false });

    if (status && status !== "all") {
      if (status === "assigned") {
        query = query.not("cardId", "is", null);
      } else if (status === "unassigned") {
        query = query.is("cardId", null);
      }
    }

    const pageNum = Math.max(1, Number.parseInt(String(page), 10) || 1);
    const limitNum = Math.min(100, Math.max(1, Number.parseInt(String(limit), 10) || 20));
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    const { data: cards, error, count } = await query.range(from, to);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({
      nfcCards: cards || [],
      total: count || 0,
      page: pageNum,
      limit: limitNum,
    });
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.get("/:id", verifySession, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const { data: card, error } = await supabase
      .from("NfcCard")
      .select("*")
      .eq("id", id)
      .eq("userId", req.user!.uid)
      .single();

    if (error || !card) {
      return res.status(404).json({ error: "NFC card not found" });
    }

    return res.json(card);
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.post("/assign", verifySession, async (req: AuthRequest, res: Response) => {
  const { nfcCardId, cardId } = req.body;

  if (!nfcCardId || !cardId) {
    return res.status(400).json({ error: "NFC card ID and digital card ID are required" });
  }

  try {
    const { data: nfcCard, error: fetchError } = await supabase
      .from("NfcCard")
      .select("*")
      .eq("id", nfcCardId)
      .eq("userId", req.user!.uid)
      .single();

    if (fetchError || !nfcCard) {
      return res.status(404).json({ error: "NFC card not found" });
    }

    if (nfcCard.isAssigned && nfcCard.cardId !== cardId) {
      return res.status(400).json({ error: "NFC card is already assigned to another card" });
    }

    const { data: digitalCard, error: cardError } = await supabase
      .from("Card")
      .select("id, userId, nfcEnabled, nfcUid")
      .eq("id", cardId)
      .eq("userId", req.user!.uid)
      .single();

    if (cardError || !digitalCard) {
      return res.status(404).json({ error: "Digital card not found" });
    }

    if (digitalCard.nfcUid && digitalCard.nfcUid !== nfcCard.uid) {
      const { error: unassignError } = await supabase
        .from("NfcCard")
        .update({ cardId: null, isAssigned: false, isLinked: false })
        .eq("uid", digitalCard.nfcUid);

      if (unassignError) {
        console.error("Error unassigning previous NFC card:", unassignError);
      }
    }

    const { data: updatedNfcCard, error: updateError } = await supabase
      .from("NfcCard")
      .update({
        cardId,
        isAssigned: true,
        isLinked: true,
        assignedAt: new Date().toISOString(),
      })
      .eq("id", nfcCardId)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    await supabase
      .from("Card")
      .update({
        nfcEnabled: true,
        nfcUid: nfcCard.uid,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", cardId);

    return res.json(updatedNfcCard);
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.post("/unassign", verifySession, async (req: AuthRequest, res: Response) => {
  const { nfcCardId } = req.body;

  if (!nfcCardId) {
    return res.status(400).json({ error: "NFC card ID is required" });
  }

  try {
    const { data: nfcCard, error: fetchError } = await supabase
      .from("NfcCard")
      .select("*")
      .eq("id", nfcCardId)
      .eq("userId", req.user!.uid)
      .single();

    if (fetchError || !nfcCard) {
      return res.status(404).json({ error: "NFC card not found" });
    }

    if (!nfcCard.cardId) {
      return res.status(400).json({ error: "NFC card is not assigned" });
    }

    await supabase
      .from("Card")
      .update({
        nfcEnabled: false,
        nfcUid: null,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", nfcCard.cardId);

    const { data: updatedNfcCard, error: updateError } = await supabase
      .from("NfcCard")
      .update({
        cardId: null,
        isAssigned: false,
        isLinked: false,
        assignedAt: null,
      })
      .eq("id", nfcCardId)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    return res.json(updatedNfcCard);
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.post("/write/:id", verifySession, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const { data: nfcCard, error: fetchError } = await supabase
      .from("NfcCard")
      .select("*")
      .eq("id", id)
      .eq("userId", req.user!.uid)
      .single();

    if (fetchError || !nfcCard) {
      return res.status(404).json({ error: "NFC card not found" });
    }

    if (!nfcCard.cardId) {
      return res.status(400).json({ error: "NFC card must be assigned to a digital card before writing" });
    }

    const { data: digitalCard } = await supabase
      .from("Card")
      .select("shareUrl")
      .eq("id", nfcCard.cardId)
      .single();

    const writeUrl = digitalCard?.shareUrl
      ? `${process.env.FRONTEND_URL || "https://samcard.app"}${digitalCard.shareUrl}`
      : `${process.env.FRONTEND_URL || "https://samcard.app"}/card/${nfcCard.uid}`;

    const { data: updatedCard, error: updateError } = await supabase
      .from("NfcCard")
      .update({
        writeCount: (nfcCard.writeCount || 0) + 1,
        nfcLastWrittenAt: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    return res.json({
      success: true,
      card: updatedCard,
      writeUrl,
    });
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.post("/register", verifySession, async (req: AuthRequest, res: Response) => {
  const { uid, chipType, ndefCapacity, physicalCardId, cardMaterial, cardColors } = req.body;

  if (!uid) {
    return res.status(400).json({ error: "NFC card UID is required" });
  }

  try {
    const { data: existing } = await supabase
      .from("NfcCard")
      .select("id")
      .eq("uid", uid)
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ error: "NFC card already registered", cardId: existing.id });
    }

    const { data: card, error } = await supabase
      .from("NfcCard")
      .insert({
        userId: req.user!.uid,
        uid,
        chipType: chipType || null,
        ndefCapacity: ndefCapacity || null,
        physicalCardId: physicalCardId || null,
        cardMaterial: cardMaterial || null,
        cardColors: cardColors || null,
        isActivated: true,
        isLinked: false,
        isAssigned: false,
        writeCount: 0,
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(card);
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default router;

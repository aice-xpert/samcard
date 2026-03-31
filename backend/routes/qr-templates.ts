import express, { Response } from "express";
import { supabase } from "../config/supabase";
import { AuthRequest, verifySession } from "../middleware/auth";

const router = express.Router();

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Internal server error";

router.get("/templates", verifySession, async (req: AuthRequest, res: Response) => {
  try {
    const { data: templates, error } = await supabase
      .from("QRTemplate")
      .select("*")
      .or(`isPreset.eq.true,userId.eq.${req.user!.uid}`)
      .order("isPreset", { ascending: false })
      .order("createdAt", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(templates || []);
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.get("/templates/public", async (req, res: Response) => {
  try {
    const { data: templates, error } = await supabase
      .from("QRTemplate")
      .select("*")
      .eq("isPreset", true)
      .eq("isPublic", true)
      .order("createdAt", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(templates || []);
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.post("/templates", verifySession, async (req: AuthRequest, res: Response) => {
  const {
    name,
    description,
    isPublic,
    shapeId,
    dotShape,
    bodyScale,
    eyeFrameStyle,
    eyeBallStyle,
    fgColor,
    bgColor,
    accentFgEnabled,
    accentFg,
    accentBgEnabled,
    accentBg,
    strokeEnabled,
    strokeColor,
    gradEnabled,
    gradStops,
    gradAngle,
    logoId,
    customLogoUrl,
    stickerId,
    stickerData,
    decorateImageUrl,
    decoratePosition,
  } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Template name is required" });
  }

  try {
    const { data: template, error } = await supabase
      .from("QRTemplate")
      .insert({
        userId: req.user!.uid,
        name,
        description: description || null,
        isPreset: true,
        isPublic: isPublic || false,
        shapeId: shapeId || "ROUNDED",
        dotShape: dotShape || "ROUNDED",
        bodyScale: bodyScale || 0.8,
        eyeFrameStyle: eyeFrameStyle || "ROUNDED",
        eyeBallStyle: eyeBallStyle || "CIRCLE",
        fgColor: fgColor || "#FFFFFF",
        bgColor: bgColor || "#000000",
        accentFgEnabled: accentFgEnabled || false,
        accentFg: accentFg || null,
        accentBgEnabled: accentBgEnabled || false,
        accentBg: accentBg || null,
        strokeEnabled: strokeEnabled || false,
        strokeColor: strokeColor || "#FFFFFF",
        gradEnabled: gradEnabled || false,
        gradStops: gradStops || null,
        gradAngle: gradAngle || 180,
        logoId: logoId || null,
        customLogoUrl: customLogoUrl || null,
        stickerId: stickerId || null,
        stickerData: stickerData || null,
        decorateImageUrl: decorateImageUrl || null,
        decoratePosition: decoratePosition || null,
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(template);
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.put("/templates/:id", verifySession, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const { data: existing } = await supabase
      .from("QRTemplate")
      .select("userId")
      .eq("id", id)
      .single();

    if (!existing || existing.userId !== req.user!.uid) {
      return res.status(404).json({ error: "Template not found" });
    }

    const { data: template, error } = await supabase
      .from("QRTemplate")
      .update({
        ...updateData,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(template);
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.delete("/templates/:id", verifySession, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const { data: existing } = await supabase
      .from("QRTemplate")
      .select("userId, isPreset")
      .eq("id", id)
      .single();

    if (!existing) {
      return res.status(404).json({ error: "Template not found" });
    }

    if (existing.isPreset && !existing.userId) {
      return res.status(403).json({ error: "Cannot delete system templates" });
    }

    if (existing.userId !== req.user!.uid) {
      return res.status(403).json({ error: "Not authorized to delete this template" });
    }

    const { error } = await supabase
      .from("QRTemplate")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.get("/logos", async (req, res: Response) => {
  try {
    const { data: logos, error } = await supabase
      .from("QRPresetLogo")
      .select("*")
      .order("displayOrder", { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(logos || []);
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.get("/stickers", async (req, res: Response) => {
  try {
    const { data: stickers, error } = await supabase
      .from("QRSticker")
      .select("*")
      .order("displayOrder", { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(stickers || []);
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.post("/templates/:id/apply/:cardId", verifySession, async (req: AuthRequest, res: Response) => {
  const { id, cardId } = req.params;

  try {
    const { data: card, error: cardError } = await supabase
      .from("Card")
      .select("userId")
      .eq("id", cardId)
      .single();

    if (cardError || !card || card.userId !== req.user!.uid) {
      return res.status(404).json({ error: "Card not found" });
    }

    const { data: template, error: templateError } = await supabase
      .from("QRTemplate")
      .select("*")
      .eq("id", id)
      .single();

    if (templateError || !template) {
      return res.status(404).json({ error: "Template not found" });
    }

    const { data: qrConfig, error: qrError } = await supabase
      .from("CardQRConfig")
      .upsert({
        cardId,
        shapeId: template.shapeId?.toLowerCase() || "square",
        dotShape: template.dotShape?.toLowerCase() || "square",
        finderStyle: template.eyeFrameStyle?.toLowerCase() || "square",
        eyeBall: template.eyeBallStyle?.toLowerCase() || "square",
        bodyScale: template.bodyScale || 1.0,
        fg: template.fgColor || "#000000",
        bg: template.bgColor || "#ffffff",
        accentFg: template.accentFg || "#000000",
        accentBg: template.accentBg || "#ffffff",
        strokeEnabled: template.strokeEnabled || false,
        strokeColor: template.strokeColor || "#000000",
        gradEnabled: template.gradEnabled || false,
        gradStops: template.gradStops || [],
        gradAngle: template.gradAngle || 135,
        selectedLogo: template.logoId || "",
        customLogoUrl: template.customLogoUrl || "",
        logoBg: template.logoId ? "#ffffff" : "",
        stickerId: template.stickerId || null,
        updatedAt: new Date().toISOString(),
      })
      .eq("cardId", cardId)
      .select()
      .single();

    if (qrError) {
      return res.status(500).json({ error: qrError.message });
    }

    return res.json(qrConfig);
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default router;

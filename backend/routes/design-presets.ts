import express, { Response } from "express";
import { supabase } from "../config/supabase";
import { AuthRequest, verifySession } from "../middleware/auth";

const router = express.Router();

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Internal server error";

router.get("/presets", verifySession, async (req: AuthRequest, res: Response) => {
  try {
    const { data: presets, error } = await supabase
      .from("CardDesign")
      .select("*")
      .or(`isPreset.eq.true,userId.eq.${req.user!.uid}`)
      .order("isPreset", { ascending: false })
      .order("createdAt", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(presets || []);
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.get("/presets/public", async (req, res: Response) => {
  try {
    const { data: presets, error } = await supabase
      .from("CardDesign")
      .select("*")
      .eq("isPreset", true)
      .eq("isPublic", true)
      .order("createdAt", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(presets || []);
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.post("/presets", verifySession, async (req: AuthRequest, res: Response) => {
  const {
    name,
    description,
    isPublic,
    accentColor,
    accentLight,
    backgroundColor,
    cardColor,
    textPrimary,
    textMuted,
    fontFamily,
    nameFontSize,
    bodyFontSize,
    boldHeadings,
    cardRadius,
    shadowIntensity,
    glowEffect,
    phoneBgType,
    phoneBgPreset,
    phoneBgColor1,
    phoneBgColor2,
    phoneBgAngle,
    thumbnailUrl,
  } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Preset name is required" });
  }

  try {
    const { data: preset, error } = await supabase
      .from("CardDesign")
      .insert({
        userId: req.user!.uid,
        name,
        description: description || null,
        isPreset: true,
        isPublic: isPublic || false,
        accentColor: accentColor || "#008001",
        accentLight: accentLight || "#49B618",
        backgroundColor: backgroundColor || "#000000",
        cardColor: cardColor || "#0a0a0a",
        textPrimary: textPrimary || "#FFFFFF",
        textMuted: textMuted || "#A0A0A0",
        fontFamily: fontFamily || "INTER",
        nameFontSize: nameFontSize || 24,
        bodyFontSize: bodyFontSize || 14,
        boldHeadings: boldHeadings ?? false,
        cardRadius: cardRadius || 16,
        shadowIntensity: shadowIntensity || "MEDIUM",
        glowEffect: glowEffect ?? false,
        phoneBgType: phoneBgType || "SOLID",
        phoneBgPreset: phoneBgPreset || null,
        phoneBgColor1: phoneBgColor1 || "#000000",
        phoneBgColor2: phoneBgColor2 || "#0a0a0a",
        phoneBgAngle: phoneBgAngle || 180,
        thumbnailUrl: thumbnailUrl || null,
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(preset);
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.put("/presets/:id", verifySession, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const { data: existing } = await supabase
      .from("CardDesign")
      .select("userId")
      .eq("id", id)
      .single();

    if (!existing || existing.userId !== req.user!.uid) {
      return res.status(404).json({ error: "Preset not found" });
    }

    const { data: preset, error } = await supabase
      .from("CardDesign")
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

    return res.json(preset);
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.delete("/presets/:id", verifySession, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const { data: existing } = await supabase
      .from("CardDesign")
      .select("userId, isPreset")
      .eq("id", id)
      .single();

    if (!existing) {
      return res.status(404).json({ error: "Preset not found" });
    }

    if (existing.isPreset && !existing.userId) {
      return res.status(403).json({ error: "Cannot delete system presets" });
    }

    if (existing.userId !== req.user!.uid) {
      return res.status(403).json({ error: "Not authorized to delete this preset" });
    }

    const { error } = await supabase
      .from("CardDesign")
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

router.get("/palettes", async (req, res: Response) => {
  try {
    const { data: palettes, error } = await supabase
      .from("ColorPalette")
      .select("*")
      .order("displayOrder", { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(palettes || []);
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.get("/wallpapers", async (req, res: Response) => {
  try {
    const { data: wallpapers, error } = await supabase
      .from("WallpaperPreset")
      .select("*")
      .order("displayOrder", { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(wallpapers || []);
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.post("/presets/:id/apply/:cardId", verifySession, async (req: AuthRequest, res: Response) => {
  const { id, cardId } = req.params;

  try {
    const { data: card, error: cardError } = await supabase
      .from("Card")
      .select("userId, designId")
      .eq("id", cardId)
      .single();

    if (cardError || !card || card.userId !== req.user!.uid) {
      return res.status(404).json({ error: "Card not found" });
    }

    const { data: preset, error: presetError } = await supabase
      .from("CardDesign")
      .select("*")
      .eq("id", id)
      .single();

    if (presetError || !preset) {
      return res.status(404).json({ error: "Preset not found" });
    }

    const { data: cardDesign, error: designError } = await supabase
      .from("CardDesign")
      .upsert({
        cardId,
        palette: preset.palette,
        accentColor: preset.accentColor,
        accentLight: preset.accentLight,
        bgColor: preset.backgroundColor,
        cardColor: preset.cardColor,
        textPrimary: preset.textPrimary,
        textMuted: preset.textMuted,
        phoneBgPreset: preset.phoneBgPreset,
        phoneBgColor1: preset.phoneBgColor1,
        phoneBgColor2: preset.phoneBgColor2,
        phoneBgAngle: preset.phoneBgAngle,
        phoneBgType: preset.phoneBgType,
        font: preset.font?.toLowerCase() || "inter",
        bodyFontSize: preset.bodyFontSize,
        nameFontSize: preset.nameFontSize,
        boldHeadings: preset.boldHeadings,
        cardRadius: preset.cardRadius,
        shadowIntensity: preset.shadowIntensity,
        glowEffect: preset.glowEffect,
        updatedAt: new Date().toISOString(),
      })
      .eq("cardId", cardId)
      .select()
      .single();

    if (designError) {
      return res.status(500).json({ error: designError.message });
    }

    return res.json(designError);
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default router;

import express, { Response } from "express";
import { supabase } from "../config/supabase";
import { AuthRequest, verifySession } from "../middleware/auth";
const router = express.Router({ mergeParams: true });

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Internal server error";

interface CardDesignData {
  cardId?: string;
  palette: string;
  accentColor: string;
  accentLight: string;
  bgColor: string;
  cardColor: string;
  textPrimary: string;
  textMuted: string;
  phoneBgPreset: string;
  phoneBgColor1: string;
  phoneBgColor2: string;
  phoneBgAngle: number;
  phoneBgType: "solid" | "gradient";
  font: string;
  bodyFontSize: number;
  nameFontSize: number;
  boldHeadings: boolean;
  cardRadius: number;
  shadowIntensity: "none" | "soft" | "medium" | "strong";
  glowEffect: boolean;
}

router.get("/", verifySession, async (req: AuthRequest, res: Response) => {
  const cardId = req.params.cardId || req.params.id;

  try {
    const { data: card } = await supabase
      .from("Card")
      .select("userId")
      .eq("id", cardId)
      .single();

    if (!card || card.userId !== req.user!.uid) {
      return res.status(404).json({ error: "Card not found" });
    }

    const { data, error } = await supabase
      .from("CardDesign")
      .select("*")
      .eq("cardId", cardId)
      .maybeSingle();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error: unknown) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.put("/", verifySession, async (req: AuthRequest, res: Response) => {
  const cardId = req.params.cardId || req.params.id;
  const designData: Partial<CardDesignData> = req.body;

  try {
    const { data: card, error: fetchErr } = await supabase
      .from("Card")
      .select("userId")
      .eq("id", cardId)
      .single();

    console.log("PUT /design - cardId:", cardId);
    console.log("PUT /design - req.params:", req.params);
    console.log("PUT /design - req.user.uid:", req.user?.uid);
    console.log("PUT /design - fetch result:", { card, fetchErr });

    if (!card || card.userId !== req.user!.uid) {
      console.log("Throwing 404 - card is null?", !card, "userId mismatch?", card?.userId !== req.user?.uid);
      return res.status(404).json({ error: "Card not found" });
    }

    const { data: existing } = await supabase
      .from("CardDesign")
      .select("id")
      .eq("cardId", cardId)
      .maybeSingle();

    let result;
    if (existing) {
      const { data, error } = await supabase
        .from("CardDesign")
        .update({
          palette: designData.palette ?? "green",
          accentColor: designData.accentColor ?? "#008001",
          accentLight: designData.accentLight ?? "#49B618",
          bgColor: designData.bgColor ?? "#0a0f0a",
          cardColor: designData.cardColor ?? "#111a11",
          textPrimary: designData.textPrimary ?? "#f0f0f0",
          textMuted: designData.textMuted ?? "#7a9a7a",
          phoneBgPreset: designData.phoneBgPreset ?? "aurora",
          phoneBgColor1: designData.phoneBgColor1 ?? "#0a0f0a",
          phoneBgColor2: designData.phoneBgColor2 ?? "#003322",
          phoneBgAngle: designData.phoneBgAngle ?? 135,
          phoneBgType: designData.phoneBgType ?? "gradient",
          font: designData.font ?? "inter",
          bodyFontSize: designData.bodyFontSize ?? 11,
          nameFontSize: designData.nameFontSize ?? 22,
          boldHeadings: designData.boldHeadings ?? true,
          cardRadius: designData.cardRadius ?? 16,
          shadowIntensity: designData.shadowIntensity ?? "soft",
          glowEffect: designData.glowEffect ?? true,
          updatedAt: new Date().toISOString(),
        })
        .eq("cardId", cardId)
        .select()
        .single();

      result = { data, error };
    } else {
      const { data, error } = await supabase
        .from("CardDesign")
        .insert({
          cardId,
          palette: designData.palette ?? "green",
          accentColor: designData.accentColor ?? "#008001",
          accentLight: designData.accentLight ?? "#49B618",
          bgColor: designData.bgColor ?? "#0a0f0a",
          cardColor: designData.cardColor ?? "#111a11",
          textPrimary: designData.textPrimary ?? "#f0f0f0",
          textMuted: designData.textMuted ?? "#7a9a7a",
          phoneBgPreset: designData.phoneBgPreset ?? "aurora",
          phoneBgColor1: designData.phoneBgColor1 ?? "#0a0f0a",
          phoneBgColor2: designData.phoneBgColor2 ?? "#003322",
          phoneBgAngle: designData.phoneBgAngle ?? 135,
          phoneBgType: designData.phoneBgType ?? "gradient",
          font: designData.font ?? "inter",
          bodyFontSize: designData.bodyFontSize ?? 11,
          nameFontSize: designData.nameFontSize ?? 22,
          boldHeadings: designData.boldHeadings ?? true,
          cardRadius: designData.cardRadius ?? 16,
          shadowIntensity: designData.shadowIntensity ?? "soft",
          glowEffect: designData.glowEffect ?? true,
        })
        .select()
        .single();

      result = { data, error };
    }

    if (result.error) {
      return res.status(500).json({ error: result.error.message });
    }

    return res.json(result.data);
  } catch (error: unknown) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default router;

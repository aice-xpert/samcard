import express, { Response } from "express";
import { supabase } from "../config/supabase";
import { AuthRequest, verifySession } from "../middleware/auth";
const router = express.Router({ mergeParams: true });
const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Internal server error";

interface QRConfigData {
  cardId?: string;
  shapeId: string;
  dotShape: string;
  finderStyle: string;
  eyeBall: string;
  bodyScale: number;
  fg: string;
  bg: string;
  accentFg: string;
  accentBg: string;
  strokeEnabled: boolean;
  strokeColor: string;
  gradEnabled: boolean;
  gradStops: { offset: number; color: string }[];
  gradAngle: number;
  selectedLogo: string;
  customLogoUrl: string;
  logoBg: string;
  designLabel: string;
  shapeLabel: string;
  stickerId: string | null;
  decorateImageUrl: string;
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
      .from("CardQRConfig")
      .select("*")
      .eq("cardId", cardId)
      .limit(1)
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
  const qrData: Partial<QRConfigData> = req.body;

  console.log("[card-qr PUT] request received", {
    cardId,
    userId: req.user?.uid,
    hasQrData: !!qrData,
    qrDataKeys: qrData ? Object.keys(qrData) : null,
    fg: qrData?.fg,
    bg: qrData?.bg,
  });

  try {
    const { data: card } = await supabase
      .from("Card")
      .select("userId")
      .eq("id", cardId)
      .single();

    console.log("[card-qr PUT] card fetch", { cardId, cardExists: !!card, cardUserId: card?.userId });

    if (!card || card.userId !== req.user!.uid) {
      console.log("[card-qr PUT] card not found or unauthorized", { cardId, userId: req.user?.uid });
      return res.status(404).json({ error: "Card not found" });
    }

    const { data: existing } = await supabase
      .from("CardQRConfig")
      .select("id")
      .eq("cardId", cardId)
      .limit(1)
      .maybeSingle();

    const defaultConfig = {
      shapeId: "square",
      dotShape: "square",
      finderStyle: "square",
      eyeBall: "square",
      bodyScale: 1.0,
      fg: "#000000",
      bg: "#ffffff",
      accentFg: "#000000",
      accentBg: "#ffffff",
      strokeEnabled: false,
      strokeColor: "#000000",
      gradEnabled: false,
      gradStops: [],
      gradAngle: 135,
      selectedLogo: "",
      customLogoUrl: "",
      logoBg: "#ffffff",
      designLabel: "",
      shapeLabel: "",
      stickerId: null,
      decorateImageUrl: qrData.decorateImageUrl ?? "",
    };

    const insertData = {
      cardId,
      shapeId: qrData.shapeId ?? defaultConfig.shapeId,
      dotShape: qrData.dotShape ?? defaultConfig.dotShape,
      finderStyle: qrData.finderStyle ?? defaultConfig.finderStyle,
      eyeBall: qrData.eyeBall ?? defaultConfig.eyeBall,
      bodyScale: qrData.bodyScale ?? defaultConfig.bodyScale,
      fg: qrData.fg ?? defaultConfig.fg,
      bg: qrData.bg ?? defaultConfig.bg,
      accentFg: qrData.accentFg ?? defaultConfig.accentFg,
      accentBg: qrData.accentBg ?? defaultConfig.accentBg,
      strokeEnabled: qrData.strokeEnabled ?? defaultConfig.strokeEnabled,
      strokeColor: qrData.strokeColor ?? defaultConfig.strokeColor,
      gradEnabled: qrData.gradEnabled ?? defaultConfig.gradEnabled,
      gradStops: qrData.gradStops ?? defaultConfig.gradStops,
      gradAngle: qrData.gradAngle ?? defaultConfig.gradAngle,
      selectedLogo: qrData.selectedLogo ?? defaultConfig.selectedLogo,
      customLogoUrl: qrData.customLogoUrl ?? defaultConfig.customLogoUrl,
      logoBg: qrData.logoBg ?? defaultConfig.logoBg,
      designLabel: qrData.designLabel ?? defaultConfig.designLabel,
      shapeLabel: qrData.shapeLabel ?? defaultConfig.shapeLabel,
      stickerId: qrData.stickerId ?? defaultConfig.stickerId,
      decorateImageUrl: qrData.decorateImageUrl ?? defaultConfig.decorateImageUrl,
      updatedAt: new Date().toISOString(),
    };

    let result;
    if (existing) {
      console.log("[card-qr PUT] updating existing config", { cardId });
      const { data, error } = await supabase
        .from("CardQRConfig")
        .update(insertData)
        .eq("cardId", cardId)
        .select()
        .single();

      console.log("[card-qr PUT] update result", { cardId, success: !error, error: error?.message, hasData: !!data });
      result = { data, error };
    } else {
      console.log("[card-qr PUT] inserting new config", { cardId });
      const { data, error } = await supabase
        .from("CardQRConfig")
        .insert(insertData)
        .select()
        .single();

      console.log("[card-qr PUT] insert result", { cardId, success: !error, error: error?.message, hasData: !!data });
      result = { data, error };
    }

    if (result.error) {
      console.log("[card-qr PUT] error returned", { cardId, error: result.error.message });
      return res.status(500).json({ error: result.error.message });
    }

    console.log("[card-qr PUT] success", { cardId, hasData: !!result.data });
    return res.json(result.data);
  } catch (error: unknown) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default router;

import express, { Response } from "express";
import { supabase } from "../config/supabase";
import { AuthRequest, verifySession } from "../middleware/auth";
import { randomUUID } from "crypto";
import { createNotification } from "../lib/notifications";

const router = express.Router();

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Internal server error";

const createCardId = (): string =>
  `card_${randomUUID().replace(/-/g, "")}`;

router.post("/duplicate/:cardId", verifySession, async (req: AuthRequest, res: Response) => {
  const { cardId } = req.params;

  try {
    const { data: originalCard, error: fetchError } = await supabase
      .from("Card")
      .select("*")
      .eq("id", cardId)
      .eq("userId", req.user!.uid)
      .single();

    if (fetchError || !originalCard) {
      return res.status(404).json({ error: "Card not found" });
    }

    const newCardId = createCardId();
    const newSlug = newCardId;
    const newShareUrl = `/${newSlug}`;

    const { data: newCard, error: createError } = await supabase
      .from("Card")
      .insert({
        id: newCardId,
        userId: req.user!.uid,
        businessProfileId: originalCard.businessProfileId,
        name: `${originalCard.name} (Copy)`,
        cardType: originalCard.cardType,
        status: "DRAFT",
        slug: newSlug,
        shareUrl: newShareUrl,
        headingText: originalCard.headingText,
        headingBodyText: originalCard.headingBodyText,
        nfcEnabled: false,
        qrEnabled: originalCard.qrEnabled,
        qrShape: originalCard.qrShape,
        designId: null,
        showProfile: originalCard.showProfile,
        showHeading: originalCard.showHeading,
        showContact: originalCard.showContact,
        showSocial: originalCard.showSocial,
        showLinks: originalCard.showLinks,
        showAppointment: originalCard.showAppointment,
        showBusinessDetails: originalCard.showBusinessDetails,
        showExtraSections: originalCard.showExtraSections,
        backgroundColor: originalCard.backgroundColor,
        accentColor: originalCard.accentColor,
        accentLight: originalCard.accentLight,
        textColor: originalCard.textColor,
        cardColor: originalCard.cardColor,
        cardRadius: originalCard.cardRadius,
        fontFamily: originalCard.fontFamily,
        nameFontSize: originalCard.nameFontSize,
        bodyFontSize: originalCard.bodyFontSize,
        boldHeadings: originalCard.boldHeadings,
        phoneBgType: originalCard.phoneBgType,
        phoneBgPreset: originalCard.phoneBgPreset,
        phoneBgColor1: originalCard.phoneBgColor1,
        phoneBgColor2: originalCard.phoneBgColor2,
        phoneBgAngle: originalCard.phoneBgAngle,
        shadowIntensity: originalCard.shadowIntensity,
        glowEffect: originalCard.glowEffect,
        thumbnailUrl: originalCard.thumbnailUrl,
        metaTitle: originalCard.metaTitle,
        metaDescription: originalCard.metaDescription,
        ogImage: originalCard.ogImage,
        monthlyTapGoal: originalCard.monthlyTapGoal,
        monthlyViewGoal: originalCard.monthlyViewGoal,
        qrConfig: originalCard.qrConfig,
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError) {
      console.error("Card duplication error:", createError);
      return res.status(500).json({ error: "Failed to duplicate card" });
    }

    const { data: originalDesign } = await supabase
      .from("CardDesign")
      .select("*")
      .eq("cardId", cardId)
      .maybeSingle();

    if (originalDesign) {
      await supabase.from("CardDesign").insert({
        cardId: newCard.id,
        palette: originalDesign.palette,
        accentColor: originalDesign.accentColor,
        accentLight: originalDesign.accentLight,
        bgColor: originalDesign.bgColor,
        cardColor: originalDesign.cardColor,
        textPrimary: originalDesign.textPrimary,
        textMuted: originalDesign.textMuted,
        phoneBgPreset: originalDesign.phoneBgPreset,
        phoneBgColor1: originalDesign.phoneBgColor1,
        phoneBgColor2: originalDesign.phoneBgColor2,
        phoneBgAngle: originalDesign.phoneBgAngle,
        phoneBgType: originalDesign.phoneBgType,
        font: originalDesign.font,
        bodyFontSize: originalDesign.bodyFontSize,
        nameFontSize: originalDesign.nameFontSize,
        boldHeadings: originalDesign.boldHeadings,
        cardRadius: originalDesign.cardRadius,
        shadowIntensity: originalDesign.shadowIntensity,
        glowEffect: originalDesign.glowEffect,
      });
    }

    const { data: originalContent } = await supabase
      .from("CardContent")
      .select("*")
      .eq("cardId", cardId)
      .maybeSingle();

    if (originalContent) {
      await supabase.from("CardContent").insert({
        cardId: newCard.id,
        profileImage: originalContent.profileImage,
        brandLogo: originalContent.brandLogo,
        logoPosition: originalContent.logoPosition,
        formData: originalContent.formData,
        connectFields: originalContent.connectFields,
        sections: originalContent.sections,
        customLinks: originalContent.customLinks,
        extraSections: originalContent.extraSections,
      });
    }

    const { data: originalQR } = await supabase
      .from("CardQRConfig")
      .select("*")
      .eq("cardId", cardId)
      .maybeSingle();

    if (originalQR) {
      await supabase.from("CardQRConfig").insert({
        cardId: newCard.id,
        shapeId: originalQR.shapeId,
        dotShape: originalQR.dotShape,
        finderStyle: originalQR.finderStyle,
        eyeBall: originalQR.eyeBall,
        bodyScale: originalQR.bodyScale,
        fg: originalQR.fg,
        bg: originalQR.bg,
        accentFg: originalQR.accentFg,
        accentBg: originalQR.accentBg,
        strokeEnabled: originalQR.strokeEnabled,
        strokeColor: originalQR.strokeColor,
        gradEnabled: originalQR.gradEnabled,
        gradStops: originalQR.gradStops,
        gradAngle: originalQR.gradAngle,
        selectedLogo: originalQR.selectedLogo,
        customLogoUrl: originalQR.customLogoUrl,
        logoBg: originalQR.logoBg,
        designLabel: originalQR.designLabel,
        shapeLabel: originalQR.shapeLabel,
        stickerId: originalQR.stickerId,
      });
    }

    // BUG 38 – notify on card duplication
    void createNotification(
      req.user!.uid,
      "CARD",
      "Card Duplicated",
      `"${originalCard.name}" has been duplicated as "${newCard.name}".`,
      { sourceId: newCard.id, sourceType: "Card" }
    );

    return res.status(201).json(newCard);
  } catch (error) {
    console.error("Error duplicating card:", error);
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.post("/share/:cardId", verifySession, async (req: AuthRequest, res: Response) => {
  const { cardId } = req.params;
  const { method, recipientEmail, recipientPhone, recipientName } = req.body;

  const validMethods = ["email", "sms", "whatsapp", "linkedin", "twitter", "facebook", "copy_link", "qr_download", "airdrop", "nfc"];
  if (!validMethods.includes(method)) {
    return res.status(400).json({ error: "Invalid share method" });
  }

  try {
    const { data: card, error: fetchError } = await supabase
      .from("Card")
      .select("id, slug, shareUrl, userId, totalShares")
      .eq("id", cardId)
      .eq("userId", req.user!.uid)
      .single();

    if (fetchError || !card) {
      return res.status(404).json({ error: "Card not found" });
    }

    const shareUrl = `${process.env.FRONTEND_URL || "https://samcard.app"}${card.shareUrl}`;

    const { data: shareRecord, error: shareError } = await supabase
      .from("CardShare")
      .insert({
        cardId: card.id,
        method: method.toUpperCase().replace("-", "_") as "EMAIL" | "SMS" | "WHATSAPP" | "LINKEDIN" | "TWITTER" | "FACEBOOK" | "COPY_LINK" | "QR_DOWNLOAD" | "AIRDROP" | "NFC",
        recipientEmail: recipientEmail || null,
        recipientPhone: recipientPhone || null,
        recipientName: recipientName || null,
        sharedUrl: shareUrl,
        sharedByIp: req.ip || null,
      })
      .select()
      .single();

    if (shareError) {
      console.error("Share tracking error:", shareError);
    }

    await supabase
      .from("Card")
      .update({
        totalShares: ((card as { totalShares?: number }).totalShares || 0) + 1,
        lastSharedAt: new Date().toISOString(),
      })
      .eq("id", card.id);

    return res.json({
      success: true,
      shareUrl,
      shareId: shareRecord?.id,
    });
  } catch (error) {
    console.error("Error sharing card:", error);
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.get("/share/:cardId/history", verifySession, async (req: AuthRequest, res: Response) => {
  const { cardId } = req.params;
  const { page = "1", limit = "20" } = req.query;

  try {
    const { data: card, error: cardError } = await supabase
      .from("Card")
      .select("id")
      .eq("id", cardId)
      .eq("userId", req.user!.uid)
      .single();

    if (cardError || !card) {
      return res.status(404).json({ error: "Card not found" });
    }

    const pageNum = Math.max(1, Number.parseInt(String(page), 10) || 1);
    const limitNum = Math.min(100, Math.max(1, Number.parseInt(String(limit), 10) || 20));
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    const { data: shares, error: sharesError, count } = await supabase
      .from("CardShare")
      .select("*", { count: "exact" })
      .eq("cardId", cardId)
      .order("createdAt", { ascending: false })
      .range(from, to);

    if (sharesError) {
      return res.status(500).json({ error: sharesError.message });
    }

    return res.json({
      shares: shares || [],
      total: count || 0,
      page: pageNum,
      limit: limitNum,
    });
  } catch (error) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default router;

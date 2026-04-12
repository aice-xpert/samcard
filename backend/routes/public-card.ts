import express, { Response } from "express";
import { supabase } from "../config/supabase";
import { randomUUID } from "crypto";

const router = express.Router();

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Internal server error";

const normalizePhoneBgType = (value: unknown): "solid" | "gradient" => {
  if (typeof value !== "string") return "solid";
  return value.toLowerCase() === "gradient" ? "gradient" : "solid";
};

const LEAD_SOURCES = new Set([
  "NFC",
  "QR",
  "LINK_CLICK",
  "DIRECT",
  "SEARCH",
  "REFERRAL",
  "SOCIAL",
  "ORGANIC",
]);

const normalizeLeadSource = (value: unknown): string => {
  if (typeof value !== "string") return "DIRECT";
  const normalized = value.trim().toUpperCase();
  return LEAD_SOURCES.has(normalized) ? normalized : "DIRECT";
};

const createLeadId = (): string =>
  `lead_${randomUUID().replace(/-/g, "")}`;

interface PublicCardResponse {
  id: string;
  name: string;
  slug: string;
  cardType: string;
  status: string;
  shareUrl: string;
  headingText?: string;
  headingBodyText?: string;
  design: {
    accentColor: string;
    accentLight: string;
    bgColor: string;
    cardColor: string;
    textPrimary: string;
    textMuted: string;
    phoneBgPreset?: string;
    phoneBgColor1: string;
    phoneBgColor2: string;
    phoneBgAngle: number;
    phoneBgType: string;
    font: string;
    bodyFontSize: number;
    nameFontSize: number;
    boldHeadings: boolean;
    cardRadius: number;
    shadowIntensity: string;
    glowEffect: boolean;
  };
  content: {
    profileImage: string;
    brandLogo: string;
    logoPosition: string;
    formData: {
      name: string;
      title: string;
      company: string;
      tagline: string;
      email: string;
      phone: string;
      website: string;
      location: string;
    };
    connectFields: { type: string; label: string; value: string }[];
    sections: {
      profile: boolean;
      headingText: boolean;
      contactUs: boolean;
      socialLinks: boolean;
      links: boolean;
      appointment: boolean;
      collectContacts: boolean;
      businessDetails: boolean;
    };
    customLinks: { label: string; url: string }[];
    extraSections: {
      id: string;
      type: string;
      label: string;
      enabled: boolean;
      data: Record<string, unknown>;
    }[];
  };
  qrConfig?: {
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
    stickerId: string | null;
  };
  socialLinks: {
    platform: string;
    handle: string;
    url: string;
    label: string;
    displayOrder: number;
    enabled: boolean;
  }[];
  businessProfile: {
    name: string;
    title?: string;
    company?: string;
    tagline?: string;
    profileImageUrl?: string;
    primaryEmail?: string;
    primaryPhone?: string;
    website?: string;
    address?: string;
    city?: string;
    country?: string;
  };
}

router.get("/:slug", async (req, res: Response) => {
  const { slug } = req.params;

  // ?preview=true allows DRAFT cards to be viewed (e.g. from dashboard preview button)
  // Without it, only ACTIVE cards are publicly accessible
  const isPreview = req.query.preview === "true";

  try {
    let query = supabase
      .from("Card")
      .select(`
        id, name, slug, cardType, status, shareUrl, headingText, headingBodyText,
        accentColor, accentLight, backgroundColor, cardColor, textColor,
        phoneBgType, phoneBgPreset, phoneBgColor1, phoneBgColor2, phoneBgAngle,
        fontFamily, nameFontSize, bodyFontSize, boldHeadings, cardRadius,
        shadowIntensity, glowEffect, showProfile, showHeading, showContact,
        showSocial, showLinks, showAppointment, showBusinessDetails, showExtraSections,
        businessProfileId
      `)
      .eq("slug", slug);

    // Only enforce ACTIVE status for public (non-preview) visits
    if (!isPreview) {
      query = query.eq("status", "ACTIVE");
    }

    const { data: card, error: cardError } = await query.single();

    if (cardError || !card) {
      return res.status(404).json({ error: "Card not found" });
    }

    const { data: design } = await supabase
      .from("CardDesign")
      .select("*")
      .eq("cardId", card.id)
      .maybeSingle();

    const { data: content } = await supabase
      .from("CardContent")
      .select("*")
      .eq("cardId", card.id)
      .maybeSingle();

    const { data: qrConfig } = await supabase
      .from("CardQRConfig")
      .select("*")
      .eq("cardId", card.id)
      .maybeSingle();

    const { data: socialLinks } = await supabase
      .from("SocialLink")
      .select("platform, handle, url, label, displayOrder, enabled")
      .eq("businessProfileId", card.businessProfileId)
      .eq("enabled", true)
      .order("displayOrder", { ascending: true });

    const { data: businessProfile } = await supabase
      .from("BusinessProfile")
      .select("name, title, company, tagline, profileImageUrl, primaryEmail, primaryPhone, website, address, city, country")
      .eq("id", card.businessProfileId)
      .single();

    console.log("[public-card] background source", {
      slug,
      cardId: card.id,
      cardBackground: {
        backgroundColor: card.backgroundColor,
        phoneBgType: card.phoneBgType,
        phoneBgColor1: card.phoneBgColor1,
        phoneBgColor2: card.phoneBgColor2,
        phoneBgAngle: card.phoneBgAngle,
      },
      designBackground: design
        ? {
            bgColor: design.bgColor,
            phoneBgType: design.phoneBgType,
            phoneBgColor1: design.phoneBgColor1,
            phoneBgColor2: design.phoneBgColor2,
            phoneBgAngle: design.phoneBgAngle,
          }
        : null,
    });

    const defaultSections = {
      profile: card.showProfile ?? true,
      headingText: card.showHeading ?? true,
      contactUs: card.showContact ?? true,
      socialLinks: card.showSocial ?? true,
      links: card.showLinks ?? true,
      appointment: card.showAppointment ?? true,
      collectContacts: true,
      businessDetails: card.showBusinessDetails ?? true,
    };

    const response: PublicCardResponse = {
      id: card.id,
      name: card.name,
      slug: card.slug,
      cardType: card.cardType,
      status: card.status,
      shareUrl: card.shareUrl,
      headingText: card.headingText,
      headingBodyText: card.headingBodyText,
      design: {
        accentColor: design?.accentColor ?? card.accentColor,
        accentLight: design?.accentLight ?? card.accentLight,
        bgColor: design?.bgColor ?? card.backgroundColor,
        cardColor: design?.cardColor ?? card.cardColor,
        textPrimary: design?.textPrimary ?? card.textColor,
        textMuted: design?.textMuted ?? "#A0A0A0",
        phoneBgPreset: design?.phoneBgPreset ?? card.phoneBgPreset,
        phoneBgColor1: design?.phoneBgColor1 ?? card.phoneBgColor1,
        phoneBgColor2: design?.phoneBgColor2 ?? card.phoneBgColor2,
        phoneBgAngle: design?.phoneBgAngle ?? card.phoneBgAngle,
        phoneBgType: normalizePhoneBgType(design?.phoneBgType ?? card.phoneBgType),
        font: design?.font ?? card.fontFamily?.toLowerCase() ?? "inter",
        bodyFontSize: design?.bodyFontSize ?? card.bodyFontSize ?? 14,
        nameFontSize: design?.nameFontSize ?? card.nameFontSize ?? 24,
        boldHeadings: design?.boldHeadings ?? card.boldHeadings ?? false,
        cardRadius: design?.cardRadius ?? card.cardRadius ?? 16,
        shadowIntensity: design?.shadowIntensity ?? card.shadowIntensity ?? "medium",
        glowEffect: design?.glowEffect ?? card.glowEffect ?? false,
      },
      content: {
        profileImage: content?.profileImage ?? businessProfile?.profileImageUrl ?? "",
        brandLogo: content?.brandLogo ?? "",
        logoPosition: content?.logoPosition ?? "top-right",
        formData: {
          name: content?.formData?.name ?? businessProfile?.name ?? "",
          title: content?.formData?.title ?? businessProfile?.title ?? "",
          company: content?.formData?.company ?? businessProfile?.company ?? "",
          tagline: content?.formData?.tagline ?? businessProfile?.tagline ?? "",
          email: content?.formData?.email ?? businessProfile?.primaryEmail ?? "",
          phone: content?.formData?.phone ?? businessProfile?.primaryPhone ?? "",
          website: content?.formData?.website ?? businessProfile?.website ?? "",
          location: content?.formData?.location ?? ([businessProfile?.city, businessProfile?.country].filter(Boolean).join(", ") || ""),
        },
        connectFields: content?.connectFields ?? [],
        sections: content?.sections ?? defaultSections,
        customLinks: content?.customLinks ?? [],
        extraSections: content?.extraSections ?? [],
      },
      qrConfig: qrConfig ? {
        shapeId: qrConfig.shapeId,
        dotShape: qrConfig.dotShape,
        finderStyle: qrConfig.finderStyle,
        eyeBall: qrConfig.eyeBall,
        bodyScale: qrConfig.bodyScale,
        fg: qrConfig.fg,
        bg: qrConfig.bg,
        accentFg: qrConfig.accentFg,
        accentBg: qrConfig.accentBg,
        strokeEnabled: qrConfig.strokeEnabled,
        strokeColor: qrConfig.strokeColor,
        gradEnabled: qrConfig.gradEnabled,
        gradStops: qrConfig.gradStops,
        gradAngle: qrConfig.gradAngle,
        selectedLogo: qrConfig.selectedLogo,
        customLogoUrl: qrConfig.customLogoUrl,
        logoBg: qrConfig.logoBg,
        stickerId: qrConfig.stickerId,
      } : undefined,
      socialLinks: socialLinks ?? [],
      businessProfile: {
        name: businessProfile?.name ?? "",
        title: businessProfile?.title,
        company: businessProfile?.company,
        tagline: businessProfile?.tagline,
        profileImageUrl: businessProfile?.profileImageUrl,
        primaryEmail: businessProfile?.primaryEmail,
        primaryPhone: businessProfile?.primaryPhone,
        website: businessProfile?.website,
        address: businessProfile?.address,
        city: businessProfile?.city,
        country: businessProfile?.country,
      },
    };

    console.log("[public-card] background response", {
      slug,
      cardId: response.id,
      design: {
        bgColor: response.design.bgColor,
        phoneBgType: response.design.phoneBgType,
        phoneBgColor1: response.design.phoneBgColor1,
        phoneBgColor2: response.design.phoneBgColor2,
        phoneBgAngle: response.design.phoneBgAngle,
      },
    });

    return res.json(response);
  } catch (error) {
    console.error("Error fetching public card:", error);
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.post("/:slug/leads", async (req, res: Response) => {
  const { slug } = req.params;
  const { name, email, phone, company, jobTitle, notes, source, utmSource, utmCampaign, marketingConsent, gdprConsent } = req.body;

  try {
    const isPreview = req.query.preview === "true";

    const { data: card, error: cardError } = await supabase
      .from("Card")
      .select("id, userId, businessProfileId, name, totalSaves, status")
      .eq("slug", slug)
      .maybeSingle();

    if (cardError) {
      return res.status(500).json({ error: cardError.message });
    }

    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    if (card.status !== "ACTIVE" && !isPreview) {
      return res.status(409).json({
        error: "Card exists but is not published yet. Publish the card to accept public leads.",
      });
    }

    if (!name && !email && !phone) {
      return res.status(400).json({ error: "At least name, email, or phone is required" });
    }

    if (email) {
      const { data: existingLead } = await supabase
        .from("Lead")
        .select("id")
        .eq("businessProfileId", card.businessProfileId)
        .eq("email", email)
        .maybeSingle();

      if (existingLead) {
        return res.status(409).json({ error: "Lead with this email already exists", leadId: existingLead.id });
      }
    }

    const now = new Date().toISOString();

    const { data: lead, error: leadError } = await supabase
      .from("Lead")
      .insert({
        id: createLeadId(),
        userId: card.userId,
        businessProfileId: card.businessProfileId,
        cardId: card.id,
        name: name || "",
        email: email || null,
        phone: phone || null,
        company: company || null,
        jobTitle: jobTitle || null,
        notes: notes || null,
        source: normalizeLeadSource(source),
        utmSource: utmSource || null,
        utmCampaign: utmCampaign || null,
        marketingConsent: marketingConsent ?? false,
        gdprConsent: gdprConsent ?? false,
        status: "NEW",
        engagementScore: 0,
        tags: [],
        createdAt: now,
        updatedAt: now,
      })
      .select()
      .single();

    if (leadError) {
      console.error("Lead creation error:", leadError);
      return res.status(500).json({ error: leadError.message || "Failed to create lead" });
    }

    await supabase
      .from("Card")
      .update({
        totalSaves: ((card as { totalSaves?: number }).totalSaves ?? 0) + 1,
      })
      .eq("id", card.id);

    return res.status(201).json({ success: true, lead });
  } catch (error) {
    console.error("Error creating lead:", error);
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.post("/:slug/track", async (req, res: Response) => {
  const { slug } = req.params;
  const { type, linkId, linkLabel, visitorId, fingerprint, referrer, utmSource, utmMedium, utmCampaign, utmContent } = req.body;

  const validTypes = ["view", "tap", "scan", "save", "share", "link_click", "contact_submit", "appointment_click"];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: "Invalid interaction type" });
  }

  try {
    const { data: card, error: cardError } = await supabase
      .from("Card")
      .select("id, userId, totalViews, totalTaps, totalScans, totalSaves, totalShares, totalLinkClicks")
      .eq("slug", slug)
      .eq("status", "ACTIVE")
      .single();

    if (cardError || !card) {
      return res.status(404).json({ error: "Card not found" });
    }

    const deviceType = req.headers["user-agent"]?.includes("Mobile") ? "MOBILE" : "WEB";
    const country = req.headers["cf-ipcountry"] || req.headers["x-vercel-ip-country"] || "UNKNOWN";

    const { error: interactionError } = await supabase
      .from("CardInteraction")
      .insert({
        cardId: card.id,
        type,
        visitorId: visitorId || null,
        fingerprint: fingerprint || null,
        deviceType: deviceType as "IOS" | "ANDROID" | "WEB" | "NFC_READER" | "QR_SCANNER" | "UNKNOWN",
        browser: req.headers["user-agent"] || null,
        referrer: referrer || req.headers.referer || null,
        utmSource: utmSource || null,
        utmMedium: utmMedium || null,
        utmCampaign: utmCampaign || null,
        utmContent: utmContent || null,
        linkId: linkId || null,
        linkLabel: linkLabel || null,
        country: typeof country === "string" ? country : "UNKNOWN",
        ipAddress: req.ip || req.connection?.remoteAddress || null,
      });

    if (interactionError) {
      console.error("Interaction tracking error:", interactionError);
    }

    const updateFields: Record<string, unknown> = {};
    if (type === "view") updateFields.totalViews = ((card as { totalViews?: number }).totalViews || 0) + 1;
    if (type === "tap" || type === "scan") updateFields.totalTaps = ((card as { totalTaps?: number }).totalTaps || 0) + 1;
    if (type === "scan") updateFields.totalScans = ((card as { totalScans?: number }).totalScans || 0) + 1;
    if (type === "save") updateFields.totalSaves = ((card as { totalSaves?: number }).totalSaves || 0) + 1;
    if (type === "share") updateFields.totalShares = ((card as { totalShares?: number }).totalShares || 0) + 1;
    if (type === "link_click") updateFields.totalLinkClicks = ((card as { totalLinkClicks?: number }).totalLinkClicks || 0) + 1;

    if (Object.keys(updateFields).length > 0) {
      await supabase.from("Card").update(updateFields).eq("id", card.id);
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("Error tracking interaction:", error);
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.get("/:slug/qr", async (req, res: Response) => {
  const { slug } = req.params;
  const { size = 300 } = req.query;

  try {
    const { data: card, error: cardError } = await supabase
      .from("Card")
      .select("id, slug, shareUrl, qrEnabled, qrConfig, qrShape")
      .eq("slug", slug)
      .eq("status", "ACTIVE")
      .single();

    if (cardError || !card) {
      return res.status(404).json({ error: "Card not found" });
    }

    const { data: qrConfig } = await supabase
      .from("CardQRConfig")
      .select("*")
      .eq("cardId", card.id)
      .maybeSingle();

    const shareUrl = `${process.env.FRONTEND_URL || "https://samcard.app"}${card.shareUrl}`;

    const qrSettings = {
      size: Number(size),
      fg: qrConfig?.fg || "#000000",
      bg: qrConfig?.bg || "#ffffff",
      shapeId: qrConfig?.shapeId || "square",
      dotShape: qrConfig?.dotShape || "square",
      finderStyle: qrConfig?.finderStyle || "square",
      eyeBall: qrConfig?.eyeBall || "square",
      bodyScale: qrConfig?.bodyScale || 1.0,
      gradEnabled: qrConfig?.gradEnabled || false,
      gradStops: qrConfig?.gradStops || [],
      gradAngle: qrConfig?.gradAngle || 135,
      logoUrl: qrConfig?.customLogoUrl || null,
      logoBg: qrConfig?.logoBg || "#ffffff",
    };

    return res.json({
      cardId: card.id,
      slug: card.slug,
      shareUrl,
      qrEnabled: card.qrEnabled,
      config: qrSettings,
    });
  } catch (error) {
    console.error("Error fetching QR config:", error);
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default router;
import express, { Response } from "express";
import { supabase } from "../config/supabase";
import { AuthRequest, verifySession } from "../middleware/auth";
import { createNotification } from "../lib/notifications";
const router = express.Router({ mergeParams: true });
const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Internal server error";

interface SectionConfig {
  profile: boolean;
  headingText: boolean;
  contactUs: boolean;
  socialLinks: boolean;
  links: boolean;
  appointment: boolean;
  collectContacts: boolean;
  businessDetails: boolean;
}

interface ExtraSection {
  id: string;
  type: string;
  label: string;
  enabled: boolean;
  expanded: boolean;
  data: Record<string, unknown>;
}

// Valid core section keys – must match the SectionKey union on the frontend.
const CORE_SECTION_KEYS = new Set([
  "profile",
  "headingText",
  "contactUs",
  "businessDetails",
  "socialLinks",
  "links",
  "appointment",
  "collectContacts",
]);

const DEFAULT_SECTION_ORDER = [
  "profile",
  "headingText",
  "contactUs",
  "businessDetails",
  "socialLinks",
  "links",
  "appointment",
  "collectContacts",
];

/**
 * Validate and sanitise a sectionOrder array coming from the client.
 * Returns a cleaned array containing only recognised core section keys.
 * Any missing keys are appended in default order so the array is always complete.
 */
const normalizeSectionOrder = (value: unknown): string[] => {
  const incoming: string[] = Array.isArray(value)
    ? (value as unknown[]).filter((v): v is string => typeof v === "string")
    : [];

  // Keep only recognised keys, deduplicate
  const seen = new Set<string>();
  const clean = incoming.filter((k) => {
    if (!CORE_SECTION_KEYS.has(k) || seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  // Append any missing keys in default order
  for (const key of DEFAULT_SECTION_ORDER) {
    if (!seen.has(key)) clean.push(key);
  }

  return clean;
};

/**
 * Validate and sanitise a unifiedOrder array coming from the client.
 * A unifiedOrder may contain both core section keys AND extra-section IDs,
 * so we only strip obvious non-string values and deduplicate – we don't
 * restrict to CORE_SECTION_KEYS here.
 */
const normalizeUnifiedOrder = (
  value: unknown,
  extraSections: ExtraSection[]
): string[] => {
  if (!Array.isArray(value)) return [];

  const incoming = (value as unknown[]).filter(
    (v): v is string => typeof v === "string" && v.trim().length > 0
  );

  const extraIds = new Set(extraSections.map((s) => s.id));
  const allAllowed = new Set([...CORE_SECTION_KEYS, ...extraIds]);

  const seen = new Set<string>();
  return incoming.filter((id) => {
    if (!allAllowed.has(id) || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
};

const normalizeLogoPosition = (
  value: unknown
): "top-left" | "top-right" | "below-photo" | "below-name" | null => {
  if (typeof value !== "string") return null;
  const normalized = value.trim().replace(/[_\s]+/g, "-").toLowerCase();
  switch (normalized) {
    case "top-left":
      return "top-left";
    case "top-right":
      return "top-right";
    case "below-photo":
      return "below-photo";
    case "below-name":
      return "below-name";
    default:
      return null;
  }
};

interface CardContentData {
  cardId?: string;
  profileImage: string;
  brandLogo: string;
  logoPosition: "top-left" | "top-right" | "below-photo" | "below-name";
  formData: {
    name: string;
    title: string;
    company: string;
    tagline: string;
    email: string;
    phone: string;
    website: string;
    location: string;
    industry: string;
    yearFounded: string;
    appointmentUrl: string;
    headingText: string;
    bodyText: string;
  };
  connectFields: {
    type: string;
    label: string;
    value: string;
  }[];
  sections: SectionConfig;
  customLinks: {
    label: string;
    url: string;
  }[];
  extraSections: ExtraSection[];
  // ── Drag-and-drop ordering ──────────────────────────────────────────────────
  // sectionOrder: ordered array of core SectionKey strings.
  sectionOrder: string[];
  // unifiedOrder: interleaved array of core SectionKey strings + extra-section IDs.
  // This is the authoritative render order used by PhonePreview / public card page.
  unifiedOrder: string[];
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
      .from("CardContent")
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
  const contentData: Partial<CardContentData> = req.body;

  console.log('[card-content PUT] Request received:');
  console.log('[card-content PUT] cardId:', cardId);
  console.log('[card-content PUT] has sectionOrder:', !!contentData.sectionOrder);
  console.log('[card-content PUT] sectionOrder value:', contentData.sectionOrder);
  console.log('[card-content PUT] has unifiedOrder:', !!contentData.unifiedOrder);
  console.log('[card-content PUT] unifiedOrder value:', contentData.unifiedOrder);

  try {
    const { data: card } = await supabase
      .from("Card")
      .select("userId, name")
      .eq("id", cardId)
      .single();

    if (!card || card.userId !== req.user!.uid) {
      return res.status(404).json({ error: "Card not found" });
    }

    const { data: existing } = await supabase
      .from("CardContent")
      .select("id, sectionOrder, unifiedOrder, extraSections")
      .eq("cardId", cardId)
      .limit(1)
      .maybeSingle();

    const existingSectionOrder = Array.isArray(existing?.sectionOrder)
      ? existing.sectionOrder
      : undefined;
    const existingUnifiedOrder = Array.isArray(existing?.unifiedOrder)
      ? existing.unifiedOrder
      : undefined;
    const existingExtraSections = Array.isArray(existing?.extraSections)
      ? existing.extraSections
      : [];

    const defaultFormData = {
      name: "",
      title: "",
      company: "",
      tagline: "",
      email: "",
      phone: "",
      website: "",
      location: "",
      industry: "",
      yearFounded: "",
      appointmentUrl: "",
      headingText: "",
      bodyText: "",
    };

    const defaultSections: SectionConfig = {
      profile: true,
      headingText: true,
      contactUs: true,
      socialLinks: true,
      links: true,
      appointment: false,
      collectContacts: false,
      businessDetails: true,
    };

    const normalizedLogoPosition =
      normalizeLogoPosition(contentData.logoPosition) ?? "top-right";

    // ── Normalise ordering fields ──────────────────────────────────────────────
    const extraSections: ExtraSection[] =
      contentData.extraSections ?? existingExtraSections;

    const sectionOrder = contentData.sectionOrder
      ? normalizeSectionOrder(contentData.sectionOrder)
      : existingSectionOrder ?? normalizeSectionOrder(undefined);

    const rawUnified =
      contentData.unifiedOrder ?? existingUnifiedOrder;
    const unifiedOrder =
      rawUnified && Array.isArray(rawUnified) && rawUnified.length > 0
        ? normalizeUnifiedOrder(rawUnified, extraSections)
        : // Fall back: core order first, then extra sections appended at the end
          [
            ...sectionOrder,
            ...extraSections
              .map((s) => s.id)
              .filter((id) => !sectionOrder.includes(id)),
          ];

    const insertData = {
      cardId,
      profileImage: contentData.profileImage ?? "",
      brandLogo: contentData.brandLogo ?? "",
      logoPosition: normalizedLogoPosition,
      formData: contentData.formData ?? defaultFormData,
      connectFields: contentData.connectFields ?? [],
      sections: contentData.sections ?? defaultSections,
      customLinks: contentData.customLinks ?? [],
      extraSections,
      // ── persisted ordering ──
      sectionOrder,
      unifiedOrder,
      updatedAt: new Date().toISOString(),
    };

    console.log('[card-content PUT] About to save with ordering:');
    console.log('[card-content PUT] Final sectionOrder:', sectionOrder);
    console.log('[card-content PUT] Final unifiedOrder:', unifiedOrder);

    let result;
    if (existing) {
      const { data, error } = await supabase
        .from("CardContent")
        .update(insertData)
        .eq("cardId", cardId)
        .select()
        .single();

      result = { data, error };
    } else {
      const { data, error } = await supabase
        .from("CardContent")
        .insert(insertData)
        .select()
        .single();

      result = { data, error };
    }

    if (result.error) {
      return res.status(500).json({ error: result.error.message });
    }

    // BUG 38 – notify on card content update
    void createNotification(
      req.user!.uid,
      "CARD",
      "Card Updated",
      `Your card "${card.name}" content has been updated successfully.`,
      { sourceId: String(cardId), sourceType: "Card" }
    );

    return res.json(result.data);
  } catch (error: unknown) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default router;
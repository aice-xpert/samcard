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

/**
 * Robustly parse a sectionOrder / unifiedOrder value coming back from Supabase.
 *
 * Column history:
 *   - Originally created as text[]  (migration 003) → PostgREST returns a
 *     PostgreSQL array literal string like '{"a","b"}' or '{}' for empty.
 *   - Fixed to jsonb               (migration 004) → PostgREST returns a real
 *     JS array OR (for rows not yet migrated) possibly a JSON-encoded string.
 *
 * This helper handles all three cases and always returns a non-empty string[]
 * or null (null = "no saved order, use default").
 */
const parseJsonbArray = (value: unknown): string[] | null => {
  // Case 1: PostgREST already deserialised the jsonb column to a JS array ✓
  if (Array.isArray(value)) return value.length > 0 ? (value as string[]) : null;

  if (typeof value === 'string') {
    const trimmed = value.trim();

    // Case 2: PostgreSQL text[] literal e.g. '{"profile","headingText"}' or '{}'
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      const inner = trimmed.slice(1, -1);
      if (!inner) return null; // empty: '{}'
      // Split on commas that are outside quoted strings (simple PG array format)
      const items = inner
        .split(',')
        .map(s => s.replace(/^"(.*)"$/, '$1').trim())
        .filter(Boolean);
      return items.length > 0 ? items : null;
    }

    // Case 3: JSON-encoded string (double-stringified or stored as text)
    try {
      const parsed = JSON.parse(trimmed);
      // Double-stringified: JSON.parse('"[]"') → "[]" (still a string)
      if (typeof parsed === 'string') {
        try {
          const inner = JSON.parse(parsed);
          if (Array.isArray(inner) && inner.length > 0) return inner as string[];
        } catch { /* ignore */ }
        return null;
      }
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as string[];
    } catch { /* ignore */ }
  }

  return null;
};

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
 * A unifiedOrder may contain both core section keys AND extra-section IDs.
 *
 * Allowed IDs are:
 *   1. Core section keys (the 8 known keys)
 *   2. IDs that exist in the extraSections array passed in
 *   3. Any string that starts with "extra-" — these are dynamically-created
 *      extra section IDs. We trust them even if extraSections is empty or
 *      out-of-sync (e.g. race between save and reload), so they are never
 *      silently stripped.
 *
 * Only truly unknown IDs (no "extra-" prefix and not a core key) are removed.
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

  const seen = new Set<string>();
  return incoming.filter((id) => {
    if (seen.has(id)) return false;
    // Allow core keys
    if (CORE_SECTION_KEYS.has(id)) { seen.add(id); return true; }
    // Allow IDs that are explicitly in extraSections
    if (extraIds.has(id)) { seen.add(id); return true; }
    // Allow any dynamically-generated extra-section ID by prefix convention.
    // This prevents silent data loss when extraSections is empty/stale at
    // save time while unifiedOrder already contains the extra IDs.
    if (id.startsWith("extra-")) { seen.add(id); return true; }
    // Unknown ID — strip it
    return false;
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

    const existingSectionOrder = parseJsonbArray(existing?.sectionOrder) ?? undefined;
    const existingUnifiedOrder = parseJsonbArray(existing?.unifiedOrder) ?? undefined;
    const existingExtraSections = Array.isArray(existing?.extraSections)
      ? existing.extraSections
      : [];

    const parseIncomingOrderArray = (value: unknown): string[] | null => {
      const parsed = parseJsonbArray(value);
      if (parsed) return parsed;
      if (Array.isArray(value)) {
        return (value as unknown[])
          .filter((item): item is string => typeof item === "string")
          .filter(Boolean);
      }
      return null;
    };

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

    // Use explicit undefined/null check rather than truthiness so that an
    // empty array sent by the client (new card, no drags yet) still triggers
    // normalizeSectionOrder and produces the full default order instead of
    // silently falling back to existingSectionOrder.
    const sectionOrder =
      contentData.sectionOrder != null
        ? normalizeSectionOrder(parseIncomingOrderArray(contentData.sectionOrder) ?? contentData.sectionOrder)
        : existingSectionOrder ?? normalizeSectionOrder(undefined);

    // Prefer the client-sent unifiedOrder; fall back to the existing DB value.
    // IMPORTANT: use != null so that when the client explicitly sends
    // unifiedOrder: [] we use it (triggering the rebuild below), rather than
    // accidentally using existingUnifiedOrder which could be stale.
    const rawUnified =
      contentData.unifiedOrder != null
        ? parseIncomingOrderArray(contentData.unifiedOrder) ?? contentData.unifiedOrder
        : existingUnifiedOrder;      // client omitted it — use DB value
    const unifiedOrder =
      rawUnified && Array.isArray(rawUnified) && rawUnified.length > 0
        ? normalizeUnifiedOrder(rawUnified, extraSections)
        : // No saved order yet — build from sectionOrder + all extraSections
          [
            ...sectionOrder,
            ...extraSections
              .map((s) => s.id)
              .filter((id) => !sectionOrder.includes(id)),
          ];

    console.log('[card-content PUT] About to save with ordering:');
    console.log('[card-content PUT] Final sectionOrder:', sectionOrder);
    console.log('[card-content PUT] Final unifiedOrder:', unifiedOrder);

    // Ensure these are always plain arrays before writing to Supabase
    const safeSectionOrder = Array.isArray(sectionOrder) ? sectionOrder :
      (typeof sectionOrder === 'string' ? JSON.parse(sectionOrder) : []);

    const safeUnifiedOrder = Array.isArray(unifiedOrder) ? unifiedOrder :
      (typeof unifiedOrder === 'string' ? JSON.parse(unifiedOrder) : []);

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
      sectionOrder: safeSectionOrder,
      unifiedOrder: safeUnifiedOrder,
      updatedAt: new Date().toISOString(),
    };

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
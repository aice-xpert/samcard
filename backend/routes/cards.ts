import express, { Response } from "express";
import { supabase } from "../config/supabase";
import { AuthRequest, verifySession } from "../middleware/auth";
import { randomUUID } from "crypto";
import { createNotification } from "../lib/notifications";

const router = express.Router();

const getErrorMessage = (error: unknown): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }
  if (error instanceof Error) return error.message;
  return "Internal server error";
};

const normalizeCardName = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const normalized = value.trim().replace(/\s+/g, " ");
  return normalized.length > 0 ? normalized : null;
};

const cardNameKey = (name: string): string =>
  name.trim().replace(/\s+/g, " ").toLowerCase();

const isCardNameConflictError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") return false;

  const parsed = error as {
    code?: string;
    constraint?: string;
    message?: string;
    details?: string;
    hint?: string;
  };

  if (parsed.code !== "23505") return false;
  const combined = [
    parsed.constraint,
    parsed.message,
    parsed.details,
    parsed.hint,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return combined.includes("card_userid_name_normalized_unique");
};

const isSlugConflictError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") return false;

  const parsed = error as {
    code?: string;
    constraint?: string;
    message?: string;
    details?: string;
    hint?: string;
  };

  if (parsed.code !== "23505") return false;
  const combined = [
    parsed.constraint,
    parsed.message,
    parsed.details,
    parsed.hint,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return combined.includes("slug");
};


// ── Slug helpers ──────────────────────────────────────────────────────────────

/**
 * Normalizes a raw custom-slug input into a URL-safe slug, or returns null if
 * the input is invalid / empty.
 *
 * Rules:
 *   - Must be a non-empty string
 *   - Lowercased, spaces → hyphens, strip non-alphanumeric except hyphens
 *   - Collapsed consecutive hyphens → single hyphen
 *   - Trimmed leading / trailing hyphens
 *   - Length between 3 and 60 characters
 */
const normalizeSlug = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (slug.length < 3 || slug.length > 60) return null;
  return slug;
};

/**
 * Checks whether a given slug is already taken in the Card table,
 * checking both the primary slug column and the customSlug column.
 * Optionally excludes a card (for update flows).
 */
const isSlugTaken = async (
  slug: string,
  excludeCardId?: string
): Promise<{ taken: boolean; error: string | null }> => {
  let slugQuery = supabase.from("Card").select("id").eq("slug", slug);
  let customSlugQuery = supabase.from("Card").select("id").eq("customSlug", slug);
  if (excludeCardId) {
    slugQuery = slugQuery.neq("id", excludeCardId);
    customSlugQuery = customSlugQuery.neq("id", excludeCardId);
  }
  const [slugRes, customSlugRes] = await Promise.all([slugQuery, customSlugQuery]);
  if (slugRes.error) return { taken: false, error: slugRes.error.message };
  if (customSlugRes.error) return { taken: false, error: customSlugRes.error.message };
  return {
    taken: (slugRes.data ?? []).length > 0 || (customSlugRes.data ?? []).length > 0,
    error: null,
  };
};

// ── Name uniqueness check ─────────────────────────────────────────────────────

const cardNameExistsForUser = async (
  userId: string,
  name: string,
  excludeCardId?: string
): Promise<{ exists: boolean; error: string | null }> => {
  let query = supabase
    .from("Card")
    .select("id,name")
    .eq("userId", userId);

  if (excludeCardId) {
    query = query.neq("id", excludeCardId);
  }

  const { data, error } = await query;
  if (error) {
    return { exists: false, error: error.message };
  }

  const targetKey = cardNameKey(name);
  const exists = (data || []).some((card) => {
    if (typeof card.name !== "string") return false;
    return cardNameKey(card.name) === targetKey;
  });

  return { exists, error: null };
};

const normalizeFontFamily = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toUpperCase().replace(/[-\s]+/g, "_");
  const allowed = new Set([
    "INTER",
    "SORA",
    "DM_SANS",
    "POPPINS",
    "RALEEWAY",
    "PLAYFAIR_DISPLAY",
    "FIRA_CODE",
    "SYSTEM",
  ]);
  if (normalized === "MONO") return "FIRA_CODE";
  return allowed.has(normalized) ? normalized : null;
};

const normalizeCardStatus = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toUpperCase();
  const allowed = new Set(["ACTIVE", "INACTIVE", "DRAFT", "ARCHIVED", "SUSPENDED"]);
  if (normalized === "LIVE") return "ACTIVE";
  return allowed.has(normalized) ? normalized : null;
};

const createBusinessProfileId = (): string =>
  `bp_${randomUUID().replace(/-/g, "")}`;

const createCardId = (): string =>
  `card_${randomUUID().replace(/-/g, "")}`;

// ── Routes ────────────────────────────────────────────────────────────────────

router.get("/", verifySession, async (req: AuthRequest, res: Response) => {
  try {
    const { data: cards, error } = await supabase
      .from("Card")
      .select("*")
      .eq("userId", req.user!.uid)
      .order("createdAt", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!cards || cards.length === 0) {
      return res.json([]);
    }

    // Compute actual lead counts from Lead table to fix stale/reset totalLeads counter
    const cardIds = cards.map((c: { id: string }) => c.id);
    const { data: leadRows } = await supabase
      .from("Lead")
      .select("cardId")
      .in("cardId", cardIds);

    const leadCountByCard: Record<string, number> = {};
    leadRows?.forEach((l: { cardId: string | null }) => {
      if (l.cardId) {
        leadCountByCard[l.cardId] = (leadCountByCard[l.cardId] || 0) + 1;
      }
    });

    const result = cards.map((c: Record<string, unknown> & { id: string }) => ({
      ...c,
      totalLeads: leadCountByCard[c.id] ?? 0,
    }));

    return res.json(result);
  } catch (error: unknown) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

// ── GET /slug-check?slug=<slug>[&excludeCardId=<id>] ─────────────────────────
// Public availability check — no auth required so the frontend can call it
// before the user is even creating a card, but we still want it under this
// router so it lives at /api/user/cards/slug-check.
router.get("/check-slug", verifySession, async (req: AuthRequest, res: Response) => {
  const raw = req.query.slug;
  const excludeCardId = typeof req.query.excludeCardId === "string"
    ? req.query.excludeCardId
    : undefined;

  const slug = normalizeSlug(raw);
  if (!slug) {
    return res.status(400).json({
      available: false,
      error:
        "Invalid slug. Use 3–60 characters: lowercase letters, numbers, and hyphens only.",
    });
  }

  const { taken, error } = await isSlugTaken(slug, excludeCardId);
  if (error) {
    return res.status(500).json({ available: false, error });
  }

  return res.json({ available: !taken, slug });
});

router.post("/", verifySession, async (req: AuthRequest, res: Response) => {
  const { name, cardType, customSlug, ...otherFields } = req.body;
  const normalizedName = normalizeCardName(name);

  if (!normalizedName) {
    return res.status(400).json({ error: "Card name is required" });
  }

  // ── Validate custom slug if provided ────────────────────────────────────────
  let resolvedCustomSlug: string | undefined;
  if (customSlug !== undefined && customSlug !== "") {
    const normalized = normalizeSlug(customSlug);
    if (!normalized) {
      return res.status(400).json({
        error:
          "Invalid custom URL. Use 3–60 characters: lowercase letters, numbers, and hyphens only.",
      });
    }
    const { taken, error: slugErr } = await isSlugTaken(normalized);
    if (slugErr) return res.status(500).json({ error: slugErr });
    if (taken) {
      return res.status(409).json({
        error: "This custom URL is already taken. Please choose another.",
      });
    }
    resolvedCustomSlug = normalized;
  }

  try {
    // 1. Ensure User exists
    await supabase.from("User").upsert({
      id: req.user!.uid,
      email: req.user!.email ?? "",
      updatedAt: new Date().toISOString(),
    }, { onConflict: "id" });

    const duplicateCheck = await cardNameExistsForUser(req.user!.uid, normalizedName);
    if (duplicateCheck.error) {
      return res.status(500).json({ error: duplicateCheck.error });
    }
    if (duplicateCheck.exists) {
      return res.status(409).json({ error: "You already have a card with this name" });
    }

    // 2. Resolve or Create Business Profile
    const { data: existingProfile } = await supabase
      .from("BusinessProfile")
      .select("id")
      .eq("userId", req.user!.uid)
      .maybeSingle();

    let businessProfileId = existingProfile?.id;

    if (!businessProfileId) {
      const profileId = createBusinessProfileId();
      const profileSlug = `profile-${req.user!.uid.slice(0, 5)}-${Date.now().toString(36)}`;

      const { data: createdProfile, error: createProfileError } = await supabase
        .from("BusinessProfile")
        .insert({
          id: profileId,
          userId: req.user!.uid,
          name: name || "My Profile",
          slug: profileSlug,
          updatedAt: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (createProfileError) throw createProfileError;
      businessProfileId = createdProfile.id;
    }

    // 3. Create the Card — slug is always the auto-generated card ID.
    // customSlug (if provided) is stored separately; both resolve publicly.
    const cardId = createCardId();
    const slug = cardId;
    const shareUrl = `/${slug}`;

    const cardData: Record<string, unknown> = {
      id: cardId,
      userId: req.user!.uid,
      businessProfileId,
      name: normalizedName,
      slug,
      shareUrl,
      ...(resolvedCustomSlug ? { customSlug: resolvedCustomSlug } : {}),
      cardType: cardType || "QR",
      status: "ACTIVE",
      updatedAt: new Date().toISOString(),
    };

    const normalizedFields = { ...otherFields } as Record<string, unknown>;
    if (normalizedFields.fontFamily !== undefined) {
      const normalizedFont = normalizeFontFamily(normalizedFields.fontFamily);
      if (!normalizedFont) {
        return res.status(400).json({ error: "Invalid fontFamily value" });
      }
      normalizedFields.fontFamily = normalizedFont;
    }
    if (normalizedFields.status !== undefined) {
      const normalizedStatus = normalizeCardStatus(normalizedFields.status);
      if (!normalizedStatus) {
        return res.status(400).json({ error: "Invalid status value" });
      }
      normalizedFields.status = normalizedStatus;
    }
    // Keep server-owned identifiers/URLs authoritative on create.
    delete normalizedFields.id;
    delete normalizedFields.userId;
    delete normalizedFields.businessProfileId;
    delete normalizedFields.slug;
    delete normalizedFields.shareUrl;
    Object.assign(cardData, normalizedFields);

    const { data, error } = await supabase
      .from("Card")
      .insert(cardData)
      .select()
      .single();

    if (error) {
      console.error("Card creation error:", error);
      if (isCardNameConflictError(error)) {
        return res.status(409).json({ error: "You already have a card with this name" });
      }
      // Surface slug unique-constraint violations clearly
      if (isSlugConflictError(error)) {
        return res.status(409).json({
          error: "This custom URL is already taken. Please choose another.",
        });
      }
      return res.status(500).json({ error: error.message });
    }

    void createNotification(
      req.user!.uid,
      "CARD",
      "New Card Created",
      `Your card "${data.name}" has been created and is ready to customize.`,
      { sourceId: data.id, sourceType: "Card" }
    );

    return res.status(201).json(data);
  } catch (error: unknown) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.put("/:id", verifySession, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, status, themeOverride, designId, customSlug, ...otherFields } = req.body;

  try {
    const { data: existing } = await supabase
      .from("Card")
      .select("userId")
      .eq("id", id)
      .single();

    if (!existing || existing.userId !== req.user!.uid) {
      return res.status(404).json({ error: "Card not found" });
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (name !== undefined) {
      const normalizedName = normalizeCardName(name);
      if (!normalizedName) {
        return res.status(400).json({ error: "Card name is required" });
      }

      const duplicateCheck = await cardNameExistsForUser(req.user!.uid, normalizedName, String(id));
      if (duplicateCheck.error) {
        return res.status(500).json({ error: duplicateCheck.error });
      }
      if (duplicateCheck.exists) {
        return res.status(409).json({ error: "You already have a card with this name" });
      }

      updateData.name = normalizedName;
    }

    // ── Custom slug update ────────────────────────────────────────────────────
    if (customSlug !== undefined) {
      if (customSlug === "") {
        // Empty string clears the custom slug
        updateData.customSlug = null;
      } else {
        const normalized = normalizeSlug(customSlug);
        if (!normalized) {
          return res.status(400).json({
            error:
              "Invalid custom URL. Use 3–60 characters: lowercase letters, numbers, and hyphens only.",
          });
        }
        const { taken, error: slugErr } = await isSlugTaken(normalized, String(id));
        if (slugErr) return res.status(500).json({ error: slugErr });
        if (taken) {
          return res.status(409).json({
            error: "This custom URL is already taken. Please choose another.",
          });
        }
        updateData.customSlug = normalized;
      }
    }

    if (status) {
      const normalizedStatus = normalizeCardStatus(status);
      if (!normalizedStatus) {
        return res.status(400).json({ error: "Invalid status value" });
      }

      const { data: currentCard, error: currentCardError } = await supabase
        .from("Card")
        .select("status")
        .eq("id", id)
        .single();

      if (currentCardError) {
        return res.status(500).json({ error: currentCardError.message });
      }

      if (currentCard?.status === normalizedStatus) {
        const { data: unchanged, error: unchangedError } = await supabase
          .from("Card")
          .select("*")
          .eq("id", id)
          .single();

        if (unchangedError) {
          return res.status(500).json({ error: unchangedError.message });
        }

        return res.json(unchanged);
      }

      updateData.status = normalizedStatus;
      if (normalizedStatus === "ACTIVE") {
        updateData.publishedAt = new Date().toISOString();
      }
    }
    if (themeOverride) updateData.themeOverride = themeOverride;
    if (designId) updateData.designId = designId;
    const normalizedFields = { ...otherFields } as Record<string, unknown>;
    if (normalizedFields.fontFamily !== undefined) {
      const normalizedFont = normalizeFontFamily(normalizedFields.fontFamily);
      if (!normalizedFont) {
        return res.status(400).json({ error: "Invalid fontFamily value" });
      }
      normalizedFields.fontFamily = normalizedFont;
    }
    if (normalizedFields.status !== undefined) {
      const normalizedStatus = normalizeCardStatus(normalizedFields.status);
      if (!normalizedStatus) {
        return res.status(400).json({ error: "Invalid status value" });
      }
      normalizedFields.status = normalizedStatus;
      if (normalizedStatus === "ACTIVE") {
        normalizedFields.publishedAt = new Date().toISOString();
      }
    }
    Object.assign(updateData, normalizedFields);

    const { data, error } = await supabase
      .from("Card")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (isCardNameConflictError(error)) {
        return res.status(409).json({ error: "You already have a card with this name" });
      }
      if (isSlugConflictError(error)) {
        return res.status(409).json({
          error: "This custom URL is already taken. Please choose another.",
        });
      }
      return res.status(500).json({ error: error.message });
    }

    if (status && normalizeCardStatus(status) === "ACTIVE") {
      void createNotification(
        req.user!.uid,
        "CARD",
        "Card Published",
        `Your card "${data.name}" is now live and visible to everyone.`,
        { sourceId: data.id, sourceType: "Card" }
      );
    } else if (name) {
      void createNotification(
        req.user!.uid,
        "CARD",
        "Card Updated",
        `Your card "${data.name}" has been updated successfully.`,
        { sourceId: data.id, sourceType: "Card" }
      );
    }

    return res.json(data);
  } catch (error: unknown) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.get("/:id/qr", verifySession, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("Card")
      .select("qrConfig, userId")
      .eq("id", id)
      .single();

    if (error || !data || data.userId !== req.user!.uid) {
      return res.status(404).json({ error: "Card not found" });
    }

    return res.json(data.qrConfig ?? null);
  } catch (error: unknown) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.put("/:id/qr", verifySession, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const { data: existing } = await supabase
      .from("Card")
      .select("userId")
      .eq("id", id)
      .single();

    if (!existing || existing.userId !== req.user!.uid) {
      return res.status(404).json({ error: "Card not found" });
    }

    const { data, error } = await supabase
      .from("Card")
      .update({ qrConfig: req.body })
      .eq("id", id)
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

router.delete("/:id", verifySession, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const { data: cardToDelete } = await supabase
      .from("Card")
      .select("name")
      .eq("id", id)
      .eq("userId", req.user!.uid)
      .maybeSingle();

    const { error } = await supabase
      .from("Card")
      .delete()
      .eq("id", id)
      .eq("userId", req.user!.uid);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (cardToDelete) {
      void createNotification(
        req.user!.uid,
        "CARD",
        "Card Deleted",
        `Your card "${cardToDelete.name}" has been permanently deleted.`,
        { sourceId: String(id), sourceType: "Card" }
      );
    }

    return res.json({ success: true });
  } catch (error: unknown) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.get("/:id", verifySession, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("Card")
      .select("*")
      .eq("id", id)
      .eq("userId", req.user!.uid)
      .single();

    if (error) {
      return res.status(404).json({ error: "Card not found" });
    }

    return res.json(data);
  } catch (error: unknown) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default router;
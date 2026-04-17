import express, { Response } from "express";
import { supabase } from "../config/supabase";
import { AuthRequest, verifySession } from "../middleware/auth";
import { randomUUID } from "crypto";
import { createNotification } from "../lib/notifications";

const router = express.Router();

const getErrorMessage = (error: any): string => {
  if (error?.message) return error.message;
  if (error instanceof Error) return error.message;
  return "Internal server error";
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

router.get("/", verifySession, async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("Card")
      .select("*")
      .eq("userId", req.user!.uid)
      .order("createdAt", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data || []);
  } catch (error: unknown) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.post("/", verifySession, async (req: AuthRequest, res: Response) => {
  const { name, cardType, ...otherFields } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Card name is required" });
  }

  try {
    // 1. Ensure User exists
    await supabase.from("User").upsert({
      id: req.user!.uid,
      email: req.user!.email ?? "",
      updatedAt: new Date().toISOString(),
    }, { onConflict: "id" });


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

    // 3. Create the Card — use the cardId itself as the slug
    const cardId = createCardId();
    const slug = cardId; // ← card ID IS the slug: samcard.vercel.app/{cardId}
    const shareUrl = `/${slug}`;

    const cardData: Record<string, unknown> = {
      id: cardId,
      userId: req.user!.uid,
      businessProfileId,
      name,
      cardType: cardType || "QR",
      slug,
      shareUrl,
      status: "ACTIVE",
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
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
    Object.assign(cardData, normalizedFields);

    const { data, error } = await supabase
      .from("Card")
      .insert(cardData)
      .select()
      .single();

    if (error) {
      console.error("Card creation error:", error);
      return res.status(500).json({ error: error.message });
    }

    void createNotification(
      req.user!.uid,
      "CARD",
      "New Card Created",
      `Your card "${name}" has been created and is ready to customize.`,
      { sourceId: data.id, sourceType: "Card" }
    );

    return res.status(201).json(data);
  } catch (error: unknown) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.put("/:id", verifySession, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, status, themeOverride, designId, ...otherFields } = req.body;

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

    if (name) updateData.name = name;
    if (status) {
      const normalizedStatus = normalizeCardStatus(status);
      if (!normalizedStatus) {
        return res.status(400).json({ error: "Invalid status value" });
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

import express, { Response } from "express";
import { supabase } from "../config/supabase";
import { AuthRequest, verifySession } from "../middleware/auth";

const router = express.Router();

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Internal server error";

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
  const { name, cardType, slug } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Card name is required" });
  }

  try {
    // Ensure the User row exists in Supabase before any FK-dependent inserts.
    // Users authenticated via Firebase client-side (Google OAuth, persistent sessions)
    // may never have gone through /api/auth/login, so the row may be missing.
    const { error: upsertUserError } = await supabase
      .from("User")
      .upsert(
        {
          id: req.user!.uid,
          email: req.user!.email ?? "",
          updatedAt: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

    if (upsertUserError) {
      console.error("User upsert error:", upsertUserError);
      return res.status(500).json({ error: "Failed to initialize user profile" });
    }

    const { data: existingProfile, error: existingProfileError } = await supabase
      .from("BusinessProfile")
      .select("id")
      .eq("userId", req.user!.uid)
      .maybeSingle();

    if (existingProfileError) {
      return res.status(500).json({ error: existingProfileError.message });
    }

    let businessProfileId = existingProfile?.id;

    if (!businessProfileId) {
      const { data: user } = await supabase
        .from("User")
        .select("name, email")
        .eq("id", req.user!.uid)
        .maybeSingle();

      const baseName =
        (typeof user?.name === "string" && user.name.trim()) ||
        req.user?.email?.split("@")[0] ||
        "My Profile";

      const slugBase = baseName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-") || "profile";

      const profileSlug = `${slugBase}-${req.user!.uid.slice(0, 8)}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

      const { data: createdProfile, error: createProfileError } = await supabase
        .from("BusinessProfile")
        .insert({
          userId: req.user!.uid,
          name: baseName,
          slug: profileSlug,
          primaryEmail: req.user?.email ?? null,
          updatedAt: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (createProfileError || !createdProfile) {
        return res
          .status(500)
          .json({ error: createProfileError?.message || "Failed to create business profile" });
      }

      businessProfileId = createdProfile.id;
    }

    if (!businessProfileId) {
      return res.status(500).json({ error: "Unable to resolve business profile" });
    }

    const cardSlug = slug || `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    const shareUrl = `/${req.user!.uid}/${cardSlug}`;

    const { data, error } = await supabase
      .from("Card")
      .insert({
        userId: req.user!.uid,
        businessProfileId,
        name,
        cardType: cardType || "QR",
        slug: cardSlug,
        shareUrl,
        status: "DRAFT",
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Card creation error:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(data);
  } catch (error: unknown) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.put("/:id", verifySession, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, status, slug, themeOverride, designId, ...otherFields } = req.body;

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
    if (status) updateData.status = status;
    if (slug) updateData.slug = slug;
    if (themeOverride) updateData.themeOverride = themeOverride;
    if (designId) updateData.designId = designId;
    Object.assign(updateData, otherFields);

    const { data, error } = await supabase
      .from("Card")
      .update(updateData)
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
    const { error } = await supabase
      .from("Card")
      .delete()
      .eq("id", id)
      .eq("userId", req.user!.uid);

    if (error) {
      return res.status(500).json({ error: error.message });
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
import express, { Response } from "express";
import { supabase } from "../config/supabase";
import { AuthRequest, verifySession } from "../middleware/auth";

const router = express.Router();

const getErrorMessage = (error: any): string => {
  if (error?.message) return error.message; 
  if (error instanceof Error) return error.message;
  return "Internal server error";
};

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
    // 1. Ensure User exists - using email conflict to handle project/auth mismatches
    await supabase.from("User").upsert({
      id: req.user!.uid,
      email: req.user!.email ?? "",
      updatedAt: new Date().toISOString(),
    }, { onConflict: "email" });

    // 2. Resolve or Create Business Profile
    const { data: existingProfile } = await supabase
      .from("BusinessProfile")
      .select("id")
      .eq("userId", req.user!.uid)
      .maybeSingle();

    let businessProfileId = existingProfile?.id;

    if (!businessProfileId) {
      // Manually generate ID for Business Profile to satisfy NOT NULL constraint
      const profileId = `bp_${Math.random().toString(36).substring(2, 11)}`;
      const profileSlug = `profile-${req.user!.uid.slice(0, 5)}-${Date.now().toString(36)}`;

      const { data: createdProfile, error: createProfileError } = await supabase
        .from("BusinessProfile")
        .insert({
          id: profileId, // FIXED: Manual ID
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

    // 3. Create the Card with a Manual ID
    const cardId = `card_${Math.random().toString(36).substring(2, 11)}`; // Generate Card ID
    const cardSlug = slug || `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    const shareUrl = `/${req.user!.uid}/${cardSlug}`;

    const { data, error } = await supabase
      .from("Card")
      .insert({
        id: cardId, // FIXED: Providing manual ID to satisfy constraint 23502
        userId: req.user!.uid,
        businessProfileId,
        name,
        cardType: cardType || "QR",
        slug: cardSlug,
        shareUrl,
        status: "DRAFT",
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Card creation error:", error);
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
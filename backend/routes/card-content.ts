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

const normalizeLogoPosition = (value: unknown): "top-left" | "top-right" | "below-photo" | "below-name" | null => {
  if (typeof value !== 'string') return null;
  const normalized = value.trim().replace(/[_\s]+/g, '-').toLowerCase();
  switch (normalized) {
    case 'top-left':
      return 'top-left';
    case 'top-right':
      return 'top-right';
    case 'below-photo':
      return 'below-photo';
    case 'below-name':
      return 'below-name';
    case 'top-left':
      return 'top-left';
    case 'top-right':
      return 'top-right';
    case 'below-photo':
      return 'below-photo';
    case 'below-name':
      return 'below-name';
    case 'top_left':
      return 'top-left';
    case 'top_right':
      return 'top-right';
    case 'below_photo':
      return 'below-photo';
    case 'below_name':
      return 'below-name';
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
      .select("id")
      .eq("cardId", cardId)
      .limit(1)
      .maybeSingle();

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

    const normalizedLogoPosition = normalizeLogoPosition(contentData.logoPosition) ?? "top-right";

    const insertData = {
      cardId,
      profileImage: contentData.profileImage ?? "",
      brandLogo: contentData.brandLogo ?? "",
      logoPosition: normalizedLogoPosition,
      formData: contentData.formData ?? defaultFormData,
      connectFields: contentData.connectFields ?? [],
      sections: contentData.sections ?? defaultSections,
      customLinks: contentData.customLinks ?? [],
      extraSections: contentData.extraSections ?? [],
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

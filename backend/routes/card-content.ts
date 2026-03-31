import express, { Response } from "express";
import { supabase } from "../config/supabase";
import { AuthRequest, verifySession } from "../middleware/auth";

const router = express.Router();

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

router.get("/:cardId", verifySession, async (req: AuthRequest, res: Response) => {
  const { cardId } = req.params;

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
      .maybeSingle();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error: unknown) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.put("/:cardId", verifySession, async (req: AuthRequest, res: Response) => {
  const { cardId } = req.params;
  const contentData: Partial<CardContentData> = req.body;

  try {
    const { data: card } = await supabase
      .from("Card")
      .select("userId")
      .eq("id", cardId)
      .single();

    if (!card || card.userId !== req.user!.uid) {
      return res.status(404).json({ error: "Card not found" });
    }

    const { data: existing } = await supabase
      .from("CardContent")
      .select("id")
      .eq("cardId", cardId)
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

    const insertData = {
      cardId,
      profileImage: contentData.profileImage ?? "",
      brandLogo: contentData.brandLogo ?? "",
      logoPosition: contentData.logoPosition ?? "top-right",
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

    return res.json(result.data);
  } catch (error: unknown) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default router;

import express, { Response } from "express";
import { supabase } from "../config/supabase";
import { AuthRequest, verifySession } from "../middleware/auth";

const router = express.Router();

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Internal server error";

router.get("/profile", verifySession, async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("User")
      .select("*")
      .eq("id", req.user!.uid)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error: unknown) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.put("/profile", verifySession, async (req: AuthRequest, res: Response) => {
  const { name, phone, avatar, timezone, language, theme, compactMode, profilePublic, showEmail, showPhone, analyticsOptIn } = req.body;

  try {
    const { data, error } = await supabase
      .from("User")
      .update({
        name,
        phone,
        avatar,
        timezone,
        language,
        theme,
        compactMode,
        profilePublic,
        showEmail,
        showPhone,
        analyticsOptIn,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", req.user!.uid)
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

router.get("/business-profile", verifySession, async (req: AuthRequest, res: Response) => {
  try {
    // Ensure User row exists before querying BusinessProfile (FK dependency).
    // Users who authenticated client-side may not have a Supabase User row yet.
    await supabase
      .from("User")
      .upsert(
        {
          id: req.user!.uid,
          email: req.user!.email ?? "",
          updatedAt: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

    const { data, error } = await supabase
      .from("BusinessProfile")
      .select("*")
      .eq("userId", req.user!.uid)
      .maybeSingle();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: "Business profile not found" });
    }

    return res.json(data);
  } catch (error: unknown) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.put("/business-profile", verifySession, async (req: AuthRequest, res: Response) => {
  const {
    name, title, company, tagline, profileImageUrl, coverImageUrl, brandLogoUrl, logoPosition,
    primaryEmail, secondaryEmail, primaryPhone, secondaryPhone, website,
    address, city, state, country, postalCode, latitude, longitude,
    industry, department, jobLevel, yearFounded, companySize,
    appointmentEnabled, appointmentUrl, appointmentLabel,
    collectContactsEnabled, collectNotesEnabled, contactFormLabel,
    headingText, headingBodyText, contactUsHeading, contactUsBodyText,
    metaTitle, metaDescription, ogImage, customCss, customJs
  } = req.body;

  try {
    const { data: existing, error: fetchError } = await supabase
      .from("BusinessProfile")
      .select("id")
      .eq("userId", req.user!.uid)
      .maybeSingle();

    if (fetchError) {
      return res.status(500).json({ error: fetchError.message });
    }

    let result;
    if (existing) {
      const { data, error } = await supabase
        .from("BusinessProfile")
        .update({
          name, title, company, tagline, profileImageUrl, coverImageUrl, brandLogoUrl, logoPosition,
          primaryEmail, secondaryEmail, primaryPhone, secondaryPhone, website,
          address, city, state, country, postalCode, latitude, longitude,
          industry, department, jobLevel, yearFounded, companySize,
          appointmentEnabled, appointmentUrl, appointmentLabel,
          collectContactsEnabled, collectNotesEnabled, contactFormLabel,
          headingText, headingBodyText, contactUsHeading, contactUsBodyText,
          metaTitle, metaDescription, ogImage, customCss, customJs,
          updatedAt: new Date().toISOString(),
        })
        .eq("userId", req.user!.uid)
        .select()
        .single();

      result = { data, error };
    } else {
      const safeName = typeof name === "string" ? name : "profile";
      const slug = `${safeName.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-") || "profile"}-${req.user!.uid.slice(0, 8)}`;
      const { data, error } = await supabase
        .from("BusinessProfile")
        .insert({
          userId: req.user!.uid,
          name, title, company, slug, tagline, profileImageUrl, coverImageUrl, brandLogoUrl, logoPosition,
          primaryEmail, secondaryEmail, primaryPhone, secondaryPhone, website,
          address, city, state, country, postalCode, latitude, longitude,
          industry, department, jobLevel, yearFounded, companySize,
          appointmentEnabled, appointmentUrl, appointmentLabel,
          collectContactsEnabled, collectNotesEnabled, contactFormLabel,
          headingText, headingBodyText, contactUsHeading, contactUsBodyText,
          metaTitle, metaDescription, ogImage, customCss, customJs,
          updatedAt: new Date().toISOString(),
        })
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
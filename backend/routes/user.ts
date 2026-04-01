import express, { Response } from "express";
import { supabase } from "../config/supabase";
import { AuthRequest, verifySession } from "../middleware/auth";
import { create } from "node:domain";
import { v4 as uuidv4 } from 'uuid';
const router = express.Router();

const getErrorMessage = (error: any): string => {
  if (error?.message) return error.message; 
  if (error instanceof Error) return error.message;
  return "Internal server error";
};

const normalizeLogoPosition = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const mapping: Record<string, string> = {
    'top-left': 'TOP_LEFT',
    'top-right': 'TOP_RIGHT',
    'below-photo': 'BELOW_PHOTO',
    'below-name': 'BELOW_NAME',
    'TOP_LEFT': 'TOP_LEFT',
    'TOP_RIGHT': 'TOP_RIGHT',
    'BELOW_PHOTO': 'BELOW_PHOTO',
    'BELOW_NAME': 'BELOW_NAME',
  };
  return mapping[value] ?? null;
};

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
    // 1. Ensure User exists - Using upsert on 'email' to handle existing accounts
    const { data: user, error: userError } = await supabase
      .from("User")
      .upsert({
          id: req.user!.uid,
          email: req.user!.email ?? "",
          updatedAt: new Date().toISOString(),
        }, { onConflict: "email" }) 
      .select()
      .single();

    if (userError) throw userError;

    // 2. Try to get the Business Profile
    let { data: profile, error: profileError } = await supabase
      .from("BusinessProfile")
      .select("*")
      .eq("userId", req.user!.uid)
      .maybeSingle();

    if (profileError) throw profileError;

    // 3. AUTO-CREATE: Generate manual ID and timestamp to fix the 23502 error
    if (!profile) {
      const safeName = req.user!.email?.split('@')[0] || "profile";
      // Generate a unique ID string since the DB won't do it automatically for 'text' types
      const manualId = `bp_${Math.random().toString(36).substring(2, 11)}`; 
      const slug = `${safeName.toLowerCase()}-${req.user!.uid.slice(0, 5)}`;
      
      const { data: newProfile, error: createError } = await supabase
        .from("BusinessProfile")
        .insert({
          id: manualId, // FIX: Providing the missing ID
          userId: req.user!.uid,
          name: safeName,
          slug: slug,
          createdAt: new Date().toISOString(), // FIX: Ensuring timestamps are set
          updatedAt: new Date().toISOString(),
          completionScore: 0, // Matching schema defaults 
          engagementScore: 0  // Matching schema defaults 
        })
        .select()
        .single();
        
      if (createError) throw createError;
      profile = newProfile;
    }

    return res.json(profile);
  } catch (error: unknown) {
    console.error("Error in business-profile sync:", error);
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
      const normalizedLogoPosition = normalizeLogoPosition(logoPosition);
      const { data, error } = await supabase
        .from("BusinessProfile")
        .update({
          id: existing.id,
          name, title, company, tagline, profileImageUrl, coverImageUrl, brandLogoUrl,
          logoPosition: normalizedLogoPosition ?? undefined,
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
      const normalizedLogoPosition = normalizeLogoPosition(logoPosition);
      const { data, error } = await supabase
        .from("BusinessProfile")
        .insert({
          id: `bp_${Math.random().toString(36).substring(2, 11)}`,
          userId: req.user!.uid,
          name, title, company, slug, tagline, profileImageUrl, coverImageUrl, brandLogoUrl,
          logoPosition: normalizedLogoPosition ?? undefined,
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
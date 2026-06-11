import express, { Response } from "express";
import bcrypt from "bcrypt";
import { supabase } from "../config/supabase";
import { AuthRequest, verifySession } from "../middleware/auth";
import { create } from "node:domain";
import { v4 as uuidv4 } from "uuid";
import { createNotification } from "../lib/notifications";
const router = express.Router();

const getErrorMessage = (error: any): string => {
  if (error?.message) return error.message;
  if (error instanceof Error) return error.message;
  return "Internal server error";
};

const normalizeLogoPosition = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const mapping: Record<string, string> = {
    "top-left": "TOP_LEFT",
    "top-right": "TOP_RIGHT",
    "below-photo": "BELOW_PHOTO",
    "below-name": "BELOW_NAME",
    TOP_LEFT: "TOP_LEFT",
    TOP_RIGHT: "TOP_RIGHT",
    BELOW_PHOTO: "BELOW_PHOTO",
    BELOW_NAME: "BELOW_NAME",
  };
  return mapping[value] ?? null;
};

router.get(
  "/profile",
  verifySession,
  async (req: AuthRequest, res: Response) => {
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
  },
);

router.put(
  "/profile",
  verifySession,
  async (req: AuthRequest, res: Response) => {
    const {
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
    } = req.body;

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
  },
);

router.put(
  "/change-password",
  verifySession,
  async (req: AuthRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user!.uid;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current password and new password are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: "New password must be at least 8 characters" });
    }

    try {
      // Get user email and passwordHash from database
      const { data: user } = await supabase
        .from("User")
        .select("email, passwordHash")
        .eq("id", userId)
        .single();

      if (!user || !user.email) {
        return res.status(404).json({ error: "User not found" });
      }

      // Verify current password against the bcrypt hash (like login does)
      if (!user.passwordHash) {
        return res.status(400).json({ error: "This account doesn't have a password. Please use OAuth." });
      }

      const passwordMatch = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!passwordMatch) {
        console.log("[change-password] Password verification failed for user:", userId);
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      // Update password using admin API
      const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
        password: newPassword,
      });

      if (updateError) {
        console.error("[change-password] Supabase Auth update error:", updateError);
        return res.status(500).json({ error: "Failed to update password" });
      }

      // Also update the passwordHash in the User table to keep in sync
      const passwordHash = await bcrypt.hash(newPassword, 12);
      const { error: dbUpdateError } = await supabase
        .from("User")
        .update({ passwordHash, updatedAt: new Date().toISOString() })
        .eq("id", userId);

      if (dbUpdateError) {
        console.error("[change-password] Database update error:", dbUpdateError);
        // Password was updated in Auth, so still return success even if DB update fails
        // But log the error for debugging
      }

      console.log(`[change-password] Password updated for user: ${userId}`);
      return res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error: unknown) {
      console.error("[change-password] Error:", error);
      return res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

router.get(
  "/business-profile",
  verifySession,
  async (req: AuthRequest, res: Response) => {
    try {
      // 1. Ensure User exists - Using upsert on 'email' to handle existing accounts
      const { data: user, error: userError } = await supabase
        .from("User")
        .upsert(
          {
            id: req.user!.uid,
            email: req.user!.email ?? "",
            updatedAt: new Date().toISOString(),
          },
          { onConflict: "id" },
        )
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
        const safeName = req.user!.email?.split("@")[0] || "profile";
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
            engagementScore: 0, // Matching schema defaults
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
  },
);
router.put(
  "/business-profile",
  verifySession,
  async (req: AuthRequest, res: Response) => {
    const {
      name,
      title,
      company,
      tagline,
      profileImageUrl,
      coverImageUrl,
      brandLogoUrl,
      logoPosition,
      primaryEmail,
      secondaryEmail,
      primaryPhone,
      secondaryPhone,
      website,
      address,
      city,
      state,
      country,
      postalCode,
      latitude,
      longitude,
      industry,
      department,
      jobLevel,
      yearFounded,
      companySize,
      appointmentEnabled,
      appointmentUrl,
      appointmentLabel,
      collectContactsEnabled,
      collectNotesEnabled,
      contactFormLabel,
      headingText,
      headingBodyText,
      contactUsHeading,
      contactUsBodyText,
      metaTitle,
      metaDescription,
      ogImage,
      customCss,
      customJs,
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
            name,
            title,
            company,
            tagline,
            profileImageUrl,
            coverImageUrl,
            brandLogoUrl,
            logoPosition: normalizedLogoPosition ?? undefined,
            primaryEmail,
            secondaryEmail,
            primaryPhone,
            secondaryPhone,
            website,
            address,
            city,
            state,
            country,
            postalCode,
            latitude,
            longitude,
            industry,
            department,
            jobLevel,
            yearFounded,
            companySize,
            appointmentEnabled,
            appointmentUrl,
            appointmentLabel,
            collectContactsEnabled,
            collectNotesEnabled,
            contactFormLabel,
            headingText,
            headingBodyText,
            contactUsHeading,
            contactUsBodyText,
            metaTitle,
            metaDescription,
            ogImage,
            customCss,
            customJs,
            updatedAt: new Date().toISOString(),
          })
          .eq("userId", req.user!.uid)
          .select()
          .single();

        result = { data, error };
      } else {
        const safeName = typeof name === "string" ? name : "profile";
        const slug = `${
          safeName
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-") || "profile"
        }-${req.user!.uid.slice(0, 8)}`;
        const normalizedLogoPosition = normalizeLogoPosition(logoPosition);
        const { data, error } = await supabase
          .from("BusinessProfile")
          .insert({
            id: `bp_${Math.random().toString(36).substring(2, 11)}`,
            userId: req.user!.uid,
            name,
            title,
            company,
            slug,
            tagline,
            profileImageUrl,
            coverImageUrl,
            brandLogoUrl,
            logoPosition: normalizedLogoPosition ?? undefined,
            primaryEmail,
            secondaryEmail,
            primaryPhone,
            secondaryPhone,
            website,
            address,
            city,
            state,
            country,
            postalCode,
            latitude,
            longitude,
            industry,
            department,
            jobLevel,
            yearFounded,
            companySize,
            appointmentEnabled,
            appointmentUrl,
            appointmentLabel,
            collectContactsEnabled,
            collectNotesEnabled,
            contactFormLabel,
            headingText,
            headingBodyText,
            contactUsHeading,
            contactUsBodyText,
            metaTitle,
            metaDescription,
            ogImage,
            customCss,
            customJs,
            updatedAt: new Date().toISOString(),
          })
          .select()
          .single();

        result = { data, error };
      }

      if (result.error) {
        return res.status(500).json({ error: result.error.message });
      }

      // BUG 38 – notify on business profile update
      void createNotification(
        req.user!.uid,
        "CARD",
        "Profile Updated",
        `Your business profile${result.data?.name ? ` "${result.data.name}"` : ""} has been updated successfully.`,
        {
          sourceId: result.data?.id ?? undefined,
          sourceType: "BusinessProfile",
        },
      );

      return res.json(result.data);
    } catch (error: unknown) {
      return res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

// ── Payment Method ────────────────────────────────────────────────────────────

// Return the default payment method (for backward compatibility)
router.get(
  "/payment-method",
  verifySession,
  async (req: AuthRequest, res: Response) => {
    try {
      const { data, error } = await supabase
        .from("PaymentMethod")
        .select("brand, last4, expMonth, expYear, id, isDefault")
        .eq("userId", req.user!.uid)
        .eq("isDefault", true)
        .maybeSingle();

      if (error) return res.status(500).json({ error: error.message });
      if (!data) return res.json(null);

      const mm = String(data.expMonth).padStart(2, "0");
      const yy = String(data.expYear % 100).padStart(2, "0");
      return res.json({
        id: data.id,
        brand: data.brand,
        last4: data.last4,
        expiry: `${mm}/${yy}`,
        isDefault: data.isDefault,
      });
    } catch (error: unknown) {
      return res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

// Return all payment methods
router.get(
  "/payment-methods",
  verifySession,
  async (req: AuthRequest, res: Response) => {
    try {
      const { data, error } = await supabase
        .from("PaymentMethod")
        .select("brand, last4, expMonth, expYear, id, isDefault")
        .eq("userId", req.user!.uid);

      if (error) return res.status(500).json({ error: error.message });

      const formatted = (data || []).map((d) => {
        const mm = String(d.expMonth).padStart(2, "0");
        const yy = String(d.expYear % 100).padStart(2, "0");
        return {
          id: d.id,
          brand: d.brand,
          last4: d.last4,
          expiry: `${mm}/${yy}`,
          isDefault: d.isDefault,
        };
      });

      return res.json(formatted);
    } catch (error: unknown) {
      return res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

router.put(
  "/payment-method",
  verifySession,
  async (req: AuthRequest, res: Response) => {
    const { brand, last4, expiry } = req.body as {
      brand: string;
      last4: string;
      expiry: string;
    };

    if (!brand || !last4 || !expiry) {
      return res
        .status(400)
        .json({ error: "brand, last4 and expiry are required" });
    }

    const ALLOWED_BRANDS: Record<string, string> = {
      VISA: "VISA",
      visa: "VISA",
      Visa: "VISA",
      MASTERCARD: "MASTERCARD",
      mastercard: "MASTERCARD",
      Mastercard: "MASTERCARD",
      AMEX: "AMEX",
      amex: "AMEX",
      Amex: "AMEX",
      DISCOVER: "DISCOVER",
      discover: "DISCOVER",
      Discover: "DISCOVER",
      JCB: "JCB",
      jcb: "JCB",
      UNIONPAY: "UNIONPAY",
      unionpay: "UNIONPAY",
      UnionPay: "UNIONPAY",
    };
    const normalizedBrand = ALLOWED_BRANDS[brand] ?? "VISA";

    const [rawMonth, rawYear] = expiry.split("/");
    const expMonth = parseInt(rawMonth ?? "1", 10);
    const expYearShort = parseInt(rawYear ?? "25", 10);
    const expYear = expYearShort < 100 ? 2000 + expYearShort : expYearShort;

    if (!expMonth || expMonth < 1 || expMonth > 12) {
      return res.status(400).json({ error: "Invalid expiry month" });
    }

    try {
      // Check if user has any payment methods already
      const { count } = await supabase
        .from("PaymentMethod")
        .select("*", { count: "exact", head: true })
        .eq("userId", req.user!.uid);

      const isFirstCard = count === 0;

      // Use a unique ID for each new card
      const cardId = `pm_int_${req.user!.uid}_${Date.now()}`;

      const { data: inserted, error } = await supabase
        .from("PaymentMethod")
        .insert({
          id: cardId,
          userId: req.user!.uid,
          stripePaymentMethodId: cardId, // Unique for each card
          brand: normalizedBrand,
          last4,
          expMonth,
          expYear,
          isDefault: isFirstCard, // Make default if it's the first card
          updatedAt: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error("Error inserting payment method:", error);
        return res.status(500).json({ error: error.message });
      }

      const mm = String(inserted.expMonth).padStart(2, "0");
      const yy = String(inserted.expYear % 100).padStart(2, "0");
      return res.json({
        id: inserted.id,
        brand: inserted.brand,
        last4: inserted.last4,
        expiry: `${mm}/${yy}`,
        isDefault: inserted.isDefault,
      });
    } catch (error: unknown) {
      return res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

// Set default payment method
router.post(
  "/payment-method/:id/default",
  verifySession,
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.uid;

    try {
      // Unset current default
      await supabase
        .from("PaymentMethod")
        .update({ isDefault: false })
        .eq("userId", userId);

      // Set new default
      const { data, error } = await supabase
        .from("PaymentMethod")
        .update({ isDefault: true })
        .eq("id", id)
        .eq("userId", userId)
        .select()
        .single();

      if (error) return res.status(500).json({ error: error.message });
      return res.json(data);
    } catch (error: unknown) {
      return res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

// Delete payment method
router.delete(
  "/payment-method/:id",
  verifySession,
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.uid;

    try {
      // Check if it's the default one
      const { data: card } = await supabase
        .from("PaymentMethod")
        .select("isDefault")
        .eq("id", id)
        .eq("userId", userId)
        .single();

      const { error } = await supabase
        .from("PaymentMethod")
        .delete()
        .eq("id", id)
        .eq("userId", userId);

      if (error) return res.status(500).json({ error: error.message });

      // If we deleted the default card, set another one as default if any exist
      if (card?.isDefault) {
        const { data: nextCard } = await supabase
          .from("PaymentMethod")
          .select("id")
          .eq("userId", userId)
          .limit(1)
          .maybeSingle();

        if (nextCard) {
          await supabase
            .from("PaymentMethod")
            .update({ isDefault: true })
            .eq("id", nextCard.id);
        }
      }

      return res.json({ success: true });
    } catch (error: unknown) {
      return res.status(500).json({ error: getErrorMessage(error) });
    }
  },
);

// ── Plan ──────────────────────────────────────────────────────────────────────

router.put("/plan", verifySession, async (req: AuthRequest, res: Response) => {
  const { tier } = req.body as { tier: string };

  const TIER_MAP: Record<string, string> = {
    FREE: "FREE",
    STARTER: "STARTER",
    PRO: "PROFESSIONAL",
    PROFESSIONAL: "PROFESSIONAL",
    BUSINESS: "BUSINESS",
    ENTERPRISE: "ENTERPRISE",
  };
  const normalizedTier = TIER_MAP[tier?.trim().toUpperCase()];
  if (!normalizedTier) {
    return res.status(400).json({ error: "Invalid plan tier" });
  }

  try {
    const { data, error } = await supabase
      .from("User")
      .update({ planTier: normalizedTier, updatedAt: new Date().toISOString() })
      .eq("id", req.user!.uid)
      .select("planTier")
      .single();

    if (error) return res.status(500).json({ error: error.message });

    // BUG 38 – notify on plan change
    void createNotification(
      req.user!.uid,
      "BILLING",
      "Subscription Updated",
      `Your plan has been updated to ${normalizedTier}.`,
      { sourceType: "Plan" },
    );

    return res.json(data);
  } catch (error: unknown) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

// ─── Delete Account ─────────────────────────────────────────────────────
router.delete("/account", verifySession, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.uid;

  try {
    // 1. Delete card child records for each card owned by the user
    const { data: cards } = await supabase
      .from("Card")
      .select("id")
      .eq("userId", userId);

    if (cards && cards.length > 0) {
      const cardIds = cards.map((c: { id: string }) => c.id);
      for (const cardId of cardIds) {
        await supabase.from("CardContent").delete().eq("cardId", cardId);
        await supabase.from("CardDesign").delete().eq("cardId", cardId);
        await supabase.from("CardQRConfig").delete().eq("cardId", cardId);
        await supabase.from("CardInteraction").delete().eq("cardId", cardId);
        await supabase.from("CardShare").delete().eq("cardId", cardId);
      }
    }

    // 2. Delete cards
    await supabase.from("Card").delete().eq("userId", userId);

    // 3. Delete business-profile child records
    const { data: bp } = await supabase
      .from("BusinessProfile")
      .select("id")
      .eq("userId", userId)
      .maybeSingle();

    if (bp) {
      await supabase.from("SocialLink").delete().eq("businessProfileId", bp.id);
      await supabase.from("CustomLink").delete().eq("businessProfileId", bp.id);
    }

    // 4. Delete tables with direct userId
    await supabase.from("BusinessProfile").delete().eq("userId", userId);
    await supabase.from("Lead").delete().eq("userId", userId);
    await supabase.from("Notification").delete().eq("userId", userId);
    await supabase.from("PaymentMethod").delete().eq("userId", userId);
    await supabase.from("Order").delete().eq("userId", userId);
    await supabase.from("Invoice").delete().eq("userId", userId);
    await supabase.from("QRTemplate").delete().eq("userId", userId);
    await supabase.from("NfcCard").delete().eq("userId", userId);
    await supabase.from("EmailToken").delete().eq("userId", userId);

    // 5. Delete the user row
    const { data: deleted, error: dbError } = await supabase
      .from("User")
      .delete()
      .eq("id", userId)
      .select();

    if (dbError) return res.status(500).json({ error: dbError.message });
    if (!deleted || deleted.length === 0) {
      return res.status(500).json({ error: "User not found or already deleted" });
    }

    // 6. Try to delete from Supabase Auth (non-blocking)
    await supabase.auth.admin.deleteUser(userId).catch(() => {});

    return res.json({ success: true });
  } catch (error: unknown) {
    console.error("Delete account error:", error);
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default router;
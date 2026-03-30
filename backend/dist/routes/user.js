"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supabase_1 = require("../config/supabase");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const getErrorMessage = (error) => error instanceof Error ? error.message : "Internal server error";
router.get("/profile", auth_1.verifySession, async (req, res) => {
    try {
        const { data, error } = await supabase_1.supabase
            .from("User")
            .select("*")
            .eq("id", req.user.uid)
            .single();
        if (error) {
            if (error.code === "PGRST116") {
                return res.status(404).json({ error: "User not found" });
            }
            return res.status(500).json({ error: error.message });
        }
        return res.json(data);
    }
    catch (error) {
        return res.status(500).json({ error: getErrorMessage(error) });
    }
});
router.put("/profile", auth_1.verifySession, async (req, res) => {
    const { name, phone, avatar, timezone, language, theme, compactMode, profilePublic, showEmail, showPhone, analyticsOptIn } = req.body;
    try {
        const { data, error } = await supabase_1.supabase
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
            .eq("id", req.user.uid)
            .select()
            .single();
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        return res.json(data);
    }
    catch (error) {
        return res.status(500).json({ error: getErrorMessage(error) });
    }
});
router.get("/business-profile", auth_1.verifySession, async (req, res) => {
    try {
        const { data, error } = await supabase_1.supabase
            .from("BusinessProfile")
            .select("*")
            .eq("userId", req.user.uid)
            .maybeSingle();
        if (error) {
            if (error.code === "PGRST116") {
                return res.status(404).json({ error: "Business profile not found" });
            }
            return res.status(500).json({ error: error.message });
        }
        return res.json(data);
    }
    catch (error) {
        return res.status(500).json({ error: getErrorMessage(error) });
    }
});
router.put("/business-profile", auth_1.verifySession, async (req, res) => {
    const { name, title, company, tagline, profileImageUrl, coverImageUrl, brandLogoUrl, logoPosition, primaryEmail, secondaryEmail, primaryPhone, secondaryPhone, website, address, city, state, country, postalCode, latitude, longitude, industry, department, jobLevel, yearFounded, companySize, appointmentEnabled, appointmentUrl, appointmentLabel, collectContactsEnabled, collectNotesEnabled, contactFormLabel, headingText, headingBodyText, contactUsHeading, contactUsBodyText, metaTitle, metaDescription, ogImage, customCss, customJs } = req.body;
    try {
        const { data: existing, error: fetchError } = await supabase_1.supabase
            .from("BusinessProfile")
            .select("id")
            .eq("userId", req.user.uid)
            .single();
        if (fetchError && fetchError.code !== "PGRST116") {
            return res.status(500).json({ error: fetchError.message });
        }
        let result;
        if (existing) {
            const { data, error } = await supabase_1.supabase
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
                .eq("userId", req.user.uid)
                .select()
                .single();
            result = { data, error };
        }
        else {
            const safeName = typeof name === "string" ? name : "profile";
            const slug = `${safeName.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-") || "profile"}-${req.user.uid.slice(0, 8)}`;
            const { data, error } = await supabase_1.supabase
                .from("BusinessProfile")
                .insert({
                userId: req.user.uid,
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
    }
    catch (error) {
        return res.status(500).json({ error: getErrorMessage(error) });
    }
});
exports.default = router;
//# sourceMappingURL=user.js.map
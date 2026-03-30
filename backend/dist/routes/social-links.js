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
router.get("/", auth_1.verifySession, async (req, res) => {
    try {
        const { data: profile } = await supabase_1.supabase
            .from("BusinessProfile")
            .select("id")
            .eq("userId", req.user.uid)
            .single();
        if (!profile) {
            return res.status(404).json({ error: "Business profile not found" });
        }
        const { data, error } = await supabase_1.supabase
            .from("SocialLink")
            .select("*")
            .eq("businessProfileId", profile.id)
            .order("displayOrder", { ascending: true });
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        return res.json(data || []);
    }
    catch (error) {
        return res.status(500).json({ error: getErrorMessage(error) });
    }
});
router.put("/", auth_1.verifySession, async (req, res) => {
    const { links } = req.body;
    if (!Array.isArray(links)) {
        return res.status(400).json({ error: "Links must be an array" });
    }
    try {
        const { data: profile } = await supabase_1.supabase
            .from("BusinessProfile")
            .select("id")
            .eq("userId", req.user.uid)
            .single();
        if (!profile) {
            return res.status(404).json({ error: "Business profile not found" });
        }
        await supabase_1.supabase
            .from("SocialLink")
            .delete()
            .eq("businessProfileId", profile.id);
        if (links.length > 0) {
            const linksToInsert = links.map((link, index) => ({
                businessProfileId: profile.id,
                platform: link.platform || "",
                handle: link.handle || "",
                url: link.url || "",
                label: link.label || "",
                icon: link.icon || "",
                displayOrder: link.displayOrder ?? index,
                enabled: link.enabled ?? true,
            }));
            const { data, error } = await supabase_1.supabase
                .from("SocialLink")
                .insert(linksToInsert)
                .select();
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            return res.json(data);
        }
        return res.json([]);
    }
    catch (error) {
        return res.status(500).json({ error: getErrorMessage(error) });
    }
});
exports.default = router;
//# sourceMappingURL=social-links.js.map
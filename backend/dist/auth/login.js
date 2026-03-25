"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_js_1 = require("@supabase/supabase-js");
const router = (0, express_1.Router)();
// Lazy-load Supabase client (same pattern as signup.ts)
let supabaseClient = null;
function getSupabaseClient() {
    if (supabaseClient)
        return supabaseClient;
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables");
    }
    supabaseClient = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
    return supabaseClient;
}
router.post("/", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }
    try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            return res.status(401).json({ error: error.message });
        }
        return res.status(200).json({
            message: "Login successful.",
            user: data.user,
            session: data.session,
        });
    }
    catch (err) {
        return res.status(500).json({ error: "Internal server error." });
    }
});
exports.default = router;
//# sourceMappingURL=login.js.map
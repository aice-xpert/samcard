"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supabase_js_1 = require("@supabase/supabase-js");
const router = express_1.default.Router();
// Lazy-load Supabase client
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
    const { name, email, password, company } = req.body;
    const missingFields = [];
    if (!name)
        missingFields.push("name");
    if (!email)
        missingFields.push("email");
    if (!password)
        missingFields.push("password");
    if (missingFields.length > 0) {
        return res.status(400).json({
            error: `Missing required fields: ${missingFields.join(", ")}`,
        });
    }
    const nameTrimmed = name.trim();
    const emailTrimmed = email.trim();
    const passwordTrimmed = password.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
        return res.status(400).json({
            error: "Invalid email format",
        });
    }
    if (passwordTrimmed.length < 8) {
        return res.status(400).json({
            error: "Password must be at least 8 characters",
        });
    }
    try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase.auth.signUp({
            email: emailTrimmed,
            password: passwordTrimmed,
            options: {
                data: {
                    full_name: nameTrimmed,
                    company_name: company || "",
                },
            },
        });
        if (error) {
            return res.status(400).json({
                error: "Signup failed. Please try again.",
            });
        }
        return res
            .status(201)
            .json({
            user: data.user,
            message: "Check your email to confirm your account!",
        });
    }
    catch {
        return res.status(400).json({ error: "Signup failed. Please try again." });
    }
});
exports.default = router;
//# sourceMappingURL=signup.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const envCandidates = [
    path_1.default.resolve(process.cwd(), ".env"),
    path_1.default.resolve(process.cwd(), "../.env"),
    path_1.default.resolve(__dirname, "../../.env"),
    path_1.default.resolve(__dirname, "../../../.env"),
];
let loadedEnvPath = null;
for (const candidate of envCandidates) {
    if (fs_1.default.existsSync(candidate)) {
        dotenv_1.default.config({ path: candidate });
        loadedEnvPath = candidate;
        break;
    }
}
const normalizeEnvValue = (value) => {
    if (!value)
        return undefined;
    const trimmed = value.trim();
    const unquoted = (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
        (trimmed.startsWith("'") && trimmed.endsWith("'"))
        ? trimmed.slice(1, -1).trim()
        : trimmed;
    return unquoted || undefined;
};
const supabaseUrl = normalizeEnvValue(process.env.SUPABASE_URL);
const supabaseServiceKey = normalizeEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_KEY);
if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(`Missing SUPABASE_URL or Supabase service key${loadedEnvPath ? ` (env loaded from ${loadedEnvPath})` : ""}`);
}
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});
//# sourceMappingURL=supabase.js.map
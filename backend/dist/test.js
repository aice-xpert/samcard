"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../.env") });
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
async function test() {
    const { data, error } = await supabase
        .from("test_table")
        .select("*")
        .limit(1);
    if (error) {
        console.error(" Failed:", error.message);
    }
    else {
        console.log(" Connected and schema works!", data);
    }
}
test();
//# sourceMappingURL=test.js.map
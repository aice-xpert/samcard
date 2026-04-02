import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl) {
    console.error("Missing SUPABASE_URL");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
    console.log("Testing with .limit(1).maybeSingle()...");
    const { data, error } = await supabase
        .from("CardQRConfig")
        .select("*")
        .eq("cardId", "card_0mntb9smc")
        .limit(1)
        .maybeSingle();

    console.log("Result:");
    console.log("Data:", data);
    console.log("Error:", error);
}

run();

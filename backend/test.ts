import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
);

async function test() {
    const { data, error } = await supabase
        .from("test_table")
        .select("*")
        .limit(1);

    if (error) {
        console.error(" Failed:", error.message);
    } else {
        console.log(" Connected and schema works!", data);
    }
}

test();
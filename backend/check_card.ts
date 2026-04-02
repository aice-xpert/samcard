import { supabase } from "./config/supabase";

async function run() {
  const { data, error } = await supabase
    .from("Card")
    .select("*")
    .eq("id", "card_0mntb9smc")
    .single();
  
  console.log("Data:", data);
  console.log("Error:", error);
}

run();

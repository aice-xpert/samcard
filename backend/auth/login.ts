import { Router, Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";

const router = Router();

// Lazy-load Supabase client (same pattern as signup.ts)
let supabaseClient: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables");
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseClient;
}

interface LoginBody {
  email: string;
  password: string;
}

router.post("/", async (req: Request, res: Response) => {
  const { email, password }: LoginBody = req.body;

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
  } catch (err) {
    return res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
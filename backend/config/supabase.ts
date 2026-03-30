import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

const envCandidates = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "../.env"),
  path.resolve(__dirname, "../../.env"),
  path.resolve(__dirname, "../../../.env"),
];

let loadedEnvPath: string | null = null;
for (const candidate of envCandidates) {
  if (fs.existsSync(candidate)) {
    dotenv.config({ path: candidate });
    loadedEnvPath = candidate;
    break;
  }
}

const normalizeEnvValue = (value?: string): string | undefined => {
  if (!value) return undefined;
  const trimmed = value.trim();
  const unquoted =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
      ? trimmed.slice(1, -1).trim()
      : trimmed;
  return unquoted || undefined;
};

const supabaseUrl = normalizeEnvValue(process.env.SUPABASE_URL);
const supabaseServiceKey = normalizeEnvValue(
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    `Missing SUPABASE_URL or Supabase service key${loadedEnvPath ? ` (env loaded from ${loadedEnvPath})` : ""}`
  );
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

import express, { Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../config/supabase";
import { AuthRequest, verifySession } from "../middleware/auth";

const router = express.Router();

const SOCIAL_PLATFORM_ALIASES: Record<string, string> = {
  linkedin: "LINKEDIN",
  instagram: "INSTAGRAM",
  facebook: "FACEBOOK",
  twitter: "TWITTER",
  x: "TWITTER",
  youtube: "YOUTUBE",
  "you-tube": "YOUTUBE",
  tiktok: "TIKTOK",
  "tik-tok": "TIKTOK",
  github: "GITHUB",
  discord: "DISCORD",
  yelp: "YELP",
  snapchat: "SNAPCHAT",
  pinterest: "PINTEREST",
  reddit: "REDDIT",
  medium: "MEDIUM",
  behance: "BEHANCE",
  threads: "THREADS",
  whatsapp: "WHATSAPP",
  telegram: "TELEGRAM",
  custom: "CUSTOM",
};

const normalizePlatformKey = (platform: string): string =>
  platform.trim().toLowerCase().replace(/[\s_-]+/g, "");

const mapPlatformToEnum = (platform?: string): string | null => {
  if (!platform) return null;

  const normalized = normalizePlatformKey(platform);
  return SOCIAL_PLATFORM_ALIASES[normalized] ?? null;
};

const getErrorMessage = (error: any): string => {
  if (error?.message) return error.message; 
  if (error instanceof Error) return error.message;
  return "Internal server error";
};

interface IncomingSocialLink {
  platform?: string;
  handle?: string;
  url?: string;
  label?: string;
  icon?: string;
  displayOrder?: number;
  enabled?: boolean;
}

router.get("/", verifySession, async (req: AuthRequest, res: Response) => {
  try {
    const { data: profile } = await supabase
      .from("BusinessProfile")
      .select("id")
      .eq("userId", req.user!.uid)
      .maybeSingle();

    if (!profile) {
      return res.json([]);
    }

    const { data, error } = await supabase
      .from("SocialLink")
      .select("*")
      .eq("businessProfileId", profile.id)
      .order("displayOrder", { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data || []);
  } catch (error: unknown) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.put("/", verifySession, async (req: AuthRequest, res: Response) => {
  const { links } = req.body;

  if (!Array.isArray(links)) {
    return res.status(400).json({ error: "Links must be an array" });
  }

  try {
    const { data: profile } = await supabase
      .from("BusinessProfile")
      .select("id")
      .eq("userId", req.user!.uid)
      .maybeSingle();

    if (!profile) {
      return res.status(404).json({ error: "Business profile not found" });
    }

    await supabase
      .from("SocialLink")
      .delete()
      .eq("businessProfileId", profile.id);

    if (links.length > 0) {
      const invalidPlatforms: string[] = [];

      const linksToInsert = links.map((link: IncomingSocialLink, index: number) => {
        const mappedPlatform = mapPlatformToEnum(link.platform);

        if (!mappedPlatform) {
          invalidPlatforms.push(link.platform || "");
        }

        return {
          id: uuidv4(),
          businessProfileId: profile.id,
          platform: mappedPlatform,
          handle: link.handle || "",
          url: link.url || "",
          label: link.label || "",
          icon: link.icon || "",
          displayOrder: link.displayOrder ?? index,
          enabled: link.enabled ?? true,
          updatedAt: new Date().toISOString(),
        };
      });

      if (invalidPlatforms.length > 0) {
        return res.status(400).json({
          error: `Invalid social platform value(s): ${invalidPlatforms.join(", ")}`,
        });
      }

      const { data, error } = await supabase
        .from("SocialLink")
        .insert(linksToInsert)
        .select();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.json(data);
    }

    return res.json([]);
  } catch (error: unknown) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default router;

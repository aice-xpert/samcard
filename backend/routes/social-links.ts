import express, { Response } from "express";
import { supabase } from "../config/supabase";
import { AuthRequest, verifySession } from "../middleware/auth";

const router = express.Router();

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Internal server error";

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
      const linksToInsert = links.map((link: IncomingSocialLink, index: number) => ({
        businessProfileId: profile.id,
        platform: link.platform || "",
        handle: link.handle || "",
        url: link.url || "",
        label: link.label || "",
        icon: link.icon || "",
        displayOrder: link.displayOrder ?? index,
        enabled: link.enabled ?? true,
      }));

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

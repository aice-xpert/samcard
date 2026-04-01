import express, { Response } from "express";
import { supabase } from "../config/supabase";
import { AuthRequest, verifySession } from "../middleware/auth";
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

const getErrorMessage = (error: any): string => {
  if (error?.message) return error.message; 
  if (error instanceof Error) return error.message;
  return "Internal server error";
};

interface IncomingCustomLink {
  label?: string;
  url?: string;
  icon?: string;
  color?: string;
  displayOrder?: number;
  enabled?: boolean;
  clickTracking?: boolean;
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
      .from("CustomLink")
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
      .from("CustomLink")
      .delete()
      .eq("businessProfileId", profile.id);

    if (links.length > 0) {
      const linksToInsert = links.map((link: IncomingCustomLink, index: number) => ({
        id: uuidv4(),
        businessProfileId: profile.id,
        label: link.label || "",
        url: link.url || "",
        icon: link.icon || "",
        color: link.color || "",
        displayOrder: link.displayOrder ?? index,
        enabled: link.enabled ?? true,
        clickTracking: link.clickTracking ?? true,
        updatedAt: new Date().toISOString(),
      }));

      const { data, error } = await supabase
        .from("CustomLink")
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

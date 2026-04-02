import express, { Response } from "express";
import { supabase } from "../config/supabase";

const router = express.Router();

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string") return message;
  }
  return "Internal server error";
};

router.get("/", async (_req, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("Plan")
      .select("*")
      .eq("isActive", true)
      .order("displayOrder", { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data ?? []);
  } catch (error: unknown) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default router;
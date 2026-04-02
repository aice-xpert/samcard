import express, { Response } from "express";
import { supabase } from "../config/supabase";
import { AuthRequest, verifySession } from "../middleware/auth";

const router = express.Router();

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string") return message;
  }
  return "Internal server error";
};

router.get("/", verifySession, async (req: AuthRequest, res: Response) => {
  const { status, page = "1", limit = "20" } = req.query;
  
  try {
    let query = supabase
      .from("Invoice")
      .select("*", { count: "exact" })
      .eq("userId", req.user!.uid)
      .order("createdAt", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const pageNum = Math.max(1, Number.parseInt(String(page), 10) || 1);
    const limitNum = Math.max(1, Number.parseInt(String(limit), 10) || 20);
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    const { data, error, count } = await query.range(from, to);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const invoices = (data || []).map(inv => ({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      date: inv.createdAt,
      periodStart: inv.periodStart,
      periodEnd: inv.periodEnd,
      amount: inv.total,
      subtotal: inv.subtotal,
      tax: inv.tax,
      discount: inv.discount,
      currency: inv.currency,
      status: inv.status,
      pdfUrl: inv.pdfUrl,
      billingName: inv.billingName,
    }));

    return res.json({
      invoices,
      total: count || 0,
      page: pageNum,
      limit: limitNum,
    });
  } catch (error: unknown) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

router.get("/:id", verifySession, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  
  try {
    const { data, error } = await supabase
      .from("Invoice")
      .select("*")
      .eq("id", id)
      .eq("userId", req.user!.uid)
      .single();

    if (error) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    return res.json(data);
  } catch (error: unknown) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supabase_1 = require("../config/supabase");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const getErrorMessage = (error) => error instanceof Error ? error.message : "Internal server error";
router.get("/", auth_1.verifySession, async (req, res) => {
    const { status, page = "1", limit = "20" } = req.query;
    try {
        let query = supabase_1.supabase
            .from("Invoice")
            .select("*", { count: "exact" })
            .eq("userId", req.user.uid)
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
            amount: inv.total,
            status: inv.status,
            pdfUrl: inv.pdfUrl,
        }));
        return res.json({
            invoices,
            total: count || 0,
            page: pageNum,
            limit: limitNum,
        });
    }
    catch (error) {
        return res.status(500).json({ error: getErrorMessage(error) });
    }
});
router.get("/:id", auth_1.verifySession, async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabase_1.supabase
            .from("Invoice")
            .select("*")
            .eq("id", id)
            .eq("userId", req.user.uid)
            .single();
        if (error) {
            return res.status(404).json({ error: "Invoice not found" });
        }
        return res.json(data);
    }
    catch (error) {
        return res.status(500).json({ error: getErrorMessage(error) });
    }
});
exports.default = router;
//# sourceMappingURL=invoices.js.map
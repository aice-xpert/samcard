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
            .from("Order")
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
        const orders = (data || []).map(order => ({
            id: order.id,
            orderNumber: order.orderNumber,
            date: order.createdAt,
            items: order.items,
            quantity: order.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0,
            amount: order.total,
            status: order.status,
            tracking: order.trackingNumber,
        }));
        return res.json({
            orders,
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
            .from("Order")
            .select("*")
            .eq("id", id)
            .eq("userId", req.user.uid)
            .single();
        if (error) {
            return res.status(404).json({ error: "Order not found" });
        }
        return res.json(data);
    }
    catch (error) {
        return res.status(500).json({ error: getErrorMessage(error) });
    }
});
exports.default = router;
//# sourceMappingURL=orders.js.map
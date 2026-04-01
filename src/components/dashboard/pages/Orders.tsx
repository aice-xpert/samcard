"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import {
    Package,
    TrendingUp,
    Search,
    Filter,
    RefreshCw,
    Eye,
    RotateCcw,
    X,
    ChevronDown,
    ShoppingBag,
    Truck,
    CheckCircle2,
    Clock,
    DollarSign,
    Copy,
    Check,
    ExternalLink,
    AlertCircle,
    Loader2,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { getOrders, type Order as ApiOrder } from "@/lib/api";

// ── Types ─────────────────────────────────────────────────────────────────────
type OrderStatus = "DELIVERED" | "SHIPPED" | "PROCESSING" | "PENDING" | "CANCELLED" | "REFUNDED" | "PARTIALLY_REFUNDED";
type DisplayStatus = "Delivered" | "In Transit" | "Processing" | "Pending" | "Cancelled" | "Refunded";

// ── Helpers ───────────────────────────────────────────────────────────────────
function toDisplayStatus(status: string): DisplayStatus {
    const map: Record<string, DisplayStatus> = {
        DELIVERED: "Delivered",
        SHIPPED: "In Transit",
        PROCESSING: "Processing",
        PENDING: "Pending",
        CANCELLED: "Cancelled",
        REFUNDED: "Refunded",
        PARTIALLY_REFUNDED: "Refunded",
    };
    return map[status?.toUpperCase()] ?? "Processing";
}

function formatAmount(amount: number | undefined): string {
    if (amount == null) return "$0.00";
    return `$${Number(amount).toFixed(2)}`;
}

function formatDate(dateStr: string | undefined): string {
    if (!dateStr) return "—";
    try {
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    } catch {
        return dateStr;
    }
}

function formatItems(items: ApiOrder["items"]): string {
    if (!items || items.length === 0) return "—";
    if (typeof items[0] === "object" && items[0] !== null) {
        const first = items[0] as { name?: string };
        const name = first.name ?? "Item";
        return items.length > 1 ? `${name} +${items.length - 1} more` : name;
    }
    return String(items[0]);
}

// Build monthly chart data from orders
function buildChartData(orders: ApiOrder[]) {
    const map: Record<string, number> = {};
    orders.forEach((o) => {
        const d = o.date ? new Date(o.date) : null;
        if (!d) return;
        const key = d.toLocaleDateString("en-US", { month: "short" });
        map[key] = (map[key] ?? 0) + 1;
    });
    return Object.entries(map)
        .map(([month, count]) => ({ month, orders: count }))
        .slice(-7);
}

// ── Status Config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
    DisplayStatus,
    { label: string; icon: React.ElementType; bg: string; text: string; border: string; dot: string }
> = {
    Delivered: {
        label: "Delivered",
        icon: CheckCircle2,
        bg: "rgba(73,182,24,0.12)",
        text: "#49B618",
        border: "rgba(73,182,24,0.3)",
        dot: "#49B618",
    },
    "In Transit": {
        label: "In Transit",
        icon: Truck,
        bg: "rgba(0,146,0,0.12)",
        text: "#009200",
        border: "rgba(0,146,0,0.3)",
        dot: "#009200",
    },
    Processing: {
        label: "Processing",
        icon: Clock,
        bg: "rgba(251,191,36,0.12)",
        text: "#fbbf24",
        border: "rgba(251,191,36,0.3)",
        dot: "#fbbf24",
    },
    Pending: {
        label: "Pending",
        icon: Clock,
        bg: "rgba(251,191,36,0.08)",
        text: "#d97706",
        border: "rgba(217,119,6,0.3)",
        dot: "#d97706",
    },
    Cancelled: {
        label: "Cancelled",
        icon: X,
        bg: "rgba(239,68,68,0.12)",
        text: "#ef4444",
        border: "rgba(239,68,68,0.3)",
        dot: "#ef4444",
    },
    Refunded: {
        label: "Refunded",
        icon: RotateCcw,
        bg: "rgba(156,163,175,0.12)",
        text: "#9ca3af",
        border: "rgba(156,163,175,0.3)",
        dot: "#9ca3af",
    },
};

// ── Order Detail Modal ────────────────────────────────────────────────────────
function OrderDetailModal({ order, onClose }: { order: ApiOrder; onClose: () => void }) {
    const displayStatus = toDisplayStatus(order.status);
    const cfg = STATUS_CONFIG[displayStatus];
    const StatusIcon = cfg.icon;
    const [copied, setCopied] = useState(false);

    const copyTracking = async () => {
        if (!order.tracking) return;
        await navigator.clipboard.writeText(order.tracking).catch(() => undefined);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4"
            onClick={onClose}
        >
            <div
                className="bg-[#0a0f0a] border border-[#008001]/30 rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 w-full sm:max-w-md shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h3 className="text-white font-bold text-lg">{order.orderNumber}</h3>
                        <p className="text-[#A0A0A0] text-xs mt-0.5">{formatDate(order.date)}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg bg-[#1E1E1E] text-[#A0A0A0] hover:text-white flex items-center justify-center transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Status banner */}
                <div
                    className="flex items-center gap-3 p-3 rounded-xl mb-5"
                    style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
                >
                    <StatusIcon className="w-5 h-5 flex-shrink-0" style={{ color: cfg.text }} />
                    <div>
                        <p className="text-sm font-semibold" style={{ color: cfg.text }}>{cfg.label}</p>
                        <p className="text-xs text-[#A0A0A0]">
                            {displayStatus === "Delivered" ? "Your order has been delivered"
                                : displayStatus === "In Transit" ? "Your order is on its way"
                                    : displayStatus === "Processing" || displayStatus === "Pending" ? "Your order is being processed"
                                        : displayStatus === "Cancelled" ? "This order was cancelled"
                                            : "This order has been refunded"}
                        </p>
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-5">
                    {[
                        { label: "Product", value: `${order.quantity}× ${formatItems(order.items)}` },
                        { label: "Amount", value: formatAmount(order.amount) },
                        { label: "Order Date", value: formatDate(order.date) },
                    ].map(({ label, value }) => (
                        <div
                            key={label}
                            className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#111a11] border border-[#008001]/20"
                        >
                            <span className="text-xs text-[#A0A0A0]">{label}</span>
                            <span className="text-sm font-semibold text-white">{value}</span>
                        </div>
                    ))}

                    {/* Tracking */}
                    {order.tracking && (
                        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#111a11] border border-[#008001]/20">
                            <span className="text-xs text-[#A0A0A0]">Tracking</span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-mono text-white">{order.tracking}</span>
                                <button
                                    onClick={copyTracking}
                                    className="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
                                    style={{ background: copied ? "rgba(73,182,24,0.2)" : "rgba(0,128,1,0.1)" }}
                                >
                                    {copied
                                        ? <Check className="w-3 h-3" style={{ color: "#49B618" }} />
                                        : <Copy className="w-3 h-3 text-[#A0A0A0]" />}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    {displayStatus !== "Cancelled" && displayStatus !== "Refunded" && (
                        <Button
                            className="flex-1 text-sm h-10 text-white"
                            style={{ background: "linear-gradient(135deg,#008001,#49B618)" }}
                        >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Track Order
                        </Button>
                    )}
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="flex-1 text-sm h-10 border-[#008001]/30 text-[#A0A0A0] hover:text-white hover:bg-[#008001]/20"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reorder
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
    const displayStatus = toDisplayStatus(status);
    const cfg = STATUS_CONFIG[displayStatus];
    return (
        <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}
        >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
            {cfg.label}
        </span>
    );
}

// ── Custom Tooltip ────────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-[#000000] border border-[#008001] rounded-xl px-4 py-3 text-xs shadow-xl">
            <p className="font-bold text-white mb-1">{label}</p>
            <p style={{ color: "#49B618" }}>Orders: {payload[0].value}</p>
        </div>
    );
}

// ── Skeleton Row ──────────────────────────────────────────────────────────────
function SkeletonRow() {
    return (
        <TableRow className="border-[#008001]/10">
            {Array.from({ length: 8 }).map((_, i) => (
                <TableCell key={i}>
                    <div className="h-4 bg-[#1E1E1E] rounded animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
                </TableCell>
            ))}
        </TableRow>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function Orders() {
    const [orders, setOrders] = useState<ApiOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [selectedOrder, setSelectedOrder] = useState<ApiOrder | null>(null);
    const [showFilter, setShowFilter] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchOrders = useCallback(async (showRefreshLoader = false) => {
        try {
            if (showRefreshLoader) setRefreshing(true);
            else setLoading(true);
            setError(null);

            const response = await getOrders();
            setOrders(response.orders ?? []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load orders");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const filtered = useMemo(() => {
        return orders.filter((o) => {
            const matchSearch =
                (o.orderNumber ?? "").toLowerCase().includes(search.toLowerCase()) ||
                formatItems(o.items).toLowerCase().includes(search.toLowerCase()) ||
                (o.tracking ?? "").toLowerCase().includes(search.toLowerCase());
            const matchStatus =
                statusFilter === "All" ||
                toDisplayStatus(o.status) === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [orders, search, statusFilter]);

    const stats = useMemo(() => {
        const total = orders.length;
        const inTransit = orders.filter((o) => toDisplayStatus(o.status) === "In Transit").length;
        const thisMonth = orders.filter((o) => {
            if (!o.date) return false;
            const d = new Date(o.date);
            const now = new Date();
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length;
        const totalSpent = orders
            .filter((o) => {
                const s = toDisplayStatus(o.status);
                return s !== "Cancelled" && s !== "Refunded";
            })
            .reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
        return { total, inTransit, thisMonth, totalSpent: `$${totalSpent.toFixed(0)}` };
    }, [orders]);

    const chartData = useMemo(() => buildChartData(orders), [orders]);

    const displayStatuses: DisplayStatus[] = ["Delivered", "In Transit", "Processing", "Pending", "Cancelled", "Refunded"];
    const statusOptions = ["All", ...displayStatuses];

    const statCards = [
        { label: "Total Orders", value: loading ? "—" : stats.total, icon: ShoppingBag, gradient: "from-[#008001] to-[#006312]", sub: "All time" },
        { label: "This Month", value: loading ? "—" : stats.thisMonth, icon: Package, gradient: "from-[#009200] to-[#006312]", sub: new Date().toLocaleString("default", { month: "long", year: "numeric" }) },
        { label: "In Transit", value: loading ? "—" : stats.inTransit, icon: Truck, gradient: "from-[#49B618] to-[#008001]", sub: "Active shipments" },
        { label: "Total Spent", value: loading ? "—" : stats.totalSpent, icon: DollarSign, gradient: "from-[#006312] to-[#008001]", sub: "Excl. cancelled" },
    ];

    return (
        <>
            {selectedOrder && (
                <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
            )}

            <div className="space-y-4 sm:space-y-6">

                {/* ── Error Banner ─────────────────────────────────────────────── */}
                {error && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm flex-1">{error}</p>
                        <button
                            onClick={() => fetchOrders()}
                            className="text-xs underline hover:no-underline"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* ── Stat Cards ───────────────────────────────────────────────── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    {statCards.map(({ label, value, icon: Icon, gradient, sub }) => (
                        <Card
                            key={label}
                            className="relative overflow-hidden bg-[#000000] border-[#008001]/30 hover:shadow-lg hover:shadow-[#008001]/20 transition-all group"
                        >
                            <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${gradient} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />
                            <CardContent className="p-4 sm:p-6 relative z-10">
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                </div>
                                {loading ? (
                                    <div className="h-8 w-16 bg-[#1E1E1E] rounded animate-pulse mb-1" />
                                ) : (
                                    <p className="text-xl sm:text-3xl font-bold text-white">{value}</p>
                                )}
                                <p className="text-xs sm:text-sm text-[#A0A0A0] mt-0.5">{label}</p>
                                <p className="text-[10px] text-[#555] mt-1">{sub}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* ── Chart + Summary ──────────────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Chart */}
                    <Card className="lg:col-span-2 bg-[#000000] border-[#008001]/30">
                        <CardHeader className="border-b border-[#008001]/30 pb-4">
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <div>
                                    <CardTitle className="text-white text-base sm:text-lg flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#49B618]" />
                                        Monthly Order Trend
                                    </CardTitle>
                                    <p className="text-xs text-[#A0A0A0] mt-0.5">Orders placed per month</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 sm:pt-6">
                            <div className="h-48 sm:h-64 min-w-0">
                                {loading ? (
                                    <div className="h-full flex items-end gap-2 px-2">
                                        {Array.from({ length: 7 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className="flex-1 bg-[#1E1E1E] rounded-t animate-pulse"
                                                style={{ height: `${30 + Math.random() * 60}%` }}
                                            />
                                        ))}
                                    </div>
                                ) : chartData.length === 0 ? (
                                    <div className="h-full flex items-center justify-center text-[#A0A0A0] text-sm">
                                        No order data available
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                        <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#008001" strokeOpacity={0.15} vertical={false} />
                                            <XAxis dataKey="month" stroke="#A0A0A0" fontSize={11} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#A0A0A0" fontSize={11} tickLine={false} axisLine={false} width={28} allowDecimals={false} />
                                            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(0,128,1,0.08)" }} />
                                            <Bar dataKey="orders" fill="#49B618" radius={[6, 6, 0, 0]} maxBarSize={48} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Summary */}
                    <Card className="bg-[#000000] border-[#008001]/30">
                        <CardHeader className="border-b border-[#008001]/30 pb-4">
                            <CardTitle className="text-white text-base sm:text-lg">Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3">
                            {displayStatuses.map((status) => {
                                const count = orders.filter((o) => toDisplayStatus(o.status) === status).length;
                                const pct = orders.length > 0 ? Math.round((count / orders.length) * 100) : 0;
                                const cfg = STATUS_CONFIG[status];
                                return (
                                    <div key={status}>
                                        <div className="flex justify-between text-xs mb-1.5">
                                            <span style={{ color: cfg.text }}>{status}</span>
                                            <span className="text-[#A0A0A0]">{count} order{count !== 1 ? "s" : ""}</span>
                                        </div>
                                        <div className="h-2 bg-[#1E1E1E] rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-700"
                                                style={{ width: `${pct}%`, background: cfg.dot }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}

                            {!loading && orders.length > 0 && (
                                <div className="pt-3 border-t border-[#008001]/20 mt-2">
                                    <p className="text-[10px] text-[#555] uppercase tracking-wider mb-2">Recent Activity</p>
                                    <p className="text-xs text-[#A0A0A0]">
                                        Last order placed on{" "}
                                        <span className="text-[#49B618]">
                                            {formatDate(orders[0]?.date)}
                                        </span>
                                    </p>
                                    {orders.length > 0 && (
                                        <p className="text-xs text-[#A0A0A0] mt-1">
                                            Avg. order value:{" "}
                                            <span className="text-white font-semibold">
                                                {formatAmount(
                                                    orders.reduce((s, o) => s + (Number(o.amount) || 0), 0) / orders.length
                                                )}
                                            </span>
                                        </p>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* ── Orders Table ─────────────────────────────────────────────── */}
                <Card className="bg-[#000000] border-[#008001]/30">
                    <CardHeader className="border-b border-[#008001]/30 pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <CardTitle className="text-white text-base sm:text-lg flex items-center gap-2">
                                    <Package className="w-4 h-4 sm:w-5 sm:h-5 text-[#49B618]" />
                                    Order History
                                </CardTitle>
                                <p className="text-xs text-[#A0A0A0] mt-0.5">
                                    {loading ? "Loading…" : `${filtered.length} of ${orders.length} orders`}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {/* Search */}
                                <div className="relative flex-1 sm:flex-none sm:w-52">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A0A0A0]" />
                                    <Input
                                        placeholder="Search orders…"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-9 w-full bg-[#1E1E1E] border-[#008001]/30 text-white text-xs h-9 rounded-full"
                                    />
                                    {search && (
                                        <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <X className="w-3 h-3 text-[#A0A0A0]" />
                                        </button>
                                    )}
                                </div>

                                {/* Filter dropdown */}
                                <div className="relative">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowFilter((f) => !f)}
                                        className="border-[#008001]/30 text-[#A0A0A0] hover:text-white hover:bg-[#008001]/20 h-9 text-xs gap-1.5 rounded-full"
                                    >
                                        <Filter className="w-3.5 h-3.5" />
                                        {statusFilter}
                                        <ChevronDown className={`w-3 h-3 transition-transform ${showFilter ? "rotate-180" : ""}`} />
                                    </Button>
                                    {showFilter && (
                                        <div className="absolute right-0 top-10 z-20 bg-[#0a0a0a] border border-[#008001]/30 rounded-xl shadow-2xl w-44 py-1.5">
                                            {statusOptions.map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => { setStatusFilter(s); setShowFilter(false); }}
                                                    className="w-full text-left px-4 py-2 text-xs transition-colors flex items-center gap-2"
                                                    style={{
                                                        color: statusFilter === s ? "#49B618" : "#A0A0A0",
                                                        background: statusFilter === s ? "rgba(0,128,1,0.1)" : "transparent",
                                                    }}
                                                >
                                                    {s !== "All" && (
                                                        <span
                                                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                                            style={{ background: STATUS_CONFIG[s as DisplayStatus]?.dot }}
                                                        />
                                                    )}
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-[#008001]/20 hover:bg-transparent">
                                        {["Order ID", "Date", "Items", "Qty", "Amount", "Status", "Tracking", "Actions"].map((h) => (
                                            <TableHead key={h} className="text-[#555] text-xs uppercase tracking-wider font-semibold">
                                                {h}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
                                    ) : filtered.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center py-16">
                                                <div className="flex flex-col items-center gap-3 text-[#A0A0A0]">
                                                    <Package className="w-10 h-10 opacity-30" />
                                                    <p className="text-sm">
                                                        {orders.length === 0 ? "No orders yet" : "No orders match your search"}
                                                    </p>
                                                    {orders.length === 0 && (
                                                        <p className="text-xs text-[#555]">Your order history will appear here</p>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filtered.map((order) => (
                                            <TableRow
                                                key={order.id}
                                                className="border-[#008001]/10 hover:bg-[#008001]/5 transition-colors cursor-pointer"
                                                onClick={() => setSelectedOrder(order)}
                                            >
                                                <TableCell className="font-mono text-sm text-[#49B618] font-semibold">
                                                    {order.orderNumber}
                                                </TableCell>
                                                <TableCell className="text-[#A0A0A0] text-sm">{formatDate(order.date)}</TableCell>
                                                <TableCell className="text-white text-sm max-w-[180px] truncate">{formatItems(order.items)}</TableCell>
                                                <TableCell className="text-[#A0A0A0] text-sm">×{order.quantity}</TableCell>
                                                <TableCell className="text-white font-semibold text-sm">{formatAmount(order.amount)}</TableCell>
                                                <TableCell><StatusBadge status={order.status} /></TableCell>
                                                <TableCell className="font-mono text-xs text-[#555]">{order.tracking ?? "—"}</TableCell>
                                                <TableCell onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => setSelectedOrder(order)}
                                                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A0A0A0] hover:text-white hover:bg-[#008001]/20 transition-colors"
                                                        >
                                                            <Eye className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#A0A0A0] hover:text-white hover:bg-[#008001]/20 transition-colors">
                                                            <RotateCcw className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Mobile Card List */}
                        <div className="md:hidden divide-y divide-[#008001]/10">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="p-4 space-y-2">
                                        <div className="h-4 w-28 bg-[#1E1E1E] rounded animate-pulse" />
                                        <div className="h-3 w-40 bg-[#1E1E1E] rounded animate-pulse" />
                                        <div className="h-3 w-24 bg-[#1E1E1E] rounded animate-pulse" />
                                    </div>
                                ))
                            ) : filtered.length === 0 ? (
                                <div className="flex flex-col items-center gap-3 text-[#A0A0A0] py-16">
                                    <Package className="w-10 h-10 opacity-30" />
                                    <p className="text-sm">{orders.length === 0 ? "No orders yet" : "No orders match your search"}</p>
                                </div>
                            ) : (
                                filtered.map((order) => (
                                    <div
                                        key={order.id}
                                        className="p-4 hover:bg-[#008001]/5 transition-colors cursor-pointer"
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <span className="font-mono text-sm font-semibold text-[#49B618]">{order.orderNumber}</span>
                                                <p className="text-xs text-[#A0A0A0] mt-0.5">{formatDate(order.date)}</p>
                                            </div>
                                            <StatusBadge status={order.status} />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-white">{order.quantity}× {formatItems(order.items)}</p>
                                            <p className="text-sm font-bold text-white">{formatAmount(order.amount)}</p>
                                        </div>
                                        {order.tracking && (
                                            <p className="text-xs font-mono text-[#555] mt-1.5">{order.tracking}</p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {!loading && filtered.length > 0 && (
                            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-[#008001]/10">
                                <p className="text-xs text-[#555]">
                                    Showing {filtered.length} of {orders.length} orders
                                </p>
                                <button
                                    onClick={() => fetchOrders(true)}
                                    disabled={refreshing}
                                    className="flex items-center gap-1.5 text-xs text-[#49B618] hover:text-white transition-colors disabled:opacity-50"
                                >
                                    {refreshing
                                        ? <Loader2 className="w-3 h-3 animate-spin" />
                                        : <RefreshCw className="w-3 h-3" />}
                                    {refreshing ? "Refreshing…" : "Refresh"}
                                </button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
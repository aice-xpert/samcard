"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
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
    Download,
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

// ── Types ─────────────────────────────────────────────────────────────────────
type OrderStatus = "Delivered" | "In Transit" | "Processing" | "Cancelled";

interface Order {
    id: string;
    date: string;
    items: string;
    quantity: number;
    amount: string;
    status: OrderStatus;
    tracking: string;
}

// ── Static Data ───────────────────────────────────────────────────────────────
const monthlyOrdersData = [
    { month: "Aug", orders: 2 },
    { month: "Sep", orders: 3 },
    { month: "Oct", orders: 1 },
    { month: "Nov", orders: 4 },
    { month: "Dec", orders: 3 },
    { month: "Jan", orders: 5 },
    { month: "Feb", orders: 2 },
];

const ordersData: Order[] = [
    {
        id: "ORD-2547",
        date: "Feb 1, 2026",
        items: "NFC Business Cards",
        quantity: 2,
        amount: "$49.99",
        status: "Delivered",
        tracking: "TRK892547123",
    },
    {
        id: "ORD-2546",
        date: "Jan 15, 2026",
        items: "NFC Business Cards",
        quantity: 5,
        amount: "$99.99",
        status: "Delivered",
        tracking: "TRK892546987",
    },
    {
        id: "ORD-2545",
        date: "Jan 3, 2026",
        items: "Premium NFC Card",
        quantity: 1,
        amount: "$29.99",
        status: "In Transit",
        tracking: "TRK892545654",
    },
    {
        id: "ORD-2544",
        date: "Dec 20, 2025",
        items: "NFC Business Cards",
        quantity: 3,
        amount: "$69.99",
        status: "Delivered",
        tracking: "TRK892544321",
    },
    {
        id: "ORD-2543",
        date: "Dec 5, 2025",
        items: "NFC Business Cards",
        quantity: 10,
        amount: "$149.99",
        status: "Delivered",
        tracking: "TRK892543098",
    },
    {
        id: "ORD-2542",
        date: "Nov 22, 2025",
        items: "Premium NFC Card",
        quantity: 2,
        amount: "$59.98",
        status: "Processing",
        tracking: "TRK892542765",
    },
    {
        id: "ORD-2541",
        date: "Nov 10, 2025",
        items: "NFC Business Cards",
        quantity: 4,
        amount: "$89.99",
        status: "Cancelled",
        tracking: "TRK892541432",
    },
];

// ── Status Config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
    OrderStatus,
    {
        label: string;
        icon: React.ElementType;
        bg: string;
        text: string;
        border: string;
        dot: string;
    }
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
    Cancelled: {
        label: "Cancelled",
        icon: X,
        bg: "rgba(239,68,68,0.12)",
        text: "#ef4444",
        border: "rgba(239,68,68,0.3)",
        dot: "#ef4444",
    },
};

// ── Order Detail Modal ────────────────────────────────────────────────────────
function OrderDetailModal({
    order,
    onClose,
}: {
    order: Order;
    onClose: () => void;
}) {
    const cfg = STATUS_CONFIG[order.status];
    const StatusIcon = cfg.icon;
    const [copied, setCopied] = useState(false);

    const copyTracking = async () => {
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
                        <h3 className="text-white font-bold text-lg">{order.id}</h3>
                        <p className="text-[#A0A0A0] text-xs mt-0.5">{order.date}</p>
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
                        <p className="text-sm font-semibold" style={{ color: cfg.text }}>
                            {cfg.label}
                        </p>
                        <p className="text-xs text-[#A0A0A0]">
                            {order.status === "Delivered"
                                ? "Your order has been delivered"
                                : order.status === "In Transit"
                                    ? "Your order is on its way"
                                    : order.status === "Processing"
                                        ? "Your order is being processed"
                                        : "This order was cancelled"}
                        </p>
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-5">
                    {[
                        { label: "Product", value: `${order.quantity}× ${order.items}` },
                        { label: "Amount", value: order.amount },
                        { label: "Order Date", value: order.date },
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
                    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#111a11] border border-[#008001]/20">
                        <span className="text-xs text-[#A0A0A0]">Tracking</span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-mono text-white">{order.tracking}</span>
                            <button
                                onClick={copyTracking}
                                className="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
                                style={{ background: copied ? "rgba(73,182,24,0.2)" : "rgba(0,128,1,0.1)" }}
                            >
                                {copied ? (
                                    <Check className="w-3 h-3" style={{ color: "#49B618" }} />
                                ) : (
                                    <Copy className="w-3 h-3 text-[#A0A0A0]" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    {order.status !== "Cancelled" && (
                        <Button
                            className="flex-1 text-sm h-10 text-white"
                            style={{
                                background: "linear-gradient(135deg,#008001,#49B618)",
                            }}
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
function StatusBadge({ status }: { status: OrderStatus }) {
    const cfg = STATUS_CONFIG[status];
    return (
        <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}
        >
            <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: cfg.dot }}
            />
            {cfg.label}
        </span>
    );
}

// ── Custom Tooltip ────────────────────────────────────────────────────────────
function ChartTooltip({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: { value: number }[];
    label?: string;
}) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-[#000000] border border-[#008001] rounded-xl px-4 py-3 text-xs shadow-xl">
            <p className="font-bold text-white mb-1">{label}</p>
            <p style={{ color: "#49B618" }}>Orders: {payload[0].value}</p>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function Orders() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"All" | OrderStatus>("All");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showFilter, setShowFilter] = useState(false);

    const filtered = useMemo(() => {
        return ordersData.filter((o) => {
            const matchSearch =
                o.id.toLowerCase().includes(search.toLowerCase()) ||
                o.items.toLowerCase().includes(search.toLowerCase()) ||
                o.tracking.toLowerCase().includes(search.toLowerCase());
            const matchStatus = statusFilter === "All" || o.status === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [search, statusFilter]);

    const stats = useMemo(() => {
        const total = ordersData.length;
        const inTransit = ordersData.filter((o) => o.status === "In Transit").length;
        const totalSpent = ordersData
            .filter((o) => o.status !== "Cancelled")
            .reduce((sum, o) => sum + parseFloat(o.amount.replace("$", "")), 0);
        return { total, inTransit, totalSpent: `$${totalSpent.toFixed(0)}` };
    }, []);

    const statCards = [
        {
            label: "Total Orders",
            value: stats.total,
            icon: ShoppingBag,
            gradient: "from-[#008001] to-[#006312]",
            sub: "All time",
        },
        {
            label: "This Month",
            value: 2,
            icon: Package,
            gradient: "from-[#009200] to-[#006312]",
            sub: "Feb 2026",
        },
        {
            label: "In Transit",
            value: stats.inTransit,
            icon: Truck,
            gradient: "from-[#49B618] to-[#008001]",
            sub: "Active shipments",
        },
        {
            label: "Total Spent",
            value: stats.totalSpent,
            icon: DollarSign,
            gradient: "from-[#006312] to-[#008001]",
            sub: "Excl. cancelled",
        },
    ];

    const statusOptions: ("All" | OrderStatus)[] = [
        "All",
        "Delivered",
        "In Transit",
        "Processing",
        "Cancelled",
    ];

    return (
        <>
            {/* Order Detail Modal */}
            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}

            <div className="space-y-4 sm:space-y-6">
                {/* ── Stat Cards ───────────────────────────────────────────────── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    {statCards.map(({ label, value, icon: Icon, gradient, sub }) => (
                        <Card
                            key={label}
                            className="relative overflow-hidden bg-[#000000] border-[#008001]/30 hover:shadow-lg hover:shadow-[#008001]/20 transition-all group"
                        >
                            <div
                                className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${gradient} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`}
                            />
                            <CardContent className="p-4 sm:p-6 relative z-10">
                                <div className="flex items-start justify-between mb-3">
                                    <div
                                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
                                    >
                                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                    </div>
                                </div>
                                <p className="text-xl sm:text-3xl font-bold text-white">
                                    {value}
                                </p>
                                <p className="text-xs sm:text-sm text-[#A0A0A0] mt-0.5">
                                    {label}
                                </p>
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
                                    <p className="text-xs text-[#A0A0A0] mt-0.5">
                                        Orders placed per month
                                    </p>
                                </div>

                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 sm:pt-6">
                            <div className="h-48 sm:h-64 min-w-0">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                    <BarChart
                                        data={monthlyOrdersData}
                                        margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#008001"
                                            strokeOpacity={0.15}
                                            vertical={false}
                                        />
                                        <XAxis
                                            dataKey="month"
                                            stroke="#A0A0A0"
                                            fontSize={11}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#A0A0A0"
                                            fontSize={11}
                                            tickLine={false}
                                            axisLine={false}
                                            width={28}
                                        />
                                        <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(0,128,1,0.08)" }} />
                                        <Bar
                                            dataKey="orders"
                                            fill="#49B618"
                                            radius={[6, 6, 0, 0]}
                                            maxBarSize={48}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Summary */}
                    <Card className="bg-[#000000] border-[#008001]/30">
                        <CardHeader className="border-b border-[#008001]/30 pb-4">
                            <CardTitle className="text-white text-base sm:text-lg">
                                Order Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-3">
                            {statusOptions.slice(1).map((status) => {
                                const count = ordersData.filter(
                                    (o) => o.status === status
                                ).length;
                                const pct = Math.round((count / ordersData.length) * 100);
                                const cfg = STATUS_CONFIG[status as OrderStatus];
                                return (
                                    <div key={status}>
                                        <div className="flex justify-between text-xs mb-1.5">
                                            <span style={{ color: cfg.text }}>{status}</span>
                                            <span className="text-[#A0A0A0]">
                                                {count} order{count !== 1 ? "s" : ""}
                                            </span>
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

                            <div className="pt-3 border-t border-[#008001]/20 mt-2">
                                <p className="text-[10px] text-[#555] uppercase tracking-wider mb-2">
                                    Recent Activity
                                </p>
                                <p className="text-xs text-[#A0A0A0]">
                                    Last order placed on{" "}
                                    <span className="text-[#49B618]">Feb 1, 2026</span>
                                </p>
                                <p className="text-xs text-[#A0A0A0] mt-1">
                                    Avg. order value:{" "}
                                    <span className="text-white font-semibold">$79.99</span>
                                </p>
                            </div>
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
                                    {filtered.length} of {ordersData.length} orders
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
                                        <button
                                            onClick={() => setSearch("")}
                                            className="absolute right-3 top-1/2 -translate-y-1/2"
                                        >
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
                                        {statusFilter === "All" ? "Filter" : statusFilter}
                                        <ChevronDown
                                            className={`w-3 h-3 transition-transform ${showFilter ? "rotate-180" : ""}`}
                                        />
                                    </Button>
                                    {showFilter && (
                                        <div className="absolute right-0 top-10 z-20 bg-[#0a0a0a] border border-[#008001]/30 rounded-xl shadow-2xl w-44 py-1.5">
                                            {statusOptions.map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => {
                                                        setStatusFilter(s);
                                                        setShowFilter(false);
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-xs transition-colors flex items-center gap-2"
                                                    style={{
                                                        color:
                                                            statusFilter === s
                                                                ? "#49B618"
                                                                : "#A0A0A0",
                                                        background:
                                                            statusFilter === s
                                                                ? "rgba(0,128,1,0.1)"
                                                                : "transparent",
                                                    }}
                                                >
                                                    {s !== "All" && (
                                                        <span
                                                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                                            style={{
                                                                background:
                                                                    STATUS_CONFIG[s as OrderStatus]?.dot,
                                                            }}
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
                                        {[
                                            "Order ID",
                                            "Date",
                                            "Items",
                                            "Qty",
                                            "Amount",
                                            "Status",
                                            "Tracking",
                                            "Actions",
                                        ].map((h) => (
                                            <TableHead key={h} className="text-[#555] text-xs uppercase tracking-wider font-semibold">
                                                {h}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={8}
                                                className="text-center py-12 text-[#A0A0A0]"
                                            >
                                                No orders match your search.
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
                                                    {order.id}
                                                </TableCell>
                                                <TableCell className="text-[#A0A0A0] text-sm">
                                                    {order.date}
                                                </TableCell>
                                                <TableCell className="text-white text-sm">
                                                    {order.items}
                                                </TableCell>
                                                <TableCell className="text-[#A0A0A0] text-sm">
                                                    ×{order.quantity}
                                                </TableCell>
                                                <TableCell className="text-white font-semibold text-sm">
                                                    {order.amount}
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge status={order.status} />
                                                </TableCell>
                                                <TableCell className="font-mono text-xs text-[#555]">
                                                    {order.tracking}
                                                </TableCell>
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
                            {filtered.length === 0 ? (
                                <div className="text-center py-12 text-[#A0A0A0] text-sm">
                                    No orders match your search.
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
                                                <span className="font-mono text-sm font-semibold text-[#49B618]">
                                                    {order.id}
                                                </span>
                                                <p className="text-xs text-[#A0A0A0] mt-0.5">
                                                    {order.date}
                                                </p>
                                            </div>
                                            <StatusBadge status={order.status} />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-white">
                                                {order.quantity}× {order.items}
                                            </p>
                                            <p className="text-sm font-bold text-white">
                                                {order.amount}
                                            </p>
                                        </div>
                                        <p className="text-xs font-mono text-[#555] mt-1.5">
                                            {order.tracking}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {filtered.length > 0 && (
                            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-[#008001]/10">
                                <p className="text-xs text-[#555]">
                                    Showing {filtered.length} of {ordersData.length} orders
                                </p>
                                <button className="flex items-center gap-1.5 text-xs text-[#49B618] hover:text-white transition-colors">
                                    <RefreshCw className="w-3 h-3" />
                                    Refresh
                                </button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import {
    Check,
    CreditCard,
    Download,
    Zap,
    Shield,
    Crown,
    Sparkles,
    Receipt,
    ChevronRight,
    ExternalLink,
    ArrowUpRight,
    X,
    AlertTriangle,
    CheckCircle2,
    Loader2,
} from "lucide-react";
import {
    ApiPlan,
    ApiUser,
    getAnalytics,
    getInvoices,
    getPlans,
    getUserProfile,
    getPaymentMethod,
    savePaymentMethod,
    updateUserPlan,
    Invoice as ApiInvoice,
} from "@/lib/api";

// ── Types ─────────────────────────────────────────────────────────────────────
interface PlanData {
    id: string;
    name: string;
    tier: string;
    price: string;
    period: string;
    features: string[];
    icon: React.ElementType;
    popular?: boolean;
    cardsLimit: string;
    tapsLimit: string;
    storageLimit: string;
    maxCards: number;
    maxTaps: number;
    maxStorageMb: number;
}

interface Invoice extends ApiInvoice {
    amount: number;
}

interface PaymentMethod {
    brand: string;
    last4: string;
    expiry: string;
}

type ModalType =
    | null
    | "cancel"
    | "upgrade"
    | "downgrade"
    | "payment"
    | "download"
    | "success";

interface Toast {
    id: number;
    message: string;
    type: "success" | "info";
}

const PLAN_ICONS: Record<string, React.ElementType> = {
    FREE: Shield,
    PRO: Crown,
    BUSINESS: Sparkles,
    STARTER: Shield,
    GROWTH: Crown,
    ENTERPRISE: Sparkles,
};

const BILLING_PLAN_ORDER = ["FREE", "PRO", "BUSINESS"] as const;
type BillingPlanKey = (typeof BILLING_PLAN_ORDER)[number];

/** Map backend tier values → the 3-slot billing plan key used in this component */
const normalizeBillingTier = (raw: string): string => {
    const t = raw.trim().toUpperCase();
    // Backend stores "PROFESSIONAL" for what the UI calls "PRO"
    if (t === "PROFESSIONAL") return "PRO";
    return t;
};

const resolveBillingPlanKey = (plan: PlanData): BillingPlanKey | null => {
    const tierKey = normalizeBillingTier(plan.tier);
    if (BILLING_PLAN_ORDER.includes(tierKey as BillingPlanKey)) {
        return tierKey as BillingPlanKey;
    }

    const nameKey = normalizePlanTier(plan.name);
    if (nameKey.includes("FREE")) return "FREE";
    if (nameKey.includes("PRO")) return "PRO";
    if (nameKey.includes("BUSINESS")) return "BUSINESS";

    return null;
};

const formatCurrency = (amount: number, currency = "USD") =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount);

const formatDate = (value: string | null | undefined) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
};

const normalizePlanTier = (tier: string) => tier.trim().toUpperCase();

const formatLimit = (value: number) => {
    if (value >= 1_000_000) return "∞";
    return value.toLocaleString();
};

const formatUsageValue = (used: number | null, limit: number, suffix = "") => {
    const usedText = used === null ? "—" : used.toLocaleString();
    return `${usedText} / ${formatLimit(limit)}${suffix}`;
};

const getUsagePercent = (used: number | null, limit: number) => {
    if (used === null || limit <= 0) return 0;
    return Math.min(100, Math.round((used / limit) * 100));
};

const mapPlanToCard = (plan: ApiPlan): PlanData => {
    const tier = normalizePlanTier(plan.tier);
    const icon = PLAN_ICONS[tier] ?? Shield;
    return {
        id: String(plan.id),
        name: plan.name,
        tier,
        price: formatCurrency(plan.priceMonthly, plan.currency),
        period: "per month",
        features: plan.features,
        icon,
        popular: plan.popular,
        cardsLimit: plan.maxCards >= 1_000_000 ? "∞" : plan.maxCards.toLocaleString(),
        tapsLimit: plan.maxTaps.toLocaleString(),
        storageLimit: `${plan.maxStorageMb.toLocaleString()} MB`,
        maxCards: plan.maxCards,
        maxTaps: plan.maxTaps,
        maxStorageMb: plan.maxStorageMb,
    };
};

// ── Toast Component ───────────────────────────────────────────────────────────
function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) {
    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl animate-slide-up"
                    style={{
                        background: "#0a0f0a",
                        borderColor: t.type === "success" ? "rgba(73,182,24,0.4)" : "rgba(0,128,1,0.3)",
                    }}
                >
                    <CheckCircle2
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: t.type === "success" ? "#49B618" : "#008001" }}
                    />
                    <span className="text-sm text-white">{t.message}</span>
                    <button
                        onClick={() => onRemove(t.id)}
                        className="ml-2 text-[#555] hover:text-white transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            ))}
            <style>{`
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-up { animation: slide-up 0.3s ease forwards; }
            `}</style>
        </div>
    );
}

// ── Confirmation Modal ────────────────────────────────────────────────────────
function ConfirmModal({
    open,
    title,
    description,
    confirmLabel,
    confirmColor,
    icon: Icon,
    loading,
    onConfirm,
    onClose,
    children,
}: {
    open: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    confirmColor: "green" | "red";
    icon: React.ElementType;
    loading: boolean;
    onConfirm: () => void;
    onClose: () => void;
    children?: React.ReactNode;
}) {
    if (!open) return null;

    const colorMap = {
        green: {
            bg: "linear-gradient(135deg,#008001,#49B618)",
            iconBg: "rgba(73,182,24,0.15)",
            iconColor: "#49B618",
        },
        red: {
            bg: "linear-gradient(135deg,#dc2626,#ef4444)",
            iconBg: "rgba(239,68,68,0.15)",
            iconColor: "#ef4444",
        },
    };
    const c = colorMap[confirmColor];

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
                <div className="flex items-start gap-4 mb-4">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: c.iconBg }}
                    >
                        <Icon className="w-5 h-5" style={{ color: c.iconColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold text-lg">{title}</h3>
                        <p className="text-[#A0A0A0] text-sm mt-1 leading-relaxed">
                            {description}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg bg-[#1E1E1E] text-[#A0A0A0] hover:text-white flex items-center justify-center transition-colors flex-shrink-0"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {children}

                {/* Actions */}
                <div className="flex gap-3 mt-5">
                    <Button
                        variant="outline"
                        className="flex-1 text-sm h-10 border-[#008001]/30 text-[#A0A0A0] hover:text-white hover:bg-[#008001]/20 rounded-xl"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="flex-1 text-sm h-10 text-white rounded-xl"
                        style={{ background: c.bg }}
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : null}
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ── Payment Update Modal ──────────────────────────────────────────────────────
function PaymentModal({
    open,
    currentMethod,
    loading,
    onSave,
    onClose,
}: {
    open: boolean;
    currentMethod: PaymentMethod | null;
    loading: boolean;
    onSave: (m: PaymentMethod) => void;
    onClose: () => void;
}) {
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvc, setCvc] = useState("");

    if (!open) return null;

    const formatCardNumber = (v: string) => {
        const digits = v.replace(/\D/g, "").slice(0, 16);
        return digits.replace(/(.{4})/g, "$1 ").trim();
    };

    const formatExpiry = (v: string) => {
        const digits = v.replace(/\D/g, "").slice(0, 4);
        if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
        return digits;
    };

    const canSubmit = cardNumber.replace(/\s/g, "").length >= 15 && expiry.length >= 5 && cvc.length >= 3;

    const handleSave = () => {
        const digits = cardNumber.replace(/\s/g, "");
        onSave({
            brand: digits.startsWith("4") ? "Visa" : digits.startsWith("5") ? "Mastercard" : "Card",
            last4: digits.slice(-4),
            expiry: expiry,
        });
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
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#008001] to-[#49B618] flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg">Update Payment</h3>
                            <p className="text-xs text-[#A0A0A0] mt-0.5">
                                Current:{" "}
                                {currentMethod
                                    ? `${currentMethod.brand} •••• ${currentMethod.last4}`
                                    : "No payment method on file"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg bg-[#1E1E1E] text-[#A0A0A0] hover:text-white flex items-center justify-center transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Fields */}
                <div className="space-y-3">
                    <div>
                        <label className="text-xs text-[#A0A0A0] mb-1.5 block">Card Number</label>
                        <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            placeholder="4242 4242 4242 4242"
                            className="w-full h-10 px-4 rounded-xl bg-[#1E1E1E] border border-[#008001]/20 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[#49B618]/50 transition-colors"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-[#A0A0A0] mb-1.5 block">Expiry</label>
                            <input
                                type="text"
                                value={expiry}
                                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                placeholder="MM/YY"
                                className="w-full h-10 px-4 rounded-xl bg-[#1E1E1E] border border-[#008001]/20 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[#49B618]/50 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-[#A0A0A0] mb-1.5 block">CVC</label>
                            <input
                                type="text"
                                value={cvc}
                                onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                placeholder="123"
                                className="w-full h-10 px-4 rounded-xl bg-[#1E1E1E] border border-[#008001]/20 text-white text-sm placeholder:text-[#555] focus:outline-none focus:border-[#49B618]/50 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-5">
                    <Button
                        variant="outline"
                        className="flex-1 text-sm h-10 border-[#008001]/30 text-[#A0A0A0] hover:text-white hover:bg-[#008001]/20 rounded-xl"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="flex-1 text-sm h-10 text-white rounded-xl"
                        style={{ background: "linear-gradient(135deg,#008001,#49B618)" }}
                        onClick={handleSave}
                        disabled={!canSubmit || loading}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Save Card
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ── Animated Progress Bar ─────────────────────────────────────────────────────
function AnimatedProgress({
    value,
    color,
    delay = 0,
}: {
    value: number;
    color: string;
    delay?: number;
}) {
    const [animatedValue, setAnimatedValue] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setAnimatedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return (
        <div className="h-2 bg-[#1E1E1E] rounded-full overflow-hidden">
            <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                    width: `${animatedValue}%`,
                    background: `linear-gradient(90deg, ${color}, ${color}99)`,
                }}
            />
        </div>
    );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function UsageStat({
    label,
    value,
    pct,
    color,
    delay,
}: {
    label: string;
    value: string;
    pct: number;
    color: string;
    delay: number;
}) {
    return (
        <div className="space-y-2">
            <p className="text-xs sm:text-sm text-[#A0A0A0]">{label}</p>
            <p className="text-xl sm:text-2xl font-bold text-white">{value}</p>
            <AnimatedProgress value={pct} color={color} delay={delay} />
            <p className="text-[10px] text-[#555]">{pct}% used</p>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function Billing() {
    const mounted = true;
    const [user, setUser] = useState<ApiUser | null>(null);
    const [plans, setPlans] = useState<PlanData[]>([]);
    const [currentPlanIdx, setCurrentPlanIdx] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
    const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
    const [monthlyTaps, setMonthlyTaps] = useState<number>(0);
    const [showAllInvoices, setShowAllInvoices] = useState(false);

    // Modals
    const [modal, setModal] = useState<ModalType>(null);
    const [targetPlanIdx, setTargetPlanIdx] = useState<number | null>(null);
    const [modalLoading, setModalLoading] = useState(false);

    // Toasts
    const [toasts, setToasts] = useState<Toast[]>([]);
    const nextToastId = useCallback(() => Date.now(), []);

    const addToast = useCallback(
        (message: string, type: "success" | "info" = "success") => {
            const id = nextToastId();
            setToasts((prev) => [...prev, { id, message, type }]);
            setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
        },
        [nextToastId]
    );

    const removeToast = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

    // Downloading state per invoice
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const loadData = async () => {
            try {
                const [userData, planData, invoiceData, analyticsData, savedPayment] = await Promise.all([
                    getUserProfile(),
                    getPlans(),
                    getInvoices("all", 1),
                    getAnalytics("30"),
                    getPaymentMethod().catch(() => null),
                ]);

                if (cancelled) return;

                const mappedPlans = planData
                    .map(mapPlanToCard)
                    .map((plan) => ({ plan, key: resolveBillingPlanKey(plan) }))
                    .filter((item): item is { plan: PlanData; key: BillingPlanKey } => item.key !== null)
                    .sort((a, b) => BILLING_PLAN_ORDER.indexOf(a.key) - BILLING_PLAN_ORDER.indexOf(b.key))
                    .map((item) => item.plan);
                const activePlanIdx = mappedPlans.findIndex(
                    (plan) => normalizeBillingTier(plan.tier) === normalizeBillingTier(userData.planTier)
                );

                setUser(userData);
                setPlans(mappedPlans);
                setCurrentPlanIdx(activePlanIdx >= 0 ? activePlanIdx : 0);
                setAllInvoices(invoiceData.invoices);
                setMonthlyTaps(analyticsData.totalTaps ?? 0);
                if (savedPayment) setPaymentMethod(savedPayment);
            } catch (error) {
                console.error("Failed to load billing data:", error);
            }
        };

        loadData();

        return () => {
            cancelled = true;
        };
    }, []);

    const currentPlan = plans[currentPlanIdx] ?? null;
    const usage = {
        cards: currentPlan ? getUsagePercent(user?.totalCards ?? null, currentPlan.maxCards) : 0,
        taps: currentPlan ? getUsagePercent(monthlyTaps, currentPlan.maxTaps) : 0,
        storage: currentPlan ? 0 : 0,
    };
    const visibleInvoices = showAllInvoices ? allInvoices : allInvoices.slice(0, 3);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleCancelPlan = () => setModal("cancel");

    const handleUpgradeFromBanner = () => {
        if (currentPlanIdx < plans.length - 1) {
            setTargetPlanIdx(currentPlanIdx + 1);
            setModal("upgrade");
        }
    };

    const handlePlanAction = (planIdx: number) => {
        if (planIdx === currentPlanIdx) return;
        setTargetPlanIdx(planIdx);
        setModal(planIdx > currentPlanIdx ? "upgrade" : "downgrade");
    };

    const confirmPlanChange = async () => {
        if (targetPlanIdx === null) return;
        const target = plans[targetPlanIdx];
        if (!target) {
            setTargetPlanIdx(null);
            setModal(null);
            return;
        }
        setModalLoading(true);
        try {
            await updateUserPlan(target.tier);
            setCurrentPlanIdx(targetPlanIdx);
            addToast(`Successfully switched to ${target.name} plan!`);
        } catch {
            addToast("Failed to update plan. Please try again.", "info");
        } finally {
            setModalLoading(false);
            setModal(null);
            setTargetPlanIdx(null);
        }
    };

    const confirmCancel = async () => {
        setModalLoading(true);
        try {
            await updateUserPlan(plans[0]?.tier ?? "FREE");
            setCurrentPlanIdx(0);
            addToast("Plan cancelled. You're now on the Free plan.", "info");
        } catch {
            addToast("Failed to cancel plan. Please try again.", "info");
        } finally {
            setModalLoading(false);
            setModal(null);
        }
    };

    const handleUpdatePayment = () => setModal("payment");

    const handleSavePayment = async (m: PaymentMethod) => {
        setModalLoading(true);
        try {
            await savePaymentMethod(m);
            setPaymentMethod(m);
            addToast(`Payment updated to ${m.brand} •••• ${m.last4}`);
        } catch {
            addToast("Failed to save payment method. Please try again.", "info");
        } finally {
            setModalLoading(false);
            setModal(null);
        }
    };

    const handleDownload = async (invoice: Invoice) => {
        setDownloadingId(invoice.id);
        if (invoice.pdfUrl) {
            window.open(invoice.pdfUrl, "_blank", "noopener,noreferrer");
        } else {
            const blob = new Blob(
                [
                    `SAMCARD INVOICE\n${"─".repeat(40)}\n\nInvoice: ${invoice.invoiceNumber}\nDate: ${formatDate(invoice.date)}\nAmount: ${formatCurrency(invoice.amount, invoice.currency)}\nStatus: ${invoice.status}\n${invoice.billingName ? `Billing Name: ${invoice.billingName}\n` : ""}${invoice.periodStart ? `Period: ${formatDate(invoice.periodStart)} → ${formatDate(invoice.periodEnd ?? invoice.periodStart)}\n` : ""}\nThank you for your business!`,
                ],
                { type: "text/plain" }
            );
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${invoice.invoiceNumber}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
        setDownloadingId(null);
        addToast(`Downloaded ${invoice.invoiceNumber}`);
    };

    // ── Derived ───────────────────────────────────────────────────────────────
    const targetPlan = targetPlanIdx !== null ? plans[targetPlanIdx] ?? null : null;

    return (
        <>
            <ToastContainer toasts={toasts} onRemove={removeToast} />

            {/* ── Cancel Modal ──────────────────────────────────────────── */}
            <ConfirmModal
                open={modal === "cancel"}
                title="Cancel Your Plan?"
                description={currentPlan
                    ? `You'll be downgraded to the Free plan at the end of your billing period. You'll lose access to ${currentPlan.name} features like ${currentPlan.features.slice(2, 4).join(", ")}.`
                    : "You'll be downgraded to the Free plan at the end of your billing period."}
                confirmLabel="Yes, Cancel Plan"
                confirmColor="red"
                icon={AlertTriangle}
                loading={modalLoading}
                onConfirm={confirmCancel}
                onClose={() => setModal(null)}
            >
                <div className="p-3 rounded-xl bg-[#ef4444]/5 border border-[#ef4444]/20 mt-3">
                    <p className="text-xs text-[#ef4444]">
                        ⚠ Your current usage and data will be retained, but some features will become unavailable.
                    </p>
                </div>
            </ConfirmModal>

            {/* ── Upgrade Modal ─────────────────────────────────────────── */}
            <ConfirmModal
                open={modal === "upgrade"}
                title={`Upgrade to ${targetPlan?.name ?? "selected plan"}?`}
                description={targetPlan
                    ? `You'll be charged ${targetPlan.price}/${targetPlan.period} starting today. The price difference will be prorated.`
                    : "You'll be charged based on the selected plan."}
                confirmLabel={`Upgrade to ${targetPlan?.name ?? "plan"}`}
                confirmColor="green"
                icon={ArrowUpRight}
                loading={modalLoading}
                onConfirm={confirmPlanChange}
                onClose={() => { setModal(null); setTargetPlanIdx(null); }}
            >
                {targetPlan && (
                    <div className="p-3 rounded-xl bg-[#008001]/10 border border-[#008001]/20 mt-3 space-y-1">
                        {targetPlan.features.slice(0, 3).map((f) => (
                            <div key={f} className="flex items-center gap-2">
                                <Check className="w-3 h-3 text-[#49B618] flex-shrink-0" />
                                <span className="text-xs text-[#A0A0A0]">{f}</span>
                            </div>
                        ))}
                        <p className="text-[10px] text-[#555] pt-1">
                            +{targetPlan.features.length - 3} more features
                        </p>
                    </div>
                )}
            </ConfirmModal>

            {/* ── Downgrade Modal ───────────────────────────────────────── */}
            <ConfirmModal
                open={modal === "downgrade"}
                title={`Downgrade to ${targetPlan?.name ?? "selected plan"}?`}
                description={targetPlan
                    ? `Your plan will switch to ${targetPlan.name} (${targetPlan.price}/${targetPlan.period}). You may lose access to some current features.`
                    : "Your plan will switch to the selected plan."}
                confirmLabel={`Downgrade to ${targetPlan?.name ?? "plan"}`}
                confirmColor="red"
                icon={AlertTriangle}
                loading={modalLoading}
                onConfirm={confirmPlanChange}
                onClose={() => { setModal(null); setTargetPlanIdx(null); }}
            >
                <div className="p-3 rounded-xl bg-[#fbbf24]/5 border border-[#fbbf24]/20 mt-3">
                    <p className="text-xs text-[#fbbf24]">
                        ⚠ Features from your current plan will be unavailable after downgrading.
                    </p>
                </div>
            </ConfirmModal>

            {/* ── Payment Modal ─────────────────────────────────────────── */}
            <PaymentModal
                open={modal === "payment"}
                currentMethod={paymentMethod}
                loading={modalLoading}
                onSave={handleSavePayment}
                onClose={() => setModal(null)}
            />

            <div className="space-y-4 sm:space-y-6">
                {/* ── Current Plan Banner ──────────────────────────────────── */}
                <Card
                    className="relative overflow-hidden bg-[#000000] border-2 border-[#49B618]/60 shadow-lg shadow-[#49B618]/10 transition-all duration-700"
                    style={{
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? "translateY(0)" : "translateY(12px)",
                        transition: "opacity 0.5s ease, transform 0.5s ease",
                    }}
                >
                    <div className="absolute top-0 right-0 w-60 h-60 bg-gradient-to-br from-[#49B618] to-[#008001] opacity-[0.06] blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[#008001] to-transparent opacity-[0.04] blur-3xl pointer-events-none" />

                    <CardHeader className="border-b border-[#008001]/20 pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#008001] to-[#49B618] flex items-center justify-center shadow-lg shadow-[#008001]/30">
                                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-white text-base sm:text-lg flex items-center gap-2">
                                        {currentPlan ? `${currentPlan.name} Plan` : "Billing"}
                                        <Badge className="bg-[#49B618]/20 text-[#49B618] border-[#49B618]/30 text-[10px] px-2 hover:bg-[#49B618]/20">
                                            Active
                                        </Badge>
                                    </CardTitle>
                                    <p className="text-xs text-[#A0A0A0] mt-0.5">
                                        {user?.subscriptionEndsAt
                                            ? `Renews on ${formatDate(user.subscriptionEndsAt)} · ${currentPlan?.price ?? "—"}/${currentPlan?.period ?? "—"}`
                                            : currentPlan?.name === "Free"
                                                ? "Free forever — upgrade anytime"
                                                : user
                                                    ? `Billing status: ${user.subscriptionStatus}`
                                                    : "Loading billing data..."}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {currentPlan && currentPlan.name !== "Free" && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-[#008001]/30 text-[#A0A0A0] hover:text-white hover:bg-[#ef4444]/10 hover:border-[#ef4444]/30 text-xs h-9 rounded-full transition-colors"
                                        onClick={handleCancelPlan}
                                    >
                                        Cancel Plan
                                    </Button>
                                )}
                                {currentPlanIdx < plans.length - 1 && (
                                    <Button
                                        size="sm"
                                        className="text-white text-xs h-9 rounded-full gap-1.5"
                                        style={{
                                            background: "linear-gradient(135deg,#008001,#49B618)",
                                        }}
                                        onClick={handleUpgradeFromBanner}
                                    >
                                        <ArrowUpRight className="w-3.5 h-3.5" />
                                        Upgrade
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-5 sm:pt-6 relative z-10">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
                            <UsageStat
                                label="Cards Used"
                                value={currentPlan ? formatUsageValue(user?.totalCards ?? null, currentPlan.maxCards) : "—"}
                                pct={usage.cards}
                                color="#49B618"
                                delay={200}
                            />
                            <UsageStat
                                label="Monthly Taps"
                                value={currentPlan ? formatUsageValue(monthlyTaps, currentPlan.maxTaps) : "—"}
                                pct={usage.taps}
                                color="#008001"
                                delay={400}
                            />
                            <UsageStat
                                label="Storage Used"
                                value={currentPlan ? formatUsageValue(null, currentPlan.maxStorageMb, " MB") : "—"}
                                pct={usage.storage}
                                color="#006312"
                                delay={600}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* ── Plan Comparison ──────────────────────────────────────── */}
                <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#49B618]" />
                        Available Plans
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                        {plans.map((plan, index) => {
                            const PlanIcon = plan.icon;
                            const isCurrent = index === currentPlanIdx;
                            const isUpgrade = index > currentPlanIdx;

                            return (
                                <Card
                                    key={plan.name}
                                    className={`relative overflow-hidden bg-[#000000] transition-all duration-500 group hover:shadow-lg hover:shadow-[#008001]/10 ${
                                        isCurrent
                                            ? "border-2 border-[#49B618]/60"
                                            : "border border-[#008001]/30 hover:border-[#008001]/60"
                                    }`}
                                    style={{
                                        opacity: mounted ? 1 : 0,
                                        transform: mounted ? "translateY(0)" : "translateY(16px)",
                                        transition: `opacity 0.5s ease ${index * 150}ms, transform 0.5s ease ${index * 150}ms`,
                                    }}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-px left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#49B618] to-transparent" />
                                    )}
                                    {plan.popular && (
                                        <div className="absolute top-3 right-3">
                                            <Badge className="bg-[#49B618]/20 text-[#49B618] border-[#49B618]/30 text-[10px] hover:bg-[#49B618]/20">
                                                Popular
                                            </Badge>
                                        </div>
                                    )}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#008001] to-transparent opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500 pointer-events-none" />

                                    <CardHeader className="pb-2">
                                        <div className="flex items-center gap-2.5 mb-3">
                                            <div
                                                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                                                    isCurrent
                                                        ? "bg-gradient-to-br from-[#008001] to-[#49B618]"
                                                        : "bg-[#1E1E1E] border border-[#008001]/20"
                                                }`}
                                            >
                                                <PlanIcon
                                                    className={`w-4 h-4 ${
                                                        isCurrent ? "text-white" : "text-[#A0A0A0]"
                                                    }`}
                                                />
                                            </div>
                                            <CardTitle className="text-white text-base">
                                                {plan.name}
                                            </CardTitle>
                                        </div>
                                        <div className="mt-1">
                                            <span className="text-3xl sm:text-4xl font-bold text-white">
                                                {plan.price}
                                            </span>
                                            <span className="text-xs sm:text-sm text-[#A0A0A0] ml-1">
                                                / {plan.period}
                                            </span>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4 pt-2">
                                        <ul className="space-y-2.5">
                                            {plan.features.map((feature, idx) => (
                                                <li
                                                    key={idx}
                                                    className="flex items-start gap-2.5"
                                                    style={{
                                                        opacity: mounted ? 1 : 0,
                                                        transform: mounted
                                                            ? "translateX(0)"
                                                            : "translateX(-8px)",
                                                        transition: `opacity 0.3s ease ${
                                                            index * 150 + idx * 60
                                                        }ms, transform 0.3s ease ${
                                                            index * 150 + idx * 60
                                                        }ms`,
                                                    }}
                                                >
                                                    <div
                                                        className={`w-4 h-4 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0 ${
                                                            isCurrent
                                                                ? "bg-[#49B618]/20"
                                                                : "bg-[#1E1E1E]"
                                                        }`}
                                                    >
                                                        <Check
                                                            className={`w-2.5 h-2.5 ${
                                                                isCurrent
                                                                    ? "text-[#49B618]"
                                                                    : "text-[#555]"
                                                            }`}
                                                        />
                                                    </div>
                                                    <span className="text-xs sm:text-sm text-[#A0A0A0]">
                                                        {feature}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>

                                        {isCurrent ? (
                                            <Button
                                                className="w-full bg-[#1E1E1E] text-[#555] border border-[#008001]/20 cursor-default h-10 rounded-xl text-xs"
                                                variant="outline"
                                                disabled
                                            >
                                                Current Plan
                                            </Button>
                                        ) : (
                                            <Button
                                                className="w-full text-white h-10 rounded-xl text-xs hover:opacity-90 transition-opacity"
                                                style={{
                                                    background: isUpgrade
                                                        ? "linear-gradient(135deg,#008001,#49B618)"
                                                        : "linear-gradient(135deg,#333,#555)",
                                                }}
                                                onClick={() => handlePlanAction(index)}
                                            >
                                                {isUpgrade ? "Upgrade" : "Downgrade"}
                                                <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* ── Payment Method ───────────────────────────────────────── */}
                <Card
                    className="bg-[#000000] border-[#008001]/30 transition-all duration-500"
                    style={{
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? "translateY(0)" : "translateY(12px)",
                        transition: "opacity 0.6s ease 400ms, transform 0.6s ease 400ms",
                    }}
                >
                    <CardHeader className="border-b border-[#008001]/20 pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-white text-base sm:text-lg flex items-center gap-2">
                                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-[#49B618]" />
                                Payment Method
                            </CardTitle>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-[#008001]/30 text-[#A0A0A0] hover:text-white hover:bg-[#008001]/20 text-xs h-9 rounded-full"
                                onClick={handleUpdatePayment}
                            >
                                Update
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div
                            className="flex items-center gap-4 p-4 rounded-xl border border-[#008001]/20 bg-[#111a11] hover:bg-[#0f1f0f] transition-colors group cursor-pointer"
                            onClick={handleUpdatePayment}
                        >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#008001] to-[#49B618] flex items-center justify-center shadow-lg shadow-[#008001]/20 group-hover:shadow-[#008001]/30 transition-shadow">
                                <CreditCard className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white">
                                    {paymentMethod
                                        ? `${paymentMethod.brand} ending in ${paymentMethod.last4}`
                                        : "No payment method on file"}
                                </p>
                                <p className="text-xs text-[#A0A0A0] mt-0.5">
                                    {paymentMethod ? `Expires ${paymentMethod.expiry}` : "Add a card to continue"}
                                </p>
                            </div>
                            <Badge
                                variant="outline"
                                className="border-[#008001]/30 text-[#A0A0A0] text-[10px] hidden sm:flex"
                            >
                                Default
                            </Badge>
                            <ExternalLink className="w-4 h-4 text-[#555] group-hover:text-[#A0A0A0] transition-colors flex-shrink-0" />
                        </div>
                    </CardContent>
                </Card>

                {/* ── Invoice History ──────────────────────────────────────── */}
                <Card
                    className="bg-[#000000] border-[#008001]/30 transition-all duration-500"
                    style={{
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? "translateY(0)" : "translateY(12px)",
                        transition: "opacity 0.6s ease 600ms, transform 0.6s ease 600ms",
                    }}
                >
                    <CardHeader className="border-b border-[#008001]/20 pb-4">
                        <CardTitle className="text-white text-base sm:text-lg flex items-center gap-2">
                            <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-[#49B618]" />
                            Invoice History
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-0">
                        {/* Desktop */}
                        <div className="hidden md:block overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-[#008001]/20 hover:bg-transparent">
                                        {["Invoice ID", "Date", "Amount", "Status", "Actions"].map(
                                            (h) => (
                                                <TableHead
                                                    key={h}
                                                    className="text-[#555] text-xs uppercase tracking-wider font-semibold"
                                                >
                                                    {h}
                                                </TableHead>
                                            )
                                        )}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {visibleInvoices.map((invoice, idx) => (
                                        <TableRow
                                            key={invoice.id}
                                            className="border-[#008001]/10 hover:bg-[#008001]/5 transition-colors"
                                            style={{
                                                opacity: mounted ? 1 : 0,
                                                transform: mounted
                                                    ? "translateY(0)"
                                                    : "translateY(8px)",
                                                transition: `opacity 0.3s ease ${
                                                    700 + idx * 80
                                                }ms, transform 0.3s ease ${700 + idx * 80}ms`,
                                            }}
                                        >
                                            <TableCell className="font-mono text-sm text-[#49B618] font-semibold">
                                                {invoice.invoiceNumber}
                                            </TableCell>
                                            <TableCell className="text-[#A0A0A0] text-sm">
                                                {formatDate(invoice.date)}
                                            </TableCell>
                                            <TableCell className="text-white font-semibold text-sm">
                                                {formatCurrency(invoice.amount, invoice.currency)}
                                            </TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#49B618]/10 text-[#49B618] border border-[#49B618]/20">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#49B618] flex-shrink-0" />
                                                    {invoice.status}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <button
                                                    className="flex items-center gap-1.5 text-[#A0A0A0] hover:text-white transition-colors text-xs disabled:opacity-50"
                                                    onClick={() => handleDownload(invoice)}
                                                    disabled={downloadingId === invoice.id}
                                                >
                                                    {downloadingId === invoice.id ? (
                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                    ) : (
                                                        <Download className="w-3.5 h-3.5" />
                                                    )}
                                                    {downloadingId === invoice.id
                                                        ? "Downloading…"
                                                        : "Download"}
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Mobile */}
                        <div className="md:hidden divide-y divide-[#008001]/10">
                            {visibleInvoices.map((invoice, idx) => (
                                <div
                                    key={invoice.id}
                                    className="p-4 hover:bg-[#008001]/5 transition-colors"
                                    style={{
                                        opacity: mounted ? 1 : 0,
                                        transform: mounted
                                            ? "translateY(0)"
                                            : "translateY(8px)",
                                        transition: `opacity 0.3s ease ${
                                            700 + idx * 80
                                        }ms, transform 0.3s ease ${700 + idx * 80}ms`,
                                    }}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <span className="font-mono text-sm font-semibold text-[#49B618]">
                                                {invoice.invoiceNumber}
                                            </span>
                                            <p className="text-xs text-[#A0A0A0] mt-0.5">
                                                {formatDate(invoice.date)}
                                            </p>
                                        </div>
                                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#49B618]/10 text-[#49B618] border border-[#49B618]/20">
                                            <span className="w-1 h-1 rounded-full bg-[#49B618]" />
                                            {invoice.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-bold text-white">
                                            {formatCurrency(invoice.amount, invoice.currency)}
                                        </p>
                                        <button
                                            className="flex items-center gap-1 text-[#A0A0A0] hover:text-white transition-colors text-xs disabled:opacity-50"
                                            onClick={() => handleDownload(invoice)}
                                            disabled={downloadingId === invoice.id}
                                        >
                                            {downloadingId === invoice.id ? (
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                            ) : (
                                                <Download className="w-3 h-3" />
                                            )}
                                            {downloadingId === invoice.id
                                                ? "Downloading…"
                                                : "Download"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-[#008001]/10">
                            <p className="text-xs text-[#555]">
                                Showing {visibleInvoices.length} of {allInvoices.length} invoices
                            </p>
                            <button
                                className="flex items-center gap-1.5 text-xs text-[#49B618] hover:text-white transition-colors"
                                onClick={() => setShowAllInvoices((v) => !v)}
                            >
                                {showAllInvoices ? "Show less" : "View all invoices"}
                                <ChevronRight
                                    className="w-3 h-3 transition-transform"
                                    style={{
                                        transform: showAllInvoices ? "rotate(90deg)" : "none",
                                    }}
                                />
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

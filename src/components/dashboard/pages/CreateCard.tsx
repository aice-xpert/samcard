"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import BusinessProfile from "./BusinessProfile";
import { DesignNew } from "./Design";
import { NfcQr } from "./NfcQR";
import { createCard, updateCard, updateCardQR, updateCardContent, updateCardDesign, CardContentPayload, getCards, uploadFile, checkSlugAvailable } from "@/lib/api";
import { makeQRMatrix } from "@/components/dashboard/pages/qr-engine";
import { rebuildDecoratedComposite } from "@/components/dashboard/pages/qr-download-utils";

const STEPS = [
    { id: 1, label: "Content" },
    { id: 2, label: "Design / Settings" },
    { id: 3, label: "QR Code" },
];

function CampaignNameModal({
    onCancel,
    onSave,
    isSaving,
    errorMessage,
    onClearError,
    isEditMode,
    initialAutoSlug,
    initialCustomSlug,
    existingCardId,
}: {
    onCancel: () => void;
    onSave: (campaignName: string, customSlug?: string | null) => void;
    isSaving: boolean;
    errorMessage?: string;
    onClearError: () => void;
    isEditMode?: boolean;
    initialAutoSlug?: string;
    initialCustomSlug?: string | null;
    existingCardId?: string;
}) {
    const [campaignName, setCampaignName] = useState("");
    const [customSlug, setCustomSlug] = useState(initialCustomSlug ?? "");
    const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">(
        initialCustomSlug ? "available" : "idle"
    );
    const [slugMessage, setSlugMessage] = useState(
        initialCustomSlug ? "✓ Current custom URL" : ""
    );
    const slugDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [autoSlugPreview] = useState(() => {
        if (initialAutoSlug) return initialAutoSlug;
        const hex = Array.from({ length: 32 }, () =>
            Math.floor(Math.random() * 16).toString(16)
        ).join("");
        return `card_${hex}`;
    });

    const PUBLIC_BASE =
        process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
        "https://samcard.vercel.app";

    const handleSlugChange = (value: string) => {
        const raw = value.toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/^-+/, "");
        setCustomSlug(raw);
        setSlugStatus("idle");
        setSlugMessage("");
        if (errorMessage) onClearError();

        if (slugDebounceRef.current) clearTimeout(slugDebounceRef.current);

        if (!raw) return;

        if (raw.length < 3) {
            setSlugStatus("invalid");
            setSlugMessage("At least 3 characters required");
            return;
        }
        if (raw.length > 60) {
            setSlugStatus("invalid");
            setSlugMessage("60 characters maximum");
            return;
        }

        // If unchanged from the existing value, mark available immediately
        if (isEditMode && raw === (initialCustomSlug ?? "")) {
            setSlugStatus("available");
            setSlugMessage("✓ Current custom URL");
            return;
        }

        setSlugStatus("checking");
        slugDebounceRef.current = setTimeout(async () => {
            try {
                const result = await checkSlugAvailable(raw, existingCardId);
                if (result.available) {
                    setSlugStatus("available");
                    setSlugMessage("✓ This URL is available");
                } else {
                    setSlugStatus("taken");
                    setSlugMessage("✗ This URL is already taken");
                }
            } catch {
                setSlugStatus("invalid");
                setSlugMessage("Could not check availability");
            }
        }, 500);
    };

    const handleSave = async () => {
        onClearError();
        let slugToUse: string | null | undefined;
        if (isEditMode) {
            // In edit mode: empty field = clear slug (null), changed value = new slug
            if (!customSlug) {
                slugToUse = initialCustomSlug ? "" : undefined;  // "" signals backend to clear
            } else {
                slugToUse = slugStatus === "available" ? customSlug : undefined;
            }
        } else {
            slugToUse = customSlug && slugStatus === "available" ? customSlug : undefined;
        }
        await onSave(campaignName, slugToUse);
    };

    const slugBorderColor =
        slugStatus === "available" ? "border-accent/60" :
            slugStatus === "taken" || slugStatus === "invalid" ? "border-destructive/60" :
                "border-border";

    const slugMsgColor =
        slugStatus === "available" ? "text-accent" :
            slugStatus === "taken" || slugStatus === "invalid" ? "text-destructive" :
                "text-muted-foreground";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-popover border-border rounded-2xl w-full max-w-md mx-4 p-6 shadow-2xl shadow-primary/10">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-foreground">
                        {isEditMode ? "Edit Card URLs" : "Finish & Publish"}
                    </h2>
                    <button
                        onClick={onCancel}
                        className="w-7 h-7 rounded-lg bg-muted text-muted-foreground hover:text-foreground hover:bg-accent/20 flex items-center justify-center transition-all text-lg"
                    >
                        ×
                    </button>
                </div>

                {/* Campaign Name — only shown when creating */}
                {!isEditMode && (
                    <div className="mb-4">
                        <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                            Campaign Name
                        </label>
                        <input
                            type="text"
                            value={campaignName}
                            onChange={(e) => {
                                setCampaignName(e.target.value);
                                if (errorMessage) onClearError();
                            }}
                            placeholder="e.g. My Business Card Campaign"
                            className="w-full px-3 py-2.5 rounded-xl border border-border bg-input text-sm text-foreground outline-none focus:border-primary/60 placeholder:text-muted-foreground/60 transition-colors"
                        />
                    </div>
                )}

                {/* Auto-generated URL (read-only) */}
                <div className="mb-4">
                    <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                        Auto-generated URL
                    </label>
                    <div className="flex items-center rounded-xl border border-border/60 bg-background/50 overflow-hidden opacity-70">
                        <span className="px-3 text-xs text-muted-foreground whitespace-nowrap border-r border-border/50 py-2.5 select-none">
                            {PUBLIC_BASE}/
                        </span>
                        <span className="flex-1 px-3 py-2.5 text-xs text-muted-foreground font-mono truncate select-none">
                            {autoSlugPreview}
                        </span>
                        <span className="px-3 text-[10px] text-muted-foreground/60 whitespace-nowrap">auto</span>
                    </div>
                    <p className="text-xs mt-1.5 text-muted-foreground/60">
                        {isEditMode ? "Permanent — cannot be changed" : "Always active — generated when you publish"}
                    </p>
                </div>

                {/* Custom URL */}
                <div className="mb-5">
                    <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                        Custom URL <span className="text-muted-foreground/60 normal-case font-normal">(optional)</span>
                    </label>
                    <div className={`flex items-center rounded-xl border ${slugBorderColor} bg-input transition-colors focus-within:border-primary/60 overflow-hidden`}>
                        <span className="px-3 text-xs text-muted-foreground whitespace-nowrap border-r border-border/50 py-2.5 select-none">
                            {PUBLIC_BASE}/
                        </span>
                        <input
                            type="text"
                            value={customSlug}
                            onChange={(e) => handleSlugChange(e.target.value)}
                            placeholder="your-custom-url"
                            maxLength={60}
                            className="flex-1 px-3 py-2.5 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                        />
                        {slugStatus === "checking" && (
                            <span className="px-3 text-xs text-muted-foreground animate-pulse">checking…</span>
                        )}
                    </div>
                    {slugMessage && (
                        <p className={`text-xs mt-1.5 ${slugMsgColor}`}>{slugMessage}</p>
                    )}
                    {!customSlug && (
                        <p className="text-xs mt-1.5 text-muted-foreground/60">
                            {isEditMode && initialCustomSlug
                                ? "Clear the field to remove your custom URL"
                                : "Add a memorable custom URL — both links will work"}
                        </p>
                    )}
                </div>

                {errorMessage && (
                    <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                        {errorMessage}
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-between gap-3">
                    <button
                        onClick={onCancel}
                        className="px-5 py-2.5 rounded-xl border border-border text-muted-foreground text-sm hover:border-primary/60 hover:text-foreground transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || (!!customSlug && slugStatus !== "available")}
                        className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-accent transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSaving ? "Saving..." : isEditMode ? "Save Changes" : "Save & Publish"}
                    </button>
                </div>
            </div>
        </div>
    );
}

const CopyIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
);

const CheckIcon = () => (
    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

function SavedSuccessModal({ onCancel, onDashboard, cardSlug, cardCustomSlug }: {
    onCancel: () => void;
    onDashboard: () => void;
    cardSlug?: string;
    cardCustomSlug?: string | null;
}) {
    const PUBLIC_BASE =
        process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
        "https://samcard.vercel.app";

    const autoUrl = cardSlug ? `${PUBLIC_BASE}/${cardSlug}` : `${PUBLIC_BASE}/...`;
    const customUrl = cardCustomSlug ? `${PUBLIC_BASE}/${cardCustomSlug}` : null;

    const shareUrl = customUrl ?? autoUrl;
    const embed = `<iframe src="${shareUrl}" />`;

    const [copiedAuto, setCopiedAuto] = useState(false);
    const [copiedCustom, setCopiedCustom] = useState(false);
    const [copiedEmbed, setCopiedEmbed] = useState(false);

    const copy = (text: string, type: "auto" | "custom" | "embed") => {
        navigator.clipboard.writeText(text);
        if (type === "auto") { setCopiedAuto(true); setTimeout(() => setCopiedAuto(false), 2000); }
        else if (type === "custom") { setCopiedCustom(true); setTimeout(() => setCopiedCustom(false), 2000); }
        else { setCopiedEmbed(true); setTimeout(() => setCopiedEmbed(false), 2000); }
    };

    const shareLinks = [
        {
            label: "Facebook",
            bg: "bg-[#1877F2]",
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        },
        {
            label: "Twitter",
            bg: "bg-black border border-[#333]",
            href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`,
        },
        {
            label: "LinkedIn",
            bg: "bg-[#0A66C2]",
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
        },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-popover border-border rounded-2xl w-full max-w-lg mx-4 p-8 shadow-2xl shadow-primary/10">

                {/* Success Icon */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-14 h-14 rounded-full border-2 border-accent bg-primary/10 flex items-center justify-center mb-4">
                        <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Saved Successfully!</h2>
                </div>

                {/* Important Notice */}
                <div className="flex gap-3 bg-primary/10 border border-primary/20 rounded-xl px-4 py-3 mb-6">
                    <span className="text-accent mt-0.5 text-sm">ℹ</span>
                    <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-accent">IMPORTANT: </span>
                        Please make sure to test scan your QR before printing for production
                    </p>
                </div>

                {/* Share */}
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Share on social media</p>
                <div className="flex gap-2 mb-5">
                    {shareLinks.map((s) => (
                        <button
                            key={s.label}
                            onClick={() => window.open(s.href, "_blank", "noopener,noreferrer")}
                            className={`${s.bg} text-white text-xs px-4 py-2 rounded-lg font-medium hover:opacity-80 transition-opacity`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>

                {/* Auto URL */}
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Auto-generated URL</p>
                <div className="flex items-center gap-2 bg-input border-border rounded-xl px-3 py-2.5 mb-3 group">
                    <span className="text-xs text-foreground/80 flex-1 truncate font-mono">{autoUrl}</span>
                    <button onClick={() => copy(autoUrl, "auto")} className="text-muted-foreground group-hover:text-accent transition-colors">
                        {copiedAuto ? <CheckIcon /> : <CopyIcon />}
                    </button>
                </div>

                {/* Custom URL (shown only if set) */}
                {customUrl && (
                    <>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Custom URL</p>
                        <div className="flex items-center gap-2 bg-input border-accent/30 rounded-xl px-3 py-2.5 mb-3 group">
                            <span className="text-xs text-accent flex-1 truncate font-mono">{customUrl}</span>
                            <button onClick={() => copy(customUrl, "custom")} className="text-muted-foreground group-hover:text-accent transition-colors">
                                {copiedCustom ? <CheckIcon /> : <CopyIcon />}
                            </button>
                        </div>
                    </>
                )}

                {/* Embed */}
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Embed Code</p>
                <div className="flex items-center gap-2 bg-input border-border rounded-xl px-3 py-2.5 mb-6 group">
                    <span className="text-xs text-muted-foreground flex-1 truncate font-mono">{embed}</span>
                    <button onClick={() => copy(embed, "embed")} className="text-muted-foreground group-hover:text-accent transition-colors">
                        {copiedEmbed ? <CheckIcon /> : <CopyIcon />}
                    </button>
                </div>

                {/* Actions */}
                <div className="flex justify-between pt-5 border-t border-border">
                    <button
                        onClick={onCancel}
                        className="px-5 py-2.5 rounded-xl border border-border text-muted-foreground text-sm hover:border-primary/60 hover:text-foreground transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onDashboard}
                        className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-accent transition-all"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}

export function CreateCard({ cardId, onDone }: { cardId?: string; onDone?: () => void }) {
    const [step, setStep] = useState(1);
    const [showCampaignModal, setShowCampaignModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [qrConfig, setQrConfig] = useState<any>(null);
    const [designSettings, setDesignSettings] = useState<any>(null);
    const [cardContent, setCardContent] = useState<CardContentPayload | null>(null);
    const [campaignName, setCampaignName] = useState("");
    const [createdSlug, setCreatedSlug] = useState<string | undefined>(undefined);
    const [createdCustomSlug, setCreatedCustomSlug] = useState<string | null | undefined>(undefined);
    const [activeCardId, setActiveCardId] = useState<string | undefined>(cardId);
    const [existingCardInfo, setExistingCardInfo] = useState<{ slug?: string; customSlug?: string | null } | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [hasLoadedCardContent, setHasLoadedCardContent] = useState(false);
    const [pendingCustomSlug, setPendingCustomSlug] = useState<string | undefined>(undefined);

    // ── FIX: Keep a ref that always holds the latest cardContent ──────────────
    // onContentChange fires on every state change in BusinessProfile, so by the
    // time Save & Finish is clicked we always have the most recent content — even
    // if the user never changed anything on Step 1 (the initial load fires it too).
    const cardContentRef = useRef<CardContentPayload | null>(null);
    const handleContentChange = useCallback((content: CardContentPayload) => {
        cardContentRef.current = content;
        setCardContent(content);
    }, []);

    useEffect(() => {
        setStep(1);
        setActiveCardId(cardId);
        setHasLoadedCardContent(false);

        if (!cardId) {
            try {
                localStorage.removeItem('businessProfile_v1:draft');
                localStorage.removeItem('cardDesign_v1:draft');
                localStorage.removeItem('samcard_qr_config_v1:draft');
            } catch {
                // ignore storage errors
            }
        }
    }, [cardId]);


    const toDbFontFamily = (font: unknown): string => {
        if (typeof font !== "string") return "INTER";
        const normalized = font.trim().toLowerCase();
        const map: Record<string, string> = {
            inter: "INTER",
            sora: "SORA",
            "dm-sans": "DM_SANS",
            poppins: "POPPINS",
            raleway: "RALEEWAY",
            playfair: "PLAYFAIR_DISPLAY",
            mono: "FIRA_CODE",
            "fira-code": "FIRA_CODE",
            system: "SYSTEM",
        };
        return map[normalized] ?? "INTER";
    };

    const toNumber = (value: unknown, fallback: number): number => {
        const parsed = typeof value === "number" ? value : Number(value);
        return Number.isFinite(parsed) ? parsed : fallback;
    };

    const toPhoneBgType = (value: unknown): "solid" | "gradient" => {
        const normalized = typeof value === "string" ? value.trim().toLowerCase() : "";
        return normalized === "solid" ? "solid" : "gradient";
    };

    const toShadowIntensity = (value: unknown): "none" | "soft" | "medium" | "strong" => {
        const normalized = typeof value === "string" ? value.trim().toLowerCase() : "";
        if (normalized === "none" || normalized === "soft" || normalized === "medium" || normalized === "strong") {
            return normalized;
        }
        return "soft";
    };

    const PALETTE_TO_HERO_LAYOUT: Record<string, string> = {
        'medical-teal': 'wave-panel', 'teamwork-orange': 'side-panel',
        'heritage-gold': 'wave-panel', 'team-pro': 'group-diagonal',
        'royal-purple': 'circle-overlap', 'minimal-mono': 'circle-center',
        'sunset-banner': 'top-banner', 'sky-circle': 'circle-overlap',
        'onyx-pro': 'default', 'mocha-torn': 'torn-edge',
        'navy-gold': 'wave-logo', 'emerald-wave': 'wave-logo',
        'azure-flow': 'wave-panel', 'rose-wave': 'wave-panel',
        'navy-amber': 'wave-logo', 'blush-soft': 'wave-side',
        'violet-pro': 'wave-icons',
    };

    const buildCardDesignPayload = (settings: any) => {
        const palette = typeof settings?.palette === "string" ? settings.palette : "green";
        const heroLayout = (typeof settings?.heroLayout === "string" && settings.heroLayout && settings.heroLayout !== "default")
            ? settings.heroLayout
            : (PALETTE_TO_HERO_LAYOUT[palette] ?? "default");
        return ({
        palette,
        heroLayout,
        accentColor: typeof settings?.accentColor === "string" ? settings.accentColor : "#008001",
        accentLight: typeof settings?.accentLight === "string" ? settings.accentLight : "#49B618",
        bgColor: typeof settings?.bgColor === "string" ? settings.bgColor : "#0a0f0a",
        cardColor: typeof settings?.cardColor === "string" ? settings.cardColor : "#111a11",
        textPrimary: typeof settings?.textPrimary === "string" ? settings.textPrimary : "#f0f0f0",
        textMuted: typeof settings?.textMuted === "string" ? settings.textMuted : "#7a9a7a",
        phoneBgPreset: typeof settings?.phoneBgPreset === "string" ? settings.phoneBgPreset : "aurora",
        phoneBgColor1: typeof settings?.phoneBgColor1 === "string" ? settings.phoneBgColor1 : "#0a0f0a",
        phoneBgColor2: typeof settings?.phoneBgColor2 === "string" ? settings.phoneBgColor2 : "#003322",
        phoneBgAngle: toNumber(settings?.phoneBgAngle, 135),
        phoneBgType: toPhoneBgType(settings?.phoneBgType),
        font: typeof settings?.font === "string" ? settings.font : "inter",
        bodyFontSize: toNumber(settings?.bodyFontSize, 11),
        nameFontSize: toNumber(settings?.nameFontSize, 22),
        boldHeadings: typeof settings?.boldHeadings === "boolean" ? settings.boldHeadings : true,
        cardRadius: toNumber(settings?.cardRadius, 16),
        shadowIntensity: toShadowIntensity(settings?.shadowIntensity),
        glowEffect: typeof settings?.glowEffect === "boolean" ? settings.glowEffect : true,
        });
    };

    const handleSaveFinish = async () => {
        setSaveError(null);
        if (activeCardId) {
            // Fetch existing card to pre-populate the URL fields in the modal
            setIsSaving(true);
            try {
                const cards = await getCards();
                const existing = cards.find((c) => c.id === activeCardId);
                setExistingCardInfo(existing
                    ? { slug: existing.slug, customSlug: existing.customSlug ?? null }
                    : null
                );
            } catch {
                setExistingCardInfo(null);
            } finally {
                setIsSaving(false);
            }
        }
        setShowCampaignModal(true);
    };

    const handleCampaignSave = async (campaignName: string, customSlug?: string | null) => {
        setPendingCustomSlug(customSlug ?? undefined);
        await handleSaveCard(campaignName, customSlug);
    };

    const handleSaveCard = async (campaignName: string | undefined, customSlug: string | null | undefined) => {
        setIsSaving(true);
        setSaveError(null);

        const payload: any = { cardType: "QR" };
        if (campaignName) payload.name = campaignName;

        if (designSettings) {
            payload.backgroundColor = designSettings.bgColor;
            payload.accentColor = designSettings.accentColor;
            payload.accentLight = designSettings.accentLight;
            payload.textColor = designSettings.textPrimary;
            payload.cardColor = designSettings.cardColor;
            payload.cardRadius = designSettings.cardRadius;
            payload.fontFamily = toDbFontFamily(designSettings.font);
            payload.nameFontSize = designSettings.nameFontSize;
            payload.bodyFontSize = designSettings.bodyFontSize;
            payload.boldHeadings = designSettings.boldHeadings;
            payload.phoneBgType = designSettings.phoneBgType ? designSettings.phoneBgType.toUpperCase() : "SOLID";
            payload.phoneBgPreset = designSettings.phoneBgPreset;
            payload.phoneBgColor1 = designSettings.phoneBgColor1;
            payload.phoneBgColor2 = designSettings.phoneBgColor2;
            payload.phoneBgAngle = parseInt(designSettings.phoneBgAngle, 10) || 0;
            payload.shadowIntensity = designSettings.shadowIntensity ? designSettings.shadowIntensity.toUpperCase() : "NONE";
            payload.glowEffect = designSettings.glowEffect;
        }

        try {
            let targetCardId = activeCardId;

            if (targetCardId) {
                // Include customSlug in update if provided (empty string clears it)
                if (customSlug !== undefined) payload.customSlug = customSlug ?? "";
                await updateCard(targetCardId, payload);
                const cards = await getCards();
                const edited = cards.find((c) => c.id === targetCardId);
                setCreatedSlug(edited?.slug);
                setCreatedCustomSlug(edited?.customSlug ?? null);
            } else {
                const createPayload: any = { ...payload, name: campaignName || "My Card" };
                if (customSlug) createPayload.customSlug = customSlug;
                const card = await createCard(createPayload);
                targetCardId = card.id;
                setActiveCardId(card.id);
                setCreatedSlug(card.slug);
                setCreatedCustomSlug(card.customSlug ?? null);
            }

            if (designSettings && targetCardId) {
                await updateCardDesign(targetCardId, buildCardDesignPayload(designSettings));
            }

            if (qrConfig && targetCardId) {
                // Rebuild decorated composite with the real card URL so the QR
                // matrix encodes the correct slug instead of the placeholder
                // ("…/…") that was used before the card existed.
                let finalDecorateUrl = qrConfig.decorateCompositeDataUrl || '';
                const realSlug = createdSlug ?? (await getCards().then(cs => cs.find(c => c.id === targetCardId)?.slug));
                if (qrConfig.decorateImageUrl && realSlug) {
                    try {
                        const PUBLIC_BASE =
                            process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ||
                            'https://samcard.vercel.app';
                        const correctUrl = `${PUBLIC_BASE}/${realSlug}`;
                        const { matrix, N } = makeQRMatrix(correctUrl);
                        const blob = await rebuildDecoratedComposite(
                            qrConfig.decorateImageUrl,
                            qrConfig,
                            matrix,
                            N,
                            1200,
                        );
                        const file = new File([blob], 'qr-decorated.png', { type: 'image/png' });
                        const { url } = await uploadFile(file);
                        finalDecorateUrl = url;
                    } catch (err) {
                        console.warn('[CreateCard] Failed to rebuild decorated composite with correct URL, using original', err);
                    }
                }

                await updateCardQR(targetCardId, {
                    shapeId: qrConfig.shapeId,
                    dotShape: qrConfig.dotShape,
                    finderStyle: qrConfig.finderStyle,
                    eyeBall: qrConfig.eyeBall,
                    bodyScale: qrConfig.bodyScale,
                    fg: qrConfig.fg,
                    bg: qrConfig.bg,
                    accentFg: qrConfig.accentFg || qrConfig.fg,
                    accentBg: qrConfig.accentBg || qrConfig.bg,
                    strokeEnabled: qrConfig.strokeEnabled,
                    strokeColor: qrConfig.strokeColor,
                    gradEnabled: qrConfig.gradEnabled,
                    gradStops: qrConfig.gradStops,
                    gradAngle: qrConfig.gradAngle,
                    selectedLogo: qrConfig.selectedLogo || '',
                    customLogoUrl: qrConfig.customLogoUrl || '',
                    logoBg: qrConfig.logoBg || '#ffffff',
                    stickerId: qrConfig.selectedSticker?.id ?? null,
                    designLabel: qrConfig.designLabel,
                    shapeLabel: qrConfig.shapeLabel,
                    decorateImageUrl: finalDecorateUrl,
                });
            }

            // ── FIX: Use the ref so we always have the latest content ────────────
            // cardContent state may be null if onContentChange never fired after
            // mount (e.g. user went straight to Step 2 without touching Step 1).
            // The ref is always up to date because onContentChange updates it on
            // every render of BusinessProfile.
            const latestContent = cardContentRef.current ?? cardContent;

            if (latestContent && targetCardId) {
                console.log('[CreateCard] Saving cardContent with ordering:');
                console.log('[CreateCard] sectionOrder:', latestContent.sectionOrder);
                console.log('[CreateCard] unifiedOrder:', latestContent.unifiedOrder);
                await updateCardContent(targetCardId, latestContent);
            } else {
                console.warn('[CreateCard] cardContent NOT saved', {
                    hasContent: !!latestContent,
                    targetCardId,
                });
            }

            setShowCampaignModal(false);
            setShowSuccessModal(true);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to save card";
            setSaveError(message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleClose = () => { setShowCampaignModal(false); setShowSuccessModal(false); };
    const handleDashboard = () => {
        setShowSuccessModal(false);
        onDone?.();
    };

    const handleNext = useCallback(() => {
        setStep((prev) => Math.min(STEPS.length, prev + 1));
    }, []);

    const handleStepClick = useCallback((targetStep: number) => {
        setStep(targetStep);
    }, []);

    return (
        <div className="flex flex-col">

            {/* Modals */}
            {showCampaignModal && (
                <CampaignNameModal
                    onCancel={handleClose}
                    onSave={handleCampaignSave}
                    isSaving={isSaving}
                    errorMessage={saveError ?? undefined}
                    onClearError={() => setSaveError(null)}
                    isEditMode={!!activeCardId}
                    initialAutoSlug={existingCardInfo?.slug}
                    initialCustomSlug={existingCardInfo?.customSlug}
                    existingCardId={activeCardId}
                />
            )}
            {showSuccessModal && <SavedSuccessModal onCancel={handleClose} onDashboard={handleDashboard} cardSlug={createdSlug} cardCustomSlug={createdCustomSlug} />}

            {/* ── Stepper Header ── */}
            <div className="flex items-center justify-center gap-2 px-8 py-5 border-b border-border bg-background">
                {STEPS.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-2">
                        <button
                            onClick={() => handleStepClick(s.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-all cursor-pointer
                ${step === s.id
                                    ? "bg-primary text-primary-foreground"
                                    : step > s.id
                                        ? "bg-primary/30 text-accent"
                                        : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                                }`}
                        >
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold
                ${step === s.id ? "bg-background text-primary" : "bg-current/20"}`}>
                                {step > s.id ? "✓" : s.id}
                            </span>
                            {s.label}
                        </button>
                        {i < STEPS.length - 1 && (
                            <div className={`w-8 h-px ${step > s.id ? "bg-primary" : "bg-muted-foreground/30"}`} />
                        )}
                    </div>
                ))}
            </div>

            {/* ── Step Content ── */}
            <div className="flex-1">
                {step === 1 && (
                    <BusinessProfile
                        cardId={activeCardId}
                        allowFallbackToFirstCard={false}
                        onContentChange={handleContentChange}
                        onContentLoaded={() => setHasLoadedCardContent(true)}
                    />
                )}
                {step === 2 && (
                    <DesignNew
                        cardId={activeCardId}
                        allowFallbackToFirstCard={false}
                        onSettingsChange={setDesignSettings}
                    />
                )}
                {step === 3 && (
                    <NfcQr
                        onConfigChange={setQrConfig}
                        cardId={activeCardId}
                        allowFallbackToFirstCard={false}
                        forceNewCard={!activeCardId}
                        initialConfig={qrConfig}
                    />
                )}
            </div>

            {/* ── Navigation Buttons ── */}
            <div className="flex justify-between items-center px-8 py-4 border-t border-border bg-background">
                <button
                    onClick={() => setStep((prev) => Math.max(1, prev - 1))}
                    disabled={step === 1}
                    className="px-5 py-2 rounded-lg border border-border text-muted-foreground text-sm
            hover:border-primary hover:text-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    ← Back
                </button>

                <span className="text-xs text-muted-foreground">Step {step} of {STEPS.length}</span>

                {step < STEPS.length ? (
                    <button
                        onClick={handleNext}
                        className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-accent transition-all"
                    >
                        Next →
                    </button>
                ) : (
                    <button
                        onClick={handleSaveFinish}
                        disabled={isSaving || (!!activeCardId && !hasLoadedCardContent)}
                        title={activeCardId && !hasLoadedCardContent ? "Waiting for card content to finish loading" : undefined}
                        className="px-5 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:bg-primary transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSaving ? "Saving..." : activeCardId && !hasLoadedCardContent ? "Loading…" : "Save & Finish ✓"}
                    </button>
                )}
            </div>
            {saveError && !showCampaignModal && (
                <div className="px-8 pb-4 bg-background">
                    <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                        {saveError}
                    </div>
                </div>
            )}
        </div>
    );
}
"use client";

import { useEffect, useState, useCallback } from "react";
import BusinessProfile from "./BusinessProfile";
import { DesignNew } from "./Design";
import { NfcQr } from "./NfcQR";
import { createCard, updateCard, updateCardQR, updateCardContent, updateCardDesign, CardContentPayload, getCards } from "@/lib/api";

const STEPS = [
    { id: 1, label: "Content" },
    { id: 2, label: "Design / Settings" },
    { id: 3, label: "QR Code" },
];

function CampaignNameModal({ onCancel, onSave }: { onCancel: () => void; onSave: (campaignName: string) => void }) {
    const [campaignName, setCampaignName] = useState("");
    const [folder, setFolder] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        await onSave(campaignName);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0d120d] border border-[#008001]/30 rounded-2xl w-full max-w-md mx-4 p-6 shadow-2xl shadow-[#008001]/10">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-white">Campaign Name</h2>
                    <button
                        onClick={onCancel}
                        className="w-7 h-7 rounded-lg bg-[#1a1f1a] text-[#A0A0A0] hover:text-white hover:bg-[#008001]/20 flex items-center justify-center transition-all text-lg"
                    >
                        ×
                    </button>
                </div>

         

                {/* Campaign Name */}
                <div className="mb-4">
                    <label className="block text-xs font-medium text-[#A0A0A0] mb-2 uppercase tracking-wide">
                        Campaign Name
                    </label>
                    <input
                        type="text"
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        placeholder="e.g. My Business Card Campaign"
                        className="w-full px-3 py-2.5 rounded-xl border border-[#008001]/25 bg-[#111811] text-sm text-white outline-none focus:border-[#008001]/60 placeholder-[#555] transition-colors"
                    />
                </div>

                {/* Folder */}
                <div className="mb-7">
                    <label className="block text-xs font-medium text-[#A0A0A0] mb-2 uppercase tracking-wide">
                        Folder <span className="normal-case text-[#555]">(Optional)</span>
                    </label>
                    <select
                        value={folder}
                        onChange={(e) => setFolder(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-[#008001]/25 bg-[#111811] text-sm text-[#A0A0A0] outline-none focus:border-[#008001]/60 transition-colors appearance-none cursor-pointer"
                    >
                        <option value="">Select Folder</option>
                        <option value="folder1">Folder 1</option>
                        <option value="folder2">Folder 2</option>
                    </select>
                </div>

                {/* Actions */}
                <div className="flex justify-between gap-3">
                    <button
                        onClick={onCancel}
                        className="px-5 py-2.5 rounded-xl border border-[#008001]/30 text-[#A0A0A0] text-sm hover:border-[#008001]/60 hover:text-white transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2.5 rounded-xl bg-[#008001] text-white text-sm font-semibold hover:bg-[#49B618] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSaving ? "Saving..." : "Save"}
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
    <svg className="w-4 h-4 text-[#49B618]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

function SavedSuccessModal({ onCancel, onDashboard, cardSlug }: { onCancel: () => void; onDashboard: () => void; cardSlug?: string }) {
    const PUBLIC_BASE =
        process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
        "https://samcard.vercel.app";

    const CARD_URL = cardSlug
        ? `${PUBLIC_BASE}/${cardSlug}`
        : typeof window !== "undefined"
            ? `${PUBLIC_BASE}/...`
            : PUBLIC_BASE;

    const url = CARD_URL;
    const embed = `<iframe src="${CARD_URL}" />`;
    const [copiedUrl, setCopiedUrl] = useState(false);
    const [copiedEmbed, setCopiedEmbed] = useState(false);

    const copy = (text: string, type: "url" | "embed") => {
        navigator.clipboard.writeText(text);
        if (type === "url") { setCopiedUrl(true); setTimeout(() => setCopiedUrl(false), 2000); }
        else { setCopiedEmbed(true); setTimeout(() => setCopiedEmbed(false), 2000); }
    };

    const shareLinks = [
        {
            label: "Facebook",
            bg: "bg-[#1877F2]",
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        },
        {
            label: "Twitter",
            bg: "bg-black border border-[#333]",
            href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
        },
        {
            label: "LinkedIn",
            bg: "bg-[#0A66C2]",
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0d120d] border border-[#008001]/30 rounded-2xl w-full max-w-lg mx-4 p-8 shadow-2xl shadow-[#008001]/10">

                {/* Success Icon */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-14 h-14 rounded-full border-2 border-[#49B618] bg-[#008001]/10 flex items-center justify-center mb-4">
                        <svg className="w-7 h-7 text-[#49B618]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Saved Successfully!</h2>
                </div>

                {/* Important Notice */}
                <div className="flex gap-3 bg-[#008001]/10 border border-[#008001]/20 rounded-xl px-4 py-3 mb-6">
                    <span className="text-[#49B618] mt-0.5 text-sm">ℹ</span>
                    <p className="text-sm text-[#A0A0A0]">
                        <span className="font-semibold text-[#49B618]">IMPORTANT: </span>
                        Please make sure to test scan your QR before printing for production
                    </p>
                </div>

                {/* Share */}
                <p className="text-xs font-medium text-[#A0A0A0] uppercase tracking-wide mb-3">Share on social media</p>
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

                {/* URL */}
                <div className="flex items-center gap-2 bg-[#111811] border border-[#008001]/25 rounded-xl px-3 py-2.5 mb-3 group">
                    <span className="text-xs text-[#A0A0A0] flex-1 truncate font-mono">{url}</span>
                    <button onClick={() => copy(url, "url")} className="text-[#555] group-hover:text-[#49B618] transition-colors">
                        {copiedUrl ? <CheckIcon /> : <CopyIcon />}
                    </button>
                </div>

                {/* Embed */}
                <p className="text-xs font-medium text-[#A0A0A0] uppercase tracking-wide mb-2">Embed Code</p>
                <div className="flex items-center gap-2 bg-[#111811] border border-[#008001]/25 rounded-xl px-3 py-2.5 mb-6 group">
                    <span className="text-xs text-[#555] flex-1 truncate font-mono">{embed}</span>
                    <button onClick={() => copy(embed, "embed")} className="text-[#555] group-hover:text-[#49B618] transition-colors">
                        {copiedEmbed ? <CheckIcon /> : <CopyIcon />}
                    </button>
                </div>

                {/* Actions */}
                <div className="flex justify-between pt-5 border-t border-[#008001]/15">
                    <button
                        onClick={onCancel}
                        className="px-5 py-2.5 rounded-xl border border-[#008001]/30 text-[#A0A0A0] text-sm hover:border-[#008001]/60 hover:text-white transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onDashboard}
                        className="px-6 py-2.5 rounded-xl bg-[#008001] text-white text-sm font-semibold hover:bg-[#49B618] transition-all"
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
    const [activeCardId, setActiveCardId] = useState<string | undefined>(cardId);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setStep(1);
        setActiveCardId(cardId);

        // BUG-19: When starting a new card (no cardId), clear the draft cache keys so
        // the form always opens with default/empty state instead of previous card data.
        if (!cardId) {
            try {
                localStorage.removeItem('businessProfile_v1:draft');
                localStorage.removeItem('cardDesign_v1:draft');
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

    const buildCardDesignPayload = (settings: any) => ({
        palette: typeof settings?.palette === "string" ? settings.palette : "green",
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

    const handleSaveFinish = () => {
        if (activeCardId) {
            // Editing existing card — save directly, no name prompt
            void handleSaveCard(undefined);
        } else {
            // Creating new card — ask for campaign name first
            setShowCampaignModal(true);
        }
    };
    const handleCampaignSave = async (campaignName: string) => {
        await handleSaveCard(campaignName);
    };
    const handleSaveCard = async (campaignName: string | undefined) => {
        setIsSaving(true);
        // Build payload for both create and edit flows
        const payload: any = { cardType: "QR" };
        // Only set name when explicitly provided (new card flow); editing preserves the existing name
        if (campaignName) payload.name = campaignName;

        // Add design settings
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
                await updateCard(targetCardId, payload);
                const cards = await getCards();
                const edited = cards.find((c) => c.id === targetCardId);
                setCreatedSlug(edited?.slug);
            } else {
                const card = await createCard({ ...payload, name: campaignName || "My Card" });
                targetCardId = card.id;
                setActiveCardId(card.id);
                setCreatedSlug(card.slug);
            }

            if (designSettings && targetCardId) {
                await updateCardDesign(targetCardId, buildCardDesignPayload(designSettings));
            }

            // If QR config exists, persist it for the selected card.
            if (qrConfig && targetCardId) {
                await updateCardQR(targetCardId, qrConfig);
            }

            // If contents from step 1 exist, persist them for the selected card.
            if (cardContent && targetCardId) {
                await updateCardContent(targetCardId, cardContent);
            }

            setShowCampaignModal(false);
            setShowSuccessModal(true);
        } catch (error) {
            console.error("Error saving card:", error);
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
            {showCampaignModal && <CampaignNameModal onCancel={handleClose} onSave={handleCampaignSave} />}
            {showSuccessModal && <SavedSuccessModal onCancel={handleClose} onDashboard={handleDashboard} cardSlug={createdSlug} />}

            {/* ── Stepper Header ── */}
            <div className="flex items-center justify-center gap-2 px-8 py-5 border-b border-[#008001]/20 bg-[#0a0f0a]">
                {STEPS.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-2">
                        <button
                            onClick={() => handleStepClick(s.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-all cursor-pointer
                ${step === s.id
                                    ? "bg-[#008001] text-white"
                                    : step > s.id
                                        ? "bg-[#008001]/30 text-[#49B618]"
                                        : "bg-[#1a1f1a] text-[#A0A0A0] hover:bg-[#1a1f1a]/80 hover:text-white"
                                }`}
                        >
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold
                ${step === s.id ? "bg-white text-[#008001]" : "bg-current/20"}`}>
                                {step > s.id ? "✓" : s.id}
                            </span>
                            {s.label}
                        </button>
                        {i < STEPS.length - 1 && (
                            <div className={`w-8 h-px ${step > s.id ? "bg-[#008001]" : "bg-[#333]"}`} />
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
                        onContentChange={setCardContent}
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
                    />
                )}
            </div>

            {/* ── Navigation Buttons ── */}
            <div className="flex justify-between items-center px-8 py-4 border-t border-[#008001]/20 bg-[#0a0f0a]">
                <button
                    onClick={() => setStep((prev) => Math.max(1, prev - 1))}
                    disabled={step === 1}
                    className="px-5 py-2 rounded-lg border border-[#008001]/40 text-[#A0A0A0] text-sm
            hover:border-[#008001] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    ← Back
                </button>

                <span className="text-xs text-[#A0A0A0]">Step {step} of {STEPS.length}</span>

                {step < STEPS.length ? (
                    <button
                        onClick={handleNext}
                        className="px-5 py-2 rounded-lg bg-[#008001] text-white text-sm font-semibold hover:bg-[#49B618] transition-all"
                    >
                        Next →
                    </button>
                ) : (
                    <button
                        onClick={handleSaveFinish}
                        disabled={isSaving}
                        className="px-5 py-2 rounded-lg bg-[#49B618] text-white text-sm font-semibold hover:bg-[#008001] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSaving ? "Saving..." : "Save & Finish ✓"}
                    </button>
                )}
            </div>
        </div>
    );
}

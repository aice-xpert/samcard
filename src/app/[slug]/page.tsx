"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  Link2,
  Share2,
  QrCode,
  Check,
  Upload,
  ChevronRight,
  MessageSquare,
  Briefcase,
  Linkedin,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Calendar,
  Video as VideoIcon,
} from "lucide-react";
import {
  QRWithShape,
  STICKER_DEFS,
} from "@/components/dashboard/pages/Qrrenderers";
import { makeQRMatrix } from "@/components/dashboard/pages/qr-engine";
import { LOGOS } from "@/components/dashboard/pages/constants";
import { getCardQRConfig } from "@/lib/api";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") || "";

const PUBLIC_BASE =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
  "https://samcard.vercel.app";

const normalizePhoneBgType = (value: unknown): "solid" | "gradient" => {
  if (typeof value !== "string") return "solid";
  return value.toLowerCase() === "gradient" ? "gradient" : "solid";
};

const resolveAssetUrl = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  // Keep already-resolved URLs and inline sources unchanged.
  if (/^(https?:|data:|blob:)/i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;

  const cleaned = trimmed.replace(/^\/+/, "");
  const base =
    BACKEND_URL ||
    PUBLIC_BASE ||
    (typeof window !== "undefined" ? window.location.origin : "");

  if (!base) return trimmed;
  return `${base.replace(/\/$/, "")}/${cleaned}`;
};

// ── Types ──────────────────────────────────────────────────────────

interface QRConfig {
  shapeId: string;
  dotShape: string;
  finderStyle: string;
  eyeBall: string;
  bodyScale: number;
  fg: string;
  bg: string;
  accentFg?: string;
  accentBg?: string;
  strokeEnabled: boolean;
  strokeColor: string;
  gradEnabled: boolean;
  gradStops: { offset: number; color: string }[];
  gradAngle: number;
  selectedLogo?: string;
  customLogoUrl?: string;
  logoBg?: string;
  stickerId?: string | null;
  decorateImageUrl?: string;
}

interface PublicCard {
  id: string;
  name: string;
  slug: string;
  status: string;
  headingText?: string;
  headingBodyText?: string;
  design: {
    accentColor: string;
    accentLight: string;
    bgColor: string;
    cardColor: string;
    textPrimary: string;
    textMuted: string;
    phoneBgPreset?: string;
    phoneBgColor1: string;
    phoneBgColor2: string;
    phoneBgAngle: number;
    phoneBgType: string;
    font: string;
    bodyFontSize: number;
    nameFontSize: number;
    boldHeadings: boolean;
    cardRadius: number;
    shadowIntensity: string;
    glowEffect: boolean;
  };
  content: {
    profileImage: string;
    brandLogo: string;
    logoPosition: string;
    formData: {
      name: string;
      title: string;
      company: string;
      tagline: string;
      email: string;
      phone: string;
      website: string;
      location: string;
      industry?: string;
      yearFounded?: string;
      appointmentUrl?: string;
      headingText?: string;
      bodyText?: string;
    };
    connectFields: { type: string; label: string; value: string }[];
    sections: {
      profile: boolean;
      headingText: boolean;
      contactUs: boolean;
      socialLinks: boolean;
      links: boolean;
      appointment: boolean;
      collectContacts: boolean;
      businessDetails: boolean;
    };
    customLinks: { label: string; url: string }[];
    extraSections: {
      id: string;
      type: string;
      label: string;
      enabled: boolean;
      data: Record<string, unknown>;
    }[];
  };
  socialLinks: {
    platform: string;
    handle: string;
    url: string;
    label: string;
    displayOrder: number;
    enabled: boolean;
  }[];
  businessProfile: {
    name: string;
    title?: string;
    company?: string;
    tagline?: string;
    profileImageUrl?: string;
    primaryEmail?: string;
    primaryPhone?: string;
    website?: string;
    city?: string;
    country?: string;
  };
  qrConfig?: QRConfig;
}

// ── Helpers ────────────────────────────────────────────────────────

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("_sc_vid");
  if (!id) {
    id = Math.random().toString(36).slice(2);
    localStorage.setItem("_sc_vid", id);
  }
  return id;
}

function track(slug: string, type: string) {
  fetch(`${BACKEND_URL}/api/public/cards/${slug}/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, visitorId: getVisitorId() }),
  }).catch(() => {});
}

function openLink(url: string) {
  if (!url) return;
  window.open(
    url.startsWith("http") ? url : `https://${url}`,
    "_blank",
    "noopener,noreferrer",
  );
}

const SOCIAL_META: Record<
  string,
  { Icon: React.ElementType; color: string; label: string }
> = {
  linkedin: { Icon: Linkedin, color: "#0a66c2", label: "LinkedIn" },
  instagram: { Icon: Instagram, color: "#e1306c", label: "Instagram" },
  twitter: { Icon: Twitter, color: "#1da1f2", label: "Twitter" },
  facebook: { Icon: Facebook, color: "#1877f2", label: "Facebook" },
  youtube: { Icon: Youtube, color: "#ff0000", label: "YouTube" },
};

// ── Dynamic QR ─────────────────────────────────────────────────────

function DynamicQR({
  qrConfig,
  cardUrl,
  size = 160,
}: {
  qrConfig: QRConfig | null | undefined;
  cardUrl: string;
  size?: number;
}) {
  const { matrix, N } = useMemo(() => makeQRMatrix(cardUrl), [cardUrl]);

  const decoratedImageUrl = useMemo(
    () => resolveAssetUrl(qrConfig?.decorateImageUrl),
    [qrConfig?.decorateImageUrl],
  );

  const sticker = useMemo(() => {
    if (!qrConfig?.stickerId) return null;
    return STICKER_DEFS.find((s) => s.id === qrConfig.stickerId) ?? null;
  }, [qrConfig?.stickerId]);

  const logoEntry = useMemo(() => {
    if (!qrConfig?.selectedLogo?.startsWith("logo-")) return null;
    const idx = parseInt(qrConfig.selectedLogo.replace("logo-", ""), 10);
    return isNaN(idx) ? null : LOGOS[idx];
  }, [qrConfig?.selectedLogo]);

  const customLogoUrl = useMemo(
    () => resolveAssetUrl(qrConfig?.customLogoUrl),
    [qrConfig?.customLogoUrl],
  );

  const selectedLogo = useMemo(() => {
    const raw = qrConfig?.selectedLogo?.trim() || "";
    if (raw.startsWith("logo-")) return raw;
    if (raw === "custom" || customLogoUrl) return "custom";
    return raw || null;
  }, [qrConfig?.selectedLogo, customLogoUrl]);

  const isSquareShape = !qrConfig?.shapeId || qrConfig.shapeId === 'square' || qrConfig.shapeId === 'rounded-square';
  const RING_PAD = sticker ? (isSquareShape ? 60 : 32) : 0;
  const OUTER = size + RING_PAD * 2;
  const gradId = "pub-qr-grad";
  const clipId = "pub-qr-clip";
  const fg = qrConfig?.fg ?? "#000000";
  const bg = qrConfig?.bg ?? "#ffffff";

  if (decoratedImageUrl) {
    return (
      <img
        src={decoratedImageUrl}
        alt="QR code"
        width={size}
        height={size}
        style={{
          display: "block",
          width: size,
          height: size,
          objectFit: "contain",
          borderRadius: 10,
          background: qrConfig?.bg ?? "#ffffff",
        }}
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${OUTER} ${OUTER}`}
      style={{ display: "block", borderRadius: 10 }}
    >
      {qrConfig?.gradEnabled && (qrConfig.gradStops?.length ?? 0) >= 2 && (
        <defs>
          <linearGradient
            id={gradId}
            x1={`${50 - 50 * Math.cos(((qrConfig.gradAngle ?? 135) * Math.PI) / 180)}%`}
            y1={`${50 - 50 * Math.sin(((qrConfig.gradAngle ?? 135) * Math.PI) / 180)}%`}
            x2={`${50 + 50 * Math.cos(((qrConfig.gradAngle ?? 135) * Math.PI) / 180)}%`}
            y2={`${50 + 50 * Math.sin(((qrConfig.gradAngle ?? 135) * Math.PI) / 180)}%`}
          >
            {qrConfig.gradStops.map((s, i) => (
              <stop key={i} offset={`${s.offset * 100}%`} stopColor={s.color} />
            ))}
          </linearGradient>
        </defs>
      )}
      <rect width={OUTER} height={OUTER} fill={bg} rx={10} />
      <g transform={sticker ? `translate(${RING_PAD},${RING_PAD})` : undefined}>
        <QRWithShape
          shapeId={qrConfig?.shapeId ?? "square"}
          dotShape={qrConfig?.dotShape ?? "square"}
          finderStyle={qrConfig?.finderStyle ?? "square"}
          fg={qrConfig?.gradEnabled ? `url(#${gradId})` : fg}
          bg={bg}
          accentFg={qrConfig?.accentFg}
          accentBg={qrConfig?.accentBg}
          scale={qrConfig?.bodyScale ?? 1.0}
          eyeBall={qrConfig?.eyeBall ?? "square"}
          size={size}
          strokeEnabled={qrConfig?.strokeEnabled ?? false}
          strokeColor={qrConfig?.strokeColor ?? "#000000"}
          selectedLogo={selectedLogo}
          customLogoUrl={customLogoUrl}
          logoNode={logoEntry?.icon ?? null}
          logoBg={logoEntry?.bg ?? qrConfig?.logoBg ?? "#ffffff"}
          clipId={clipId}
          qrMatrix={matrix}
          qrN={N}
        />
      </g>
      {sticker && sticker.render(OUTER, size)}
    </svg>
  );
}

// ── Sub-components ─────────────────────────────────────────────────

function SectionHeader({
  icon,
  title,
  T,
}: {
  icon: React.ReactNode;
  title: string;
  T: {
    green: string;
    greenLight: string;
    cardBorder: string;
    textPrimary: string;
    bodyFontSize: number;
    boldHeadings: boolean;
  };
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 16px",
        borderBottom: `1px solid ${T.cardBorder}`,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          flexShrink: 0,
          background: `linear-gradient(135deg,${T.green},${T.greenLight})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>
      <span
        style={{
          fontWeight: T.boldHeadings ? 700 : 500,
          fontSize: T.bodyFontSize + 1,
          color: T.textPrimary,
        }}
      >
        {title}
      </span>
    </div>
  );
}

function Divider({ color }: { color: string }) {
  return <div style={{ height: 1, background: color, margin: "0 16px" }} />;
}

function CardBlock({
  children,
  T,
}: {
  children: React.ReactNode;
  T: { card: string; cardBorder: string; cardRadius: number };
}) {
  return (
    <div
      style={{
        margin: "0 12px 10px",
        background: T.card,
        border: `1px solid ${T.cardBorder}`,
        borderRadius: T.cardRadius,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

// ── Extra Section Block ────────────────────────────────────────────

function ExtraSectionBlock({
  section,
  T,
  onLinkClick,
}: {
  section: {
    id: string;
    type: string;
    label: string;
    enabled: boolean;
    data: Record<string, unknown>;
  };
  T: {
    card: string;
    cardBorder: string;
    cardRadius: number;
    green: string;
    greenLight: string;
    textPrimary: string;
    textMuted: string;
    divider: string;
    bodyFontSize: number;
    boldHeadings: boolean;
    fontFamily: string;
  };
  onLinkClick: () => void;
}) {
  const d = section.data;

  function str(key: string): string {
    const v = d[key];
    return typeof v === "string" ? v : "";
  }

  switch (section.type) {
    case "extra-button": {
      const btnLabel = str("btnLabel");
      const btnUrl = str("btnUrl");
      if (!btnLabel && !btnUrl) return null;
      return (
        <div style={{ margin: "0 12px 10px" }}>
          <button
            onClick={() => { onLinkClick(); openLink(btnUrl); }}
            style={{
              width: "100%",
              padding: "12px",
              fontWeight: 700,
              color: "#fff",
              background: `linear-gradient(135deg, ${T.green}, ${T.greenLight})`,
              border: "none",
              borderRadius: T.cardRadius,
              fontSize: T.bodyFontSize,
              fontFamily: T.fontFamily,
              cursor: "pointer",
            }}
          >
            {btnLabel || "Click Here"}
          </button>
        </div>
      );
    }
    case "extra-video": {
      const videoUrl = str("videoUrl");
      if (!videoUrl) return null;
      return (
        <div
          style={{
            margin: "0 12px 10px",
            background: T.card,
            border: `1px solid ${T.cardBorder}`,
            borderRadius: T.cardRadius,
            overflow: "hidden",
          }}
        >
          <button
            onClick={() => { onLinkClick(); openLink(videoUrl); }}
            style={{
              width: "100%",
              height: 96,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${T.green}, ${T.greenLight})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <VideoIcon size={20} color="#fff" />
            </div>
            <span style={{ fontSize: T.bodyFontSize, color: T.textMuted, fontFamily: T.fontFamily }}>
              Watch Video
            </span>
          </button>
        </div>
      );
    }
    case "extra-hours": {
      const days = ["Monday–Friday", "Saturday", "Sunday"];
      const hasAny = days.some((day) => str(day));
      if (!hasAny) return null;
      return (
        <div
          style={{
            margin: "0 12px 10px",
            background: T.card,
            border: `1px solid ${T.cardBorder}`,
            borderRadius: T.cardRadius,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 16px",
              borderBottom: `1px solid ${T.divider}`,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                flexShrink: 0,
                background: `linear-gradient(135deg, ${T.green}, ${T.greenLight})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
              }}
            >
              🕐
            </div>
            <span
              style={{
                fontWeight: T.boldHeadings ? 700 : 500,
                fontSize: T.bodyFontSize + 1,
                color: T.textPrimary,
                fontFamily: T.fontFamily,
              }}
            >
              Business Hours
            </span>
          </div>
          {days.map((day) => {
            const val = str(day);
            return val ? (
              <div
                key={day}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 16px",
                }}
              >
                <span style={{ fontSize: T.bodyFontSize, color: T.textMuted, fontFamily: T.fontFamily }}>
                  {day}
                </span>
                <span
                  style={{
                    fontWeight: T.boldHeadings ? 500 : 400,
                    fontSize: T.bodyFontSize,
                    color: T.textPrimary,
                    fontFamily: T.fontFamily,
                  }}
                >
                  {val}
                </span>
              </div>
            ) : null;
          })}
        </div>
      );
    }
    case "extra-products": {
      const productName = str("productName");
      const price = str("price");
      const buyUrl = str("buyUrl");
      if (!productName) return null;
      return (
        <div
          style={{
            margin: "0 12px 10px",
            background: T.card,
            border: `1px solid ${T.cardBorder}`,
            borderRadius: T.cardRadius,
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "12px 16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontWeight: T.boldHeadings ? 700 : 500,
                  fontSize: T.bodyFontSize,
                  color: T.textPrimary,
                  fontFamily: T.fontFamily,
                }}
              >
                {productName}
              </span>
              {price && (
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: T.bodyFontSize + 2,
                    color: T.greenLight,
                    fontFamily: T.fontFamily,
                  }}
                >
                  {price}
                </span>
              )}
            </div>
            {buyUrl && (
              <button
                onClick={() => { onLinkClick(); openLink(buyUrl); }}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: 999,
                  border: "none",
                  background: `linear-gradient(135deg, ${T.green}, ${T.greenLight})`,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: T.bodyFontSize,
                  fontFamily: T.fontFamily,
                  cursor: "pointer",
                }}
              >
                Buy Now
              </button>
            )}
          </div>
        </div>
      );
    }
    case "extra-imagetext": {
      const heading = str("heading");
      const body = str("body");
      const imgUrl = str("imgUrl");
      if (!heading && !body && !imgUrl) return null;
      return (
        <div
          style={{
            margin: "0 12px 10px",
            background: T.card,
            border: `1px solid ${T.cardBorder}`,
            borderRadius: T.cardRadius,
            overflow: "hidden",
          }}
        >
          {imgUrl && (
            <div style={{ width: "100%", maxHeight: 140, overflow: "hidden" }}>
              <img
                src={imgUrl}
                alt={heading || ""}
                style={{ width: "100%", maxHeight: 140, objectFit: "cover", display: "block" }}
              />
            </div>
          )}
          {(heading || body) && (
            <div style={{ padding: "12px 16px" }}>
              {heading && (
                <p
                  style={{
                    fontWeight: T.boldHeadings ? 700 : 500,
                    fontSize: T.bodyFontSize,
                    marginBottom: 4,
                    color: T.textPrimary,
                    fontFamily: T.fontFamily,
                  }}
                >
                  {heading}
                </p>
              )}
              {body && (
                <p
                  style={{
                    fontSize: T.bodyFontSize,
                    lineHeight: 1.5,
                    color: T.textMuted,
                    fontFamily: T.fontFamily,
                  }}
                >
                  {body}
                </p>
              )}
            </div>
          )}
        </div>
      );
    }
    case "extra-team":
    case "extra-customer": {
      const title = str("title");
      const desc = str("desc");
      if (!title && !desc) return null;
      return (
        <div
          style={{
            margin: "0 12px 10px",
            background: T.card,
            border: `1px solid ${T.cardBorder}`,
            borderRadius: T.cardRadius,
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "12px 16px" }}>
            {title && (
              <p
                style={{
                  fontWeight: T.boldHeadings ? 700 : 500,
                  fontSize: T.bodyFontSize,
                  marginBottom: 4,
                  color: T.textPrimary,
                  fontFamily: T.fontFamily,
                }}
              >
                {title}
              </p>
            )}
            {desc && (
              <p
                style={{
                  fontSize: T.bodyFontSize,
                  lineHeight: 1.5,
                  color: T.textMuted,
                  fontFamily: T.fontFamily,
                }}
              >
                {desc}
              </p>
            )}
          </div>
        </div>
      );
    }
    case "extra-pdf": {
      const pdfTitle = str("pdfTitle");
      const pdfUrl = str("pdfUrl");
      if (!pdfTitle && !pdfUrl) return null;
      return (
        <div
          style={{
            margin: "0 12px 10px",
            background: T.card,
            border: `1px solid ${T.cardBorder}`,
            borderRadius: T.cardRadius,
            overflow: "hidden",
          }}
        >
          <button
            onClick={() => { onLinkClick(); openLink(pdfUrl); }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
               gap: 12,
              padding: "14px 16px",
              background: "none",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                flexShrink: 0,
                background: `linear-gradient(135deg, ${T.green}, ${T.greenLight})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 18 }}>📄</span>
            </div>
            <span
              style={{
                flex: 1,
                fontWeight: T.boldHeadings ? 700 : 500,
                fontSize: T.bodyFontSize,
                color: T.textPrimary,
                fontFamily: T.fontFamily,
              }}
            >
              {pdfTitle || "Download PDF"}
            </span>
            <ChevronRight size={18} color={T.textMuted} />
          </button>
        </div>
      );
    }
    default: {
      const title = str("title");
      const bodyText = str("content");
      if (!title && !bodyText) return null;
      return (
        <div
          style={{
            margin: "0 12px 10px",
            background: T.card,
            border: `1px solid ${T.cardBorder}`,
            borderRadius: T.cardRadius,
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "12px 16px" }}>
            {title && (
              <p
                style={{
                  fontWeight: T.boldHeadings ? 700 : 500,
                  fontSize: T.bodyFontSize,
                  marginBottom: 4,
                  color: T.textPrimary,
                  fontFamily: T.fontFamily,
                }}
              >
                {title}
              </p>
            )}
            {bodyText && (
              <p
                style={{
                  fontSize: T.bodyFontSize,
                  lineHeight: 1.5,
                  color: T.textMuted,
                  fontFamily: T.fontFamily,
                }}
              >
                {bodyText}
              </p>
            )}
          </div>
        </div>
      );
    }
  }
}

// ── QR Modal ────────────────────────────────────────────────────────

function QRModal({
  onClose,
  qrConfig: initialQrConfig,
  cardId,
  cardUrl,
  T,
}: {
  onClose: () => void;
  qrConfig: QRConfig | null | undefined;
  cardId?: string | null;
  cardUrl: string;
  T: {
    bg: string;
    card: string;
    green: string;
    greenLight: string;
    cardBorder: string;
    textPrimary: string;
    textMuted: string;
    cardRadius: number;
    bodyFontSize: number;
    boldHeadings: boolean;
    fontFamily: string;
  };
}) {
  const [qrConfig, setQrConfig] = useState(initialQrConfig);
  const fetched = useRef(false);

  useEffect(() => {
    if (qrConfig || !cardId || fetched.current) return;
    fetched.current = true;

    getCardQRConfig(cardId)
      .then((data) => {
        if (data) setQrConfig(data);
      })
      .catch(() => {});
  }, [cardId]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: T.card,
          border: `1px solid ${T.cardBorder}`,
          borderRadius: T.cardRadius + 4,
          padding: 28,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          boxShadow: `0 0 80px ${T.green}44`,
          maxWidth: 320,
          width: "100%",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 700,
            color: T.textPrimary,
            fontFamily: T.fontFamily,
          }}
        >
          Scan to View Card
        </h3>
        <div
          style={{
            padding: 12,
            borderRadius: 16,
            background: qrConfig?.bg ?? "#ffffff",
            border: `2px solid ${T.green}44`,
            boxShadow: `0 0 24px ${T.green}33`,
          }}
        >
          <DynamicQR qrConfig={qrConfig} cardUrl={cardUrl} size={200} />
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 11,
            color: T.textMuted,
            textAlign: "center",
            wordBreak: "break-all",
            fontFamily: T.fontFamily,
          }}
        >
          {cardUrl}
        </p>
        <button
          onClick={onClose}
          style={{
            padding: "10px 28px",
            borderRadius: 999,
            border: "none",
            background: `linear-gradient(135deg, ${T.green}, ${T.greenLight})`,
            color: "#fff",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            fontFamily: T.fontFamily,
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ── Loading ────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0a0f0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "3px solid #008001",
          borderTopColor: "transparent",
          animation: "spin 0.7s linear infinite",
        }}
      />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ── Not Found ──────────────────────────────────────────────────────

function NotFoundScreen() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0a0f0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
      }}
    >
      <div style={{ fontSize: 56 }}>🃏</div>
      <h1
        style={{ margin: 0, color: "#f0f0f0", fontSize: 22, fontWeight: 700 }}
      >
        Card not found
      </h1>
      <p style={{ margin: 0, color: "#7a9a7a", fontSize: 14 }}>
        This card may have been removed or the link is incorrect.
      </p>
      <a href="/" style={{ marginTop: 8, color: "#49B618", fontSize: 13 }}>
        ← Go to SamCard
      </a>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────

export default function PublicCardPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [card, setCard] = useState<PublicCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contactSaved, setContactSaved] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: "", email: "", phone: "" });
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSubmitFeedback, setLeadSubmitFeedback] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  useEffect(() => {
    if (!slug) return;
    const isPreview =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("preview") === "true";
    const url = `${BACKEND_URL}/api/public/cards/${slug}${isPreview ? "?preview=true" : ""}`;
    console.log("[public-card-page] fetching card", { slug, url, isPreview });
    fetch(url)
      .then((r) => {
        console.log("[public-card-page] fetch status", {
          slug,
          status: r.status,
          ok: r.ok,
        });
        if (r.status === 404) {
          setNotFound(true);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data) {
          console.log("[public-card-page] fetched background payload", {
            slug,
            design: {
              bgColor: data?.design?.bgColor,
              phoneBgType: data?.design?.phoneBgType,
              phoneBgColor1: data?.design?.phoneBgColor1,
              phoneBgColor2: data?.design?.phoneBgColor2,
              phoneBgAngle: data?.design?.phoneBgAngle,
            },
          });
          setCard(data);
          track(slug, "view");
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!card) return;

    const design = card.design;
    const phoneBgType = normalizePhoneBgType(design.phoneBgType);
    const resolvedBackground =
      phoneBgType === "gradient" &&
      design.phoneBgColor1 &&
      design.phoneBgColor2
        ? `linear-gradient(${design.phoneBgAngle || 135}deg, ${design.phoneBgColor1}, ${design.phoneBgColor2})`
        : design.phoneBgColor1 || design.bgColor || "#0a0f0a";

    console.log("[public-card-page] resolved background", {
      slug,
      design: {
        bgColor: design.bgColor,
        phoneBgType,
        phoneBgColor1: design.phoneBgColor1,
        phoneBgColor2: design.phoneBgColor2,
        phoneBgAngle: design.phoneBgAngle,
      },
      pageBg: resolvedBackground,
    });
  }, [card, slug]);

  const cardUrl = `${PUBLIC_BASE}/${slug}`;

  const copyLink = useCallback(async () => {
    await navigator.clipboard.writeText(window.location.href).catch(() => {});
    setCopied(true);
    track(slug, "share");
    setTimeout(() => setCopied(false), 2000);
  }, [slug]);

  // Download vCard / Add to Contacts
  const saveContact = useCallback(() => {
    if (!card) return;
    const fd = card.content.formData;
    const bp = card.businessProfile;
    const name = fd.name || bp.name || "";
    const vcf = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${name}`,
      fd.title || bp.title ? `TITLE:${fd.title || bp.title}` : "",
      fd.company || bp.company ? `ORG:${fd.company || bp.company}` : "",
      fd.email || bp.primaryEmail ? `EMAIL:${fd.email || bp.primaryEmail}` : "",
      fd.phone || bp.primaryPhone ? `TEL:${fd.phone || bp.primaryPhone}` : "",
      fd.website || bp.website
        ? `URL:${(fd.website || bp.website || "").startsWith("http") ? fd.website || bp.website : `https://${fd.website || bp.website}`}`
        : "",
      "END:VCARD",
    ]
      .filter(Boolean)
      .join("\r\n");
    const blob = new Blob([vcf], { type: "text/vcard" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${name.replace(/\s+/g, "_") || "contact"}.vcf`;
    a.click();
    URL.revokeObjectURL(a.href);
    setContactSaved(true);
    track(slug, "save");
  }, [card, slug]);

  const submitLead = useCallback(async () => {
    if (!slug || leadSubmitting) return;

    const name = leadForm.name.trim();
    const email = leadForm.email.trim();
    const phone = leadForm.phone.trim();

    if (!name && !email && !phone) {
      setLeadSubmitFeedback({
        type: "error",
        message: "Please provide at least name, email, or phone.",
      });
      return;
    }

    setLeadSubmitting(true);
    setLeadSubmitFeedback({ type: null, message: "" });

    try {
      const searchParams =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search)
          : null;
      const isPreview = searchParams?.get("preview") === "true";
      const leadsUrl = `${BACKEND_URL}/api/public/cards/${slug}/leads${isPreview ? "?preview=true" : ""}`;

      const response = await fetch(leadsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: email || null,
          phone: phone || null,
          source: "DIRECT",
          utmSource: searchParams?.get("utm_source") || null,
          utmCampaign: searchParams?.get("utm_campaign") || null,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 409) {
          setLeadSubmitFeedback({
            type: "success",
            message: "This contact was already submitted.",
          });
          track(slug, "contact_submit");
          return;
        }
        throw new Error(payload?.error || `Failed to submit (${response.status})`);
      }

      setLeadForm({ name: "", email: "", phone: "" });
      setLeadSubmitFeedback({
        type: "success",
        message: "Successfully submitted!",
      });
      track(slug, "contact_submit");
    } catch (error) {
      setLeadSubmitFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to submit contact details.",
      });
    } finally {
      setLeadSubmitting(false);
    }
  }, [leadForm, leadSubmitting, slug]);

  if (loading) return <LoadingScreen />;
  if (notFound || !card) return <NotFoundScreen />;

  const { design: D, content, socialLinks, businessProfile } = card;
  const fd = content.formData;
  const S = content.sections;

  const T = {
    bg: D.bgColor || "#0a0f0a",
    card: D.cardColor || "#111a11",
    cardBorder: `${D.accentColor}33`,
    green: D.accentColor || "#008001",
    greenLight: D.accentLight || "#49B618",
    muted: "#3a4a3a",
    textPrimary: D.textPrimary || "#f0f0f0",
    textMuted: D.textMuted || "#7a9a7a",
    divider: `${D.accentColor}20`,
    fontFamily: D.font === "inter" ? "Inter, sans-serif" : D.font || "inherit",
    nameFontSize: D.nameFontSize ?? 22,
    bodyFontSize: D.bodyFontSize ?? 13,
    boldHeadings: D.boldHeadings ?? true,
    cardRadius: D.cardRadius ?? 16,
  };

// In [slug]/page.tsx — add this lookup before pageBg computation
const PRESET_STYLES: Record<string, string> = {
  'aurora': 'linear-gradient(160deg, #0a0a0a 0%, #003322 25%, #006644 50%, #004422 70%, #001133 85%, #0a0a0a 100%)',
  'deep-space': 'radial-gradient(ellipse at 20% 80%, #0f2027 0%, #203a43 45%, #2c5364 100%)',
  'midnight-purple': 'radial-gradient(ellipse at 60% 10%, #2d0855 0%, #1a0533 40%, #0d0118 70%, #050010 100%)',
  'sunset-dusk': 'linear-gradient(170deg, #1a0500 0%, #3d1000 30%, #2a0a00 55%, #1a0800 75%, #000 100%)',
  'ocean-depth': 'radial-gradient(ellipse at 30% 20%, #003366 0%, #001f3f 40%, #000d1a 75%, #000510 100%)',
  'volcanic': 'radial-gradient(ellipse at 50% 90%, #3d0000 0%, #2d0000 30%, #1a0000 60%, #050000 100%)',
};

const pageBg = (() => {
  // 1. If a named preset is set (and it's not 'custom'), use its CSS directly
  if (D.phoneBgPreset && D.phoneBgPreset !== 'custom' && PRESET_STYLES[D.phoneBgPreset]) {
    return PRESET_STYLES[D.phoneBgPreset];
  }
  // 2. Custom or fallback: use raw colors
  const phoneBgType = normalizePhoneBgType(D.phoneBgType);
  if (phoneBgType === 'gradient' && D.phoneBgColor1 && D.phoneBgColor2) {
    return `linear-gradient(${D.phoneBgAngle || 135}deg, ${D.phoneBgColor1}, ${D.phoneBgColor2})`;
  }
  if (D.phoneBgColor1) return D.phoneBgColor1;
  return D.bgColor || '#0a0f0a';
})();

  const hasBrandLogo = !!content.brandLogo?.trim();

  const contactItems = [
    fd.phone && {
      label: "Call Us",
      sub: fd.phone,
      href: `tel:${fd.phone}`,
      Icon: Phone,
    },
    fd.email && {
      label: "Email",
      sub: fd.email,
      href: `mailto:${fd.email}`,
      Icon: Mail,
    },
    fd.location && {
      label: "Address",
      sub: fd.location,
      href: `https://maps.google.com/?q=${encodeURIComponent(fd.location)}`,
      Icon: MapPin,
    },
    fd.website && {
      label: "Website",
      sub: fd.website,
      href: fd.website.startsWith("http")
        ? fd.website
        : `https://${fd.website}`,
      Icon: Globe,
    },
  ].filter(Boolean) as {
    label: string;
    sub: string;
    href: string;
    Icon: React.ElementType;
  }[];

  return (
    <>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        html,body{height:100%;overflow-x:hidden;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:${T.green}66;border-radius:99px;}
        a{text-decoration:none;color:inherit;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:none;}}
        .sc-card{animation:fadeUp .45s ease both;}
        .sc-row:hover{background:${T.green}12!important;}
      `}</style>

      {/* QR modal */}
      {qrModalOpen && (
        <QRModal
          onClose={() => setQrModalOpen(false)}
          qrConfig={card.qrConfig}
          cardUrl={cardUrl}
          T={T}
          cardId={card.id}
        />
      )}

      {/* ── Full-bleed background = user's chosen phone bg ── */}
     <div style={{
  minHeight: "100dvh",
  background: pageBg,
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  padding: "0 0 80px",
  fontFamily: T.fontFamily,
  width: "100%",

  // ✅ FULL WINDOW GLOW
//   boxShadow: D.glowEffect
//     ? `
//       inset 0 0 80px ${T.green}55,
//       inset 0 0 120px ${T.greenLight}33,
//       inset 0 0 160px ${D.bgColor || "#0a0f0a"}
//     `
//     : "none",
}}>
        {/* Card column — transparent so page bg shows around edges on wider screens */}
        <div className="sc-card" style={{
  width: "100%",
  maxWidth: 480,
  minHeight: "100vh",
  background: "transparent",

  borderRadius: T.cardRadius,
}}>
          {/* ── HERO ── */}
          {S.profile && (
            <div
              style={{
                position: "relative",
                aspectRatio: "16/9",
                overflow: "hidden",
                background: "#000",
              }}
            >
              {content.profileImage ? (
                <img
                  src={content.profileImage}
                  alt={fd.name || businessProfile.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: `linear-gradient(135deg, ${T.green}88 0%, ${T.bg} 50%, ${T.greenLight}66 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 72,
                      fontWeight: 900,
                      color: T.green,
                      opacity: 0.3,
                      lineHeight: 1,
                    }}
                  >
                    {(fd.name || businessProfile.name || "?")[0].toUpperCase()}
                  </div>
                </div>
              )}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.78) 100%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: `linear-gradient(90deg, transparent, ${T.green}, ${T.greenLight}, ${T.green}, transparent)`,
                }}
              />

              {hasBrandLogo && content.logoPosition === "top-right" && (
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    zIndex: 10,
                  }}
                >
                  <div
                    style={{
                      background: "rgba(0,0,0,0.5)",
                      backdropFilter: "blur(6px)",
                      padding: 5,
                      borderRadius: 10,
                      lineHeight: 0,
                    }}
                  >
                    <img
                      src={content.brandLogo}
                      alt="Brand"
                      style={{
                        maxWidth: 48,
                        maxHeight: 48,
                        objectFit: "contain",
                        borderRadius: 7,
                      }}
                    />
                  </div>
                </div>
              )}
              {hasBrandLogo && content.logoPosition === "top-left" && (
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    zIndex: 10,
                  }}
                >
                  <div
                    style={{
                      background: "rgba(0,0,0,0.5)",
                      backdropFilter: "blur(6px)",
                      padding: 5,
                      borderRadius: 10,
                      lineHeight: 0,
                    }}
                  >
                    <img
                      src={content.brandLogo}
                      alt="Brand"
                      style={{
                        maxWidth: 48,
                        maxHeight: 48,
                        objectFit: "contain",
                        borderRadius: 7,
                      }}
                    />
                  </div>
                </div>
              )}

              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "12px 20px 16px",
                  zIndex: 10,
                }}
              >
                <h1
                  style={{
                    color: "#fff",
                    fontSize: T.nameFontSize,
                    lineHeight: 1.15,
                    fontWeight: T.boldHeadings ? 800 : 600,
                    textShadow: "0 2px 12px rgba(0,0,0,0.8)",
                  }}
                >
                  {fd.name || businessProfile.name}
                </h1>
                {(fd.title || businessProfile.title) && (
                  <p
                    style={{
                      color: T.greenLight,
                      fontSize: T.bodyFontSize,
                      marginTop: 3,
                      fontWeight: 500,
                    }}
                  >
                    {fd.title || businessProfile.title}
                  </p>
                )}
                {(fd.company || businessProfile.company || (hasBrandLogo && content.logoPosition === "below-name")) && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginTop: 2,
                    }}
                  >
                    {hasBrandLogo && content.logoPosition === "below-name" && (
                      <div
                        style={{
                          background: "rgba(0,0,0,0.45)",
                          padding: "2px 4px",
                          borderRadius: 5,
                          lineHeight: 0,
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={content.brandLogo}
                          alt="Brand"
                          style={{ maxWidth: 22, maxHeight: 22, objectFit: "contain", borderRadius: 3 }}
                        />
                      </div>
                    )}
                    {(fd.company || businessProfile.company) && (
                      <p
                        style={{
                          color: "rgba(255,255,255,0.6)",
                          fontSize: T.bodyFontSize - 1,
                        }}
                      >
                        {fd.company || businessProfile.company}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {hasBrandLogo && content.logoPosition === "below-photo" && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "12px 0",
              }}
            >
              <div
                style={{
                  background: T.card,
                  border: `1px solid ${T.cardBorder}`,
                  borderRadius: 12,
                  padding: "8px 14px",
                  lineHeight: 0,
                }}
              >
                <img
                  src={content.brandLogo}
                  alt="Brand"
                  style={{ maxWidth: 80, maxHeight: 40, objectFit: "contain" }}
                />
              </div>
            </div>
          )}

          {S.profile && (fd.tagline || businessProfile.tagline) && (
            <p
              style={{
                padding: "10px 20px",
                textAlign: "center",
                color: T.textMuted,
                fontSize: T.bodyFontSize,
                fontStyle: "italic",
                lineHeight: 1.6,
              }}
            >
              {fd.tagline || businessProfile.tagline}
            </p>
          )}

          {S.profile && contactItems.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 12,
                margin: "0 12px 10px",
                background: T.card,
                border: `1px solid ${T.cardBorder}`,
                borderRadius: T.cardRadius,
                padding: "12px 16px",
              }}
            >
              {contactItems.slice(0, 4).map(({ href, Icon }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track(slug, "link_click")}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${T.green}, ${T.greenLight})`,
                      boxShadow: `0 4px 12px ${T.green}55`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={18} color="#fff" />
                  </div>
                </a>
              ))}
            </div>
          )}

          {S.headingText && (card.headingText || card.headingBodyText || fd.headingText || fd.bodyText) && (
            <CardBlock T={T}>
              <div style={{ padding: "12px 16px" }}>
                {(card.headingText || fd.headingText) && (
                  <p
                    style={{
                      fontWeight: T.boldHeadings ? 700 : 500,
                      fontSize: T.bodyFontSize + 1,
                      color: T.textPrimary,
                      marginBottom: 4,
                    }}
                  >
                    {card.headingText || fd.headingText}
                  </p>
                )}
                {(card.headingBodyText || fd.bodyText) && (
                  <p
                    style={{
                      fontSize: T.bodyFontSize,
                      lineHeight: 1.6,
                      color: T.textMuted,
                    }}
                  >
                    {card.headingBodyText || fd.bodyText}
                  </p>
                )}
              </div>
            </CardBlock>
          )}

          {S.contactUs && contactItems.length > 0 && (
            <CardBlock T={T}>
              <SectionHeader
                T={T}
                icon={<Phone size={14} color="#fff" />}
                title="Contact Us"
              />
              {contactItems.map(({ label, sub, href, Icon }, i) => (
                <div key={i}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track(slug, "link_click")}
                    className="sc-row"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 16px",
                      color: "inherit",
                      transition: "background .15s",
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        flexShrink: 0,
                        background: `${T.green}28`,
                        border: `1px solid ${T.green}44`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Icon size={13} color={T.greenLight} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontWeight: T.boldHeadings ? 600 : 500,
                          fontSize: T.bodyFontSize,
                          color: T.textPrimary,
                        }}
                      >
                        {label}
                      </p>
                      <p
                        style={{
                          fontSize: T.bodyFontSize - 1,
                          color: T.textMuted,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {sub}
                      </p>
                    </div>
                    <ChevronRight size={14} color={T.muted} />
                  </a>
                  {i < contactItems.length - 1 && <Divider color={T.divider} />}
                </div>
              ))}
            </CardBlock>
          )}

          {S.businessDetails && (fd.company || businessProfile.company || fd.industry || fd.yearFounded || fd.location) && (
            <CardBlock T={T}>
              <SectionHeader
                T={T}
                icon={<Briefcase size={14} color="#fff" />}
                title="Business Details"
              />
              {[
                (fd.company || businessProfile.company) && {
                  label: "Company",
                  val: fd.company || businessProfile.company!,
                },
                fd.industry && { label: "Industry", val: fd.industry },
                fd.yearFounded && { label: "Year Founded", val: fd.yearFounded },
                fd.location && { label: "Location", val: fd.location },
              ]
                .filter(Boolean)
                .map((row, i, arr) => {
                  const { label, val } = row as { label: string; val: string };
                  return (
                    <div key={label}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "10px 16px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: T.bodyFontSize,
                            color: T.textMuted,
                          }}
                        >
                          {label}
                        </span>
                        <span
                          style={{
                            fontSize: T.bodyFontSize,
                            fontWeight: T.boldHeadings ? 600 : 400,
                            color: T.textPrimary,
                            maxWidth: "55%",
                            textAlign: "right",
                          }}
                        >
                          {val}
                        </span>
                      </div>
                      {i < arr.length - 1 && <Divider color={T.divider} />}
                    </div>
                  );
                })}
            </CardBlock>
          )}

          {S.socialLinks && socialLinks.filter(sl => sl.enabled !== false).length > 0 && (
            <CardBlock T={T}>
              <SectionHeader
                T={T}
                icon={<Share2 size={14} color="#fff" />}
                title="Social Links"
              />
              {socialLinks.filter(sl => sl.enabled !== false).map((sl, i, arr) => {
                const meta = SOCIAL_META[sl.platform?.toLowerCase()] ?? {
                  Icon: Link2,
                  color: T.green,
                  label: sl.platform,
                };
                const { Icon, color, label } = meta;
                return (
                  <div key={i}>
                    <button
                      onClick={() => {
                        track(slug, "link_click");
                        openLink(sl.url);
                      }}
                      className="sc-row"
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 16px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "background .15s",
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          flexShrink: 0,
                          background: `${color}1a`,
                          border: `1px solid ${color}35`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon size={16} color={color} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontWeight: T.boldHeadings ? 600 : 500,
                            fontSize: T.bodyFontSize,
                            color: T.textPrimary,
                          }}
                        >
                          {sl.label || label}
                        </p>
                        <p
                          style={{
                            fontSize: T.bodyFontSize - 1,
                            color: T.textMuted,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {sl.handle || sl.url}
                        </p>
                      </div>
                      <ChevronRight size={14} color={T.muted} />
                    </button>
                    {i < arr.length - 1 && (
                      <Divider color={T.divider} />
                    )}
                  </div>
                );
              })}
            </CardBlock>
          )}

          {S.links && content.customLinks.length > 0 && (
            <CardBlock T={T}>
              <SectionHeader
                T={T}
                icon={<Link2 size={14} color="#fff" />}
                title="Web Links"
              />
              {content.customLinks.map((cl, i) => (
                <div key={i}>
                  <button
                    onClick={() => {
                      track(slug, "link_click");
                      openLink(cl.url);
                    }}
                    className="sc-row"
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 16px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "background .15s",
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        flexShrink: 0,
                        background: `${T.green}1f`,
                        border: `1px solid ${T.green}40`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Link2 size={15} color={T.greenLight} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontWeight: T.boldHeadings ? 600 : 500,
                          fontSize: T.bodyFontSize,
                          color: T.textPrimary,
                        }}
                      >
                        {cl.label || "Link"}
                      </p>
                      <p
                        style={{
                          fontSize: T.bodyFontSize - 1,
                          color: T.textMuted,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {cl.url}
                      </p>
                    </div>
                    <ChevronRight size={14} color={T.muted} />
                  </button>
                  {i < content.customLinks.length - 1 && (
                    <Divider color={T.divider} />
                  )}
                </div>
              ))}
            </CardBlock>
          )}

          {S.appointment && fd.appointmentUrl && (
            <CardBlock T={T}>
              <div
                style={{
                  padding: "16px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${T.green}, ${T.greenLight})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Calendar size={20} color="#fff" />
                </div>
                <p
                  style={{
                    fontWeight: T.boldHeadings ? 700 : 500,
                    fontSize: T.bodyFontSize + 1,
                    color: T.textPrimary,
                  }}
                >
                  Schedule Meeting
                </p>
                <p
                  style={{
                    fontSize: T.bodyFontSize,
                    lineHeight: 1.5,
                    color: T.textMuted,
                    padding: "0 8px",
                  }}
                >
                  Book a time to discuss potential opportunities
                </p>
              </div>
              <div
                style={{
                  padding: "0 16px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {["Book on Calendly", "Add to Calendar"].map((label) => (
                  <button
                    key={label}
                    onClick={() => {
                      track(slug, "link_click");
                      openLink(fd.appointmentUrl!);
                    }}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: 999,
                      border: `1px solid ${T.green}59`,
                      color: T.greenLight,
                      background: `${T.green}1a`,
                      fontWeight: 600,
                      fontSize: T.bodyFontSize,
                      cursor: "pointer",
                      fontFamily: T.fontFamily,
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </CardBlock>
          )}

          {content.extraSections
            .filter((s) => s.enabled)
            .map((section, index) => (
              <ExtraSectionBlock
                key={section.id || `extra-sec-${index}`}
                section={section}
                T={T}
                onLinkClick={() => track(slug, "link_click")}
              />
            ))}

          {S.collectContacts && (
            <CardBlock T={T}>
              <SectionHeader
                T={T}
                icon={<MessageSquare size={14} color="#fff" />}
                title="Get in Touch"
              />
              <div
                style={{
                  padding: "12px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {[
                  { key: "name" as const, placeholder: "Your name", type: "text" },
                  { key: "email" as const, placeholder: "Email address", type: "email" },
                  { key: "phone" as const, placeholder: "Phone number", type: "tel" },
                ].map((field) => (
                  <input
                    key={field.key}
                    type={field.type}
                    value={leadForm[field.key]}
                    placeholder={field.placeholder}
                    onChange={(e) =>
                      setLeadForm((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: 10,
                      background: T.bg,
                      border: `1px solid ${T.green}33`,
                      color: T.textPrimary,
                      fontSize: T.bodyFontSize,
                      outline: "none",
                      fontFamily: T.fontFamily,
                    }}
                  />
                ))}
                <button
                  onClick={submitLead}
                  disabled={leadSubmitting}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: 999,
                    border: "none",
                    background: `linear-gradient(135deg, ${T.green}, ${T.greenLight})`,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: T.bodyFontSize,
                    cursor: leadSubmitting ? "not-allowed" : "pointer",
                    opacity: leadSubmitting ? 0.8 : 1,
                    fontFamily: T.fontFamily,
                  }}
                >
                  {leadSubmitting ? "Submitting..." : "Submit"}
                </button>
                {leadSubmitFeedback.type && (
                  <p
                    style={{
                      marginTop: 4,
                      fontSize: T.bodyFontSize - 1,
                      color:
                        leadSubmitFeedback.type === "success"
                          ? T.greenLight
                          : "#ff7a7a",
                    }}
                  >
                    {leadSubmitFeedback.message}
                  </p>
                )}
              </div>
            </CardBlock>
          )}

          <div style={{ height: 80 }} />
        </div>
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 16,
          left: 16,
          display: "flex",
          gap: 8,
          zIndex: 100,
        }}
      >
        <button
          onClick={() => setQrModalOpen(true)}
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: `1px solid ${T.green}4d`,
            background: "rgba(0,128,1,0.15)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <QrCode size={16} color={T.greenLight} />
        </button>

        <button
          onClick={copyLink}
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: `1px solid ${T.green}4d`,
            background: "rgba(0,0,0,0.25)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {copied ? (
            <Check size={16} color={T.greenLight} />
          ) : (
            <Upload size={16} color={T.textMuted} />
          )}
        </button>
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 100,
        }}
      >
        <button
          onClick={saveContact}
          style={{
            padding: "12px 20px",
            borderRadius: 999,
            border: "none",
            cursor: "pointer",
            background: contactSaved
              ? T.greenLight
              : `linear-gradient(135deg, ${T.green}, ${T.greenLight})`,
            color: "#fff",
            fontWeight: 700,
            fontSize: 14,
            boxShadow: `0 4px 16px ${T.green}55`,
          }}
        >
          {contactSaved ? "✓ Saved!" : "Add to Contact"}
        </button>
      </div>
    </>
  );
}

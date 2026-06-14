"use client";

import { useEffect, useState, useCallback, useMemo, Fragment } from "react";
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

const parseJsonbArray = (value: unknown): string[] | null => {
  if (Array.isArray(value)) {
    const items = value.filter((item): item is string => typeof item === "string");
    return items.length > 0 ? items : null;
  }

  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    const inner = trimmed.slice(1, -1);
    if (!inner) return null;
    const items = inner
      .split(",")
      .map((item) => item.replace(/^"(.*)"$/, "$1").trim())
      .filter((item): item is string => item.length > 0);
    return items.length > 0 ? items : null;
  }

  try {
    const parsed = JSON.parse(trimmed);
    if (typeof parsed === "string") {
      const inner = JSON.parse(parsed);
      if (Array.isArray(inner)) {
        const items = inner.filter((item): item is string => typeof item === "string");
        return items.length > 0 ? items : null;
      }
      return null;
    }
    if (Array.isArray(parsed)) {
      const items = parsed.filter((item): item is string => typeof item === "string");
      return items.length > 0 ? items : null;
    }
  } catch {
    // ignore malformed JSON
  }

  return null;
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
    palette: string;
    heroLayout?: string;
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
    // Drag-and-drop section ordering persisted by the backend
    sectionOrder?: string[];
    unifiedOrder?: string[];
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
  }).catch(() => { });
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
  cardUrl,
  T,
}: {
  onClose: () => void;
  qrConfig: QRConfig | null | undefined;
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
  // The QR config comes straight from the public card payload
  // (/api/public/cards/:slug). We deliberately do NOT fall back to the
  // authenticated /api/user/cards/:id/qr endpoint here: that only works for the
  // logged-in owner and would hide a missing-persistence bug from anonymous
  // visitors (the QR would render for the owner but no one else).
  const [qrConfig] = useState(initialQrConfig);

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
  const [leadFormErrors, setLeadFormErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
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
    fetch(url, { cache: "no-store" })
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
          track(data.slug || slug, "view");
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
  const apiSlug = card?.slug || slug;

  const trackEvent = useCallback((type: string) => {
    if (!apiSlug) return;
    track(apiSlug, type);
  }, [apiSlug]);

  const copyLink = useCallback(async () => {
    await navigator.clipboard.writeText(window.location.href).catch(() => { });
    setCopied(true);
    trackEvent("share");
    setTimeout(() => setCopied(false), 2000);
  }, [trackEvent]);

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
    trackEvent("save");
  }, [card, trackEvent]);

  const submitLead = useCallback(async () => {
    if (!apiSlug || leadSubmitting) return;

    const name = leadForm.name.trim();
    const email = leadForm.email.trim();
    const phone = leadForm.phone.trim();

    // Field-level validation
    const errors: { name?: string; email?: string; phone?: string } = {};
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Enter a valid email address";
    }
    if (phone && !/^[+\d][\d\s\-().]{4,30}$/.test(phone)) {
      errors.phone = "Enter a valid phone number";
    }
    if (name && name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }
    if (!name && !email && !phone) {
      errors.name = "Please fill in at least one field";
    }
    setLeadFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLeadSubmitting(true);
    setLeadSubmitFeedback({ type: null, message: "" });

    try {
      const searchParams =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search)
          : null;
      const isPreview = searchParams?.get("preview") === "true";
      const leadsUrl = `${BACKEND_URL}/api/public/cards/${apiSlug}/leads${isPreview ? "?preview=true" : ""}`;

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
          trackEvent("contact_submit");
          return;
        }
        throw new Error(payload?.error || `Failed to submit (${response.status})`);
      }

      setLeadForm({ name: "", email: "", phone: "" });
      setLeadSubmitFeedback({
        type: "success",
        message: "Successfully submitted!",
      });
      trackEvent("contact_submit");
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
  }, [apiSlug, leadForm, leadSubmitting, trackEvent]);

  if (loading) return <LoadingScreen />;
  if (notFound || !card) return <NotFoundScreen />;

  const { design: D, content, socialLinks, businessProfile } = card;
  const fd = content.formData;
  const S = content.sections;
  // Treat undefined S.profile as true (default visible)
  const profileVisible = (S?.profile as boolean | undefined) !== false;

  const FONT_MAP: Record<string, string> = {
    inter: 'Inter, sans-serif',
    sora: 'Sora, sans-serif',
    'dm-sans': '"DM Sans", sans-serif',
    poppins: 'Poppins, sans-serif',
    raleway: 'Raleway, sans-serif',
    playfair: '"Playfair Display", serif',
    mono: '"Fira Code", monospace',
  };

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
    fontFamily: FONT_MAP[D.font] ?? 'Inter, sans-serif',
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

  // Map template palette names to hero layout variants (fallback when heroLayout not stored)
  const PALETTE_TO_HERO: Record<string, string> = {
    'medical-teal':    'wave-panel',
    'teamwork-orange': 'side-panel',
    'heritage-gold':   'wave-panel',
    'team-pro':        'group-diagonal',
    'royal-purple':    'circle-overlap',
    'minimal-mono':    'circle-center',
    'sunset-banner':   'top-banner',
    'sky-circle':      'circle-overlap',
    'onyx-pro':        'default',
    'mocha-torn':      'torn-edge',
    'navy-gold':       'wave-logo',
    'emerald-wave':    'wave-logo',
    'azure-flow':      'wave-panel',
    'rose-wave':       'wave-panel',
    'navy-amber':      'wave-logo',
    'blush-soft':      'wave-side',
    'violet-pro':      'wave-icons',
  };
  // Use stored heroLayout from DB first; fall back to palette-based derivation for legacy rows.
  // Use || not ?? so empty string from DB also falls back to 'default'.
  const heroLayout = (typeof D.heroLayout === 'string' && D.heroLayout && D.heroLayout !== 'default')
    ? D.heroLayout
    : (PALETTE_TO_HERO[D.palette] || D.heroLayout || 'default');

  const name = fd.name || businessProfile.name || '';
  const title = fd.title || businessProfile.title || '';
  const company = fd.company || businessProfile.company || '';
  const profileImg = content.profileImage || '';

  const PhotoEl = ({ height, objectFit = 'cover', objectPosition = 'center 20%', className = '' }: { height?: number | string; objectFit?: string; objectPosition?: string; className?: string }) =>
    profileImg ? (
      objectFit === 'contain' ? (
        // Blurred, zoomed copy fills the frame behind the sharp (uncropped)
        // photo so wave/curve overlays stay visible instead of flat bars.
        <div style={{ position: 'relative', width: '100%', height: height ?? '100%', overflow: 'hidden' }} className={className}>
          <img src={profileImg} alt="" aria-hidden="true"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', filter: 'blur(16px) brightness(0.55)', transform: 'scale(1.15)', display: 'block' }} />
          <img src={profileImg} alt={name}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', display: 'block' }} />
        </div>
      ) : (
        <img src={profileImg} alt={name}
          style={{ width: '100%', height: height ?? '100%', objectFit: objectFit as 'cover', objectPosition, display: 'block' }}
          className={className}
        />
      )
    ) : (
      <div style={{
        width: '100%', height: height ?? '100%',
        background: `linear-gradient(135deg, ${T.green}88 0%, ${T.bg} 50%, ${T.greenLight}66 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ fontSize: 72, fontWeight: 900, color: T.green, opacity: 0.3, lineHeight: 1 }}>
          {(name || '?')[0].toUpperCase()}
        </div>
      </div>
    );

  const NameInfo = ({ color = '#fff', titleColor = T.greenLight, companyColor = 'rgba(255,255,255,0.65)', align = 'left' as 'left'|'center' }) => (
    <div style={{ textAlign: align }}>
      {name && <h1 style={{ color, fontSize: T.nameFontSize, lineHeight: 1.2, fontWeight: T.boldHeadings ? 800 : 600, fontFamily: T.fontFamily, wordBreak: 'break-word' }}>{name}</h1>}
      {title && <p style={{ color: titleColor, fontSize: T.bodyFontSize + 1, marginTop: 4, fontFamily: T.fontFamily }}>{title}</p>}
      {(company || (hasBrandLogo && content.logoPosition === 'below-name')) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2, justifyContent: align === 'center' ? 'center' : 'flex-start' }}>
          {hasBrandLogo && content.logoPosition === 'below-name' && (
            <div style={{ background: 'rgba(0,0,0,0.45)', padding: '2px 4px', borderRadius: 5, lineHeight: 0, flexShrink: 0 }}>
              <img src={content.brandLogo} alt="Brand" style={{ maxWidth: 22, maxHeight: 22, objectFit: 'contain', borderRadius: 3 }} />
            </div>
          )}
          {company && <p style={{ color: companyColor, fontSize: T.bodyFontSize - 1, fontFamily: T.fontFamily, fontWeight: T.boldHeadings ? 700 : 500 }}>{company}</p>}
        </div>
      )}
    </div>
  );

  const LogoBadge = ({ size = 48, pos }: { size?: number; pos?: string }) => hasBrandLogo && content.logoPosition === pos ? (
    <div style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', padding: 5, borderRadius: 10, lineHeight: 0 }}>
      <img src={content.brandLogo} alt="Brand" style={{ maxWidth: size, maxHeight: size, objectFit: 'contain', borderRadius: 7 }} />
    </div>
  ) : null;

  const LogoCircle = ({ sz = 52 }: { sz?: number }) => (
    <div style={{
      width: sz, height: sz, borderRadius: '50%', background: '#fff',
      border: `3px solid ${T.green}`, display: 'flex', alignItems: 'center',
      justifyContent: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
    }}>
      {hasBrandLogo ? (
        <img src={content.brandLogo} alt="Brand" style={{ width: sz - 16, height: sz - 16, borderRadius: '50%', objectFit: 'contain' }} />
      ) : (
        <div style={{ width: sz - 14, height: sz - 14, borderRadius: '50%', background: T.green, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: sz * 0.4 }}>
          {(company || name || 'T')[0]?.toUpperCase()}
        </div>
      )}
    </div>
  );

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

  // ─────────────────────────────────────────────────────────────────
  // Profile hero renderer (extracted from the big block below)
  // ─────────────────────────────────────────────────────────────────
  const renderProfileHero = () => {
    if (!profileVisible) return null;

    return (
      <>
        {heroLayout === 'wave-panel' && (
          <div style={{ position: 'relative', fontFamily: T.fontFamily }}>
            <div style={{ width: '100%', height: 240, position: 'relative', overflow: 'hidden', background: T.bg }}>
              <PhotoEl height="100%" objectFit="contain" objectPosition="center" />
              <svg viewBox="0 0 200 36" preserveAspectRatio="none"
                style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 42, zIndex: 2 }}>
                <path d="M0,0 Q100,28 200,0 L200,36 L0,36 Z" fill={T.bg} />
              </svg>
            </div>
            {hasBrandLogo && content.logoPosition === 'top-right' && (
              <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}><LogoBadge pos="top-right" /></div>
            )}
            {hasBrandLogo && content.logoPosition === 'top-left' && (
              <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 10 }}><LogoBadge pos="top-left" /></div>
            )}
            <div style={{ background: T.bg, paddingTop: 16, paddingBottom: 6, paddingLeft: 20, paddingRight: 20, textAlign: 'center' }}>
              <NameInfo align="center" companyColor={T.textMuted} titleColor={T.greenLight} />
            </div>
            <div style={{ height: 48, background: `linear-gradient(to bottom, ${T.bg} 0%, ${T.bg}99 30%, ${T.bg}44 60%, transparent 100%)`, pointerEvents: 'none' }} />
          </div>
        )}

        {heroLayout === 'side-panel' && (
          <div style={{ fontFamily: T.fontFamily }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', gap: 10, background: T.bg }}>
              {hasBrandLogo && !['below-photo','below-name'].includes(content.logoPosition) ? (
                <img src={content.brandLogo} alt="Brand" style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 8 }} />
              ) : !hasBrandLogo ? (
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: T.green, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                  {(company || name || 'T')[0]?.toUpperCase()}
                </div>
              ) : null}
              {company && <span style={{ fontWeight: 700, fontSize: 15, color: T.textPrimary, fontFamily: T.fontFamily }}>{company}</span>}
            </div>
            <div style={{ margin: '0 12px 12px', borderRadius: T.cardRadius, overflow: 'hidden', display: 'flex', height: 140 }}>
              <div style={{ width: '45%', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                <PhotoEl height="100%" />
              </div>
              <div style={{ flex: 1, background: T.card, padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <NameInfo color={T.textPrimary} titleColor={T.greenLight} companyColor={T.textMuted} />
              </div>
            </div>
            <div style={{ height: 48, background: `linear-gradient(to bottom, ${T.bg} 0%, ${T.bg}99 30%, ${T.bg}44 60%, transparent 100%)`, pointerEvents: 'none' }} />
          </div>
        )}

        {heroLayout === 'group-diagonal' && (
          <div style={{ fontFamily: T.fontFamily }}>
            <div style={{ width: '100%', height: 180, position: 'relative', overflow: 'hidden', background: T.bg }}>
              <PhotoEl height="100%" objectFit="contain" objectPosition="center" />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.5) 100%)' }} />
              {(!hasBrandLogo || content.logoPosition === 'top-right') && (
                <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 3 }}>
                  {hasBrandLogo ? (
                    <div style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', padding: 5, borderRadius: 10, lineHeight: 0 }}>
                      <img src={content.brandLogo} alt="Brand" style={{ maxWidth: 40, maxHeight: 40, objectFit: 'contain', borderRadius: 6 }} />
                    </div>
                  ) : (
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: T.green, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16 }}>
                      {(company || name || 'T')[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
              )}
              {hasBrandLogo && content.logoPosition === 'top-left' && (
                <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 3 }}><LogoBadge pos="top-left" /></div>
              )}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 180" preserveAspectRatio="none">
                <line x1="65" y1="0" x2="100" y2="120" stroke={T.green} strokeWidth="12" opacity="0.65" />
                <line x1="80" y1="0" x2="100" y2="60" stroke={T.greenLight} strokeWidth="8" opacity="0.45" />
              </svg>
            </div>
            <div style={{ position: 'relative', background: T.card, padding: '10px 16px 10px 90px', minHeight: 80 }}>
              <div style={{ position: 'absolute', top: -28, left: 16, width: 64, height: 80, borderRadius: 8, overflow: 'hidden', border: `2px solid ${T.green}` }}>
                <PhotoEl height="100%" objectPosition="top" />
              </div>
              <NameInfo color={T.textPrimary} titleColor={T.greenLight} companyColor={T.textMuted} />
            </div>
            <div style={{ height: 48, background: `linear-gradient(to bottom, ${T.card} 0%, ${T.card}99 30%, ${T.card}44 60%, transparent 100%)`, pointerEvents: 'none' }} />
          </div>
        )}

        {heroLayout === 'circle-overlap' && (
          <div style={{ fontFamily: T.fontFamily }}>
            <div style={{ width: '100%', height: 180, position: 'relative', overflow: 'hidden', background: T.bg }}>
              <PhotoEl height="100%" objectFit="contain" objectPosition="center" />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.55) 100%)' }} />
              {hasBrandLogo && content.logoPosition === 'top-right' && (
                <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 5 }}><LogoBadge pos="top-right" /></div>
              )}
              {hasBrandLogo && content.logoPosition === 'top-left' && (
                <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 5 }}><LogoBadge pos="top-left" /></div>
              )}
            </div>
            <div style={{ background: T.bg, paddingBottom: 6, textAlign: 'center' }}>
              <div style={{ marginTop: -52, display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
                <div style={{ width: 100, height: 100, borderRadius: '50%', overflow: 'hidden', border: '4px solid #fff', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', background: T.card }}>
                  <PhotoEl height="100%" objectPosition="top" />
                </div>
              </div>
              <div style={{ padding: '12px 20px 0' }}>
                <NameInfo align="center" companyColor={T.textMuted} titleColor={T.greenLight} />
              </div>
            </div>
            <div style={{ height: 48, background: `linear-gradient(to bottom, ${T.bg} 0%, ${T.bg}99 30%, ${T.bg}44 60%, transparent 100%)`, pointerEvents: 'none' }} />
          </div>
        )}

        {heroLayout === 'circle-center' && (
          <div style={{ position: 'relative', fontFamily: T.fontFamily }}>
            <div style={{ background: T.bg, padding: '48px 20px 8px' }}>
              {hasBrandLogo && content.logoPosition === 'top-left' && (
                <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 5 }}><LogoBadge pos="top-left" /></div>
              )}
              {hasBrandLogo && content.logoPosition === 'top-right' && (
                <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 5 }}><LogoBadge pos="top-right" /></div>
              )}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                <div style={{ width: 110, height: 110, borderRadius: '50%', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.18)', background: T.card }}>
                  <PhotoEl height="100%" objectPosition="top" />
                </div>
              </div>
              <NameInfo color={T.textPrimary} titleColor={T.textMuted} companyColor={T.green} />
            </div>
            <div style={{ height: 48, background: `linear-gradient(to bottom, ${T.bg} 0%, ${T.bg}99 30%, ${T.bg}44 60%, transparent 100%)`, pointerEvents: 'none' }} />
          </div>
        )}

        {heroLayout === 'top-banner' && (
          <div style={{ fontFamily: T.fontFamily }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', gap: 10, background: T.bg }}>
              {hasBrandLogo && !['below-photo','below-name'].includes(content.logoPosition) ? (
                <img src={content.brandLogo} alt="Brand" style={{ width: 34, height: 34, objectFit: 'contain', borderRadius: 8 }} />
              ) : !hasBrandLogo ? (
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: T.green, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                  {(company || name || 'T')[0]?.toUpperCase()}
                </div>
              ) : null}
              {company && <span style={{ fontWeight: 700, color: T.textPrimary, fontFamily: T.fontFamily }}>{company}</span>}
            </div>
            <div style={{ background: T.green, padding: '18px 20px' }}>
              <NameInfo color="#fff" titleColor="rgba(255,255,255,0.9)" companyColor="rgba(255,255,255,0.7)" />
            </div>
            <div style={{ width: '100%', height: 220, overflow: 'hidden', position: 'relative', background: T.bg }}>
              <PhotoEl height="100%" objectFit="contain" objectPosition="center" />
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 30%, ${T.bg}88 65%, ${T.bg}cc 80%, ${T.bg} 100%)` }} />
            </div>
          </div>
        )}

        {heroLayout === 'torn-edge' && (
          <div style={{ fontFamily: T.fontFamily, position: 'relative' }}>
            <div style={{
              width: '100%', height: 220, position: 'relative',
              clipPath: 'polygon(0 0, 100% 0, 100% 82%, 97% 70%, 93% 84%, 89% 70%, 85% 83%, 81% 68%, 77% 82%, 73% 70%, 69% 84%, 65% 70%, 61% 83%, 57% 69%, 53% 83%, 49% 70%, 45% 83%, 41% 70%, 37% 82%, 33% 68%, 29% 80%, 25% 68%, 21% 80%, 17% 67%, 13% 79%, 9% 67%, 5% 78%, 2% 67%, 0 76%)',
            }}>
              <PhotoEl height="100%" objectPosition="center top" />
            </div>
            {hasBrandLogo && content.logoPosition === 'top-left' && (
              <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 10 }}><LogoBadge pos="top-left" /></div>
            )}
            {hasBrandLogo && content.logoPosition === 'top-right' && (
              <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}><LogoBadge pos="top-right" /></div>
            )}
            <div style={{ position: 'relative', background: T.bg, paddingTop: 8, paddingLeft: 80, paddingRight: 20, paddingBottom: 8, minHeight: 80 }}>
              <div style={{ position: 'absolute', top: -32, left: 20 }}>
                <LogoCircle sz={64} />
              </div>
              <NameInfo color={T.textPrimary} titleColor={T.textMuted} companyColor={T.green} />
            </div>
            <div style={{ height: 48, background: `linear-gradient(to bottom, ${T.bg} 0%, ${T.bg}99 30%, ${T.bg}44 60%, transparent 100%)`, pointerEvents: 'none' }} />
          </div>
        )}

        {heroLayout === 'wave-logo' && (
          <div style={{ fontFamily: T.fontFamily, position: 'relative' }}>
            <div style={{ width: '100%', height: 260, position: 'relative', overflow: 'hidden', background: T.bg }}>
              <PhotoEl height="100%" objectFit="contain" objectPosition="center" />
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 35%, ${T.green}55 100%)` }} />
              <svg viewBox="0 0 400 60" preserveAspectRatio="none"
                style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 48, zIndex: 1 }}>
                <path d="M0,40 C100,10 300,55 400,20 L400,60 L0,60 Z" fill={T.green} opacity="0.3" />
              </svg>
              <svg viewBox="0 0 400 60" preserveAspectRatio="none"
                style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 44, zIndex: 2 }}>
                <path d="M0,36 C100,6 300,54 400,22 L400,60 L0,60 Z" fill={T.bg} />
              </svg>
              {hasBrandLogo && content.logoPosition === 'top-left' && (
                <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 10 }}><LogoBadge pos="top-left" /></div>
              )}
              {hasBrandLogo && content.logoPosition === 'top-right' && (
                <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}><LogoBadge pos="top-right" /></div>
              )}
            </div>
            <div style={{
              position: 'absolute', top: 222, left: 20, zIndex: 5,
            }}>
              <LogoCircle sz={64} />
            </div>
            <div style={{ background: T.bg, paddingTop: 10, paddingLeft: 96, paddingRight: 20, paddingBottom: 8, minHeight: 80 }}>
              <NameInfo color={T.textPrimary} titleColor={T.greenLight} companyColor={T.textMuted} />
            </div>
            <div style={{ height: 48, background: `linear-gradient(to bottom, ${T.bg} 0%, ${T.bg}99 30%, ${T.bg}44 60%, transparent 100%)`, pointerEvents: 'none' }} />
          </div>
        )}

        {heroLayout === 'wave-side' && (
          <div style={{ fontFamily: T.fontFamily, position: 'relative' }}>
            <div style={{ width: '100%', height: 230, position: 'relative', overflow: 'hidden', display: 'flex' }}>
              <div style={{ flex: 1, background: T.bg, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '16px 20px 44px 20px', position: 'relative', zIndex: 2 }}>
                <NameInfo color={T.textPrimary} titleColor={T.green} companyColor={T.textMuted} />
              </div>
              <div style={{ width: '46%', position: 'relative', overflow: 'hidden', flexShrink: 0, alignSelf: 'stretch' }}>
                <PhotoEl height="100%" objectPosition="center top" />
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, ${T.bg} 0%, ${T.bg}dd 18%, ${T.bg}88 35%, transparent 62%)` }} />
              </div>
              <svg viewBox="0 0 400 60" preserveAspectRatio="none"
                style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 44, zIndex: 3, opacity: 0.45 }}>
                <path d="M0,28 C60,4 160,50 260,16 C330,0 375,30 400,12 L400,60 L0,60 Z" fill={T.green} />
              </svg>
              <svg viewBox="0 0 400 60" preserveAspectRatio="none"
                style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 34, zIndex: 4 }}>
                <path d="M0,18 C70,0 170,34 275,8 C342,0 380,22 400,8 L400,60 L0,60 Z" fill={T.bg} />
              </svg>
              {hasBrandLogo && content.logoPosition === 'top-left' && (
                <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 6 }}><LogoBadge pos="top-left" /></div>
              )}
              {hasBrandLogo && content.logoPosition === 'top-right' && (
                <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 6 }}><LogoBadge pos="top-right" /></div>
              )}
              <div style={{ position: 'absolute', bottom: 8, right: 18, zIndex: 5 }}>
                {hasBrandLogo && !['top-left', 'top-right'].includes(content.logoPosition) ? (
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#fff', border: `2px solid ${T.green}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                    <img src={content.brandLogo} alt="Brand" style={{ width: 30, height: 30, objectFit: 'contain' }} />
                  </div>
                ) : (
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: T.green, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16, border: `2px solid ${T.bg}` }}>
                    {(company || name || 'T')[0]?.toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <div style={{ height: 48, background: `linear-gradient(to bottom, ${T.bg} 0%, ${T.bg}99 30%, ${T.bg}44 60%, transparent 100%)`, pointerEvents: 'none' }} />
          </div>
        )}

        {heroLayout === 'wave-icons' && (
          <div style={{ fontFamily: T.fontFamily, position: 'relative' }}>
            <div style={{ width: '100%', height: 230, position: 'relative', overflow: 'hidden', background: T.bg }}>
              <PhotoEl height="100%" objectFit="contain" objectPosition="center" />
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 30%, ${T.green}88 100%)` }} />
              {hasBrandLogo && content.logoPosition === 'top-right' && (
                <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 5 }}><LogoBadge pos="top-right" /></div>
              )}
              {hasBrandLogo && content.logoPosition === 'top-left' && (
                <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 5 }}><LogoBadge pos="top-left" /></div>
              )}
              <svg viewBox="0 0 400 60" preserveAspectRatio="none"
                style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 50, zIndex: 1, opacity: 0.4 }}>
                <path d="M0,38 C60,10 150,50 230,18 C300,0 360,36 400,16 L400,60 L0,60 Z" fill={T.greenLight} />
              </svg>
              <svg viewBox="0 0 400 60" preserveAspectRatio="none"
                style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 42, zIndex: 2, opacity: 0.65 }}>
                <path d="M0,26 C80,4 190,46 280,14 C345,2 385,28 400,10 L400,60 L0,60 Z" fill={T.bg} />
              </svg>
              <svg viewBox="0 0 400 60" preserveAspectRatio="none"
                style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 30, zIndex: 3 }}>
                <path d="M0,16 C70,0 165,30 265,8 C330,0 375,20 400,6 L400,60 L0,60 Z" fill={T.bg} />
              </svg>
            </div>
            <div style={{ background: T.bg, padding: '14px 20px 8px' }}>
              <NameInfo color={T.textPrimary} titleColor={T.greenLight} companyColor={T.textMuted} />
            </div>
            <div style={{ height: 48, background: `linear-gradient(to bottom, ${T.bg} 0%, ${T.bg}99 30%, ${T.bg}44 60%, transparent 100%)`, pointerEvents: 'none' }} />
          </div>
        )}

        {heroLayout === 'slash-wave' && (
          <div style={{ fontFamily: T.fontFamily, position: 'relative' }}>
            <div style={{ width: '100%', height: 200, position: 'relative', overflow: 'hidden', background: T.bg }}>
              <PhotoEl height="100%" objectFit="contain" objectPosition="center" />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.55) 100%)' }} />
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 200" preserveAspectRatio="none">
                <line x1="60" y1="0" x2="100" y2="120" stroke={T.green} strokeWidth="9" opacity="0.7" />
                <line x1="76" y1="0" x2="100" y2="65" stroke={T.greenLight} strokeWidth="6" opacity="0.45" />
                <line x1="50" y1="0" x2="95" y2="150" stroke={T.green} strokeWidth="3" opacity="0.28" />
              </svg>
              {(!hasBrandLogo || content.logoPosition === 'top-right') && (
                <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 3 }}>
                  {hasBrandLogo ? (
                    <div style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', padding: 5, borderRadius: 10, lineHeight: 0 }}>
                      <img src={content.brandLogo} alt="Brand" style={{ maxWidth: 40, maxHeight: 40, objectFit: 'contain', borderRadius: 6 }} />
                    </div>
                  ) : (
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: T.green, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16 }}>
                      {(company || name || 'T')[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
              )}
              {hasBrandLogo && content.logoPosition === 'top-left' && (
                <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 3 }}><LogoBadge pos="top-left" /></div>
              )}
              <svg viewBox="0 0 400 60" preserveAspectRatio="none"
                style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 46, zIndex: 4, opacity: 0.7 }}>
                <path d="M0,30 C60,6 160,50 260,16 C330,0 375,30 400,12 L400,60 L0,60 Z" fill={T.green} />
              </svg>
              <svg viewBox="0 0 400 60" preserveAspectRatio="none"
                style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 34, zIndex: 5 }}>
                <path d="M0,16 C80,0 185,30 290,8 C352,0 385,20 400,6 L400,60 L0,60 Z" fill={T.card} />
              </svg>
            </div>
            <div style={{ position: 'relative', background: T.card, padding: '12px 20px 8px 100px', minHeight: 88 }}>
              <div style={{ position: 'absolute', top: -32, left: 18, width: 70, height: 70, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${T.green}`, boxShadow: `0 3px 16px rgba(0,0,0,0.3)` }}>
                <PhotoEl height="100%" objectPosition="center top" />
              </div>
              <NameInfo color={T.textPrimary} titleColor={T.greenLight} companyColor={T.textMuted} />
            </div>
            <div style={{ height: 48, background: `linear-gradient(to bottom, ${T.card} 0%, ${T.card}99 30%, ${T.card}44 60%, transparent 100%)`, pointerEvents: 'none' }} />
          </div>
        )}

        {heroLayout === 'default' && (
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: "relative",
                minHeight: 240,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                overflow: "hidden",
                clipPath: "inset(0)",
                background: "#000",
              }}
            >
              <div style={{ position: 'absolute', inset: 0 }}>
                <PhotoEl height="100%" objectFit="contain" objectPosition="center" />
              </div>
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 15%, ${T.bg}66 50%, ${T.bg}cc 75%, ${T.bg} 100%)` }} />
              {hasBrandLogo && content.logoPosition === "top-right" && (
                <div style={{ position: "absolute", top: 12, right: 12, zIndex: 10 }}><LogoBadge pos="top-right" /></div>
              )}
              {hasBrandLogo && content.logoPosition === "top-left" && (
                <div style={{ position: "absolute", top: 12, left: 12, zIndex: 10 }}><LogoBadge pos="top-left" /></div>
              )}
              <div style={{ position: "relative", padding: "40px 20px 10px", zIndex: 10 }}>
                <NameInfo color="#fff" titleColor={T.greenLight} companyColor="rgba(255,255,255,0.6)" />
              </div>
            </div>
            <div style={{ height: 48, background: `linear-gradient(to bottom, ${T.bg} 0%, ${T.bg}99 30%, ${T.bg}44 60%, transparent 100%)`, pointerEvents: 'none', marginTop: -1 }} />
          </div>
        )}

        {/* Below-photo brand logo (all layouts) */}
        {hasBrandLogo && content.logoPosition === 'below-photo' && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
            <div style={{
              background: T.card, border: `1px solid ${T.cardBorder}`,
              borderRadius: 12, padding: '8px 14px', lineHeight: 0,
            }}>
              <img src={content.brandLogo} alt="Brand"
                style={{ maxWidth: 80, maxHeight: 80, objectFit: 'contain', display: 'block', borderRadius: 8 }} />
            </div>
          </div>
        )}
      </>
    );
  };

  // Build order from content.unifiedOrder or fallback
  const DEFAULT_ORDER = [
    'profile', 'headingText', 'contactUs', 'businessDetails',
    'socialLinks', 'links', 'appointment', 'collectContacts',
  ];
  const extraIds = new Set(content.extraSections.map(s => s.id));
  const coreKeys = new Set(DEFAULT_ORDER);

  const savedUnifiedOrder = parseJsonbArray(content.unifiedOrder);
  const savedSectionOrder = parseJsonbArray(content.sectionOrder);

  const savedOrder = savedUnifiedOrder
    ? savedUnifiedOrder
    : savedSectionOrder && savedSectionOrder.length > 0
      ? [
          ...savedSectionOrder,
          ...content.extraSections.map(s => s.id).filter(id => !savedSectionOrder.includes(id)),
        ]
      : [
          ...DEFAULT_ORDER.filter(key => S[key as keyof typeof S] !== false),
          ...content.extraSections.filter(s => s.enabled).map(s => s.id),
        ];

  const allKnown = new Set([...coreKeys, ...extraIds]);
  const seen = new Set<string>();
  const order = savedOrder.filter(id => {
    if (!allKnown.has(id) || seen.has(id)) return false;
    seen.add(id); return true;
  });
  for (const id of allKnown) { if (!seen.has(id)) order.push(id); }

  // Determine if Profile is first in the order
  const firstItem = order[0];
  const profileIsFirst = firstItem === 'profile' || (firstItem === undefined && profileVisible);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Sora:wght@400;500;600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=Poppins:wght@400;500;600;700;800&family=Raleway:wght@400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700;800&family=Fira+Code:wght@400;500;700&display=swap" rel="stylesheet" />
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
      }}>
        {/* Card column — transparent so page bg shows around edges on wider screens */}
        <div className="sc-card" style={{
          width: "100%",
          maxWidth: 480,
          minHeight: "100vh",
          background: "transparent",
          overflowX: "hidden",
          borderRadius: T.cardRadius,
        }}>

          {/* Render Profile hero at top only if it is first in order */}
          {profileIsFirst && renderProfileHero()}

          {/* Tagline + quick-contact icons — always directly after the hero */}
          {profileIsFirst && (
            <>
              {fd.tagline && (
                <div style={{ padding: '10px 20px', textAlign: 'center' }}>
                  <p style={{ fontSize: T.bodyFontSize, fontStyle: 'italic', lineHeight: 1.5, color: T.textMuted, fontFamily: T.fontFamily, wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{fd.tagline}</p>
                </div>
              )}
              {contactItems.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12, padding: '12px', margin: '0 12px 10px', background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: T.cardRadius }}>
                  {contactItems.slice(0, 4).map(({ href, Icon }, i) => (
                    <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                      onClick={() => trackEvent("link_click")}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${T.green}, ${T.greenLight})`, boxShadow: `0 3px 10px ${T.green}66` }}>
                        <Icon size={16} color="#fff" />
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── Ordered sections – respects unifiedOrder ── */}
          {order.map(id => {
            // Profile is already handled above when it is first; if not first, render it here
            if (id === 'profile') {
              if (!profileIsFirst) {
                return (
                  <Fragment key={id}>
                    {renderProfileHero()}
                    {fd.tagline && (
                      <div style={{ padding: '10px 20px', textAlign: 'center' }}>
                        <p style={{ fontSize: T.bodyFontSize, fontStyle: 'italic', lineHeight: 1.5, color: T.textMuted, fontFamily: T.fontFamily, wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{fd.tagline}</p>
                      </div>
                    )}
                    {contactItems.length > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, padding: '12px', margin: '0 12px 10px', background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: T.cardRadius }}>
                        {contactItems.slice(0, 4).map(({ href, Icon }, i) => (
                          <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                            onClick={() => trackEvent("link_click")}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                            <div style={{ width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${T.green}, ${T.greenLight})`, boxShadow: `0 3px 10px ${T.green}66` }}>
                              <Icon size={16} color="#fff" />
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                  </Fragment>
                );
              }
              return null;
            }

            // Extra section
            if (extraIds.has(id)) {
              const section = content.extraSections.find(s => s.id === id);
              if (!section || !section.enabled) return null;
              return (
                <ExtraSectionBlock
                  key={section.id}
                  section={section}
                  T={T}
                  onLinkClick={() => trackEvent("link_click")}
                />
              );
            }

            // Core sections
            switch (id) {

              case 'headingText':
                if (!S.headingText) return null;
                if (!card.headingText && !card.headingBodyText && !fd.headingText && !fd.bodyText) return null;
                return (
                  <CardBlock key="headingText" T={T}>
                    <div style={{ padding: "12px 16px" }}>
                      {(card.headingText || fd.headingText) && (
                        <p style={{ fontWeight: T.boldHeadings ? 700 : 500, fontSize: T.bodyFontSize + 1, color: T.textPrimary, marginBottom: 4 }}>
                          {card.headingText || fd.headingText}
                        </p>
                      )}
                      {(card.headingBodyText || fd.bodyText) && (
                        <p style={{ fontSize: T.bodyFontSize, lineHeight: 1.6, color: T.textMuted }}>
                          {card.headingBodyText || fd.bodyText}
                        </p>
                      )}
                    </div>
                  </CardBlock>
                );

              case 'contactUs':
                if (!S.contactUs || contactItems.length === 0) return null;
                return (
                  <CardBlock key="contactUs" T={T}>
                    <SectionHeader T={T} icon={<Phone size={14} color="#fff" />} title="Contact Us" />
                    {contactItems.map(({ label, sub, href, Icon }, i) => (
                      <div key={i}>
                        <a href={href} target="_blank" rel="noopener noreferrer"
                          onClick={() => trackEvent("link_click")} className="sc-row"
                          style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", color: "inherit", transition: "background .15s" }}>
                          <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, background: `${T.green}28`, border: `1px solid ${T.green}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Icon size={13} color={T.greenLight} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontWeight: T.boldHeadings ? 600 : 500, fontSize: T.bodyFontSize, color: T.textPrimary }}>{label}</p>
                            <p style={{ fontSize: T.bodyFontSize - 1, color: T.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sub}</p>
                          </div>
                          <ChevronRight size={14} color={T.muted} />
                        </a>
                        {i < contactItems.length - 1 && <Divider color={T.divider} />}
                      </div>
                    ))}
                  </CardBlock>
                );

              case 'businessDetails': {
                if (!S.businessDetails) return null;
                if (!fd.company && !businessProfile.company && !fd.industry && !fd.yearFounded && !fd.location) return null;
                const rows = [
                  (fd.company || businessProfile.company) && { label: "Company", val: fd.company || businessProfile.company! },
                  fd.industry && { label: "Industry", val: fd.industry },
                  fd.yearFounded && { label: "Year Founded", val: fd.yearFounded },
                  fd.location && { label: "Location", val: fd.location },
                ].filter(Boolean) as { label: string; val: string }[];
                return (
                  <CardBlock key="businessDetails" T={T}>
                    <SectionHeader T={T} icon={<Briefcase size={14} color="#fff" />} title="Business Details" />
                    {rows.map((row, i) => (
                      <div key={row.label}>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 16px" }}>
                          <span style={{ fontSize: T.bodyFontSize, color: T.textMuted }}>{row.label}</span>
                          <span style={{ fontSize: T.bodyFontSize, fontWeight: T.boldHeadings ? 600 : 400, color: T.textPrimary, maxWidth: "55%", textAlign: "right", wordBreak: "break-word", overflowWrap: "anywhere", display: "inline-block" }}>{row.val}</span>
                        </div>
                        {i < rows.length - 1 && <Divider color={T.divider} />}
                      </div>
                    ))}
                  </CardBlock>
                );
              }

              case 'socialLinks': {
                const activeSocials = socialLinks.filter(sl => sl.enabled !== false);
                if (!S.socialLinks || activeSocials.length === 0) return null;
                return (
                  <CardBlock key="socialLinks" T={T}>
                    <SectionHeader T={T} icon={<Share2 size={14} color="#fff" />} title="Social Links" />
                    {activeSocials.map((sl, i, arr) => {
                      const meta = SOCIAL_META[sl.platform?.toLowerCase()] ?? { Icon: Link2, color: T.green, label: sl.platform };
                      const { Icon, color, label } = meta;
                      return (
                        <div key={i}>
                          <button onClick={() => { trackEvent("link_click"); openLink(sl.url); }} className="sc-row"
                            style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left", transition: "background .15s" }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}22`, border: `1px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <Icon size={16} color={color} />
                            </div>
                            <span style={{ flex: 1, fontSize: T.bodyFontSize, fontWeight: T.boldHeadings ? 500 : 400, color: T.textPrimary }}>{label}</span>
                            <ChevronRight size={14} color={T.muted} />
                          </button>
                          {i < arr.length - 1 && <Divider color={T.divider} />}
                        </div>
                      );
                    })}
                  </CardBlock>
                );
              }

              case 'links': {
                const activeLinks = content.customLinks.filter(l => l.label || l.url);
                if (!S.links || activeLinks.length === 0) return null;
                return (
                  <CardBlock key="links" T={T}>
                    <SectionHeader T={T} icon={<Link2 size={14} color="#fff" />} title="Links" />
                    {activeLinks.map((l, i) => (
                      <div key={i}>
                        <button onClick={() => { trackEvent("link_click"); openLink(l.url); }} className="sc-row"
                          style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left", transition: "background .15s" }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: `${T.green}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Link2 size={14} color={T.greenLight} />
                          </div>
                          <span style={{ flex: 1, fontSize: T.bodyFontSize, color: T.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.label || l.url}</span>
                          <ChevronRight size={14} color={T.muted} />
                        </button>
                        {i < activeLinks.length - 1 && <Divider color={T.divider} />}
                      </div>
                    ))}
                  </CardBlock>
                );
              }

              case 'appointment':
                if (!S.appointment || !fd.appointmentUrl) return null;
                return (
                  <CardBlock key="appointment" T={T}>
                    <div style={{ padding: "16px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${T.green}, ${T.greenLight})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Calendar size={20} color="#fff" />
                      </div>
                      <p style={{ fontWeight: T.boldHeadings ? 700 : 500, fontSize: T.bodyFontSize + 1, color: T.textPrimary }}>Schedule Meeting</p>
                      <p style={{ fontSize: T.bodyFontSize, lineHeight: 1.5, color: T.textMuted, padding: "0 8px" }}>Book a time to discuss potential opportunities</p>
                    </div>
                    <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                      {["Book on Calendly", "Add to Calendar"].map((label) => (
                        <button key={label} onClick={() => { trackEvent("link_click"); openLink(fd.appointmentUrl!); }}
                          style={{ width: "100%", padding: "10px", borderRadius: 999, border: `1px solid ${T.green}59`, color: T.greenLight, background: `${T.green}1a`, fontWeight: 600, fontSize: T.bodyFontSize, cursor: "pointer", fontFamily: T.fontFamily }}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </CardBlock>
                );

              case 'collectContacts':
                if (!S.collectContacts) return null;
                return (
                  <CardBlock key="collectContacts" T={T}>
                    <SectionHeader T={T} icon={<MessageSquare size={14} color="#fff" />} title="Get in Touch" />
                    <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                      {[
                        { key: "name" as const, label: "Your Name", placeholder: "Full name", type: "text" },
                        { key: "email" as const, label: "Email Address", placeholder: "email@domain.com", type: "email" },
                        { key: "phone" as const, label: "Phone Number", placeholder: "+1 (555) 000-0000", type: "tel" },
                      ].map((field) => {
                        const err = leadFormErrors[field.key];
                        return (
                        <div key={field.key} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <label style={{ fontSize: T.bodyFontSize - 1, color: T.textMuted, fontWeight: 500 }}>{field.label}</label>
                          <input type={field.type} value={leadForm[field.key]} placeholder={field.placeholder}
                            onChange={(e) => { setLeadForm((prev) => ({ ...prev, [field.key]: e.target.value })); setLeadFormErrors(prev => ({ ...prev, [field.key]: undefined })); }}
                            style={{ width: "100%", padding: "9px 12px", borderRadius: 10, background: T.bg, border: `1px solid ${err ? "#ff7a7a" : T.green}33`, color: T.textPrimary, fontSize: T.bodyFontSize, outline: "none", fontFamily: T.fontFamily }} />
                          {err && <span style={{ fontSize: T.bodyFontSize - 2, color: "#ff7a7a" }}>{err}</span>}
                        </div>
                        );
                      })}
                      <button onClick={submitLead} disabled={leadSubmitting}
                        style={{ width: "100%", padding: "10px", borderRadius: 999, border: "none", background: `linear-gradient(135deg, ${T.green}, ${T.greenLight})`, color: "#fff", fontWeight: 700, fontSize: T.bodyFontSize, cursor: leadSubmitting ? "not-allowed" : "pointer", opacity: leadSubmitting ? 0.8 : 1, fontFamily: T.fontFamily }}>
                        {leadSubmitting ? "Submitting..." : "Submit"}
                      </button>
                      {leadSubmitFeedback.type && (
                        <p style={{ marginTop: 4, fontSize: T.bodyFontSize - 1, color: leadSubmitFeedback.type === "success" ? T.greenLight : "#ff7a7a" }}>
                          {leadSubmitFeedback.message}
                        </p>
                      )}
                    </div>
                  </CardBlock>
                );

              default:
                return null;
            }
          })}

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

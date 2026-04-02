import React, { useState, ReactNode, useMemo, useRef, useCallback } from "react";
import {
  QR_SHAPES, PRE_DESIGNS, LOGOS,
} from "@/components/dashboard/pages/constants";
import {
  QRWithShape, QRShapeThumbnail, StickerBadge, QRThumbnail,
  QR_SHAPE_DEFS, STICKER_DEFS, StickerDef,
} from "@/components/dashboard/pages/Qrrenderers";
import { makeQRMatrix } from "@/components/dashboard/pages/qr-engine";
import { uploadFile } from "@/lib/api";

const PREVIEW_PX = 240;
const STICKER_RING_PAD = 44;
const OUTER_PX = PREVIEW_PX + STICKER_RING_PAD * 2;
const FONT = "'Sora','DM Sans','Segoe UI',system-ui,sans-serif";
const IC = "#22c55e";

type PreDesign = {
  id: string; label: string; dotShape: string; finderStyle: string;
  fg: string; bg: string; accentFg?: string; accentBg?: string;
  sticker?: { text: string; icon: string; color: string; outline: string; pos: string };
};

type GradStop = { offset: number; color: string };

export type QRCustomConfig = {
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
  gradStops: GradStop[];
  gradAngle: number;
  selectedLogo: string | null;
  customLogoUrl: string | null;
  logoNode?: React.ReactNode;
  logoBg?: string;
  selectedSticker?: StickerDef | null;
  designLabel: string;
  shapeLabel: string;
  qrMatrix?: boolean[][];
  qrN?: number;
  decorateImageUrl?: string | null;
  decorateCompositeDataUrl?: string | null;
};

interface QRCustomizerProps {
  onApply?: (config: QRCustomConfig) => void;
  onClose?: () => void;
  targetUrl?: string;
  initialConfig?: QRCustomConfig | null;
}

function resolveShapeId(id: string) {
  return QR_SHAPE_DEFS[id] ? id : "square";
}

const PALETTES = [
  { label: "Ink", fg: "#111111", bg: "#ffffff" },
  { label: "Slate", fg: "#334155", bg: "#f8fafc" },
  { label: "Forest", fg: "#14532d", bg: "#f0fdf4" },
  { label: "Ocean", fg: "#1e3a8a", bg: "#eff6ff" },
  { label: "Plum", fg: "#581c87", bg: "#faf5ff" },
  { label: "Crimson", fg: "#9f1239", bg: "#fff1f2" },
  { label: "Amber", fg: "#78350f", bg: "#fffbeb" },
  { label: "Teal", fg: "#134e4a", bg: "#f0fdfa" },
  { label: "Rose Gold", fg: "#9d174d", bg: "#fdf2f8" },
  { label: "Midnight", fg: "#e2e8f0", bg: "#0f172a" },
  { label: "Neon", fg: "#00ff88", bg: "#0a0a0a" },
  { label: "Carbon", fg: "#f8fafc", bg: "#1e293b" },
  { label: "Sepia", fg: "#44200a", bg: "#fdf6ec" },
  { label: "Sage", fg: "#1a3528", bg: "#ecfdf5" },
];

const GRADIENT_PRESETS = [
  { label: "Sunrise", stops: [{ offset: 0, color: "#f97316" }, { offset: 1, color: "#ec4899" }], angle: 135 },
  { label: "Ocean", stops: [{ offset: 0, color: "#0ea5e9" }, { offset: 1, color: "#6366f1" }], angle: 135 },
  { label: "Forest", stops: [{ offset: 0, color: "#16a34a" }, { offset: 1, color: "#0d9488" }], angle: 135 },
  { label: "Violet", stops: [{ offset: 0, color: "#7c3aed" }, { offset: 1, color: "#ec4899" }], angle: 135 },
  { label: "Gold", stops: [{ offset: 0, color: "#ca8a04" }, { offset: 1, color: "#ea580c" }], angle: 90 },
  { label: "Midnight", stops: [{ offset: 0, color: "#1e1b4b" }, { offset: 1, color: "#4c1d95" }], angle: 135 },
  { label: "Arctic", stops: [{ offset: 0, color: "#06b6d4" }, { offset: 1, color: "#a5f3fc" }], angle: 180 },
  { label: "Flamingo", stops: [{ offset: 0, color: "#f43f5e" }, { offset: 1, color: "#fb923c" }], angle: 45 },
];

const STICKER_CATEGORIES = Array.from(
  STICKER_DEFS.reduce((m, s) => {
    if (!m.has(s.category)) m.set(s.category, []);
    m.get(s.category)!.push(s);
    return m;
  }, new Map<string, StickerDef[]>())
);

// ── UI atoms ──────────────────────────────────────────────────────────────────

const SLabel = ({ children }: { children: ReactNode }) => (
  <div style={{
    fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
    textTransform: "uppercase" as const, color: "rgba(74,222,128,0.4)",
    marginBottom: 10, display: "flex", alignItems: "center", gap: 6,
  }}>
    <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(34,197,94,0.4)", display: "inline-block" }} />
    {children}
  </div>
);

const Divider = () => <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(34,197,94,0.12),transparent)", margin: "6px 0" }} />;

function CheckBox({ checked }: { checked: boolean }) {
  return (
    <div style={{
      width: 16, height: 16, borderRadius: 4, flexShrink: 0, transition: "all 0.15s",
      border: `1.5px solid ${checked ? "#22c55e" : "rgba(148,163,184,0.3)"}`,
      background: checked ? "#22c55e" : "transparent",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {checked && <svg width="9" height="7" viewBox="0 0 9 7"><path d="M1 3.5l2 2L8 1" stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
    </div>
  );
}

function ColorPicker({ color, onChange }: { color: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 30, height: 30, borderRadius: 7, background: color, border: "1px solid rgba(255,255,255,0.1)", flexShrink: 0 }} />
      <input type="color" value={color.length === 7 ? color : "#111111"} onChange={e => onChange(e.target.value)}
        style={{ width: 30, height: 30, border: "none", background: "none", cursor: "pointer", padding: 0 }} />
      <input value={color} onChange={e => onChange(e.target.value)}
        style={{
          flex: 1, padding: "6px 10px", borderRadius: 7,
          border: "1px solid rgba(255,255,255,0.07)", fontSize: 11,
          fontFamily: "'JetBrains Mono',monospace",
          background: "rgba(255,255,255,0.03)", color: "#cbd5e1", outline: "none",
        }} />
    </div>
  );
}

const ShapeBtn = ({ sel, onClick, el }: { sel: boolean; onClick: () => void; el: ReactNode }) => (
  <button onClick={onClick} style={{
    width: "100%", aspectRatio: "1", padding: 4, cursor: "pointer",
    border: sel ? "1.5px solid #22c55e" : "1px solid rgba(255,255,255,0.06)",
    borderRadius: 8,
    background: sel ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.02)",
    boxShadow: sel ? "0 0 0 2px rgba(34,197,94,0.15)" : "none",
    transform: sel ? "scale(1.06)" : "scale(1)",
    transition: "all 0.13s cubic-bezier(0.4,0,0.2,1)",
  }}>
    <svg width="100%" height="100%" viewBox="10 10 30 30" style={{ display: "block" }}>{el}</svg>
  </button>
);

function SummaryRow({ label, value, onClear, swatch }: { label: string; value: string; onClear: () => void; swatch?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10 }}>
      {swatch && <div style={{ width: 10, height: 10, borderRadius: 2, background: swatch, border: "1px solid rgba(255,255,255,0.12)", flexShrink: 0 }} />}
      <span style={{ color: "rgba(148,163,184,0.4)", minWidth: 52 }}>{label}</span>
      <span style={{ color: "#94a3b8", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</span>
      <button onClick={onClear} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(148,163,184,0.3)", fontSize: 14, padding: "0 2px", lineHeight: 1 }}>×</button>
    </div>
  );
}

function findShapeById(id: string) {
  return QR_SHAPES.find(s => s.id === id) ?? QR_SHAPES[0];
}

function logoIdxFromStr(selectedLogo: string | null): number | null {
  if (!selectedLogo || !selectedLogo.startsWith("logo-")) return null;
  const idx = parseInt(selectedLogo.replace("logo-", ""), 10);
  return isNaN(idx) ? null : idx;
}

// ── Canvas export helper ──────────────────────────────────────────────────────

async function exportDecorateComposite(
  bgImgUrl: string,
  qrSvgEl: SVGSVGElement,
  overlay: { x: number; y: number; size: number },
  containerWidth: number,
  containerHeight: number,
): Promise<string> {
  return new Promise(resolve => {
    const canvas = document.createElement("canvas");
    const scale = 2; // retina
    canvas.width = containerWidth * scale;
    canvas.height = containerHeight * scale;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(scale, scale);

    const bg = new Image();
    bg.crossOrigin = "anonymous";
    bg.onload = () => {
      ctx.drawImage(bg, 0, 0, containerWidth, containerHeight);

      // Serialize QR SVG → image
      const svgWidth = qrSvgEl.getAttribute("width");
      const svgHeight = qrSvgEl.getAttribute("height");
      const svgClone = qrSvgEl.cloneNode(true) as SVGSVGElement;
      if (svgWidth) svgClone.setAttribute("width", svgWidth);
      if (svgHeight) svgClone.setAttribute("height", svgHeight);
      const svgBlob = new Blob([svgClone.outerHTML], { type: "image/svg+xml;charset=utf-8" });
      const svgUrl = URL.createObjectURL(svgBlob);
      const qrImg = new Image();
      qrImg.onload = () => {
        const pxX = (overlay.x / 100) * containerWidth;
        const pxY = (overlay.y / 100) * containerHeight;
        const drawSize = parseInt(svgWidth || "100", 10);
        ctx.drawImage(qrImg, pxX, pxY, drawSize, drawSize);
        URL.revokeObjectURL(svgUrl);
        resolve(canvas.toDataURL("image/png"));
      };
      qrImg.onerror = () => {
        URL.revokeObjectURL(svgUrl);
        resolve(canvas.toDataURL("image/png"));
      };
      qrImg.src = svgUrl;
    };
    bg.src = bgImgUrl;
  });
}

// ── Main component ────────────────────────────────────────────────────────────

export default function QRCustomizer({ onApply, onClose, targetUrl: propTargetUrl, initialConfig }: QRCustomizerProps) {
  const targetUrl = propTargetUrl ?? (typeof window !== "undefined" ? window.location.href : "https://samcard.app");

  const { matrix: previewMatrix, N: previewN } = useMemo(() => makeQRMatrix(targetUrl), [targetUrl]);

  const [selectedShape, setSelectedShape] = useState(() =>
    initialConfig?.shapeId ? findShapeById(initialConfig.shapeId) : QR_SHAPES[0]
  );
  const [selectedDesign, setSelectedDesign] = useState<PreDesign | null>(null);
  const [selectedSticker, setSelectedSticker] = useState<StickerDef | null>(() => initialConfig?.selectedSticker ?? null);
  const [activeTab, setActiveTab] = useState("qr-shapes");

  const [bodyType, setBodyType] = useState(() => initialConfig?.dotShape ?? "square");
  const [bodyScale, setBodyScale] = useState(() => initialConfig?.bodyScale ?? 1.0);
  const [eyeFrameType, setEyeFrameType] = useState(() => initialConfig?.finderStyle ?? "square");
  const [eyeBallType, setEyeBallType] = useState(() => initialConfig?.eyeBall ?? "square");
  const [shapesOverridden, setShapesOverridden] = useState(() =>
    !!(initialConfig && (
      initialConfig.dotShape !== "square" || initialConfig.finderStyle !== "square" ||
      initialConfig.eyeBall !== "square" || initialConfig.bodyScale !== 1.0
    ))
  );

  const [selectedLogoIdx, setSelectedLogoIdx] = useState<number | null>(() => logoIdxFromStr(initialConfig?.selectedLogo ?? null));
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(() => initialConfig?.customLogoUrl ?? null);

  const [decoratePicUrl, setDecoratePicUrl] = useState<string | null>(() => initialConfig?.decorateImageUrl ?? null);
  const [qrOverlay, setQrOverlay] = useState({ x: 5, y: 5, size: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ mx: 0, my: 0, ox: 0, oy: 0 });
  const [resizeStart, setResizeStart] = useState({ mx: 0, my: 0, os: 0 });

  const decorateContainerRef = useRef<HTMLDivElement>(null);
  const decorateQrRef = useRef<SVGSVGElement>(null);

  const [fgOverride, setFgOverride] = useState<string | null>(() => initialConfig?.fg ?? null);
  const [bgOverride, setBgOverride] = useState<string | null>(() => initialConfig?.bg ?? null);
  const [strokeEnabled, setStrokeEnabled] = useState(() => initialConfig?.strokeEnabled ?? false);
  const [strokeColor, setStrokeColor] = useState(() => initialConfig?.strokeColor ?? "#22c55e");
  const [eyeEnabled, setEyeEnabled] = useState(() => !!(initialConfig?.accentFg));
  const [eyeColor, setEyeColor] = useState(() => initialConfig?.accentFg ?? "#e53935");

  const [fgGradEnabled, setFgGradEnabled] = useState(() => initialConfig?.gradEnabled ?? false);
  const [fgGradStops, setFgGradStops] = useState<GradStop[]>(() =>
    initialConfig?.gradStops?.length
      ? initialConfig.gradStops
      : [{ offset: 0, color: "#7c3aed" }, { offset: 1, color: "#ec4899" }]
  );
  const [fgGradAngle, setFgGradAngle] = useState(() => initialConfig?.gradAngle ?? 135);

  const [isApplying, setIsApplying] = useState(false);

  const activeFg = fgOverride ?? selectedDesign?.fg ?? "#111111";
  const activeBg = bgOverride ?? selectedDesign?.bg ?? "#ffffff";
  const activeAccentFg = eyeEnabled ? eyeColor : selectedDesign?.accentFg;
  const activeAccentBg = eyeEnabled ? eyeColor : selectedDesign?.accentBg;
  const activeBodyType = (shapesOverridden || !selectedDesign) ? bodyType : (selectedDesign.dotShape ?? bodyType);
  const activeEyeFrame = (shapesOverridden || !selectedDesign) ? eyeFrameType : (selectedDesign.finderStyle ?? eyeFrameType);
  const activeShapeId = resolveShapeId(selectedShape.id);

  const [clipKey] = useState(() => Math.random().toString(36).slice(2, 6));
  const previewClipId = `qrc-${activeShapeId}-${clipKey}`;
  const gradId = "qr-fg-grad";

  const selectedLogoEntry = selectedLogoIdx !== null ? LOGOS[selectedLogoIdx] : null;
  const logoIdStr = selectedLogoIdx !== null ? `logo-${selectedLogoIdx}` : (customLogoUrl ? "custom" : null);
  const logoNode = selectedLogoEntry?.icon ?? null;
  const logoBg = selectedLogoEntry?.bg ?? "#ffffff";

  const qrProps = {
    shapeId: activeShapeId, dotShape: activeBodyType, finderStyle: activeEyeFrame,
    fg: fgGradEnabled ? `url(#${gradId})` : activeFg, bg: activeBg,
    accentFg: activeAccentFg, accentBg: activeAccentBg,
    scale: bodyScale, eyeBall: eyeBallType, strokeEnabled, strokeColor,
    selectedLogo: logoIdStr, customLogoUrl, logoNode, logoBg,
  };

  const gradDefs = fgGradEnabled ? (
    <defs>
      <linearGradient id={gradId}
        x1={`${50 - 50 * Math.cos((fgGradAngle * Math.PI) / 180)}%`}
        y1={`${50 - 50 * Math.sin((fgGradAngle * Math.PI) / 180)}%`}
        x2={`${50 + 50 * Math.cos((fgGradAngle * Math.PI) / 180)}%`}
        y2={`${50 + 50 * Math.sin((fgGradAngle * Math.PI) / 180)}%`}
      >
        {fgGradStops.map((s, i) => <stop key={i} offset={`${s.offset * 100}%`} stopColor={s.color} />)}
      </linearGradient>
    </defs>
  ) : null;

  const handleApply = useCallback(async () => {
    setIsApplying(true);
    let compositeDataUrl: string | null = null;

    if (decoratePicUrl && decorateQrRef.current && decorateContainerRef.current) {
      try {
        const rect = decorateContainerRef.current.getBoundingClientRect();
        compositeDataUrl = await exportDecorateComposite(
          decoratePicUrl, decorateQrRef.current, qrOverlay, rect.width, rect.height,
        );
      } catch {
        // Canvas export failed — proceed without composite
      }
    }

    const config: QRCustomConfig = {
      shapeId: activeShapeId, dotShape: activeBodyType, finderStyle: activeEyeFrame,
      eyeBall: eyeBallType, bodyScale, fg: activeFg, bg: activeBg,
      accentFg: activeAccentFg, accentBg: activeAccentBg, strokeEnabled, strokeColor,
      gradEnabled: fgGradEnabled, gradStops: fgGradStops, gradAngle: fgGradAngle,
      selectedLogo: logoIdStr, customLogoUrl, logoNode, logoBg, selectedSticker,
      designLabel: selectedDesign?.label ?? (selectedSticker?.label ?? ""),
      shapeLabel: selectedShape.label,
      qrMatrix: previewMatrix, qrN: previewN,
      decorateImageUrl: decoratePicUrl,
      decorateCompositeDataUrl: compositeDataUrl,
    };
    onApply?.(config);
    onClose?.();
    setIsApplying(false);
  }, [
    activeShapeId, activeBodyType, activeEyeFrame, eyeBallType, bodyScale,
    activeFg, activeBg, activeAccentFg, activeAccentBg, strokeEnabled, strokeColor,
    fgGradEnabled, fgGradStops, fgGradAngle, logoIdStr, customLogoUrl, logoNode, logoBg,
    selectedSticker, selectedDesign, selectedShape, previewMatrix, previewN,
    decoratePicUrl, qrOverlay,
  ]);

  const hasCustomisation = !!(selectedDesign || selectedSticker || selectedLogoIdx !== null || fgOverride || bgOverride || shapesOverridden || fgGradEnabled);

  const ic = IC;

  const BODY_TYPES = [
    { id: "square", el: <rect x={14} y={14} width={22} height={22} fill={ic} /> },
    { id: "rounded-tag", el: <rect x={14} y={14} width={22} height={22} rx={4} fill={ic} /> },
    { id: "rounded", el: <rect x={14} y={14} width={22} height={22} rx={9} fill={ic} /> },
    { id: "dot", el: <circle cx={25} cy={25} r={11} fill={ic} /> },
    { id: "tiny-dot", el: <circle cx={25} cy={25} r={6} fill={ic} /> },
    { id: "diamond", el: <polygon points="25,13 37,25 25,37 13,25" fill={ic} /> },
    { id: "star", el: <polygon points={Array.from({ length: 10 }, (_, i) => { const a = (Math.PI / 5) * i - Math.PI / 2, r = i % 2 === 0 ? 11 : 5; return `${25 + r * Math.cos(a)},${25 + r * Math.sin(a)}`; }).join(" ")} fill={ic} /> },
    { id: "cross", el: <g><rect x={22} y={13} width={6} height={24} fill={ic} /><rect x={13} y={22} width={24} height={6} fill={ic} /></g> },
    { id: "plus", el: <g><rect x={22} y={14} width={6} height={22} rx={2} fill={ic} /><rect x={14} y={22} width={22} height={6} rx={2} fill={ic} /></g> },
    { id: "hexagon", el: <polygon points={Array.from({ length: 6 }, (_, i) => { const a = (Math.PI / 3) * i - Math.PI / 6; return `${25 + 11 * Math.cos(a)},${25 + 11 * Math.sin(a)}`; }).join(" ")} fill={ic} /> },
    { id: "leaf", el: <ellipse cx={25} cy={25} rx={7} ry={11} fill={ic} transform="rotate(-30,25,25)" /> },
    { id: "bars-h", el: <g><rect x={13} y={16} width={24} height={8} rx={2.5} fill={ic} /><rect x={13} y={26} width={24} height={8} rx={2.5} fill={ic} /></g> },
    { id: "bars-v", el: <g><rect x={16} y={13} width={8} height={24} rx={2.5} fill={ic} /><rect x={26} y={13} width={8} height={24} rx={2.5} fill={ic} /></g> },
    { id: "mosaic", el: <g><rect x={13} y={13} width={11} height={11} rx={2} fill={ic} /><rect x={26} y={26} width={11} height={11} rx={2} fill={ic} /></g> },
    { id: "wave", el: <rect x={13} y={13} width={24} height={24} rx={12} ry={5} fill={ic} /> },
    { id: "dna", el: <g><circle cx={21} cy={25} r={8.5} fill={ic} /><circle cx={29} cy={25} r={8.5} fill={ic} /></g> },
    { id: "arrow-r", el: <polygon points="13,18 27,18 37,25 27,32 13,32" fill={ic} /> },
    { id: "arrow-l", el: <polygon points="37,18 23,18 13,25 23,32 37,32" fill={ic} /> },
    { id: "kite", el: <polygon points="25,12 37,25 25,38 13,25" fill={ic} /> },
  ];

  const EYE_FRAMES = [
    { id: "square", el: <g><rect x={13} y={13} width={24} height={24} fill={ic} /><rect x={16} y={16} width={18} height={18} fill="#0d1f14" /><rect x={19} y={19} width={12} height={12} fill={ic} /></g> },
    { id: "rounded", el: <g><rect x={13} y={13} width={24} height={24} rx={5} fill={ic} /><rect x={16} y={16} width={18} height={18} rx={2.5} fill="#0d1f14" /><rect x={19} y={19} width={12} height={12} rx={2} fill={ic} /></g> },
    { id: "circle", el: <g><circle cx={25} cy={25} r={12} fill={ic} /><circle cx={25} cy={25} r={8.5} fill="#0d1f14" /><circle cx={25} cy={25} r={4.5} fill={ic} /></g> },
    { id: "dot-outline", el: <g><circle cx={25} cy={25} r={12} fill="none" stroke={ic} strokeWidth={2.5} /><circle cx={25} cy={25} r={4.5} fill={ic} /></g> },
    { id: "round-outer", el: <g><rect x={13} y={13} width={24} height={24} rx={9} fill={ic} /><rect x={16} y={16} width={18} height={18} rx={1.5} fill="#0d1f14" /><rect x={19} y={19} width={12} height={12} fill={ic} /></g> },
    { id: "thick", el: <g><rect x={12} y={12} width={26} height={26} rx={4} fill={ic} /><rect x={16} y={16} width={18} height={18} rx={1.5} fill="#0d1f14" /><rect x={19} y={19} width={12} height={12} fill={ic} /></g> },
    { id: "dashed", el: <g><rect x={13} y={13} width={24} height={24} rx={3} fill="none" stroke={ic} strokeWidth={2.5} strokeDasharray="4 2.5" /><rect x={19} y={19} width={12} height={12} fill={ic} /></g> },
    { id: "double", el: <g><rect x={13} y={13} width={24} height={24} rx={3} fill="none" stroke={ic} strokeWidth={1.5} /><rect x={15.5} y={15.5} width={19} height={19} rx={2} fill="none" stroke={ic} strokeWidth={1} /><rect x={19} y={19} width={12} height={12} fill={ic} /></g> },
    { id: "octagon", el: <g><polygon points="18,13 32,13 37,18 37,32 32,37 18,37 13,32 13,18" fill={ic} /><polygon points="19.5,16 30.5,16 35,20 35,30 30.5,34 19.5,34 15,30 15,20" fill="#0d1f14" /><rect x={19} y={19} width={12} height={12} fill={ic} /></g> },
    { id: "gap", el: <g><rect x={13} y={13} width={24} height={24} rx={4} fill={ic} /><rect x={16.5} y={16.5} width={17} height={17} rx={1.5} fill="#0d1f14" /><rect x={19} y={19} width={12} height={12} fill={ic} /></g> },
  ];

  const EYE_BALLS = [
    { id: "circle", el: <circle cx={25} cy={25} r={8} fill={ic} /> },
    { id: "square", el: <rect x={17} y={17} width={16} height={16} fill={ic} /> },
    { id: "rounded", el: <rect x={17} y={17} width={16} height={16} rx={4} fill={ic} /> },
    { id: "diamond", el: <polygon points="25,17 33,25 25,33 17,25" fill={ic} /> },
    { id: "hexagon", el: <polygon points={Array.from({ length: 6 }, (_, i) => { const a = (Math.PI / 3) * i - Math.PI / 6; return `${25 + 8 * Math.cos(a)},${25 + 8 * Math.sin(a)}`; }).join(" ")} fill={ic} /> },
    { id: "star", el: <polygon points={Array.from({ length: 10 }, (_, i) => { const a = (Math.PI / 5) * i - Math.PI / 2, r = i % 2 === 0 ? 8 : 3.5; return `${25 + r * Math.cos(a)},${25 + r * Math.sin(a)}`; }).join(" ")} fill={ic} /> },
    { id: "squircle", el: <rect x={17} y={17} width={16} height={16} rx={8} fill={ic} /> },
    { id: "kite", el: <polygon points="25,16 33,25 25,34 17,25" fill={ic} /> },
    { id: "leaf", el: <ellipse cx={25} cy={25} rx={5} ry={8} fill={ic} transform="rotate(-30,25,25)" /> },
    { id: "cross", el: <g><rect x={23} y={17} width={4} height={16} fill={ic} /><rect x={17} y={23} width={16} height={4} fill={ic} /></g> },
    { id: "ring", el: <circle cx={25} cy={25} r={7.5} fill="none" stroke={ic} strokeWidth={2.5} /> },
    { id: "dot-sq", el: <g><rect x={17} y={17} width={16} height={16} fill="none" stroke={ic} strokeWidth={1.5} /><circle cx={25} cy={25} r={4} fill={ic} /></g> },
  ];

  const tabs = [
    { id: "qr-shapes", label: "QR Shapes" },
    { id: "predesigned", label: "Pre-Designed" },
    { id: "stickers", label: "Stickers" },
    { id: "colors", label: "Colors" },
    { id: "shapes", label: "Shapes" },
    { id: "logos", label: "Logos" },
    { id: "decorate", label: "Decorate" },
  ];

  const plainDesigns = PRE_DESIGNS.filter(d => !d.sticker);
  const stickerDesigns = PRE_DESIGNS.filter(d => !!d.sticker);

  const renderPreview = () => {
    const qrSvg = (size: number, cId: string) => (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
        {gradDefs}
        <QRWithShape {...qrProps} size={size} clipId={cId} qrMatrix={previewMatrix} qrN={previewN} />
      </svg>
    );

    if (selectedSticker) {
      return (
        <div style={{ position: "relative", width: PREVIEW_PX }}>
          {selectedDesign?.sticker && <StickerBadge sticker={selectedDesign.sticker} />}
          <div style={{ borderRadius: 16, overflow: "visible", boxShadow: "0 8px 32px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <svg width={PREVIEW_PX} height={PREVIEW_PX} viewBox={`0 0 ${OUTER_PX} ${OUTER_PX}`} style={{ display: "block" }}>
              {gradDefs}
              <rect width={OUTER_PX} height={OUTER_PX} fill={activeBg} rx={16} />
              <g transform={`translate(${STICKER_RING_PAD},${STICKER_RING_PAD})`}>
                <QRWithShape {...qrProps} size={PREVIEW_PX} clipId={previewClipId} qrMatrix={previewMatrix} qrN={previewN} />
              </g>
              {selectedSticker.render(OUTER_PX, PREVIEW_PX)}
            </svg>
          </div>
        </div>
      );
    }

    return (
      <div style={{ position: "relative", width: PREVIEW_PX, marginTop: selectedDesign?.sticker ? 18 : 0 }}>
        {selectedDesign?.sticker && <StickerBadge sticker={selectedDesign.sticker} />}
        <div style={{ borderRadius: 14, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)", background: activeBg }}>
          {qrSvg(PREVIEW_PX, previewClipId)}
        </div>
      </div>
    );
  };

  // ── Tab content renderer ──────────────────────────────────────────────────

  const renderTabContent = () => {
    switch (activeTab) {

      case "qr-shapes":
        return (
          <>
            {/* <p style={{ margin: "0 0 14px", fontSize: 11, color: "rgba(148,163,184,0.6)", lineHeight: 1.6 }}>
              QR dots are distributed <em>inside</em> the shape outline — not simply cropped.
            </p> */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
              {QR_SHAPES.map(shape => {
                const sid = resolveShapeId(shape.id);
                const isActive = selectedShape.id === shape.id;
                return (
                  <div key={shape.id}>
                    <button onClick={() => setSelectedShape(shape)} title={shape.label} style={{
                      width: "100%", aspectRatio: "1", padding: 3, cursor: "pointer",
                      border: isActive ? "1.5px solid #22c55e" : "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 10, background: isActive ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.02)",
                      boxShadow: isActive ? "0 0 0 2px rgba(34,197,94,0.15)" : "none",
                      transform: isActive ? "scale(1.04)" : "scale(1)", transition: "all 0.15s",
                      display: "block", overflow: "hidden",
                    }}>
                      <QRShapeThumbnail shapeId={sid} fg="#111111" bg="#ffffff" size={70} clipId={`thumb-${shape.id}`} />
                    </button>
                    <div style={{ textAlign: "center", fontSize: 9, color: "rgba(148,163,184,0.5)", fontWeight: 500, marginTop: 3 }}>{shape.label}</div>
                  </div>
                );
              })}
            </div>
          </>
        );

      case "predesigned":
        return (
          <>
            <p style={{ margin: "0 0 12px", fontSize: 11, color: "rgba(148,163,184,0.6)", lineHeight: 1.6 }}>
              Select a design to apply its full style. Override colours in the Colors tab.
            </p>
            <SLabel>Dot Styles</SLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 16 }}>
              {plainDesigns.map(d => (
                <QRThumbnail key={d.id} design={d} selected={selectedDesign?.id === d.id}
                  onClick={() => {
                    if (selectedDesign?.id === d.id) setSelectedDesign(null);
                    else { setSelectedDesign(d); setFgOverride(null); setBgOverride(null); setShapesOverridden(false); setEyeEnabled(false); }
                  }} />
              ))}
            </div>
            <SLabel>✦ Sticker Styles</SLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
              {stickerDesigns.map(d => (
                <QRThumbnail key={d.id} design={d} selected={selectedDesign?.id === d.id}
                  onClick={() => {
                    if (selectedDesign?.id === d.id) setSelectedDesign(null);
                    else { setSelectedDesign(d); setFgOverride(null); setBgOverride(null); setShapesOverridden(false); setEyeEnabled(false); }
                  }} />
              ))}
            </div>
            {selectedDesign && (
              <div style={{ marginTop: 12, padding: "8px 12px", borderRadius: 8, background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.18)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: "#4ade80", fontWeight: 600 }}>✓ {selectedDesign.label} applied</span>
                <button onClick={() => setSelectedDesign(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, color: "rgba(148,163,184,0.45)", fontWeight: 600, fontFamily: FONT }}>Reset</button>
              </div>
            )}
          </>
        );

      case "stickers":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <p style={{ margin: "0 0 8px", fontSize: 11, color: "rgba(148,163,184,0.6)", lineHeight: 1.6 }}>
              Rings &amp; frames that wrap the <strong style={{ color: "#e2e8f0" }}>outside</strong> of your QR code.
            </p>
            {STICKER_CATEGORIES.map(([category, items]) => (
              <div key={category}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "12px 0 7px" }}>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
                  <span style={{ fontSize: 8.5, letterSpacing: "0.14em", color: "rgba(148,163,184,0.35)", textTransform: "uppercase" as const, whiteSpace: "nowrap" }}>{category}</span>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 7 }}>
                  {items.map(sticker => {
                    const isActive = selectedSticker?.id === sticker.id;
                    const tO = 62, tQ = 38, tP = (tO - tQ) / 2;
                    return (
                      <div key={sticker.id} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        <button onClick={() => setSelectedSticker(isActive ? null : sticker)} title={sticker.label} style={{
                          width: "100%", aspectRatio: "1", padding: 2, cursor: "pointer",
                          border: isActive ? "1.5px solid #22c55e" : "1px solid rgba(255,255,255,0.06)",
                          borderRadius: 9, background: isActive ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.02)",
                          boxShadow: isActive ? "0 0 0 2px rgba(34,197,94,0.15)" : "none",
                          transform: isActive ? "scale(1.05)" : "scale(1)", transition: "all 0.13s", position: "relative", overflow: "hidden",
                        }}>
                          {isActive && (
                            <div style={{ position: "absolute", top: 2, right: 2, zIndex: 3, width: 12, height: 12, borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <svg width="7" height="5" viewBox="0 0 7 5" fill="none"><path d="M1 2.5l1.5 1.5L6 1" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                          )}
                          <svg width="100%" height="100%" viewBox={`0 0 ${tO} ${tO}`} style={{ display: "block" }}>
                            <rect width={tO} height={tO} fill="#fff" rx={5} />
                            <g transform={`translate(${tP},${tP})`}>
                              {[0, 1, 2, 3, 4, 5, 6].map(r => [0, 1, 2, 3, 4, 5, 6].map(cc =>
                                (r === 0 || r === 6 || cc === 0 || cc === 6 || (r >= 2 && r <= 4 && cc >= 2 && cc <= 4)) && (
                                  <rect key={`${r}${cc}`} x={cc * (tQ / 7)} y={r * (tQ / 7)} width={tQ / 7 - 0.4} height={tQ / 7 - 0.4} fill="#2d3748" />
                                )
                              ))}
                            </g>
                            {sticker.render(tO, tQ)}
                          </svg>
                        </button>
                        <div style={{ textAlign: "center", fontSize: 8, color: "rgba(148,163,184,0.45)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sticker.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {selectedSticker && (
              <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 8, background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.18)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: "#4ade80", fontWeight: 600 }}>✓ {selectedSticker.label} applied</span>
                <button onClick={() => setSelectedSticker(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, color: "rgba(148,163,184,0.45)", fontFamily: FONT }}>Remove</button>
              </div>
            )}
          </div>
        );

      case "colors":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {selectedDesign && (
              <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.12)", fontSize: 10, color: "#4ade80", lineHeight: 1.5 }}>
                <strong>{selectedDesign.label}</strong> active — colour overrides apply on top.
              </div>
            )}
            <div>
              <SLabel>Solid Palettes</SLabel>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 7 }}>
                {PALETTES.map((p, i) => {
                  const active = !fgGradEnabled && fgOverride === p.fg && bgOverride === p.bg;
                  return (
                    <button key={i} title={p.label}
                      onClick={() => { setFgOverride(p.fg); setBgOverride(p.bg); setFgGradEnabled(false); setEyeColor(p.fg); setEyeEnabled(true); }}
                      style={{ width: "100%", aspectRatio: "1", border: "none", borderRadius: "50%", padding: 0, cursor: "pointer", overflow: "hidden", outline: active ? "2.5px solid #22c55e" : "1px solid rgba(255,255,255,0.08)", outlineOffset: active ? 2 : 1, transition: "all 0.13s", transform: active ? "scale(1.12)" : "scale(1)" }}>
                      <svg width="100%" height="100%" viewBox="0 0 40 40">
                        <circle cx={20} cy={20} r={20} fill={p.bg} />
                        <path d="M 20,0 A 20,20 0 0,1 20,40 L 20,20 Z" fill={p.fg} />
                        <circle cx={20} cy={20} r={20} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={1.5} />
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>
            <Divider />
            <div>
              <SLabel>Gradient Presets</SLabel>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 7 }}>
                {GRADIENT_PRESETS.map((g, i) => {
                  const active = fgGradEnabled && JSON.stringify(fgGradStops) === JSON.stringify(g.stops);
                  return (
                    <button key={i} title={g.label}
                      onClick={() => { setFgGradStops(g.stops); setFgGradAngle(g.angle); setFgGradEnabled(true); setEyeColor(g.stops[0].color); setEyeEnabled(true); }}
                      style={{ width: "100%", aspectRatio: "1.8", border: "none", borderRadius: 8, padding: 0, cursor: "pointer", overflow: "hidden", outline: active ? "2px solid #22c55e" : "1px solid rgba(255,255,255,0.08)", outlineOffset: active ? 2 : 0, transition: "all 0.13s", transform: active ? "scale(1.03)" : "scale(1)", background: `linear-gradient(${g.angle}deg,${g.stops.map(s => `${s.color} ${s.offset * 100}%`).join(",")})` }}>
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: "0.05em", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>{g.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              {fgGradEnabled && (
                <div style={{ marginTop: 10, padding: "10px 12px", borderRadius: 9, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 10, color: "rgba(148,163,184,0.6)", fontWeight: 600 }}>Angle</span>
                    <span style={{ fontSize: 10, color: "#4ade80", fontFamily: "monospace" }}>{fgGradAngle}°</span>
                  </div>
                  <input type="range" min={0} max={360} value={fgGradAngle} onChange={e => setFgGradAngle(Number(e.target.value))} style={{ width: "100%", accentColor: "#22c55e" }} />
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 10, color: "rgba(148,163,184,0.6)", fontWeight: 600 }}>Start</span>
                    <input type="color" value={fgGradStops[0]?.color ?? "#000"} onChange={e => { setFgGradStops(s => [{ ...s[0], color: e.target.value }, s[1]]); setEyeColor(e.target.value); setEyeEnabled(true); }} style={{ width: 26, height: 26, border: "none", cursor: "pointer", borderRadius: 5 }} />
                    <span style={{ fontSize: 10, color: "rgba(148,163,184,0.6)", fontWeight: 600, marginLeft: 8 }}>End</span>
                    <input type="color" value={fgGradStops[1]?.color ?? "#fff"} onChange={e => setFgGradStops(s => [s[0], { ...s[1], color: e.target.value }])} style={{ width: 26, height: 26, border: "none", cursor: "pointer", borderRadius: 5 }} />
                    <button onClick={() => setFgGradEnabled(false)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: 10, color: "rgba(148,163,184,0.4)", fontFamily: FONT }}>Use solid</button>
                  </div>
                </div>
              )}
            </div>
            <Divider />
            {[
              { enabled: fgOverride !== null && !fgGradEnabled, label: "Custom Foreground", onToggle: () => fgOverride ? setFgOverride(null) : (setFgOverride(activeFg), setFgGradEnabled(false)), color: fgOverride ?? activeFg, onChange: (v: string) => { setFgOverride(v); setFgGradEnabled(false); setEyeColor(v); setEyeEnabled(true); } },
              { enabled: bgOverride !== null, label: "Custom Background", onToggle: () => bgOverride ? setBgOverride(null) : setBgOverride(activeBg), color: bgOverride ?? activeBg, onChange: setBgOverride },
              { enabled: strokeEnabled, label: "Shape Stroke", onToggle: () => setStrokeEnabled(!strokeEnabled), color: strokeColor, onChange: setStrokeColor },
              { enabled: eyeEnabled, label: "Custom Eye Color", onToggle: () => setEyeEnabled(!eyeEnabled), color: eyeColor, onChange: setEyeColor },
            ].map(({ enabled, label, onToggle, color, onChange }) => (
              <div key={label} style={{ borderRadius: 10, border: `1px solid ${enabled ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.06)"}`, overflow: "hidden", transition: "border-color 0.2s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 12px", background: enabled ? "rgba(34,197,94,0.05)" : "rgba(255,255,255,0.015)", cursor: "pointer" }} onClick={onToggle}>
                  <CheckBox checked={enabled} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: enabled ? "#4ade80" : "rgba(148,163,184,0.6)" }}>{label}</span>
                </div>
                {enabled && <div style={{ padding: "10px 12px" }}><ColorPicker color={color} onChange={onChange} /></div>}
              </div>
            ))}
            {(fgOverride || bgOverride || fgGradEnabled) && (
              <button onClick={() => { setFgOverride(null); setBgOverride(null); setFgGradEnabled(false); setEyeEnabled(false); }}
                style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.015)", color: "rgba(148,163,184,0.45)", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: FONT, alignSelf: "flex-start" }}>
                ↩ Reset all colour overrides
              </button>
            )}
          </div>
        );

      case "shapes":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <SLabel>Body Dot Type</SLabel>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6 }}>
                {BODY_TYPES.map(bt => (
                  <ShapeBtn key={bt.id} sel={activeBodyType === bt.id} onClick={() => { setBodyType(bt.id); setShapesOverridden(true); }} el={bt.el} />
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(148,163,184,0.45)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Dot Scale</span>
                  <span style={{ fontSize: 10, color: "#22c55e", fontWeight: 700, fontFamily: "monospace" }}>{Math.round(bodyScale * 100)}%</span>
                </div>
                <input type="range" min={60} max={110} value={bodyScale * 100} onChange={e => setBodyScale(Number(e.target.value) / 100)} style={{ width: "100%", accentColor: "#22c55e", cursor: "pointer" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }} onClick={() => setStrokeEnabled(!strokeEnabled)}>
                <CheckBox checked={strokeEnabled} />
                <span style={{ fontSize: 10, fontWeight: 600, color: strokeEnabled ? "#4ade80" : "rgba(148,163,184,0.5)" }}>Stroke</span>
              </div>
            </div>
            <Divider />
            <div>
              <SLabel>Eye Frame Type</SLabel>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 6 }}>
                {EYE_FRAMES.map(ef => (
                  <ShapeBtn key={ef.id} sel={activeEyeFrame === ef.id} onClick={() => { setEyeFrameType(ef.id); setShapesOverridden(true); }} el={ef.el} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <SLabel>Eye Ball Type</SLabel>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 6 }}>
                {EYE_BALLS.map(eb => (
                  <ShapeBtn key={eb.id} sel={eyeBallType === eb.id} onClick={() => setEyeBallType(eb.id)} el={eb.el} />
                ))}
              </div>
            </div>
            {shapesOverridden && (
              <button onClick={() => { setBodyType("square"); setEyeFrameType("square"); setEyeBallType("square"); setBodyScale(1.0); setShapesOverridden(false); }}
                style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.015)", color: "rgba(148,163,184,0.45)", fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: FONT, alignSelf: "flex-start" }}>
                ↩ Reset shapes
              </button>
            )}
          </div>
        );

      case "logos":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ margin: 0, fontSize: 11, color: "rgba(148,163,184,0.6)" }}>Select a logo to embed in the centre of your QR code.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(8,1fr)", gap: 7 }}>
              {LOGOS.map((logo, idx) => {
                const isActive = selectedLogoIdx === idx;
                return (
                  <button key={logo.id} onClick={() => { setSelectedLogoIdx(isActive ? null : idx); setCustomLogoUrl(null); }} title={logo.label} style={{ width: "100%", aspectRatio: "1", border: "none", borderRadius: "50%", cursor: "pointer", padding: 0, overflow: "hidden", outline: isActive ? "2.5px solid #22c55e" : "1px solid rgba(255,255,255,0.08)", outlineOffset: isActive ? 2 : 0, boxShadow: isActive ? "0 0 0 4px rgba(34,197,94,0.15)" : "0 2px 6px rgba(0,0,0,0.3)", transform: isActive ? "scale(1.12)" : "scale(1)", transition: "all 0.14s" }}>
                    <div style={{ width: "100%", height: "100%", background: logo.bg, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", padding: "18%" }}>
                      <svg viewBox="0 0 24 24" width="100%" height="100%" style={{ display: "block" }}>{logo.icon}</svg>
                    </div>
                  </button>
                );
              })}
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 12, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" as const }}>
              <label style={{ display: "flex", alignItems: "center", gap: 7, background: "linear-gradient(135deg,#16a34a,#22c55e)", color: "#052e14", borderRadius: 9, padding: "8px 14px", cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: FONT, boxShadow: "0 2px 10px rgba(34,197,94,0.25)" }}>
                + Add Your Own Logo
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={async e => {
                  const f = e.target.files?.[0]; if (!f) return;
                  try {
                    const res = await uploadFile(f);
                    setCustomLogoUrl(res.url);
                    setSelectedLogoIdx(null);
                  } catch (err) { alert("Failed to upload logo."); }
                }} />
              </label>
              <span style={{ fontSize: 10, color: "rgba(148,163,184,0.35)" }}>Min 512px · 1:1 ratio</span>
            </div>
            {(selectedLogoIdx !== null || customLogoUrl) && (
              <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.18)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: "#4ade80", fontWeight: 600 }}>✓ {customLogoUrl ? "Custom logo" : LOGOS[selectedLogoIdx!]?.label} applied</span>
                <button onClick={() => { setSelectedLogoIdx(null); setCustomLogoUrl(null); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, color: "rgba(148,163,184,0.4)", fontFamily: FONT }}>Remove</button>
              </div>
            )}
          </div>
        );

      case "decorate":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>Add QR Code on Your Picture</p>
              <p style={{ margin: 0, fontSize: 11, color: "rgba(148,163,184,0.55)" }}>Upload a photo, then drag and resize the QR overlay. Hit Apply to flatten into a single PNG.</p>
            </div>
            <div
              ref={decorateContainerRef}
              style={{ border: "1.5px dashed rgba(255,255,255,0.08)", borderRadius: 12, minHeight: 200, position: "relative", overflow: "hidden", background: "rgba(255,255,255,0.015)", display: "flex", alignItems: "center", justifyContent: "center" }}
              onMouseMove={e => {
                if (!isDragging && !isResizing) return;
                const rect = e.currentTarget.getBoundingClientRect();
                if (isDragging) {
                  const dx = ((e.clientX - dragStart.mx) / rect.width) * 100;
                  const dy = ((e.clientY - dragStart.my) / rect.height) * 100;
                  setQrOverlay(prev => ({ ...prev, x: Math.max(0, Math.min(95 - prev.size / rect.width * 100, dragStart.ox + dx)), y: Math.max(0, Math.min(95 - prev.size / rect.height * 100, dragStart.oy + dy)) }));
                }
                if (isResizing) setQrOverlay(prev => ({ ...prev, size: Math.max(50, Math.min(250, resizeStart.os + (e.clientX - resizeStart.mx))) }));
              }}
              onMouseUp={() => { setIsDragging(false); setIsResizing(false); }}
              onMouseLeave={() => { setIsDragging(false); setIsResizing(false); }}
            >
              {decoratePicUrl ? (
                <div style={{ position: "relative", width: "100%", lineHeight: 0 }}>
                  <img src={decoratePicUrl} style={{ width: "100%", height: "auto", display: "block", userSelect: "none", pointerEvents: "none" }} draggable={false} alt="uploaded" />
                  <div
                    onMouseDown={e => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); setDragStart({ mx: e.clientX, my: e.clientY, ox: qrOverlay.x, oy: qrOverlay.y }); }}
                    style={{ position: "absolute", left: `${qrOverlay.x}%`, top: `${qrOverlay.y}%`, width: `${qrOverlay.size}px`, height: `${qrOverlay.size}px`, cursor: isDragging ? "grabbing" : "grab", border: "2px solid #22c55e", borderRadius: 6, boxShadow: "0 3px 14px rgba(0,0,0,0.5)", userSelect: "none", background: activeBg }}
                  >
                    <svg ref={decorateQrRef} width={qrOverlay.size} height={qrOverlay.size} viewBox={`0 0 ${PREVIEW_PX} ${PREVIEW_PX}`} xmlns="http://www.w3.org/2000/svg" style={{ display: "block", borderRadius: 4 }}>
                      {gradDefs}
                      <QRWithShape {...qrProps} size={PREVIEW_PX} clipId={`dec-${activeShapeId}`} qrMatrix={previewMatrix} qrN={previewN} />
                    </svg>
                    <div
                      onMouseDown={e => { e.preventDefault(); e.stopPropagation(); setIsResizing(true); setResizeStart({ mx: e.clientX, my: e.clientY, os: qrOverlay.size }); }}
                      style={{ position: "absolute", bottom: -6, right: -6, width: 12, height: 12, background: "#22c55e", borderRadius: 3, cursor: "se-resize", border: "2px solid white" }}
                    />
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: 32 }}>
                  <div style={{ width: 56, height: 56, background: "rgba(255,255,255,0.03)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="rgba(148,163,184,0.25)"><path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z" /></svg>
                  </div>
                  <label style={{ background: "linear-gradient(135deg,#16a34a,#22c55e)", color: "#052e14", borderRadius: 9, padding: "9px 18px", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: FONT, boxShadow: "0 2px 12px rgba(34,197,94,0.25)" }}>
                    + Add Picture
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={async e => {
                      const f = e.target.files?.[0]; if (!f) return;
                      try {
                        const res = await uploadFile(f);
                        setDecoratePicUrl(res.url);
                        setQrOverlay({ x: 5, y: 5, size: 100 });
                      } catch (err) { alert("Failed to upload picture."); }
                    }} />
                  </label>
                  <p style={{ margin: 0, fontSize: 10, color: "rgba(148,163,184,0.35)", textAlign: "center" }}>PNG, JPG, GIF supported</p>
                </div>
              )}
            </div>
            {decoratePicUrl && (
              <div style={{ display: "flex", gap: 7 }}>
                  <label style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: "rgba(34,197,94,0.06)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 9, padding: "7px 12px", cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: FONT }}>
                  🔄 Change Picture
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={async e => {
                    const f = e.target.files?.[0]; if (!f) return;
                    try {
                      const res = await uploadFile(f);
                      setDecoratePicUrl(res.url);
                      setQrOverlay({ x: 5, y: 5, size: 100 });
                    } catch (err) { alert("Failed to upload picture."); }
                  }} />
                </label>
                <button onClick={() => { setDecoratePicUrl(null); setQrOverlay({ x: 5, y: 5, size: 100 }); }} style={{ padding: "7px 12px", borderRadius: 9, border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.06)", color: "#f87171", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>✕ Remove</button>
              </div>
            )}
            {decoratePicUrl && (
              <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.12)", fontSize: 10, color: "#4ade80", lineHeight: 1.5 }}>
                💡 Hit <strong>Apply Changes</strong> to export a flattened PNG combining the image and QR code.
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{
      minHeight: "100vh", width: "100%",
      background: "rgba(0,0,0,0.75)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      display: "flex", alignItems: "flex-start", justifyContent: "center",
      padding: "28px 16px 40px",
      fontFamily: FONT,
    }}>
      {/* ── Modal container ── */}
      <div style={{
        width: "100%", maxWidth: 1180,
        background: "linear-gradient(160deg, #0f1a14 0%, #111816 40%, #0d1510 100%)",
        border: "1px solid rgba(34,197,94,0.12)",
        borderRadius: 24,
        boxShadow: "0 40px 100px rgba(0,0,0,0.85), 0 0 0 1px rgba(34,197,94,0.08), 0 0 60px rgba(34,197,94,0.04)",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        maxHeight: "calc(100vh - 56px)",
      }}>

        {/* ── Sticky header ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: 16,
          padding: "18px 28px",
          borderBottom: "1px solid rgba(34,197,94,0.1)",
          background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.18) 100%)",
          flexShrink: 0,
        }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, flexShrink: 0, background: "linear-gradient(135deg,#059669,#22c55e)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(34,197,94,0.3), 0 0 0 3px rgba(34,197,94,0.08), inset 0 1px 0 rgba(255,255,255,0.15)" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#052e14" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="3" height="3" rx="0.5" />
              <rect x="19" y="14" width="2" height="2" rx="0.5" /><rect x="14" y="19" width="2" height="2" rx="0.5" />
              <rect x="18" y="18" width="3" height="3" rx="0.5" />
            </svg>
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: "-0.03em", background: "linear-gradient(135deg, #f1f5f9 30%, #4ade80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Customize QR Code</h2>
            <p style={{ margin: "3px 0 0", fontSize: 11, color: "rgba(148,163,184,0.45)", letterSpacing: "0.06em", fontWeight: 500 }}>Design · Colors · Shapes · Logos · Decorate</p>
          </div>
          {hasCustomisation && (
            <div style={{ marginLeft: "auto", padding: "5px 12px", borderRadius: 20, background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", fontSize: 10, color: "#4ade80", fontWeight: 600, letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: 6, backdropFilter: "blur(8px)" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ade80", display: "inline-block", boxShadow: "0 0 6px #4ade80" }} />
              Customised
            </div>
          )}
          {onClose && (
            <button onClick={onClose}
              style={{ marginLeft: hasCustomisation ? 10 : "auto", width: 36, height: 36, borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(148,163,184,0.5)", fontSize: 16, flexShrink: 0, transition: "all 0.2s" }}
              onMouseOver={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)"; e.currentTarget.style.color = "#f87171"; }}
              onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(148,163,184,0.5)"; }}
            >✕</button>
          )}
        </div>

        {/* ── Body: two-pane ── */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0, flexShrink: 1 }}>

          {/* Left pane — options */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", borderRight: "1px solid rgba(34,197,94,0.08)", minWidth: 0 }}>

            {/* Tab bar */}
            <div style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none" as React.CSSProperties["scrollbarWidth"], background: "rgba(0,0,0,0.2)", borderBottom: "1px solid rgba(34,197,94,0.06)", padding: "8px 10px 8px", flexShrink: 0, gap: 4 }}>
              {tabs.map(tab => {
                const active = activeTab === tab.id;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                    padding: "7px 14px", border: "none", cursor: "pointer",
                    whiteSpace: "nowrap", fontFamily: FONT, fontSize: 10,
                    fontWeight: active ? 700 : 500, letterSpacing: "0.06em",
                    textTransform: "uppercase" as const,
                    color: active ? "#052e14" : "rgba(148,163,184,0.5)",
                    background: active ? "linear-gradient(135deg,#16a34a,#22c55e)" : "rgba(255,255,255,0.02)",
                    borderRadius: 10,
                    boxShadow: active ? "0 2px 8px rgba(34,197,94,0.3)" : "none",
                    transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
                  }}
                    onMouseOver={e => { if (!active) { e.currentTarget.style.background = "rgba(34,197,94,0.08)"; e.currentTarget.style.color = "#4ade80"; } }}
                    onMouseOut={e => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.color = "rgba(148,163,184,0.5)"; } }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Scrollable tab content */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px", scrollbarWidth: "thin" as React.CSSProperties["scrollbarWidth"], minHeight: 0 }}>
              {renderTabContent()}
            </div>
          </div>

          {/* Right pane — docked preview */}
          <div style={{ width: 320, flexShrink: 1, minWidth: 0, display: "flex", flexDirection: "column", background: "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(5,15,10,0.25) 100%)" }}>

            {/* Preview label */}
            <div style={{ padding: "14px 22px 10px", borderBottom: "1px solid rgba(34,197,94,0.06)", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block", boxShadow: "0 0 8px rgba(34,197,94,0.6), 0 0 2px #22c55e", animation: "pulse-dot 2s ease-in-out infinite" }} />
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" as const, color: "rgba(74,222,128,0.45)" }}>Live Preview</span>
              </div>
              <style>{`@keyframes pulse-dot{0%,100%{opacity:1;box-shadow:0 0 8px rgba(34,197,94,0.6)}50%{opacity:0.6;box-shadow:0 0 4px rgba(34,197,94,0.3)}}`}</style>
            </div>

            {/* Preview area — scrollable */}
            <div style={{
              flex: 1, overflowY: "auto", padding: "24px 22px", display: "flex", flexDirection: "column", alignItems: "center", gap: 18, scrollbarWidth: "thin" as React.CSSProperties["scrollbarWidth"],
              backgroundImage: "radial-gradient(rgba(34,197,94,0.04) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
              minHeight: 0,
            }}>

              {/* QR preview */}
              {activeTab === "decorate" && decoratePicUrl ? (
                <div style={{ position: "relative", width: "100%", borderRadius: 14, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(34,197,94,0.08)" }}>
                  <img src={decoratePicUrl} alt="Decorated preview" style={{ width: "100%", height: "auto", display: "block" }} draggable={false} />
                  <div style={{ position: "absolute", left: `${qrOverlay.x}%`, top: `${qrOverlay.y}%`, width: 64, height: 64, borderRadius: 4, overflow: "hidden" }}>
                    <svg width="64" height="64" viewBox={`0 0 ${PREVIEW_PX} ${PREVIEW_PX}`} style={{ display: "block" }}>
                      {gradDefs}
                      <QRWithShape {...qrProps} size={PREVIEW_PX} clipId={`decprev-${activeShapeId}`} />
                    </svg>
                  </div>
                </div>
              ) : (
                renderPreview()
              )}

              {/* Shape + design label */}
              <div style={{ textAlign: "center", width: "100%", padding: "10px 14px", borderRadius: 14, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(34,197,94,0.06)" }}>
                <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: "-0.01em", marginBottom: 3, background: "linear-gradient(135deg, #4ade80, #22c55e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{selectedShape.label}</div>
                <div style={{ fontSize: 10, color: "rgba(148,163,184,0.45)", letterSpacing: "0.02em" }}>
                  {selectedSticker ? selectedSticker.label : selectedDesign ? selectedDesign.label : "Classic theme"}
                  {fgGradEnabled && <span style={{ marginLeft: 5, color: "#22c55e" }}>· gradient</span>}
                  {(fgOverride || bgOverride) && !fgGradEnabled && <span style={{ marginLeft: 5, color: "#22c55e" }}>· custom colour</span>}
                </div>
              </div>

              {/* Active settings summary */}
              {hasCustomisation && (
                <div style={{ width: "100%", borderRadius: 14, padding: "14px 16px", background: "rgba(34,197,94,0.03)", border: "1px solid rgba(34,197,94,0.1)", backdropFilter: "blur(8px)" }}>
                  <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "rgba(74,222,128,0.4)", marginBottom: 10, display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(34,197,94,0.5)", display: "inline-block" }} />
                    Active Settings
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {selectedDesign && <SummaryRow label="Design" value={selectedDesign.label} onClear={() => setSelectedDesign(null)} />}
                    {selectedSticker && <SummaryRow label="Sticker" value={selectedSticker.label} onClear={() => setSelectedSticker(null)} />}
                    {selectedLogoIdx !== null && <SummaryRow label="Logo" value={LOGOS[selectedLogoIdx]?.label} onClear={() => setSelectedLogoIdx(null)} />}
                    {fgGradEnabled && <SummaryRow label="Gradient" value={`${fgGradAngle}° custom`} onClear={() => { setFgGradEnabled(false); setEyeEnabled(false); }} />}
                    {fgOverride && !fgGradEnabled && <SummaryRow label="FG" value={fgOverride} onClear={() => setFgOverride(null)} swatch={fgOverride} />}
                    {bgOverride && <SummaryRow label="BG" value={bgOverride} onClear={() => setBgOverride(null)} swatch={bgOverride} />}
                    {shapesOverridden && <SummaryRow label="Shapes" value="Custom dot/eye styles" onClear={() => { setShapesOverridden(false); setBodyType("square"); setEyeFrameType("square"); setEyeBallType("square"); }} />}
                    {decoratePicUrl && <SummaryRow label="Decorate" value="Image overlay active" onClear={() => setDecoratePicUrl(null)} />}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Sticky footer ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "16px 28px",
          borderTop: "1px solid rgba(34,197,94,0.1)",
          background: "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.35) 100%)",
          backdropFilter: "blur(12px)",
          flexShrink: 0,
        }}>
          {onClose && (
            <button onClick={onClose}
              style={{ padding: "10px 20px", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FONT, background: "rgba(255,255,255,0.02)", color: "rgba(148,163,184,0.5)", transition: "all 0.2s", flexShrink: 0 }}
              onMouseOver={e => { e.currentTarget.style.background = "rgba(239,68,68,0.06)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)"; e.currentTarget.style.color = "#f87171"; }}
              onMouseOut={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(148,163,184,0.5)"; }}
            >
              ✕ Discard &amp; Close
            </button>
          )}

          {decoratePicUrl && (
            <div style={{ fontSize: 10, color: "rgba(74,222,128,0.55)", display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: 8, background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.1)" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ade80", flexShrink: 0, boxShadow: "0 0 4px #4ade80" }} />
              Decorate active — Apply exports a flattened PNG
            </div>
          )}

          <button
            onClick={handleApply}
            disabled={isApplying}
            style={{
              marginLeft: "auto", padding: "12px 32px", border: "none", borderRadius: 14,
              fontSize: 14, fontWeight: 800, cursor: isApplying ? "wait" : "pointer", fontFamily: FONT,
              letterSpacing: "0.01em",
              background: isApplying ? "rgba(34,197,94,0.4)" : "linear-gradient(135deg,#16a34a,#22c55e 60%,#4ade80)",
              color: "#052e14",
              boxShadow: isApplying ? "none" : "0 6px 24px rgba(34,197,94,0.35), 0 0 0 2px rgba(34,197,94,0.08), inset 0 1px 0 rgba(255,255,255,0.15)",
              transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
              display: "flex", alignItems: "center", gap: 8, flexShrink: 0,
            }}
            onMouseOver={e => { if (!isApplying) { e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(34,197,94,0.5), 0 0 0 2px rgba(34,197,94,0.15), inset 0 1px 0 rgba(255,255,255,0.2)"; } }}
            onMouseOut={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(34,197,94,0.35), 0 0 0 2px rgba(34,197,94,0.08), inset 0 1px 0 rgba(255,255,255,0.15)"; }}
          >
            {isApplying ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#052e14" strokeWidth="2.5" strokeLinecap="round" style={{ animation: "spin 1s linear infinite" }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
                Applying…
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3.5 3.5L13 4.5" stroke="#052e14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Apply Changes
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
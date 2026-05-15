{/* theme: converted */}
import React, { useState, ReactNode, useMemo, useRef, useCallback } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import {
  QR_SHAPES, PRE_DESIGNS, LOGOS,
} from "@/components/dashboard/pages/constants";
import {
  QRWithShape, QRShapeThumbnail, StickerBadge, QRThumbnail,
  QR_SHAPE_DEFS, STICKER_DEFS, StickerDef, QRWithShapeCanvas,
} from "@/components/dashboard/pages/Qrrenderers";
import { makeQRMatrix } from "@/components/dashboard/pages/qr-engine";
import { uploadFile } from "@/lib/api";

const PREVIEW_PX = 240;
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

// ── UI atoms (converted to Tailwind) ─────────────────────────────────────────

const SLabel = ({ children }: { children: ReactNode }) => (
  <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground/60 mb-2.5">
    <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground/40" />
    {children}
  </div>
);

const Divider = () => <div className="h-px bg-gradient-to-r from-transparent via-border/40 to-transparent my-1.5" />;

function CheckBox({ checked }: { checked: boolean }) {
  return (
    <div className={`w-4 h-4 rounded-sm border flex items-center justify-center flex-shrink-0 transition-all ${
      checked ? 'border-primary bg-primary' : 'border-muted-foreground/30 bg-transparent'
    }`}>
      {checked && <svg width="9" height="7" viewBox="0 0 9 7"><path d="M1 3.5l2 2L8 1" stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
    </div>
  );
}

function ColorPicker({ color, onChange }: { color: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-[30px] h-[30px] rounded-md border border-border/50 flex-shrink-0" style={{ background: color }} />
      <input type="color" value={color.length === 7 ? color : "#111111"} onChange={e => onChange(e.target.value)}
        className="w-[30px] h-[30px] border-none bg-transparent cursor-pointer p-0" />
      <input value={color} onChange={e => onChange(e.target.value)}
        className="flex-1 px-2.5 py-1.5 rounded-md border border-border bg-muted/30 text-foreground text-xs font-mono outline-none focus:ring-1 focus:ring-ring" />
    </div>
  );
}

const ShapeBtn = ({ sel, onClick, el }: { sel: boolean; onClick: () => void; el: ReactNode }) => (
  <button onClick={onClick} className={`w-full aspect-square p-1 cursor-pointer rounded-lg transition-all ${
    sel ? 'border-2 border-primary bg-primary/10 shadow-[0_0_0_2px_rgba(34,197,94,0.15)] scale-105' : 'border border-border/60 bg-muted/20 hover:bg-muted/40'
  }`}>
    <svg width="100%" height="100%" viewBox="10 10 30 30" className="block">{el}</svg>
  </button>
);

function SummaryRow({ label, value, onClear, swatch }: { label: string; value: string; onClear: () => void; swatch?: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[10px]">
      {swatch && <div className="w-2.5 h-2.5 rounded-sm border border-border/30 flex-shrink-0" style={{ background: swatch }} />}
      <span className="text-muted-foreground/60 min-w-[52px]">{label}</span>
      <span className="text-muted-foreground flex-1 truncate">{value}</span>
      <button onClick={onClear} className="bg-transparent border-none cursor-pointer text-muted-foreground/40 text-sm px-0.5 leading-none hover:text-foreground">×</button>
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
    bg.onerror = () => resolve(canvas.toDataURL("image/png"));
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
  const { isDark } = useTheme();
  const targetUrl = propTargetUrl ?? (typeof window !== "undefined" ? window.location.href : "https://samcard.app");

  const { matrix: previewMatrix, N: previewN } = useMemo(() => makeQRMatrix(targetUrl), [targetUrl]);

  const [selectedShape, setSelectedShape] = useState(() =>
    initialConfig?.shapeId ? findShapeById(initialConfig.shapeId) : QR_SHAPES[0]
  );
  const [selectedDesign, setSelectedDesign] = useState<PreDesign | null>(null);
  const [selectedSticker, setSelectedSticker] = useState<StickerDef | null>(() => initialConfig?.selectedSticker ?? null);
  const [activeTab, setActiveTab] = useState("qr-shapes");
  const [useCanvasRenderer, setUseCanvasRenderer] = useState(false);

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
  const isSquareShape = activeShapeId === 'square' || activeShapeId === 'rounded-square';
  const STICKER_RING_PAD = isSquareShape ? 70 : 30;
  const OUTER_PX = PREVIEW_PX + STICKER_RING_PAD * 2;

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
    decoratePicUrl, qrOverlay, onApply, onClose,
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
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block">
        {gradDefs}
        <QRWithShape {...qrProps} size={size} clipId={cId} qrMatrix={previewMatrix} qrN={previewN} />
      </svg>
    );

    const qrCanvas = (size: number) => (
      <QRWithShapeCanvas
        url={targetUrl}
        size={size}
        dotColor={activeFg}
        bgColor={activeBg}
        dotShape={activeBodyType}
        finderStyle={activeEyeFrame}
      />
    );

    if (selectedSticker) {
      return (
        <div className="relative w-[240px]">
          {selectedDesign?.sticker && <StickerBadge sticker={selectedDesign.sticker} />}
          <div className="rounded-lg overflow-visible shadow-2xl border border-white/5">
            <svg width={PREVIEW_PX} height={PREVIEW_PX} viewBox={`0 0 ${OUTER_PX} ${OUTER_PX}`} className="block">
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

    // Canvas preview
    if (useCanvasRenderer) {
      return (
        <div className="relative w-[240px] mt-4">
          {selectedDesign?.sticker && <StickerBadge sticker={selectedDesign.sticker} />}
          <div className="rounded-lg overflow-hidden shadow-2xl border border-white/5" style={{ background: activeBg }}>
            {qrCanvas(PREVIEW_PX)}
          </div>
        </div>
      );
    }

    // SVG preview (default)
    return (
      <div className="relative w-[240px] mt-4">
        {selectedDesign?.sticker && <StickerBadge sticker={selectedDesign.sticker} />}
        <div className="rounded-lg overflow-hidden shadow-2xl border border-white/5" style={{ background: activeBg }}>
          {qrSvg(PREVIEW_PX, previewClipId)}
        </div>
      </div>
    );
  };

  // ── Tab content renderer (converted to Tailwind) ────────────────────────────

  const renderTabContent = () => {
    switch (activeTab) {

      case "qr-shapes":
        return (
          <div className="grid grid-cols-5 gap-2">
            {QR_SHAPES.map(shape => {
              const sid = resolveShapeId(shape.id);
              const isActive = selectedShape.id === shape.id;
              return (
                <div key={shape.id}>
                  <button onClick={() => setSelectedShape(shape)} title={shape.label} className={`w-full aspect-square p-0.5 cursor-pointer rounded-lg overflow-hidden transition-all ${
                    isActive ? 'border-2 border-primary bg-primary/10 shadow-[0_0_0_2px_rgba(34,197,94,0.15)] scale-105' : 'border border-border/60 bg-muted/20 hover:bg-muted/40'
                  }`}>
                    <QRShapeThumbnail shapeId={sid} fg="#111111" bg="#ffffff" size={70} clipId={`thumb-${shape.id}`} />
                  </button>
                  <div className="text-center text-[9px] text-muted-foreground/60 font-medium mt-1">{shape.label}</div>
                </div>
              );
            })}
          </div>
        );

      case "predesigned":
        return (
          <>
            <p className="text-[11px] text-muted-foreground/60 leading-relaxed mb-3">
              Select a design to apply its full style. Override colours in the Colors tab.
            </p>
            <SLabel>Dot Styles</SLabel>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {plainDesigns.map(d => (
                <QRThumbnail key={d.id} design={d} selected={selectedDesign?.id === d.id}
                  onClick={() => {
                    if (selectedDesign?.id === d.id) setSelectedDesign(null);
                    else { setSelectedDesign(d); setFgOverride(null); setBgOverride(null); setShapesOverridden(false); setEyeEnabled(false); setFgGradEnabled(false); }
                  }} />
              ))}
            </div>
            <SLabel>✦ Sticker Styles</SLabel>
            <div className="grid grid-cols-4 gap-2">
              {stickerDesigns.map(d => (
                <QRThumbnail key={d.id} design={d} selected={selectedDesign?.id === d.id}
                  onClick={() => {
                    if (selectedDesign?.id === d.id) setSelectedDesign(null);
                    else { setSelectedDesign(d); setFgOverride(null); setBgOverride(null); setShapesOverridden(false); setEyeEnabled(false); setFgGradEnabled(false); }
                  }} />
              ))}
            </div>
            {selectedDesign && (
              <div className="mt-3 px-3 py-2 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-between">
                <span className="text-[11px] text-primary font-semibold">✓ {selectedDesign.label} applied</span>
                <button onClick={() => setSelectedDesign(null)} className="bg-transparent border-none cursor-pointer text-[10px] text-muted-foreground/60 font-semibold hover:text-foreground">Reset</button>
              </div>
            )}
          </>
        );

      case "stickers":
        return (
          <div className="flex flex-col gap-1">
            <p className="text-[11px] text-muted-foreground/60 leading-relaxed mb-2">
              Rings &amp; frames that wrap the <strong className="text-foreground">outside</strong> of your QR code.
            </p>
            {STICKER_CATEGORIES.map(([category, items]) => (
              <div key={category}>
                <div className="flex items-center gap-2 my-3">
                  <div className="flex-1 h-px bg-border/40" />
                  <span className="text-[8.5px] tracking-[0.14em] text-muted-foreground/40 uppercase whitespace-nowrap">{category}</span>
                  <div className="flex-1 h-px bg-border/40" />
                </div>
                <div className="grid grid-cols-6 gap-1.5">
                  {items.map(sticker => {
                    const isActive = selectedSticker?.id === sticker.id;
                    const tO = 62, tQ = 38, tP = (tO - tQ) / 2;
                    return (
                      <div key={sticker.id} className="flex flex-col gap-0.5">
                        <button onClick={() => setSelectedSticker(isActive ? null : sticker)} title={sticker.label} className={`relative w-full aspect-square p-0.5 cursor-pointer rounded-lg overflow-hidden transition-all ${
                          isActive ? 'border-2 border-primary bg-primary/10 shadow-[0_0_0_2px_rgba(34,197,94,0.15)] scale-105' : 'border border-border/60 bg-muted/20 hover:bg-muted/40'
                        }`}>
                          {isActive && (
                            <div className="absolute top-1 right-1 z-10 w-3 h-3 rounded-full bg-primary flex items-center justify-center">
                              <svg width="7" height="5" viewBox="0 0 7 5" fill="none"><path d="M1 2.5l1.5 1.5L6 1" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                          )}
                          <svg width="100%" height="100%" viewBox={`0 0 ${tO} ${tO}`} className="block">
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
                        <div className="text-center text-[8px] text-muted-foreground/50 font-medium truncate">{sticker.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {selectedSticker && (
              <div className="mt-2.5 px-3 py-2 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-between">
                <span className="text-[11px] text-primary font-semibold">✓ {selectedSticker.label} applied</span>
                <button onClick={() => setSelectedSticker(null)} className="bg-transparent border-none cursor-pointer text-[10px] text-muted-foreground/60 font-semibold hover:text-foreground">Remove</button>
              </div>
            )}
          </div>
        );

      case "colors":
        return (
          <div className="flex flex-col gap-3.5">
            {selectedDesign && (
              <div className="px-3 py-2 rounded-md bg-primary/10 border border-primary/20 text-[10px] text-primary leading-relaxed">
                <strong>{selectedDesign.label}</strong> active — colour overrides apply on top.
              </div>
            )}
            <div>
              <SLabel>Solid Palettes</SLabel>
              <div className="grid grid-cols-7 gap-1.5">
                {PALETTES.map((p, i) => {
                  const active = !fgGradEnabled && fgOverride === p.fg && bgOverride === p.bg;
                  return (
                    <button key={i} title={p.label}
                      onClick={() => { setFgOverride(p.fg); setBgOverride(p.bg); setFgGradEnabled(false); setEyeColor(p.fg); setEyeEnabled(true); }}
                      className={`w-full aspect-square border-none rounded-full p-0 cursor-pointer overflow-hidden transition-all ${
                        active ? 'outline outline-2 outline-primary scale-110' : 'outline outline-1 outline-border/30'
                      }`}>
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
              <div className="grid grid-cols-4 gap-1.5">
                {GRADIENT_PRESETS.map((g, i) => {
                  const active = fgGradEnabled && JSON.stringify(fgGradStops) === JSON.stringify(g.stops);
                  return (
                    <button key={i} title={g.label}
                      onClick={() => { setFgGradStops(g.stops); setFgGradAngle(g.angle); setFgGradEnabled(true); setEyeColor(g.stops[0].color); setEyeEnabled(true); }}
                      className={`w-full aspect-[1.8] border-none rounded-lg p-0 cursor-pointer overflow-hidden transition-all ${
                        active ? 'outline outline-2 outline-primary scale-105' : 'outline outline-1 outline-border/30'
                      }`}
                      style={{ background: `linear-gradient(${g.angle}deg,${g.stops.map(s => `${s.color} ${s.offset * 100}%`).join(",")})` }}>
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-[9px] font-bold text-white/90 tracking-[0.05em] drop-shadow-md">{g.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              {fgGradEnabled && (
                <div className="mt-2.5 p-2.5 rounded-md bg-muted/20 border border-border/60 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-muted-foreground/80 font-semibold">Angle</span>
                    <span className="text-[10px] text-primary font-mono">{fgGradAngle}°</span>
                  </div>
                  <input type="range" min={0} max={360} value={fgGradAngle} onChange={e => setFgGradAngle(Number(e.target.value))} className="w-full accent-primary" />
                  <div className="flex gap-2 items-center">
                    <span className="text-[10px] text-muted-foreground/80 font-semibold">Start</span>
                    <input type="color" value={fgGradStops[0]?.color ?? "#000"} onChange={e => { setFgGradStops(s => [{ ...s[0], color: e.target.value }, s[1]]); setEyeColor(e.target.value); setEyeEnabled(true); }} className="w-6 h-6 border-none cursor-pointer rounded-md" />
                    <span className="text-[10px] text-muted-foreground/80 font-semibold ml-2">End</span>
                    <input type="color" value={fgGradStops[1]?.color ?? "#fff"} onChange={e => setFgGradStops(s => [s[0], { ...s[1], color: e.target.value }])} className="w-6 h-6 border-none cursor-pointer rounded-md" />
                    <button onClick={() => setFgGradEnabled(false)} className="ml-auto bg-transparent border-none cursor-pointer text-[10px] text-muted-foreground/50 hover:text-foreground">Use solid</button>
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
              <div key={label} className={`rounded-md border overflow-hidden transition-colors ${enabled ? 'border-primary/30' : 'border-border/60'}`}>
                <div className={`flex items-center gap-2 px-3 py-2 cursor-pointer ${enabled ? 'bg-primary/10' : 'bg-muted/20'}`} onClick={onToggle}>
                  <CheckBox checked={enabled} />
                  <span className={`text-xs font-semibold ${enabled ? 'text-primary' : 'text-muted-foreground/80'}`}>{label}</span>
                </div>
                {enabled && <div className="p-2.5"><ColorPicker color={color} onChange={onChange} /></div>}
              </div>
            ))}
            {(fgOverride || bgOverride || fgGradEnabled) && (
              <button onClick={() => { setFgOverride(null); setBgOverride(null); setFgGradEnabled(false); setEyeEnabled(false); }}
                className="self-start px-3 py-1.5 rounded-md border border-border/60 bg-muted/20 text-muted-foreground/60 text-[10px] font-semibold hover:text-foreground">
                ↩ Reset all colour overrides
              </button>
            )}
          </div>
        );

      case "shapes":
        return (
          <div className="flex flex-col gap-4">
            <div>
              <SLabel>Body Dot Type</SLabel>
              <div className="grid grid-cols-7 gap-1.5">
                {BODY_TYPES.map(bt => (
                  <ShapeBtn key={bt.id} sel={activeBodyType === bt.id} onClick={() => { setBodyType(bt.id); setShapesOverridden(true); }} el={bt.el} />
                ))}
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="flex-1">
                <div className="flex justify-between mb-1.5">
                  <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wide">Dot Scale</span>
                  <span className="text-[10px] text-primary font-bold font-mono">{Math.round(bodyScale * 100)}%</span>
                </div>
                <input type="range" min={60} max={110} value={bodyScale * 100} onChange={e => setBodyScale(Number(e.target.value) / 100)} className="w-full accent-primary cursor-pointer" />
              </div>
              <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setStrokeEnabled(!strokeEnabled)}>
                <CheckBox checked={strokeEnabled} />
                <span className={`text-[10px] font-semibold ${strokeEnabled ? 'text-primary' : 'text-muted-foreground/70'}`}>Stroke</span>
              </div>
            </div>
            <Divider />
            <div>
              <SLabel>Eye Frame Type</SLabel>
              <div className="grid grid-cols-5 gap-1.5">
                {EYE_FRAMES.map(ef => (
                  <ShapeBtn key={ef.id} sel={activeEyeFrame === ef.id} onClick={() => { setEyeFrameType(ef.id); setShapesOverridden(true); }} el={ef.el} />
                ))}
              </div>
            </div>
            <Divider />
            <div>
              <SLabel>Eye Ball Type</SLabel>
              <div className="grid grid-cols-6 gap-1.5">
                {EYE_BALLS.map(eb => (
                  <ShapeBtn key={eb.id} sel={eyeBallType === eb.id} onClick={() => setEyeBallType(eb.id)} el={eb.el} />
                ))}
              </div>
            </div>
            {shapesOverridden && (
              <button onClick={() => { setBodyType("square"); setEyeFrameType("square"); setEyeBallType("square"); setBodyScale(1.0); setShapesOverridden(false); }}
                className="self-start px-3 py-1.5 rounded-md border border-border/60 bg-muted/20 text-muted-foreground/60 text-[10px] font-semibold hover:text-foreground">
                ↩ Reset shapes
              </button>
            )}
          </div>
        );

      case "logos":
        return (
          <div className="flex flex-col gap-3.5">
            <p className="text-[11px] text-muted-foreground/60">Select a logo to embed in the centre of your QR code.</p>
            <div className="grid grid-cols-8 gap-1.5">
              {LOGOS.map((logo, idx) => {
                const isActive = selectedLogoIdx === idx;
                return (
                  <button key={logo.id} onClick={() => { setSelectedLogoIdx(isActive ? null : idx); setCustomLogoUrl(null); }} title={logo.label} className={`w-full aspect-square border-none rounded-full cursor-pointer p-0 overflow-hidden transition-all ${
                    isActive ? 'outline outline-2 outline-primary scale-110 shadow-[0_0_0_4px_rgba(34,197,94,0.15)]' : 'outline outline-1 outline-border/30 shadow-md'
                  }`}>
                    <div className="w-full h-full flex items-center justify-center rounded-full p-[18%]" style={{ background: logo.bg }}>
                      <svg viewBox="0 0 24 24" width="100%" height="100%" className="block">{logo.icon}</svg>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="pt-3 border-t border-border/40 flex items-center gap-2 flex-wrap">
              <label className="flex items-center gap-1.5 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-md px-3 py-2 cursor-pointer text-[11px] font-bold shadow-md">
                + Add Your Own Logo
                <input type="file" accept="image/*" className="hidden" onChange={async e => {
                  const f = e.target.files?.[0]; if (!f) return;
                  try {
                    const res = await uploadFile(f);
                    setCustomLogoUrl(res.url);
                    setSelectedLogoIdx(null);
                  } catch { alert("Failed to upload logo."); }
                }} />
              </label>
              <span className="text-[10px] text-muted-foreground/60">Min 512px · 1:1 ratio</span>
            </div>
            {(selectedLogoIdx !== null || customLogoUrl) && (
              <div className="px-3 py-2 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-between">
                <span className="text-[11px] text-primary font-semibold">✓ {customLogoUrl ? "Custom logo" : LOGOS[selectedLogoIdx!]?.label} applied</span>
                <button onClick={() => { setSelectedLogoIdx(null); setCustomLogoUrl(null); }} className="bg-transparent border-none cursor-pointer text-[10px] text-muted-foreground/60 font-semibold hover:text-foreground">Remove</button>
              </div>
            )}
          </div>
        );

      case "decorate":
        return (
          <div className="flex flex-col gap-3.5">
            <div>
              <p className="text-sm font-bold text-foreground mb-1">Add QR Code on Your Picture</p>
              <p className="text-[11px] text-muted-foreground/70">Upload a photo, then drag and resize the QR overlay. Hit Apply to flatten into a single PNG.</p>
            </div>
            <div
              ref={decorateContainerRef}
              className="relative min-h-[200px] rounded-xl border-2 border-dashed border-border/80 bg-muted/10 flex items-center justify-center overflow-hidden"
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
                <div className="relative w-full leading-none">
                  <img src={decoratePicUrl} className="w-full h-auto block select-none pointer-events-none" draggable={false} alt="uploaded" />
                  <div
                    onMouseDown={e => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); setDragStart({ mx: e.clientX, my: e.clientY, ox: qrOverlay.x, oy: qrOverlay.y }); }}
                    className="absolute border-2 border-primary rounded-md shadow-lg select-none"
                    style={{ left: `${qrOverlay.x}%`, top: `${qrOverlay.y}%`, width: `${qrOverlay.size}px`, height: `${qrOverlay.size}px`, background: activeBg, cursor: isDragging ? "grabbing" : "grab" }}
                  >
                    <svg ref={decorateQrRef} width={qrOverlay.size} height={qrOverlay.size} viewBox={`0 0 ${PREVIEW_PX} ${PREVIEW_PX}`} xmlns="http://www.w3.org/2000/svg" className="block rounded-sm">
                      {gradDefs}
                      <QRWithShape {...qrProps} size={PREVIEW_PX} clipId={`dec-${activeShapeId}`} qrMatrix={previewMatrix} qrN={previewN} />
                    </svg>
                    <div
                      onMouseDown={e => { e.preventDefault(); e.stopPropagation(); setIsResizing(true); setResizeStart({ mx: e.clientX, my: e.clientY, os: qrOverlay.size }); }}
                      className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-primary rounded-sm cursor-se-resize border-2 border-white"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2.5 py-8">
                  <div className="w-14 h-14 rounded-xl bg-muted/30 flex items-center justify-center">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" className="text-muted-foreground/30"><path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z" /></svg>
                  </div>
                  <label className="bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-md px-4 py-2 cursor-pointer text-xs font-bold shadow-md">
                    + Add Picture
                    <input type="file" accept="image/*" className="hidden" onChange={async e => {
                      const f = e.target.files?.[0]; if (!f) return;
                      try {
                        const res = await uploadFile(f);
                        setDecoratePicUrl(res.url);
                        setQrOverlay({ x: 5, y: 5, size: 100 });
                      } catch { alert("Failed to upload picture."); }
                    }} />
                  </label>
                  <p className="text-[10px] text-muted-foreground/50 text-center">PNG, JPG, GIF supported</p>
                </div>
              )}
            </div>
            {decoratePicUrl && (
              <div className="flex gap-1.5">
                <label className="flex-1 flex items-center justify-center gap-1 bg-primary/10 text-primary border border-primary/20 rounded-md px-3 py-1.5 cursor-pointer text-[11px] font-bold">
                  🔄 Change Picture
                  <input type="file" accept="image/*" className="hidden" onChange={async e => {
                    const f = e.target.files?.[0]; if (!f) return;
                    try {
                      const res = await uploadFile(f);
                      setDecoratePicUrl(res.url);
                      setQrOverlay({ x: 5, y: 5, size: 100 });
                    } catch { alert("Failed to upload picture."); }
                  }} />
                </label>
                <button onClick={() => { setDecoratePicUrl(null); setQrOverlay({ x: 5, y: 5, size: 100 }); }} className="px-3 py-1.5 rounded-md border border-destructive/30 bg-destructive/10 text-destructive text-[11px] font-bold">✕ Remove</button>
              </div>
            )}
            {decoratePicUrl && (
              <div className="px-3 py-2 rounded-md bg-primary/10 border border-primary/20 text-[10px] text-primary leading-relaxed">
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
    <div className={`fixed inset-0 z-[9999] flex items-start justify-center ${isDark ? 'bg-black/75' : 'bg-white/70'} backdrop-blur-sm p-7 font-sans`}>
      <div className={`w-full max-w-[1180px] rounded-2xl border ${isDark ? 'border-primary/12' : 'border-slate-300/70'} shadow-2xl flex flex-col overflow-hidden max-h-[calc(100vh-56px)] ${isDark ? 'bg-[linear-gradient(160deg,#0f1a14_0%,#111816_40%,#0d1510_100%)]' : 'bg-[linear-gradient(160deg,#f0f4ef_0%,#e8ece8_40%,#e0e4e0_100%)]'}`}>

        {/* ── Sticky header ── */}
        <div className={`flex items-center gap-4 px-7 py-4 border-b border-primary/10 ${isDark ? 'bg-gradient-to-b from-black/35 to-black/20' : 'bg-gradient-to-b from-slate-100/80 to-slate-100/60'} flex-shrink-0`}>
          <div className="w-11 h-11 rounded-md flex-shrink-0 bg-gradient-to-r from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30 ring-2 ring-primary/10">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
              <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="3" height="3" rx="0.5" />
              <rect x="19" y="14" width="2" height="2" rx="0.5" /><rect x="14" y="19" width="2" height="2" rx="0.5" />
              <rect x="18" y="18" width="3" height="3" rx="0.5" />
            </svg>
          </div>
          <div>
            <h2 className="m-0 text-xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Customize QR Code</h2>
            <p className="mt-0.5 text-[11px] text-muted-foreground/60 tracking-wide font-medium">Design · Colors · Shapes · Logos · Decorate</p>
          </div>
          {hasCustomisation && (
            <div className="ml-auto px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] text-primary font-semibold tracking-wide flex items-center gap-1.5 backdrop-blur-sm">
              <span className="w-1 h-1 rounded-full bg-primary shadow-[0_0_6px_#4ade80]" />
              Customised
            </div>
          )}
          {onClose && (
            <button onClick={onClose}
              className="ml-auto w-9 h-9 rounded-xl bg-muted/20 border border-border/60 flex items-center justify-center text-muted-foreground/70 hover:text-destructive hover:bg-destructive/10 transition-all flex-shrink-0"
            >✕</button>
          )}
        </div>

        {/* ── Body: two-pane ── */}
        <div className="flex flex-1 overflow-hidden min-h-0">

          {/* Left pane — options */}
          <div className="flex-1 flex flex-col border-r border-primary/10 min-w-0">

            {/* Tab bar */}
            <div className={`flex overflow-x-auto no-scrollbar border-b border-primary/10 px-2.5 py-2 flex-shrink-0 gap-1 ${isDark ? 'bg-black/20' : 'bg-slate-100/70'}`}>
              {tabs.map(tab => {
                const active = activeTab === tab.id;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-3.5 py-1.5 border-none cursor-pointer whitespace-nowrap text-[10px] font-bold uppercase tracking-wide rounded-md transition-all ${
                    active ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md' : 'bg-muted/20 text-muted-foreground/70 hover:bg-primary/20 hover:text-foreground'
                  }`}>
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Scrollable tab content */}
            <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
              {renderTabContent()}
            </div>
          </div>

          {/* Right pane — docked preview */}
          <div className={`w-80 flex-shrink-0 flex flex-col ${isDark ? 'bg-gradient-to-b from-black/20 to-background/25' : 'bg-gradient-to-b from-slate-100/75 to-slate-50/75'}`}>

            {/* Preview label */}
            <div className="px-5 py-3 border-b border-primary/10 flex-shrink-0">
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                  <span className="text-[9px] font-bold tracking-[0.16em] uppercase text-muted-foreground/60">Live Preview</span>
                </div>
                <button
                  onClick={() => setUseCanvasRenderer(!useCanvasRenderer)}
                  title={useCanvasRenderer ? "Switch to SVG renderer" : "Switch to Canvas renderer (experimental)"}
                  className={`px-2.5 py-1 rounded border text-[8px] font-semibold uppercase tracking-[0.05em] transition-all ${
                    useCanvasRenderer ? 'border-primary/60 bg-primary/20 text-primary' : 'border-border/60 bg-muted/20 text-muted-foreground/70 hover:border-primary/40 hover:bg-primary/10'
                  }`}
                >
                  {useCanvasRenderer ? "Canvas ✓" : "SVG"}
                </button>
              </div>
            </div>

            {/* Preview area — scrollable */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center gap-4 bg-[radial-gradient(rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[length:16px_16px]">

              {/* QR preview */}
              {activeTab === "decorate" && decoratePicUrl ? (
                <div className="relative w-full rounded-lg overflow-hidden shadow-2xl border border-white/5">
                  <img src={decoratePicUrl} alt="Decorated preview" className="w-full h-auto block" draggable={false} />
                  <div className="absolute left-[5%] top-[5%] w-16 h-16 rounded-sm overflow-hidden">
                    <svg width="64" height="64" viewBox={`0 0 ${PREVIEW_PX} ${PREVIEW_PX}`} className="block">
                      {gradDefs}
                      <QRWithShape {...qrProps} size={PREVIEW_PX} clipId={`decprev-${activeShapeId}`} />
                    </svg>
                  </div>
                </div>
              ) : (
                renderPreview()
              )}

              {/* Shape + design label */}
              <div className={`text-center w-full px-3 py-2.5 rounded-md border border-primary/10 ${isDark ? 'bg-black/20' : 'bg-white/80'}`}>
                <div className="text-sm font-extrabold tracking-tight mb-0.5 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{selectedShape.label}</div>
                <div className="text-[10px] text-muted-foreground/60 tracking-wide">
                  {selectedSticker ? selectedSticker.label : selectedDesign ? selectedDesign.label : "Classic theme"}
                  {fgGradEnabled && <span className="ml-1 text-primary">· gradient</span>}
                  {(fgOverride || bgOverride) && !fgGradEnabled && <span className="ml-1 text-primary">· custom colour</span>}
                </div>
              </div>

              {/* Active settings summary */}
              {hasCustomisation && (
                <div className="w-full rounded-md p-3.5 bg-primary/5 border border-primary/15 backdrop-blur-sm">
                  <div className="flex items-center gap-1 text-[8.5px] font-bold tracking-[0.14em] uppercase text-muted-foreground/60 mb-2.5">
                    <span className="w-0.5 h-0.5 rounded-full bg-primary/50" />
                    Active Settings
                  </div>
                  <div className="flex flex-col gap-1">
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
        <div className={`flex items-center gap-3 px-7 py-4 border-t border-primary/10 backdrop-blur-sm flex-shrink-0 ${isDark ? 'bg-gradient-to-b from-black/20 to-black/40' : 'bg-gradient-to-b from-slate-100/75 to-slate-100/65'}`}>
          {onClose && (
            <button onClick={onClose}
              className="px-5 py-2.5 rounded-md border border-border/60 bg-muted/20 text-muted-foreground/70 text-xs font-semibold hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-all flex-shrink-0"
            >
              ✕ Discard &amp; Close
            </button>
          )}

          {decoratePicUrl && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-primary/10 border border-primary/20 text-[10px] text-primary">
              <span className="w-1 h-1 rounded-full bg-primary shadow-[0_0_4px_#4ade80]" />
              Decorate active — Apply exports a flattened PNG
            </div>
          )}

          <button
            onClick={handleApply}
            disabled={isApplying}
            className="ml-auto px-8 py-3 border-none rounded-xl text-sm font-extrabold tracking-wide cursor-pointer disabled:cursor-wait bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/40 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 flex-shrink-0"
          >
            {isApplying ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="animate-spin">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Applying…
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
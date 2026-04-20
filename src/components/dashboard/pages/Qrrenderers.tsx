// ─────────────────────────────────────────────────────────────────────────────
// src/components/pages/Qrrenderers.tsx  (v5 — exact geometry, no scale floors)
// ─────────────────────────────────────────────────────────────────────────────

import React, { useMemo } from "react";
import { T, ICONS } from "@/components/dashboard/pages/constants";
import {
  makeQRMatrix, isFinderCell, getFinderOrigins,
  LEGACY_QR_GRID, isFinderCell21,
} from "@/components/dashboard/pages/qr-engine";
import {
  pointInShape,
  computeFinderSafeScale,
} from "@/components/dashboard/pages/qr-shape-geometry";
import { QRCanvasRenderer } from "./QRCanvasRenderer";
import { QRWithShapeCanvas } from "./QRWithShapeCanvas";

export { makeQRMatrix, isFinderCell, getFinderOrigins };
export type { QRMatrix } from "@/components/dashboard/pages/qr-engine";
export { computeFinderSafeScale };
export { QRCanvasRenderer, QRWithShapeCanvas };

// ═══════════════════════════════════════════════════════════════════════════
// SHAPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

export const QR_SHAPE_DEFS: Record<string, { pathIn100: string; insetFrac: number }> = {
  square: { pathIn100: "M0,0 H100 V100 H0 Z", insetFrac: 0 },
  "rounded-square": { pathIn100: "M12,0 H88 Q100,0 100,12 V88 Q100,100 88,100 H12 Q0,100 0,88 V12 Q0,0 12,0 Z", insetFrac: 0.02 },
  circle: { pathIn100: "M50,0 A50,50 0 1,1 50,100 A50,50 0 1,1 50,0 Z", insetFrac: 0.09 },
  heart: { pathIn100: "M50,85 C50,85 5,58 5,32 C5,15 17,8 30,8 C39,8 46,13 50,19 C54,13 61,8 70,8 C83,8 95,15 95,32 C95,58 50,85 50,85 Z", insetFrac: 0.11 },
  hexagon: { pathIn100: "M50,2 L95,26 L95,74 L50,98 L5,74 L5,26 Z", insetFrac: 0.08 },
  "speech-bubble": { pathIn100: "M5,4 Q5,1 9,1 L91,1 Q95,1 95,5 L95,68 Q95,72 91,72 L58,72 L50,92 L42,72 L9,72 Q5,72 5,68 Z", insetFrac: 0.09 },
  star: { pathIn100: "M50,4 L61,36 L96,36 L68,56 L79,90 L50,70 L21,90 L32,56 L4,36 L39,36 Z", insetFrac: 0.11 },
  diamond: { pathIn100: "M50,3 L97,50 L50,97 L3,50 Z", insetFrac: 0.11 },
  shield: { pathIn100: "M50,3 L93,16 L93,46 Q93,78 50,97 Q7,78 7,46 L7,16 Z", insetFrac: 0.11 },
  octagon: { pathIn100: "M29,3 H71 L97,29 L97,71 L71,97 H29 L3,71 L3,29 Z", insetFrac: 0.07 },
  arrow: { pathIn100: "M50,3 L95,48 L68,48 L68,97 L32,97 L32,48 L5,48 Z", insetFrac: 0.09 },
  cross: { pathIn100: "M33,3 H67 V33 H97 V67 H67 V97 H33 V67 H3 V33 H33 Z", insetFrac: 0.04 },
  droplet: { pathIn100: "M50,3 Q80,30 80,58 Q80,87 50,97 Q20,87 20,58 Q20,30 50,3 Z", insetFrac: 0.11 },
  leaf: { pathIn100: "M50,97 Q6,78 6,34 Q6,3 50,3 Q94,3 94,34 Q94,78 50,97 Z", insetFrac: 0.09 },
  pentagon: { pathIn100: "M50,3 L97,36 L79,93 L21,93 L3,36 Z", insetFrac: 0.10 },
  cloud: { pathIn100: "M17,82 Q4,82 4,62 Q4,46 17,42 Q17,18 34,18 Q45,18 51,27 Q57,22 65,22 Q82,22 82,38 Q94,42 92,60 Q92,82 76,82 Z", insetFrac: 0.10 },
  location: { pathIn100: "M50,3 Q82,3 82,35 Q82,63 50,97 Q18,63 18,35 Q18,3 50,3 Z", insetFrac: 0.12 },
};

// ═══════════════════════════════════════════════════════════════════════════
// GHOST DOT BUILDER
// ═══════════════════════════════════════════════════════════════════════════

interface GhostDot { x: number; y: number; cs: number; }

// Sin-based hash — visually indistinguishable from real QR noise, ~45 % density,
// zero periodicity. Safe only outside the real QR matrix boundary.
function fakeDark(r: number, c: number): boolean {
  const v = Math.sin(r * 127.1 + c * 311.7 + r * c * 74.3) * 43758.5453;
  return (v - Math.floor(v)) < 0.45;
}

// Faint 28 % texture for light cells inside the real QR grid.
function buildGhostDots(
  gridOriginX: number, gridOriginY: number, cs: number,
  matrix: boolean[][], N: number, shapeId: string, size: number,
): GhostDot[] {
  const dots: GhostDot[] = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (matrix[r][c] || isFinderCell(r, c, N)) continue;
      const nx = (gridOriginX + (c + 0.5) * cs) / size;
      const ny = (gridOriginY + (r + 0.5) * cs) / size;
      if (pointInShape(nx, ny, shapeId))
        dots.push({ x: gridOriginX + c * cs, y: gridOriginY + r * cs, cs });
    }
  }
  return dots;
}

// Full-opacity fake QR fill for the padding zone between the inset QR grid
// and the shape edge. Uses fakeDark() so it looks like genuine QR data.
function buildPaddingDots(
  gridOriginX: number, gridOriginY: number, cs: number,
  N: number, shapeId: string, size: number,
): GhostDot[] {
  if (gridOriginX < cs * 0.5) return [];
  const dots: GhostDot[] = [];
  const pad = Math.ceil(gridOriginX / cs) + 2;
  for (let r = -pad; r < N + pad; r++) {
    for (let c = -pad; c < N + pad; c++) {
      if (r >= 0 && r < N && c >= 0 && c < N) continue; // leave real QR untouched
      if (!fakeDark(r, c)) continue;
      const nx = (gridOriginX + (c + 0.5) * cs) / size;
      const ny = (gridOriginY + (r + 0.5) * cs) / size;
      if (pointInShape(nx, ny, shapeId))
        dots.push({ x: gridOriginX + c * cs, y: gridOriginY + r * cs, cs });
    }
  }
  return dots;
}

// ═══════════════════════════════════════════════════════════════════════════
// DOT RENDERER
// ═══════════════════════════════════════════════════════════════════════════

export function renderDot(
  x: number, y: number, size: number, shape: string,
  color: string, key: string, scale = 1.0,
): React.ReactNode {
  const s = size * scale * 0.88, cx = x + size / 2, cy = y + size / 2, r = s / 2;
  const ox = cx - s / 2, oy = cy - s / 2;
  if (shape === "square") return <rect key={key} x={ox} y={oy} width={s} height={s} fill={color} />;
  if (shape === "dot" || shape === "circle") return <circle key={key} cx={cx} cy={cy} r={r * 0.85} fill={color} />;
  if (shape === "tiny-dot") return <circle key={key} cx={cx} cy={cy} r={r * 0.55} fill={color} />;
  if (shape === "rounded") return <rect key={key} x={ox} y={oy} width={s} height={s} rx={s * 0.3} fill={color} />;
  if (shape === "rounded-tag") return <rect key={key} x={ox} y={oy} width={s} height={s} rx={s * 0.18} fill={color} />;
  if (shape === "diamond") return <polygon key={key} points={`${cx},${oy} ${ox + s},${cy} ${cx},${oy + s} ${ox},${cy}`} fill={color} />;
  if (shape === "kite") return <polygon key={key} points={`${cx},${oy - r * 0.1} ${ox + s + r * 0.1},${cy} ${cx},${oy + s} ${ox},${cy}`} fill={color} />;
  if (shape === "leaf") return <ellipse key={key} cx={cx} cy={cy} rx={r * 0.7} ry={r} fill={color} transform={`rotate(-30,${cx},${cy})`} />;
  if (shape === "hexagon") {
    const pts = Array.from({ length: 6 }, (_, i) => { const a = (Math.PI / 3) * i - Math.PI / 6; return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`; }).join(" ");
    return <polygon key={key} points={pts} fill={color} />;
  }
  if (shape === "cross") {
    const t = s * 0.32;
    return <g key={key}><rect x={cx - t / 2} y={oy} width={t} height={s} fill={color} /><rect x={ox} y={cy - t / 2} width={s} height={t} fill={color} /></g>;
  }
  if (shape === "plus") {
    const t = s * 0.26, g2 = s * 0.12;
    return <g key={key}><rect x={cx - t / 2} y={oy + g2} width={t} height={s - 2 * g2} rx={t * 0.4} fill={color} /><rect x={ox + g2} y={cy - t / 2} width={s - 2 * g2} height={t} rx={t * 0.4} fill={color} /></g>;
  }
  if (shape === "bars-h") return <g key={key}><rect x={ox} y={oy} width={s} height={s * 0.42} rx={s * 0.1} fill={color} /><rect x={ox} y={oy + s * 0.58} width={s} height={s * 0.42} rx={s * 0.1} fill={color} /></g>;
  if (shape === "bars-v") return <g key={key}><rect x={ox} y={oy} width={s * 0.42} height={s} rx={s * 0.1} fill={color} /><rect x={ox + s * 0.58} y={oy} width={s * 0.42} height={s} rx={s * 0.1} fill={color} /></g>;
  if (shape === "mosaic") {
    const h = s / 2 * 0.88;
    return <g key={key}><rect x={ox} y={oy} width={h} height={h} rx={h * 0.15} fill={color} /><rect x={ox + s - h} y={oy + s - h} width={h} height={h} rx={h * 0.15} fill={color} /></g>;
  }
  if (shape === "arrow-r") return <polygon key={key} points={`${ox},${oy} ${ox + s * 0.65},${oy} ${ox + s},${cy} ${ox + s * 0.65},${oy + s} ${ox},${oy + s}`} fill={color} />;
  if (shape === "arrow-l") return <polygon key={key} points={`${ox + s},${oy} ${ox + s * 0.35},${oy} ${ox},${cy} ${ox + s * 0.35},${oy + s} ${ox + s},${oy + s}`} fill={color} />;
  if (shape === "wave") return <rect key={key} x={ox} y={oy} width={s} height={s} rx={s * 0.5} ry={s * 0.2} fill={color} />;
  if (shape === "dna") return <g key={key}><circle cx={cx - r * 0.25} cy={cy} r={r * 0.72} fill={color} /><circle cx={cx + r * 0.25} cy={cy} r={r * 0.72} fill={color} /></g>;
  if (shape === "star") {
    const pts = Array.from({ length: 10 }, (_, i) => { const a = (Math.PI / 5) * i - Math.PI / 2, rad = i % 2 === 0 ? r * 0.95 : r * 0.42; return `${cx + rad * Math.cos(a)},${cy + rad * Math.sin(a)}`; }).join(" ");
    return <polygon key={key} points={pts} fill={color} />;
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// FINDER RENDERER
// ═══════════════════════════════════════════════════════════════════════════

export function renderFinder(
  oR: number, oC: number, cs: number, style: string,
  fg: string, accentFg: string | undefined, accentBg: string | undefined,
  key: string, eyeBall?: string, bgColor?: string,
): React.ReactNode {
  const bg = bgColor ?? T.surface;
  const ox = oC * cs, oy = oR * cs;
  const os = 7 * cs, is = 3 * cs, io = 2 * cs;
  const outer = accentBg || fg, inner = accentFg || fg;
  const fcx = ox + os / 2, fcy = oy + os / 2;

  const ball = (c: string): React.ReactNode => {
    const bt = eyeBall || "square";
    const r = is / 2, bx = ox + io, by = oy + io;
    if (bt === "circle") return <circle cx={fcx} cy={fcy} r={r} fill={c} />;
    if (bt === "rounded") return <rect x={bx} y={by} width={is} height={is} rx={is * 0.3} fill={c} />;
    if (bt === "diamond") return <polygon points={`${fcx},${by} ${bx + is},${fcy} ${fcx},${by + is} ${bx},${fcy}`} fill={c} />;
    if (bt === "hexagon") { const pts = Array.from({ length: 6 }, (_, i) => { const a = (Math.PI / 3) * i - Math.PI / 6; return `${fcx + r * Math.cos(a)},${fcy + r * Math.sin(a)}`; }).join(" "); return <polygon points={pts} fill={c} />; }
    if (bt === "star") { const pts = Array.from({ length: 10 }, (_, i) => { const a = (Math.PI / 5) * i - Math.PI / 2, rd = i % 2 === 0 ? r * 0.95 : r * 0.42; return `${fcx + rd * Math.cos(a)},${fcy + rd * Math.sin(a)}`; }).join(" "); return <polygon points={pts} fill={c} />; }
    if (bt === "leaf") return <ellipse cx={fcx} cy={fcy} rx={r * 0.7} ry={r} fill={c} transform={`rotate(-30,${fcx},${fcy})`} />;
    if (bt === "cross") return <g><rect x={fcx - r * 0.18} y={by} width={r * 0.36} height={is} fill={c} /><rect x={bx} y={fcy - r * 0.18} width={is} height={r * 0.36} fill={c} /></g>;
    if (bt === "ring") return <circle cx={fcx} cy={fcy} r={r} fill="none" stroke={c} strokeWidth={cs * 0.8} />;
    if (bt === "dot-sq") return <g><rect x={bx} y={by} width={is} height={is} fill="none" stroke={c} strokeWidth={cs * 0.5} /><circle cx={fcx} cy={fcy} r={r * 0.5} fill={c} /></g>;
    if (bt === "squircle") return <rect x={bx} y={by} width={is} height={is} rx={is * 0.5} fill={c} />;
    if (bt === "kite") return <polygon points={`${fcx},${by - r * 0.1} ${bx + is + r * 0.1},${fcy} ${fcx},${by + is} ${bx},${fcy}`} fill={c} />;
    return <rect x={bx} y={by} width={is} height={is} fill={c} />;
  };

  if (style === "circle") return <g key={key}><circle cx={fcx} cy={fcy} r={os / 2} fill={outer} /><circle cx={fcx} cy={fcy} r={os / 2 - cs} fill={bg} />{ball(inner)}</g>;
  if (style === "rounded") { const r1 = os * 0.22; return <g key={key}><rect x={ox} y={oy} width={os} height={os} rx={r1} fill={outer} /><rect x={ox + cs} y={oy + cs} width={os - 2 * cs} height={os - 2 * cs} rx={r1 * 0.4} fill={bg} />{ball(inner)}</g>; }
  if (style === "dot-outline") return <g key={key}><circle cx={fcx} cy={fcy} r={os / 2} fill="none" stroke={outer} strokeWidth={cs} />{ball(inner)}</g>;
  if (style === "round-outer") return <g key={key}><rect x={ox} y={oy} width={os} height={os} rx={os * 0.35} fill={outer} /><rect x={ox + cs} y={oy + cs} width={os - 2 * cs} height={os - 2 * cs} rx={1.5} fill={bg} />{ball(inner)}</g>;
  if (style === "thick") return <g key={key}><rect x={ox} y={oy} width={os} height={os} rx={os * 0.15} fill={outer} /><rect x={ox + cs * 1.5} y={oy + cs * 1.5} width={os - 3 * cs} height={os - 3 * cs} rx={1.5} fill={bg} />{ball(inner)}</g>;
  if (style === "dashed") return <g key={key}><rect x={ox} y={oy} width={os} height={os} rx={os * 0.1} fill="none" stroke={outer} strokeWidth={cs} strokeDasharray={`${cs * 1.5} ${cs * 0.8}`} />{ball(inner)}</g>;
  if (style === "double") return <g key={key}><rect x={ox} y={oy} width={os} height={os} rx={os * 0.1} fill="none" stroke={outer} strokeWidth={cs * 0.6} /><rect x={ox + cs * 0.9} y={oy + cs * 0.9} width={os - 1.8 * cs} height={os - 1.8 * cs} rx={os * 0.08} fill="none" stroke={outer} strokeWidth={cs * 0.4} />{ball(inner)}</g>;
  if (style === "octagon") {
    const f = os * 0.22;
    return <g key={key}>
      <polygon points={`${ox + f},${oy} ${ox + os - f},${oy} ${ox + os},${oy + f} ${ox + os},${oy + os - f} ${ox + os - f},${oy + os} ${ox + f},${oy + os} ${ox},${oy + os - f} ${ox},${oy + f}`} fill={outer} />
      <polygon points={`${ox + f + cs},${oy + cs} ${ox + os - f - cs},${oy + cs} ${ox + os - cs},${oy + f + cs} ${ox + os - cs},${oy + os - f - cs} ${ox + os - f - cs},${oy + os - cs} ${ox + f + cs},${oy + os - cs} ${ox + cs},${oy + os - f - cs} ${ox + cs},${oy + f + cs}`} fill={bg} />
      {ball(inner)}
    </g>;
  }
  if (style === "gap") return <g key={key}><rect x={ox} y={oy} width={os} height={os} rx={os * 0.1} fill={outer} /><rect x={ox + cs * 1.2} y={oy + cs * 1.2} width={os - 2.4 * cs} height={os - 2.4 * cs} rx={2} fill={bg} />{ball(inner)}</g>;
  return <g key={key}><rect x={ox} y={oy} width={os} height={os} fill={outer} /><rect x={ox + cs} y={oy + cs} width={os - 2 * cs} height={os - 2 * cs} fill={bg} />{ball(inner)}</g>;
}

// ═══════════════════════════════════════════════════════════════════════════
// PLAIN SQUARE QR  (legacy fake grid — thumbnails only)
// ═══════════════════════════════════════════════════════════════════════════

export function QRStyled({ dotShape, finderStyle, fg, bg, accentFg, accentBg, size = 100, scale = 1.0, eyeBall }: {
  dotShape: string; finderStyle: string; fg: string; bg: string;
  accentFg?: string; accentBg?: string; size?: number; scale?: number; eyeBall?: string;
}) {
  const cs = size / 21;
  return (
    <g>
      <rect x={0} y={0} width={size} height={size} fill={bg} />
      {LEGACY_QR_GRID.map((row, r) => row.map((on, c) => {
        if (!on || isFinderCell21(r, c)) return null;
        return renderDot(c * cs, r * cs, cs, dotShape, fg, `d-${r}-${c}`, scale);
      }))}
      {renderFinder(0, 0, cs, finderStyle, fg, accentFg, accentBg, "f1", eyeBall, bg)}
      {renderFinder(0, 14, cs, finderStyle, fg, accentFg, accentBg, "f2", eyeBall, bg)}
      {renderFinder(14, 0, cs, finderStyle, fg, accentFg, accentBg, "f3", eyeBall, bg)}
    </g>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LOGO CENTRE
// ═══════════════════════════════════════════════════════════════════════════

export function renderLogoCenter(size: number, logoNode: React.ReactNode, logoBg: string, fg: string, bg: string) {
  const cx = size / 2, cy = size / 2, radius = size * 0.07;
  return (
    <g>
      <circle cx={cx} cy={cy} r={radius * 1.25} fill={bg} />
      <circle cx={cx} cy={cy} r={radius} fill={logoBg} />
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke={fg} strokeWidth={1} opacity={0.2} />
      <g transform={`translate(${cx - radius * 0.65},${cy - radius * 0.65}) scale(${(radius * 1.3) / 24})`}>{logoNode}</g>
    </g>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ★ QRWithShape  (v5 — uses exact geometry, no scale floors)
// ═══════════════════════════════════════════════════════════════════════════

export interface QRWithShapeProps {
  shapeId?: string; dotShape: string; finderStyle: string;
  fg: string; bg: string; accentFg?: string; accentBg?: string;
  scale?: number; eyeBall?: string; size?: number;
  strokeEnabled?: boolean; strokeColor?: string;
  selectedFrame?: unknown; frameColor?: string;
  selectedLogo?: string | null; customLogoUrl?: string | null;
  clipId: string; logoNode?: React.ReactNode; logoBg?: string;
  qrMatrix?: boolean[][]; qrN?: number;
}

export function QRWithShape({
  shapeId = "square", dotShape, finderStyle, fg, bg, accentFg, accentBg,
  scale = 1.0, eyeBall, size = 260, strokeEnabled, strokeColor,
  selectedLogo, customLogoUrl, clipId,
  logoNode, logoBg,
  qrMatrix: externalMatrix, qrN: externalN,
}: QRWithShapeProps) {
  const shapeDef = QR_SHAPE_DEFS[shapeId] ?? QR_SHAPE_DEFS.square;
  const matrix = externalMatrix ?? LEGACY_QR_GRID;
  const N = externalN ?? 21;

  // Inset the QR grid so ALL finder modules sit inside the shape boundary.
  const finderScale = useMemo(() => computeFinderSafeScale(shapeId, N), [shapeId, N]);
  const gridSize = size * finderScale;
  const gridOriginX = (size - gridSize) / 2;
  const gridOriginY = (size - gridSize) / 2;
  const cs = gridSize / N;

  const pathScale = size / 100;

  const ghostDots = useMemo(
    () => buildGhostDots(gridOriginX, gridOriginY, cs, matrix, N, shapeId, size),
    [gridOriginX, gridOriginY, cs, matrix, N, shapeId, size],
  );

  const padDots = useMemo(
    () => buildPaddingDots(gridOriginX, gridOriginY, cs, N, shapeId, size),
    [gridOriginX, gridOriginY, cs, N, shapeId, size],
  );

  const realDots = useMemo(() => {
    const out: React.ReactNode[] = [];
    matrix.forEach((row, r) => {
      row.forEach((on, c) => {
        if (!on || isFinderCell(r, c, N)) return;
        const nx = (gridOriginX + (c + 0.5) * cs) / size;
        const ny = (gridOriginY + (r + 0.5) * cs) / size;
        if (!pointInShape(nx, ny, shapeId)) return;
        out.push(renderDot(
          gridOriginX + c * cs, gridOriginY + r * cs,
          cs, dotShape, fg, `d-${r}-${c}`, scale,
        ));
      });
    });
    return out;
  }, [matrix, N, gridOriginX, gridOriginY, cs, size, shapeId, dotShape, fg, scale]);

  // Finders rendered outside the clip — always fully visible, never cropped.
  const finderOrigins = getFinderOrigins(N);
  const finders = finderOrigins.map(({ r, c }, i) => (
    <g key={`f${i}`} transform={`translate(${gridOriginX},${gridOriginY})`}>
      {renderFinder(r, c, cs, finderStyle, fg, accentFg, accentBg, `f${i}`, eyeBall, bg)}
    </g>
  ));
  const logoCx = size / 2, logoCy = size / 2;
  const logoRadius = size * 0.115, haloRadius = logoRadius * 1.25;
  const customClipId = `${clipId}-logo`;
  const shapeClipId = `${clipId}-shape`;
  const outlineColor = strokeEnabled ? strokeColor! : fg;

  return (
    <g>
      <defs>
        {/* Clip data dots to the shape boundary */}
        <clipPath id={shapeClipId} clipPathUnits="userSpaceOnUse">
          <path d={shapeDef.pathIn100} transform={`scale(${pathScale})`} />
        </clipPath>
        {selectedLogo === "custom" && customLogoUrl && (
          <clipPath id={customClipId} clipPathUnits="userSpaceOnUse">
            <circle cx={logoCx} cy={logoCy} r={logoRadius} />
          </clipPath>
        )}
      </defs>

      {/* LAYER 1: Shape background fill */}
      <path d={shapeDef.pathIn100} transform={`scale(${pathScale})`} fill={bg} />

      {/* LAYER 2: Ghost + padding fill + real data — clipped to shape */}
      <g clipPath={`url(#${shapeClipId})`}>
        {/* Faint texture for light cells inside the QR grid */}
        <g opacity={0.28}>
          {ghostDots.map((d, i) => renderDot(d.x, d.y, d.cs, dotShape, fg, `ghost-${i}`, 0.65))}
        </g>
        {/* Full-opacity random QR-like fill for the padding zone */}
        {padDots.map((d, i) => renderDot(d.x, d.y, d.cs, dotShape, fg, `pad-${i}`, scale))}
        {/* Real scannable QR data */}
        {realDots}
      </g>

      {/* LAYER 3: Finder patterns — outside clip, always fully visible */}
      {finders}

      {/* LAYER 5: Shape outline stroke — on top for crisp edge */}
      <path
        d={shapeDef.pathIn100} transform={`scale(${pathScale})`}
        fill="none" stroke={outlineColor}
        strokeWidth={3.5 / pathScale} strokeLinejoin="round" strokeLinecap="round"
      />

      {/* LAYER 6: Logos */}
      {selectedLogo && selectedLogo !== "custom" && logoNode && logoBg &&
        renderLogoCenter(size, logoNode, logoBg, fg, bg)}
      {selectedLogo === "custom" && customLogoUrl && (
        <g>
          <circle cx={logoCx} cy={logoCy} r={haloRadius} fill={bg} />
          <image href={customLogoUrl} x={logoCx - logoRadius} y={logoCy - logoRadius}
            width={logoRadius * 2} height={logoRadius * 2}
            preserveAspectRatio="xMidYMid slice" clipPath={`url(#${customClipId})`} />
          <circle cx={logoCx} cy={logoCy} r={logoRadius} fill="none" stroke={fg} strokeWidth={1} opacity={0.2} />
        </g>
      )}
    </g>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SHAPE THUMBNAIL
// ═══════════════════════════════════════════════════════════════════════════

export function QRShapeThumbnail({ shapeId = "square", fg = "#111111", bg = "#ffffff", size = 76, clipId }: {
  shapeId?: string; fg?: string; bg?: string; size?: number; clipId: string;
}) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      <QRWithShape shapeId={shapeId} dotShape="square" finderStyle="square"
        fg={fg} bg={bg} scale={1.0} eyeBall="square" size={size} clipId={clipId} />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// STICKER DEFS  (unchanged)
// ═══════════════════════════════════════════════════════════════════════════

export type StickerDef = {
  id: string; label: string; category: string;
  render: (outerSize: number, qrSize: number) => React.ReactNode;
};

const ringPad = (o: number, q: number) => (o - q) / 2;

export const STICKER_DEFS: StickerDef[] = [
  { id: "circle-ring-pink", label: "Circle Ring", category: "Simple Rings", render: (o, q) => { const p = ringPad(o, q), cx = o / 2, cy = o / 2, r = cx - p * 0.3; return <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e91e8c" strokeWidth={p * 0.55} />; } },
  { id: "double-ring", label: "Double Ring", category: "Simple Rings", render: (o, q) => { const p = ringPad(o, q), cx = o / 2, cy = o / 2; return <g><circle cx={cx} cy={cy} r={cx - p * 0.2} fill="none" stroke="#e91e8c" strokeWidth={p * 0.2} /><circle cx={cx} cy={cy} r={cx - p * 0.55} fill="none" stroke="#e91e8c" strokeWidth={p * 0.2} /></g>; } },
  { id: "dashed-ring", label: "Dashed Ring", category: "Simple Rings", render: (o, q) => { const p = ringPad(o, q), cx = o / 2, cy = o / 2, r = cx - p * 0.35, circ = 2 * Math.PI * r; return <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e91e8c" strokeWidth={p * 0.45} strokeDasharray={`${circ / 16} ${circ / 32}`} />; } },
  { id: "scalloped", label: "Scalloped", category: "Simple Rings", render: (o, q) => { const cx = o / 2, cy = o / 2, p = ringPad(o, q), scR = p > 0 ? p * 0.22 : q * 0.05, r = p > 0 ? cx - p * 0.35 : q / 2 * 1.05; return <g>{Array.from({ length: 24 }, (_, i) => { const a = (2 * Math.PI / 24) * i; return <circle key={i} cx={cx + r * Math.cos(a)} cy={cy + r * Math.sin(a)} r={scR} fill="#e91e8c" />; })}</g>; } },
  { id: "scallop-fill", label: "Scallop Fill", category: "Simple Rings", render: (o, q) => { const cx = o / 2, cy = o / 2, p = ringPad(o, q), scR = p > 0 ? p * 0.22 : q * 0.05, r = p > 0 ? cx - p * 0.35 : q / 2 * 1.05; return <g>{Array.from({ length: 24 }, (_, i) => { const a = (2 * Math.PI / 24) * i; return <circle key={i} cx={cx + r * Math.cos(a)} cy={cy + r * Math.sin(a)} r={scR} fill="#ad1457" />; })}<circle cx={cx} cy={cy} r={r} fill="rgba(173,20,87,0.08)" /></g>; } },
  { id: "rounded-frame", label: "Rounded Frame", category: "Simple Frames", render: (o, q) => { const p = ringPad(o, q), m = p * 0.25; return <rect x={m} y={m} width={o - 2 * m} height={o - 2 * m} rx={p * 0.7} fill="none" stroke="#e91e8c" strokeWidth={p * 0.5} />; } },
  { id: "corner-frame", label: "Corner Frame", category: "Simple Frames", render: (o, q) => { const p = ringPad(o, q), m = p * 0.2, arm = p * 1.1, sw = p * 0.45; const corners = [[m, m + arm, m, m, m + arm, m], [o - m - arm, m, o - m, m, o - m, m + arm], [m, o - m - arm, m, o - m, m + arm, o - m], [o - m - arm, o - m, o - m, o - m, o - m, o - m - arm]]; return <g>{corners.map((c, i) => <polyline key={i} points={`${c[0]},${c[1]} ${c[2]},${c[3]} ${c[4]},${c[5]}`} fill="none" stroke="#e91e8c" strokeWidth={sw} strokeLinecap="round" />)}</g>; } },
  { id: "bold-frame", label: "Bold Frame", category: "Simple Frames", render: (o, q) => { const p = ringPad(o, q), m = p * 0.15; return <rect x={m} y={m} width={o - 2 * m} height={o - 2 * m} rx={p * 0.3} fill="none" stroke="#e91e8c" strokeWidth={p * 0.8} />; } },
  { id: "scan-me-teal", label: "Scan Me Teal", category: "Scan Me", render: (o, q) => { const cx = o / 2, cy = o / 2, p = ringPad(o, q), r = cx - p * 0.25; return <g><circle cx={cx} cy={cy} r={r} fill="none" stroke="#00bcd4" strokeWidth={p * 0.6} /><defs><path id={`sp-teal-${o}`} d={`M ${cx - r},${cy} A ${r},${r} 0 1,1 ${cx + r},${cy}`} /></defs><text fill="white" fontSize={p * 0.55} fontWeight="800" letterSpacing="0.12em"><textPath href={`#sp-teal-${o}`} startOffset="20%">SCAN ME • SCAN ME •</textPath></text></g>; } },
  { id: "scan-me-red", label: "Scan Me Red", category: "Scan Me", render: (o, q) => { const cx = o / 2, cy = o / 2, p = ringPad(o, q), r = cx - p * 0.25; return <g><circle cx={cx} cy={cy} r={r} fill="none" stroke="#f44336" strokeWidth={p * 0.6} /><defs><path id={`sp-red-${o}`} d={`M ${cx - r},${cy} A ${r},${r} 0 1,1 ${cx + r},${cy}`} /></defs><text fill="white" fontSize={p * 0.55} fontWeight="800" letterSpacing="0.12em"><textPath href={`#sp-red-${o}`} startOffset="20%">SCAN ME • SCAN ME •</textPath></text></g>; } },
  { id: "scan-me-navy", label: "Scan Me Navy", category: "Scan Me", render: (o, q) => { const cx = o / 2, cy = o / 2, p = ringPad(o, q), r = cx - p * 0.25; return <g><circle cx={cx} cy={cy} r={r} fill="none" stroke="#1a237e" strokeWidth={p * 0.6} /><defs><path id={`sp-navy-${o}`} d={`M ${cx - r},${cy} A ${r},${r} 0 1,1 ${cx + r},${cy}`} /></defs><text fill="white" fontSize={p * 0.55} fontWeight="800" letterSpacing="0.12em"><textPath href={`#sp-navy-${o}`} startOffset="20%">SCAN ME • SCAN ME •</textPath></text></g>; } },
  { id: "scan-me-gold", label: "Scan Me Gold", category: "Scan Me", render: (o, q) => { const cx = o / 2, cy = o / 2, p = ringPad(o, q), r = cx - p * 0.25; return <g><circle cx={cx} cy={cy} r={r} fill="none" stroke="#ffc107" strokeWidth={p * 0.6} /><defs><path id={`sp-gold-${o}`} d={`M ${cx - r},${cy} A ${r},${r} 0 1,1 ${cx + r},${cy}`} /></defs><text fill="#333" fontSize={p * 0.55} fontWeight="800" letterSpacing="0.12em"><textPath href={`#sp-gold-${o}`} startOffset="20%">SCAN ME • SCAN ME •</textPath></text></g>; } },
  { id: "scan-me-purple", label: "Scan Me Purple", category: "Scan Me", render: (o, q) => { const cx = o / 2, cy = o / 2, p = ringPad(o, q), r = cx - p * 0.25; return <g><circle cx={cx} cy={cy} r={r} fill="none" stroke="#7b1fa2" strokeWidth={p * 0.6} /><defs><path id={`sp-purple-${o}`} d={`M ${cx - r},${cy} A ${r},${r} 0 1,1 ${cx + r},${cy}`} /></defs><text fill="white" fontSize={p * 0.55} fontWeight="800" letterSpacing="0.12em"><textPath href={`#sp-purple-${o}`} startOffset="20%">SCAN ME • SCAN ME •</textPath></text></g>; } },
  { id: "scan-me-green", label: "Scan Me Green", category: "Scan Me", render: (o, q) => { const cx = o / 2, cy = o / 2, p = ringPad(o, q), r = cx - p * 0.25; return <g><circle cx={cx} cy={cy} r={r} fill="none" stroke="#2e7d32" strokeWidth={p * 0.6} /><defs><path id={`sp-green-${o}`} d={`M ${cx - r},${cy} A ${r},${r} 0 1,1 ${cx + r},${cy}`} /></defs><text fill="white" fontSize={p * 0.55} fontWeight="800" letterSpacing="0.12em"><textPath href={`#sp-green-${o}`} startOffset="20%">SCAN ME • SCAN ME •</textPath></text></g>; } },
  { id: "scan-me-orange", label: "Scan Me Orange", category: "Scan Me", render: (o, q) => { const cx = o / 2, cy = o / 2, p = ringPad(o, q), r = cx - p * 0.25; return <g><circle cx={cx} cy={cy} r={r} fill="none" stroke="#e65100" strokeWidth={p * 0.6} /><defs><path id={`sp-orange-${o}`} d={`M ${cx - r},${cy} A ${r},${r} 0 1,1 ${cx + r},${cy}`} /></defs><text fill="white" fontSize={p * 0.55} fontWeight="800" letterSpacing="0.12em"><textPath href={`#sp-orange-${o}`} startOffset="20%">SCAN ME • SCAN ME •</textPath></text></g>; } },
  { id: "christmas-wreath", label: "Christmas Wreath", category: "Holiday", render: (o, q) => { const cx = o / 2, cy = o / 2, p = ringPad(o, q), r = cx - p * 0.35; const leaves = Array.from({ length: 28 }, (_, i) => { const a = (2 * Math.PI / 28) * i, lx = cx + r * Math.cos(a), ly = cy + r * Math.sin(a); return <ellipse key={i} cx={lx} cy={ly} rx={p * 0.28} ry={p * 0.16} fill="#2e7d32" transform={`rotate(${(a * 180 / Math.PI) + 90},${lx},${ly})`} />; }); const berries = Array.from({ length: 8 }, (_, i) => { const a = (2 * Math.PI / 8) * i; return <circle key={i} cx={cx + r * Math.cos(a)} cy={cy + r * Math.sin(a)} r={p * 0.12} fill="#c62828" />; }); return <g>{leaves}{berries}</g>; } },
  { id: "snowflake-ring", label: "Snowflake Border", category: "Holiday", render: (o, q) => { const cx = o / 2, cy = o / 2, p = ringPad(o, q), r = cx - p * 0.3; return <g><circle cx={cx} cy={cy} r={r} fill="none" stroke="#90caf9" strokeWidth={p * 0.18} />{Array.from({ length: 12 }, (_, i) => { const a = (2 * Math.PI / 12) * i, sx = cx + r * Math.cos(a), sy = cy + r * Math.sin(a); return <g key={i} transform={`translate(${sx},${sy}) rotate(${a * 180 / Math.PI})`}><line x1={0} y1={-p * 0.25} x2={0} y2={p * 0.25} stroke="#90caf9" strokeWidth={p * 0.1} /><line x1={-p * 0.15} y1={-p * 0.08} x2={p * 0.15} y2={p * 0.08} stroke="#90caf9" strokeWidth={p * 0.07} /><line x1={-p * 0.15} y1={p * 0.08} x2={p * 0.15} y2={-p * 0.08} stroke="#90caf9" strokeWidth={p * 0.07} /></g>; })}</g>; } },
  { id: "gold-ring", label: "Gold Ring", category: "Simple Rings", render: (o, q) => { const cx = o / 2, cy = o / 2, p = ringPad(o, q), r = cx - p * 0.3; return <g><circle cx={cx} cy={cy} r={r + p * 0.1} fill="none" stroke="#b8860b" strokeWidth={p * 0.65} /><circle cx={cx} cy={cy} r={r} fill="none" stroke="#ffd700" strokeWidth={p * 0.35} /></g>; } },
  { id: "lavender-ring", label: "Lavender Ring", category: "Simple Rings", render: (o, q) => { const cx = o / 2, cy = o / 2, p = ringPad(o, q), r = cx - p * 0.3; return <circle cx={cx} cy={cy} r={r} fill="none" stroke="#9c27b0" strokeWidth={p * 0.55} />; } },
  { id: "coral-ring", label: "Coral Ring", category: "Simple Rings", render: (o, q) => { const cx = o / 2, cy = o / 2, p = ringPad(o, q), r = cx - p * 0.3; return <circle cx={cx} cy={cy} r={r} fill="none" stroke="#ff5722" strokeWidth={p * 0.55} />; } },
  { id: "rainbow-ring", label: "Rainbow Ring", category: "Special", render: (o, q) => { const cx = o / 2, cy = o / 2, p = ringPad(o, q), r = cx - p * 0.3, gradId = `rainbow-grad-${o}`; return <g><defs><linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f44336" /><stop offset="16%" stopColor="#ff9800" /><stop offset="33%" stopColor="#ffeb3b" /><stop offset="50%" stopColor="#4caf50" /><stop offset="67%" stopColor="#2196f3" /><stop offset="83%" stopColor="#9c27b0" /><stop offset="100%" stopColor="#f44336" /></linearGradient></defs><circle cx={cx} cy={cy} r={r} fill="none" stroke={`url(#${gradId})`} strokeWidth={p * 0.6} /></g>; } },
  { id: "scan-me-banner-bottom", label: "Scan Me Banner", category: "Banners", render: (o, q) => { const p = ringPad(o, q), bh = p * 1.1; return <g><rect x={0} y={o - bh} width={o} height={bh} fill="#222" /><text x={o / 2} y={o - bh / 2 + p * 0.2} textAnchor="middle" fill="white" fontSize={p * 0.55} fontWeight="800" letterSpacing="0.1em">SCAN ME</text></g>; } },
  { id: "like-us-banner", label: "Like Us Banner", category: "Banners", render: (o, q) => { const p = ringPad(o, q), bh = p * 1.1; return <g><rect x={0} y={0} width={o} height={bh} fill="#1877F2" /><text x={o / 2} y={bh / 2 + p * 0.2} textAnchor="middle" fill="white" fontSize={p * 0.5} fontWeight="800">👍 Like Us!</text></g>; } },
  { id: "watch-video-banner", label: "Watch Video", category: "Banners", render: (o, q) => { const p = ringPad(o, q), bh = p * 1.1; return <g><rect x={0} y={o - bh} width={o} height={bh} fill="#FF0000" /><text x={o / 2} y={o - bh / 2 + p * 0.2} textAnchor="middle" fill="white" fontSize={p * 0.5} fontWeight="800">▶ Watch Video</text></g>; } },
];

// ═══════════════════════════════════════════════════════════════════════════
// STICKER BADGE
// ═══════════════════════════════════════════════════════════════════════════

export function StickerBadge({ sticker }: {
  sticker: { text: string; icon: string; color: string; outline: string; pos: string };
}) {
  const iconEl = ICONS[sticker.icon as keyof typeof ICONS]?.(sticker.color);
  const posStyle =
    sticker.pos === "top-left" ? { top: -14, left: 8 } :
      sticker.pos === "top-right" ? { top: -14, right: 8 } :
        { top: -14, left: "50%", transform: "translateX(-50%)" };
  return (
    <div style={{ position: "absolute", ...posStyle, display: "flex", alignItems: "center", gap: 5, background: T.surface, border: `2.5px solid ${sticker.outline}`, borderRadius: 20, padding: "4px 10px 4px 7px", boxShadow: "0 2px 10px rgba(0,0,0,0.13)", whiteSpace: "nowrap", zIndex: 10 }}>
      {iconEl}
      <span style={{ fontFamily: "'Sora','DM Sans',system-ui,sans-serif", fontSize: 13, fontWeight: 800, color: sticker.color }}>{sticker.text}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// QR THUMBNAIL (pre-designed grid)
// ═══════════════════════════════════════════════════════════════════════════

export function QRThumbnail({ design, selected, onClick }: {
  design: {
    id: string;
    label: string;
    dotShape: string;
    finderStyle: string;
    fg: string;
    bg: string;
    accentFg?: string;
    accentBg?: string;
    sticker?: { text: string; color: string; outline: string };
  };
  selected: boolean; onClick: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <button onClick={onClick} style={{ width: "100%", aspectRatio: "1", border: selected ? `2px solid ${T.accent}` : "2px solid #1e3328", borderRadius: 10, background: design.bg, cursor: "pointer", padding: 4, transition: "all 0.18s cubic-bezier(0.4,0,0.2,1)", boxShadow: selected ? "0 0 0 3px rgba(34,197,94,0.2)" : "none", transform: selected ? "scale(1.05)" : "scale(1)", position: "relative", overflow: "hidden" }}>
        {selected && (
          <div style={{ position: "absolute", top: 3, right: 3, zIndex: 3, width: 16, height: 16, borderRadius: "50%", background: T.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3l2.5 2.5L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        )}
        {design.sticker && (
          <div style={{ position: "absolute", top: 2, left: 2, zIndex: 2, background: T.surface, border: `1.5px solid ${design.sticker.outline}`, borderRadius: 8, padding: "1px 5px", fontSize: 8, fontWeight: 700, color: design.sticker.color }}>{design.sticker.text}</div>
        )}
        <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ display: "block" }}>
          <QRStyled dotShape={design.dotShape} finderStyle={design.finderStyle} fg={design.fg} bg={design.bg} accentFg={design.accentFg} accentBg={design.accentBg} size={100} eyeBall="square" />
        </svg>
      </button>
      <div style={{ textAlign: "center", fontSize: 10, color: T.textDim, fontWeight: 500, lineHeight: 1.2 }}>{design.label}</div>
    </div>
  );
}
"use client";

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { QRWithShape, STICKER_DEFS } from "@/components/dashboard/pages/Qrrenderers";
import { LOGOS } from "@/components/dashboard/pages/constants";
import type { CardQRConfigPayload } from "@/lib/api";
import type { QRCustomConfig } from "@/components/dashboard/pages/Qrcustomizer";

// ─── SVG normalisation helpers ────────────────────────────────────────────────

export const normalizeHexForQrApi = (value: string | undefined, fallback: string): string => {
  if (!value) return fallback;
  const cleaned = value.trim().replace("#", "");
  if (/^[0-9a-fA-F]{6}$/.test(cleaned)) return cleaned.toLowerCase();
  return fallback;
};

const ensureSvgNamespaces = (svgText: string): string => {
  let out = svgText;
  if (!/xmlns=/.test(out)) out = out.replace("<svg", `<svg xmlns="http://www.w3.org/2000/svg"`);
  if (!/xmlns:xlink=/.test(out)) out = out.replace("<svg", `<svg xmlns:xlink="http://www.w3.org/1999/xlink"`);
  return out;
};

const sanitizeHiddenSvgRootStyles = (styleValue: string): string => {
  const hidden = new Set(["position", "width", "height", "opacity", "pointer-events", "display", "visibility", "left", "top"]);
  return styleValue
    .split(";")
    .map((r) => r.trim())
    .filter(Boolean)
    .filter((r) => {
      const idx = r.indexOf(":");
      if (idx === -1) return true;
      return !hidden.has(r.slice(0, idx).trim().toLowerCase());
    })
    .join("; ");
};

const sanitizeExportSvg = (svgText: string): string => {
  try {
    const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
    if (doc.querySelector("parsererror")) return svgText;
    const root = doc.documentElement;
    if (root.tagName.toLowerCase() !== "svg") return svgText;

    root.removeAttribute("aria-hidden");
    root.removeAttribute("focusable");

    const style = root.getAttribute("style");
    if (style) {
      const cleaned = sanitizeHiddenSvgRootStyles(style);
      cleaned ? root.setAttribute("style", cleaned) : root.removeAttribute("style");
    }

    const w = root.getAttribute("width");
    if (!w || w === "0" || w === "0px") root.setAttribute("width", "360");
    const h = root.getAttribute("height");
    if (!h || h === "0" || h === "0px") root.setAttribute("height", "360");
    if (!root.getAttribute("preserveAspectRatio")) root.setAttribute("preserveAspectRatio", "xMidYMid meet");

    // Hoist nested <defs> so clipPath references work when SVG is loaded as a blob image
    const nestedDefs = Array.from(root.querySelectorAll(":scope > * > defs, :scope > * > * > defs"));
    if (nestedDefs.length > 0) {
      let rootDefs = root.querySelector(":scope > defs");
      if (!rootDefs) {
        rootDefs = doc.createElementNS("http://www.w3.org/2000/svg", "defs");
        root.insertBefore(rootDefs, root.firstChild);
      }
      nestedDefs.forEach((d) => {
        while (d.firstChild) rootDefs!.appendChild(d.firstChild);
        d.parentNode?.removeChild(d);
      });
    }

    return new XMLSerializer().serializeToString(root);
  } catch {
    return svgText;
  }
};

const stripExternalSvgImages = (svgText: string): string => {
  try {
    const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
    if (doc.querySelector("parsererror")) return svgText;
    doc.querySelectorAll("image").forEach((node) => {
      const href = (node.getAttribute("href") || node.getAttribute("xlink:href") || "").trim().toLowerCase();
      if (!href || href.startsWith("http://") || href.startsWith("https://") || href.startsWith("//")) node.remove();
    });
    return new XMLSerializer().serializeToString(doc.documentElement);
  } catch {
    return svgText;
  }
};

const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => (typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Failed to encode image")));
    reader.onerror = () => reject(new Error("Failed to read image blob"));
    reader.readAsDataURL(blob);
  });

const inlineExternalSvgImages = async (svgText: string): Promise<string> => {
  try {
    const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
    if (doc.querySelector("parsererror")) return svgText;
    const nodes = Array.from(doc.querySelectorAll("image"));
    if (!nodes.length) return svgText;
    await Promise.all(
      nodes.map(async (node) => {
        const href = node.getAttribute("href") || node.getAttribute("xlink:href") || "";
        const norm = href.trim().toLowerCase();
        if (!norm || norm.startsWith("data:")) return;
        if (!norm.startsWith("http://") && !norm.startsWith("https://") && !norm.startsWith("//")) return;
        try {
          const res = await fetch(href);
          if (!res.ok) return;
          const dataUrl = await blobToDataUrl(await res.blob());
          node.setAttribute("href", dataUrl);
          node.setAttribute("xlink:href", dataUrl);
        } catch { /* keep original */ }
      }),
    );
    return new XMLSerializer().serializeToString(doc.documentElement);
  } catch {
    return svgText;
  }
};

// ─── Blob → canvas helpers ────────────────────────────────────────────────────

const svgUrlToCanvas = async (svgUrl: string, size: number): Promise<HTMLCanvasElement> => {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("Failed to load QR SVG image"));
    el.src = svgUrl;
  });
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(img, 0, 0, size, size);
  return canvas;
};

const svgTextToCanvas = async (svgText: string, size: number): Promise<HTMLCanvasElement> => {
  const sanitized = ensureSvgNamespaces(sanitizeExportSvg(svgText));
  const blob = new Blob([sanitized], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    return await svgUrlToCanvas(url, size);
  } finally {
    URL.revokeObjectURL(url);
  }
};

export const svgTextToPngBlob = async (svgText: string, size = 1200): Promise<Blob> => {
  const tryConvert = async (input: string): Promise<Blob> => {
    const canvas = await svgTextToCanvas(input, size);
    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Failed to export PNG"))), "image/png");
    });
  };
  try {
    const inlined = await inlineExternalSvgImages(svgText);
    return await tryConvert(inlined);
  } catch {
    return tryConvert(stripExternalSvgImages(svgText));
  }
};

export const svgTextToJpegBlob = async (svgText: string, size = 1400): Promise<Blob> => {
  const tryConvert = async (input: string): Promise<Blob> => {
    const canvas = await svgTextToCanvas(input, size);
    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Failed to export JPEG"))), "image/jpeg", 0.96);
    });
  };
  try {
    const inlined = await inlineExternalSvgImages(svgText);
    return await tryConvert(inlined);
  } catch {
    return tryConvert(stripExternalSvgImages(svgText));
  }
};

export const triggerBlobDownload = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};

// ─── QR SVG builders ──────────────────────────────────────────────────────────

export const buildQrSvgString = (
  matrix: boolean[][],
  N: number,
  fg: string,
  bg: string,
  outputSize = 1200,
  margin = 40,
): string => {
  const inner = outputSize - margin * 2;
  const cs = inner / N;
  const rects: string[] = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      if (matrix[r][c]) {
        const x = (margin + c * cs).toFixed(2);
        const y = (margin + r * cs).toFixed(2);
        const s = cs.toFixed(2);
        rects.push(`<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${fg}"/>`);
      }
    }
  }
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${outputSize}" height="${outputSize}" viewBox="0 0 ${outputSize} ${outputSize}">`,
    `<rect width="${outputSize}" height="${outputSize}" fill="${bg}"/>`,
    ...rects,
    `</svg>`,
  ].join("");
};

// Takes CardQRConfigPayload — used by MyCards.tsx
export const buildCustomizedQrSvgFromPayload = (
  qrConfig: CardQRConfigPayload,
  matrix: boolean[][],
  N: number,
  outputSize = 1200,
): string => {
  const fg = `#${normalizeHexForQrApi(qrConfig.fg, "000000")}`;
  const bg = `#${normalizeHexForQrApi(qrConfig.bg, "ffffff")}`;
  const safeFg = fg.toLowerCase() === bg.toLowerCase() ? "#000000" : fg;

  const gradEnabled = qrConfig.gradEnabled && (qrConfig.gradStops?.length ?? 0) >= 2;
  const gradId = "qr-dl-grad";
  const clipId = "qr-dl-clip";

  const sticker = qrConfig.stickerId ? STICKER_DEFS.find((s) => s.id === qrConfig.stickerId) ?? null : null;
  const isSquareShape = !qrConfig.shapeId || qrConfig.shapeId === "square" || qrConfig.shapeId === "rounded-square";
  const RING_PAD = isSquareShape ? 60 : 36;
  const QR_SIZE = sticker ? outputSize - RING_PAD * 2 : outputSize;
  const OUTER = outputSize;

  const logoIndex = qrConfig.selectedLogo?.startsWith("logo-") ? parseInt(qrConfig.selectedLogo.replace("logo-", ""), 10) : null;
  const logoEntry = logoIndex !== null ? LOGOS[logoIndex] : null;
  const logoNode: React.ReactNode = logoEntry?.icon ?? null;
  const logoBg = logoEntry?.bg ?? qrConfig.logoBg ?? "#ffffff";

  const gradAngle = qrConfig.gradAngle ?? 135;
  const gradStops = qrConfig.gradStops ?? [];

  const svgEl = React.createElement(
    "svg",
    { xmlns: "http://www.w3.org/2000/svg", width: OUTER, height: OUTER, viewBox: `0 0 ${OUTER} ${OUTER}` },
    gradEnabled
      ? React.createElement(
          "defs",
          null,
          React.createElement(
            "linearGradient",
            {
              id: gradId,
              x1: `${50 - 50 * Math.cos((gradAngle * Math.PI) / 180)}%`,
              y1: `${50 - 50 * Math.sin((gradAngle * Math.PI) / 180)}%`,
              x2: `${50 + 50 * Math.cos((gradAngle * Math.PI) / 180)}%`,
              y2: `${50 + 50 * Math.sin((gradAngle * Math.PI) / 180)}%`,
            },
            ...gradStops.map((s, i) =>
              React.createElement("stop", { key: i, offset: `${s.offset * 100}%`, stopColor: s.color }),
            ),
          ),
        )
      : null,
    React.createElement("rect", { width: OUTER, height: OUTER, fill: bg }),
    React.createElement(
      "g",
      sticker ? { transform: `translate(${RING_PAD},${RING_PAD})` } : null,
      React.createElement(QRWithShape, {
        shapeId: qrConfig.shapeId ?? "square",
        dotShape: qrConfig.dotShape ?? "square",
        finderStyle: qrConfig.finderStyle ?? "square",
        fg: gradEnabled ? `url(#${gradId})` : safeFg,
        bg,
        accentFg: qrConfig.accentFg,
        accentBg: qrConfig.accentBg,
        scale: qrConfig.bodyScale ?? 1.0,
        eyeBall: qrConfig.eyeBall ?? "square",
        size: QR_SIZE,
        strokeEnabled: qrConfig.strokeEnabled ?? false,
        strokeColor: qrConfig.strokeColor ?? "#000000",
        selectedLogo: qrConfig.selectedLogo ?? null,
        customLogoUrl: qrConfig.customLogoUrl ?? null,
        logoNode,
        logoBg,
        clipId,
        qrMatrix: matrix,
        qrN: N,
      }),
    ),
    sticker ? sticker.render(OUTER, QR_SIZE) : null,
  );

  return renderToStaticMarkup(svgEl);
};

// Takes QRCustomConfig — used by NfcQR.tsx (logo/sticker already resolved to objects)
export const buildCustomizedQrSvgFromConfig = (
  config: QRCustomConfig,
  matrix: boolean[][],
  N: number,
  outputSize = 1200,
): string => {
  const fg = config.fg ?? "#000000";
  const bg = config.bg ?? "#ffffff";

  const gradEnabled = config.gradEnabled && (config.gradStops?.length ?? 0) >= 2;
  const gradId = "qr-export-grad";
  const clipId = "qr-export-clip";

  const sticker = config.selectedSticker ?? null;
  const isSquareShape = !config.shapeId || config.shapeId === "square" || config.shapeId === "rounded-square";
  const RING_PAD = isSquareShape ? 60 : 36;
  const QR_SIZE = sticker ? outputSize - RING_PAD * 2 : outputSize;
  const OUTER = outputSize;

  const gradAngle = config.gradAngle ?? 135;
  const gradStops = config.gradStops ?? [];

  const svgEl = React.createElement(
    "svg",
    { xmlns: "http://www.w3.org/2000/svg", width: OUTER, height: OUTER, viewBox: `0 0 ${OUTER} ${OUTER}` },
    gradEnabled
      ? React.createElement(
          "defs",
          null,
          React.createElement(
            "linearGradient",
            {
              id: gradId,
              x1: `${50 - 50 * Math.cos((gradAngle * Math.PI) / 180)}%`,
              y1: `${50 - 50 * Math.sin((gradAngle * Math.PI) / 180)}%`,
              x2: `${50 + 50 * Math.cos((gradAngle * Math.PI) / 180)}%`,
              y2: `${50 + 50 * Math.sin((gradAngle * Math.PI) / 180)}%`,
            },
            ...gradStops.map((s, i) =>
              React.createElement("stop", { key: i, offset: `${s.offset * 100}%`, stopColor: s.color }),
            ),
          ),
        )
      : null,
    React.createElement("rect", { width: OUTER, height: OUTER, fill: bg }),
    React.createElement(
      "g",
      sticker ? { transform: `translate(${RING_PAD},${RING_PAD})` } : null,
      React.createElement(QRWithShape, {
        shapeId: config.shapeId ?? "square",
        dotShape: config.dotShape ?? "square",
        finderStyle: config.finderStyle ?? "square",
        fg: gradEnabled ? `url(#${gradId})` : fg,
        bg,
        accentFg: config.accentFg,
        accentBg: config.accentBg,
        scale: config.bodyScale ?? 1.0,
        eyeBall: config.eyeBall ?? "square",
        size: QR_SIZE,
        strokeEnabled: config.strokeEnabled ?? false,
        strokeColor: config.strokeColor ?? "#000000",
        selectedLogo: config.selectedLogo ?? null,
        customLogoUrl: config.customLogoUrl ?? null,
        logoNode: config.logoNode ?? null,
        logoBg: config.logoBg ?? "#ffffff",
        clipId,
        qrMatrix: matrix,
        qrN: N,
      }),
    ),
    sticker ? sticker.render(OUTER, QR_SIZE) : null,
  );

  return renderToStaticMarkup(svgEl);
};

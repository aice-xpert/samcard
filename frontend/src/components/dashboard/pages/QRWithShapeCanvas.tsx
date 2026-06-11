// ─────────────────────────────────────────────────────────────────────────────
// QRWithShapeCanvas.tsx - Wrapper integrating canvas-based QR into existing system
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { QRCanvasRenderer, QRCanvasProps } from "./QRCanvasRenderer";

export interface QRWithShapeCanvasProps extends Omit<QRCanvasProps, "dotType" | "cornerType"> {
  dotShape?: string;
  finderStyle?: string;
  shapeId?: string;
  accentFg?: string;
  accentBg?: string;
  scale?: number;
  eyeBall?: string;
  strokeEnabled?: boolean;
  strokeColor?: string;
  selectedLogo?: string | null;
  customLogoUrl?: string | null;
  selectedLogoNode?: React.ReactNode;
  logoBg?: string;
}

/**
 * QRWithShapeCanvas - Drop-in replacement for QRWithShape that uses canvas rendering
 * Supports all shape types while maintaining full scanability
 *
 * Works with qr-code-styling library for mathematically correct shape support
 */
export const QRWithShapeCanvas = React.forwardRef<HTMLDivElement, QRWithShapeCanvasProps>(
  (
    {
      url: propUrl,
      size = 260,
      dotColor = "#000000",
      bgColor = "#ffffff",
      dotShape = "square",
      finderStyle = "square",
    },
    ref
  ) => {
    // Map dot shape names to qr-code-styling dot types
    const dotTypeMap: Record<string, QRCanvasProps["dotType"]> = {
      square: "square",
      dot: "dots",
      circle: "dots",
      "tiny-dot": "dots",
      rounded: "rounded",
      "rounded-tag": "rounded",
      diamond: "rounded",
      hexagon: "rounded",
      star: "rounded",
      classy: "classy",
      "classy-rounded": "classy-rounded",
      cross: "square",
      plus: "square",
      wave: "rounded",
      dna: "dots",
      leaf: "rounded",
    };

    // Map finder styles to corner types
    const cornerTypeMap: Record<string, QRCanvasProps["cornerType"]> = {
      square: "square",
      circle: "extra-rounded",
      rounded: "extra-rounded",
      "dot-outline": "dot",
      "round-outer": "extra-rounded",
      thick: "square",
      dashed: "square",
      double: "square",
      octagon: "square",
      gap: "extra-rounded",
    };

    const effectiveDotType = dotTypeMap[dotShape] || "square";
    const effectiveCornerType = cornerTypeMap[finderStyle] || "square";

    // Use provided URL or fall back to default
    const url = propUrl || "https://samcard.app";

    return (
      <QRCanvasRenderer
        ref={ref}
        url={url}
        size={size}
        dotColor={dotColor}
        bgColor={bgColor}
        dotType={effectiveDotType}
        cornerType={effectiveCornerType}
      />
    );
  }
);

QRWithShapeCanvas.displayName = "QRWithShapeCanvas";

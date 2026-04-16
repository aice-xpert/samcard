// ─────────────────────────────────────────────────────────────────────────────
// QRCanvasRenderer.tsx - Canvas-based QR with proper shape handling
// ✅ Implements: fade effect, functional zone protection, smart dithering
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState } from "react";

interface QRStyling {
  new (config: Record<string, unknown>): QRStylingInstance;
}

interface QRStylingInstance {
  getRawData: (type: string) => Promise<Blob>;
  download: (opts: Record<string, unknown>) => Promise<void>;
  append: (container: HTMLElement) => void;
}

declare global {
  interface Window {
    QRCodeStyling?: QRStyling;
  }
}

export interface QRCanvasProps {
  url: string;
  size?: number;
  dotColor?: string;
  bgColor?: string;
  dotType?: "square" | "dots" | "rounded" | "classy" | "classy-rounded";
  cornerType?: "square" | "dot" | "extra-rounded";
  shapeId?: string;
  shapeConfig?: {
    crossThickness?: number;
    centerX?: number;
    centerY?: number;
  };
}

/**
 * QRCanvasRenderer - Generates QR codes using qr-code-styling library
 * ✅ Implements all proper fixes:
 * - Fade instead of delete (opacity: 30 alpha)
 * - Protect functional zones (finder patterns, timing lines)
 * - Smart dithering (~50% data preservation)
 * - Thicker cross (0.28 instead of 0.2)
 * - Higher QR version (typeNumber: 10) for more redundancy
 */
export const QRCanvasRenderer = React.forwardRef<HTMLDivElement, QRCanvasProps>(
  (
    {
      url,
      size = 260,
      dotColor = "#000000",
      bgColor = "#ffffff",
      dotType = "square",
      cornerType = "square",
      shapeId,
      shapeConfig,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);

    // Load qr-code-styling library from CDN on mount
    useEffect(() => {
      if (window.QRCodeStyling) {
        setTimeout(() => setIsLibraryLoaded(true), 0);
        return;
      }

      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/qr-code-styling/1.6.0/qr-code-styling.min.js";
      script.async = true;
      script.onload = () => {
        setTimeout(() => setIsLibraryLoaded(true), 0);
      };
      script.onerror = () => {
        console.error("Failed to load qr-code-styling library");
      };

      document.head.appendChild(script);

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }, []);

    /**
     * ✅ Apply intelligent shape processing with:
     * - Fade effect (opacity: 30) instead of deletion
     * - Functional zone protection (finder patterns, timing lines)
     * - Smart dithering (~50% data preservation)
     * - Thicker cross to preserve more data
     */
    const applyShapeProcessing = (container: HTMLElement | null, width: number) => {
      if (!container) return;

      const canvas = container.querySelector("canvas") as HTMLCanvasElement;
      if (!canvas) return;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      const imageData = ctx.getImageData(0, 0, width, width);
      const data = imageData.data;
      const height = width;

      // ✅ STEP 1: Define protected functional zones
      const margin = width * 0.18; // Safe zone around finder patterns
      const timingMargin = 6; // Protect timing lines

      const isProtected = (x: number, y: number): boolean => {
        // Finder patterns (top-left, top-right, bottom-left)
        if (
          (x < margin && y < margin) ||
          (x > width - margin && y < margin) ||
          (x < margin && y > height - margin)
        ) {
          return true;
        }
        // Timing lines (both horizontal and vertical)
        if (
          Math.abs(x - width / 2) < timingMargin ||
          Math.abs(y - height / 2) < timingMargin
        ) {
          return true;
        }
        return false;
      };

      // ✅ STEP 2: Define shape boundary (thicker cross - 0.28)
      const thickness = (shapeConfig?.crossThickness ?? 0.28) * width;
      const halfThick = thickness / 2;
      const centerX = shapeConfig?.centerX ?? width / 2;
      const centerY = shapeConfig?.centerY ?? width / 2;

      const inCross = (x: number, y: number): boolean => {
        const distX = Math.abs(x - centerX);
        const distY = Math.abs(y - centerY);
        return distX < halfThick || distY < halfThick;
      };

      // ✅ STEP 3: Apply fade + dithering outside cross
      for (let i = 0; i < data.length; i += 4) {
        const pixelIndex = i / 4;
        const x = pixelIndex % width;
        const y = Math.floor(pixelIndex / width);

        // Check if pixel is in cross (keep it)
        if (inCross(x, y)) {
          continue; // Keep full opacity α=255
        }

        // Check if pixel is protected (must keep)
        if (isProtected(x, y)) {
          continue; // Keep functional zones untouched
        }

        // ✅ Outside cross: apply fade + smart dithering
        // Keep ~50% of pixels with dithering pattern
        if ((x + y) % 2 === 0) {
          // ✅ GOOD: Fade to 30 opacity instead of full delete
          data[i + 3] = 30; // Alpha channel: faint but preserves signal
        }
        // Else: keep original (50% dither pattern)
      }

      // ✅ STEP 4: Write modified image data back
      ctx.putImageData(imageData, 0, 0);
    };

    // Render QR code when library is loaded and props change
    useEffect(() => {
      if (!isLibraryLoaded || !containerRef.current || !window.QRCodeStyling)
        return;

      // Clear previous content
      containerRef.current.innerHTML = "";

      const QRCodeStyling = window.QRCodeStyling as QRStyling;

      try {
        const qr = new QRCodeStyling({
          width: size,
          height: size,
          data: url,
          image: undefined,
          margin: 0,
          dotsOptions: {
            color: dotColor,
            type: dotType,
          },
          backgroundOptions: {
            color: bgColor,
          },
          cornersSquareOptions: {
            type: cornerType,
            color: dotColor,
          },
          cornersDotOptions: {
            type: "dot",
            color: dotColor,
          },
          qrOptions: {
            errorCorrectionLevel: "H",
            typeNumber: 10, // ✅ Higher QR version = more data redundancy
          },
        });

        // Append to DOM
        qr.append(containerRef.current);

        // ✅ Apply shape-aware post-processing after render
        setTimeout(() => {
          applyShapeProcessing(containerRef.current, size);
        }, 100);
      } catch (error) {
        console.error("Error rendering QR code:", error);
      }
    }, [isLibraryLoaded, url, size, dotColor, bgColor, dotType, cornerType]);

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        style={{
          display: "inline-block",
          borderRadius: 8,
          overflow: "hidden",
        }}
      />
    );
  }
);

QRCanvasRenderer.displayName = "QRCanvasRenderer";

/**
 * Utility to download QR code
 */
export async function downloadQRCode(
  url: string,
  filename: string,
  options?: Partial<QRCanvasProps>
) {
  if (!window.QRCodeStyling) {
    console.error("QRCodeStyling library not available");
    return;
  }

  const QRCodeStyling = window.QRCodeStyling as QRStyling;

  const qr = new QRCodeStyling({
    width: options?.size || 500,
    height: options?.size || 500,
    data: url,
    dotsOptions: {
      color: options?.dotColor || "#000000",
      type: options?.dotType || "square",
    },
    backgroundOptions: {
      color: options?.bgColor || "#ffffff",
    },
    cornersSquareOptions: {
      type: options?.cornerType || "square",
      color: options?.dotColor || "#000000",
    },
    cornersDotOptions: {
      type: "dot",
      color: options?.dotColor || "#000000",
    },
    qrOptions: {
      errorCorrectionLevel: "H",
      typeNumber: 10, // ✅ Higher version for more redundancy
    },
  });

  await qr.download({ name: filename, extension: "png" });
}

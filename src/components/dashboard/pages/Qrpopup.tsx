"use client";
// src/components/pages/QrPopup.tsx
//
// Toast-style QR popup used by PhonePreview and CardPreviewModal.
// Reads qrConfig + qrMatrix from useQrStore so it always mirrors
// whatever is showing on the NfcQr page.

import { useEffect, useCallback, useRef } from "react";
import { X, Download, Share2 } from "lucide-react";
import { useQrStore } from "@/components/dashboard/stores/Useqrstore";
import { LiveQrDisplay } from "@/components/dashboard/pages/NfcQR";

interface QrPopupProps {
  isOpen:  boolean;
  onClose: () => void;
  cardUrl: string;
}

export function QrPopup({ isOpen, onClose, cardUrl }: QrPopupProps) {
  const { qrConfig, qrMatrix, qrN } = useQrStore();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    };
    const t = setTimeout(() => document.addEventListener("mousedown", handler), 80);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", handler); };
  }, [isOpen, onClose]);

  const handleDownload = useCallback(() => {
    const svgEl = panelRef.current?.querySelector<SVGSVGElement>("svg");
    if (!svgEl) return;
    const blob = new Blob([svgEl.outerHTML], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "card-qr.svg";
    a.click();
    URL.revokeObjectURL(a.href);
  }, []);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      await navigator.share({ title: "My Digital Card", url: cardUrl }).catch(() => undefined);
    } else {
      await navigator.clipboard.writeText(cardUrl).catch(() => undefined);
    }
  }, [cardUrl]);

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes qr-pop-in {
          from { opacity: 0; transform: scale(0.84) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        .qr-pop-panel {
          animation: qr-pop-in 0.22s cubic-bezier(0.34,1.5,0.64,1) both;
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position:          "fixed",
          inset:             0,
          zIndex:            999999,
          background:        "rgba(0,0,0,0.75)",
          backdropFilter:    "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          display:           "flex",
          alignItems:        "center",
          justifyContent:    "center",
        }}
      >
        {/* Panel */}
        <div
          ref={panelRef}
          className="qr-pop-panel"
          onClick={e => e.stopPropagation()}
          style={{
            position:      "relative",
            display:       "flex",
            flexDirection: "column",
            alignItems:    "center",
            gap:           14,
            padding:       "20px 18px 18px",
            borderRadius:  22,
            background:    "#0d1a0d",
            border:        "1px solid rgba(0,128,1,0.35)",
            boxShadow:     "0 8px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(73,182,24,0.1)",
            width:         "min(300px, 90vw)",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center" }}>
            <p style={{
              margin:        0,
              fontSize:      10,
              fontWeight:    700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color:         "#49B618",
            }}>
              Your Digital Card
            </p>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "#7a9a7a" }}>
              Scan to open your card
            </p>
          </div>

          {/* Live QR — mirrors NfcQr page exactly */}
          <LiveQrDisplay
            config={qrConfig}
            qrMatrix={qrMatrix ?? undefined}
            qrN={qrN ?? undefined}
          />

          {/* URL pill */}
          <div style={{
            display:      "flex",
            alignItems:   "center",
            padding:      "7px 13px",
            borderRadius: 999,
            background:   "#111a11",
            border:       "1px solid rgba(0,128,1,0.2)",
            width:        "100%",
            overflow:     "hidden",
          }}>
            <span style={{
              fontSize:     11,
              color:        "#7a9a7a",
              overflow:     "hidden",
              textOverflow: "ellipsis",
              whiteSpace:   "nowrap",
              flex:         1,
            }}>
              {cardUrl}
            </span>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 9, width: "100%" }}>
            <button
              onClick={handleDownload}
              style={{
                flex:           1,
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                gap:            6,
                padding:        "10px 0",
                borderRadius:   12,
                background:     "linear-gradient(135deg,#008001,#49B618)",
                border:         "none",
                color:          "#fff",
                fontSize:       12,
                fontWeight:     700,
                cursor:         "pointer",
                boxShadow:      "0 3px 14px rgba(0,128,1,0.3)",
              }}
            >
              <Download style={{ width: 14, height: 14 }} />
              Download
            </button>
            <button
              onClick={handleShare}
              style={{
                flex:           1,
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                gap:            6,
                padding:        "10px 0",
                borderRadius:   12,
                background:     "rgba(0,128,1,0.1)",
                border:         "1px solid rgba(0,128,1,0.3)",
                color:          "#f0f0f0",
                fontSize:       12,
                fontWeight:     700,
                cursor:         "pointer",
              }}
            >
              <Share2 style={{ width: 14, height: 14 }} />
              Share
            </button>
          </div>

          {/* Close × */}
          <button
            onClick={onClose}
            style={{
              position:       "absolute",
              top:            10,
              right:          10,
              width:          28,
              height:         28,
              borderRadius:   "50%",
              background:     "rgba(0,128,1,0.12)",
              border:         "1px solid rgba(0,128,1,0.3)",
              color:          "#7a9a7a",
              cursor:         "pointer",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
            }}
          >
            <X style={{ width: 13, height: 13 }} />
          </button>
        </div>
      </div>
    </>
  );
}
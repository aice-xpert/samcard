"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  QrCode, Download, Share2, RefreshCw,
  Printer, Clock, Copy, Check,
  AlertCircle, Palette, TrendingUp, Activity, ChevronLeft,
} from 'lucide-react';

import QRCustomizer, { QRCustomConfig } from './Qrcustomizer';
import { QRWithShape, STICKER_DEFS } from '@/components/dashboard/pages/Qrrenderers';
import { LOGOS } from '@/components/dashboard/pages/constants';
import { makeQRMatrix } from '@/components/dashboard/pages/qr-engine';
import { useQrStore } from '@/components/dashboard/stores/Useqrstore';
import { getCardQRConfig, updateCardQR, getCards, BACKEND_URL } from '@/lib/api';

// ─── Persistence helpers ──────────────────────────────────────────────────────

const STORAGE_KEY = 'samcard_qr_config_v1';

const qrStorageKeyForCard = (cardId?: string): string =>
  cardId ? `${STORAGE_KEY}:${cardId}` : STORAGE_KEY;

const qrStorageKeyForEditor = (
  explicitCardId?: string,
  resolvedCardId?: string,
  allowFallbackToFirstCard: boolean = true,
): string => {
  if (explicitCardId) return qrStorageKeyForCard(explicitCardId);
  if (resolvedCardId) return qrStorageKeyForCard(resolvedCardId);
  if (!allowFallbackToFirstCard) return `${STORAGE_KEY}:draft`;
  return STORAGE_KEY;
};

type PersistedConfig = Omit<QRCustomConfig, 'logoNode' | 'selectedSticker'> & {
  logoIndex: number | null;
  stickerId: string | null;
};

function saveConfig(cfg: QRCustomConfig, storageKey: string = STORAGE_KEY): void {
  try {
    let logoIndex: number | null = null;
    if (cfg.selectedLogo?.startsWith('logo-')) {
      logoIndex = parseInt(cfg.selectedLogo.replace('logo-', ''), 10);
    }
    const persisted: PersistedConfig = {
      shapeId: cfg.shapeId, dotShape: cfg.dotShape, finderStyle: cfg.finderStyle,
      eyeBall: cfg.eyeBall, bodyScale: cfg.bodyScale, fg: cfg.fg, bg: cfg.bg,
      accentFg: cfg.accentFg, accentBg: cfg.accentBg, strokeEnabled: cfg.strokeEnabled,
      strokeColor: cfg.strokeColor, gradEnabled: cfg.gradEnabled, gradStops: cfg.gradStops,
      gradAngle: cfg.gradAngle, selectedLogo: cfg.selectedLogo, customLogoUrl: cfg.customLogoUrl,
      logoBg: cfg.logoBg, designLabel: cfg.designLabel, shapeLabel: cfg.shapeLabel,
      logoIndex, stickerId: cfg.selectedSticker?.id ?? null,
    };
    localStorage.setItem(storageKey, JSON.stringify(persisted));
  } catch { /* ignore */ }
}

function loadConfig(storageKey: string = STORAGE_KEY): QRCustomConfig | null {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    const p: PersistedConfig = JSON.parse(raw);
    const logoEntry = p.logoIndex !== null ? LOGOS[p.logoIndex] : null;
    const selectedSticker = p.stickerId ? STICKER_DEFS.find(s => s.id === p.stickerId) ?? null : null;
    return {
      shapeId: p.shapeId, dotShape: p.dotShape, finderStyle: p.finderStyle, eyeBall: p.eyeBall,
      bodyScale: p.bodyScale, fg: p.fg, bg: p.bg, accentFg: p.accentFg, accentBg: p.accentBg,
      strokeEnabled: p.strokeEnabled, strokeColor: p.strokeColor, gradEnabled: p.gradEnabled,
      gradStops: p.gradStops, gradAngle: p.gradAngle, selectedLogo: p.selectedLogo,
      customLogoUrl: p.customLogoUrl, logoNode: logoEntry?.icon ?? null,
      logoBg: logoEntry?.bg ?? p.logoBg ?? '#ffffff', selectedSticker,
      designLabel: p.designLabel, shapeLabel: p.shapeLabel,
    };
  } catch { return null; }
}

function clearConfig(storageKey: string = STORAGE_KEY): void {
  try { localStorage.removeItem(storageKey); } catch { /* ignore */ }
}

// ─── QR Display ───────────────────────────────────────────────────────────────

const QR_SIZE = 200;

function LiveQrDisplay({ config, qrMatrix, qrN }: {
  config: QRCustomConfig | null;
  qrMatrix?: boolean[][];
  qrN?: number;
}) {
  const gradId = "qr-fg-grad";
  const clipId = "qr-clip";
  const fg = config?.fg ?? "#000000";
  const bg = config?.bg ?? "#ffffff";
  const sticker = config?.selectedSticker ?? null;
  const RING_PAD = 36;
  const OUTER = sticker ? QR_SIZE + RING_PAD * 2 : QR_SIZE;

  if (config?.decorateCompositeDataUrl) {
    return (
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 blur-3xl opacity-20 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #49B618, transparent 70%)' }} />
        <div className="relative rounded-2xl overflow-hidden"
          style={{
            background: '#0c130c',
            border: '1.5px solid rgba(0,128,1,0.4)',
            boxShadow: '0 0 32px rgba(0,128,1,0.15), inset 0 1px 0 rgba(255,255,255,0.03)',
          }}
        >
          <img
            src={config.decorateCompositeDataUrl}
            alt="Decorated QR"
            style={{ display: 'block', maxWidth: 280, height: 'auto' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute inset-0 blur-3xl opacity-20 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #49B618, transparent 70%)' }} />
      <div className="relative p-3 rounded-2xl"
        style={{
          background: '#0c130c',
          border: '1.5px solid rgba(0,128,1,0.4)',
          boxShadow: '0 0 32px rgba(0,128,1,0.15), inset 0 1px 0 rgba(255,255,255,0.03)',
          display: 'inline-block',
        }}
      >
        <svg width={QR_SIZE} height={QR_SIZE} viewBox={`0 0 ${OUTER} ${OUTER}`}
          style={{ display: 'block', borderRadius: 12, overflow: 'hidden' }}>
          {config?.gradEnabled && (config?.gradStops?.length ?? 0) >= 2 && (
            <defs>
              <linearGradient id={gradId}
                x1={`${50 - 50 * Math.cos(((config.gradAngle ?? 135) * Math.PI) / 180)}%`}
                y1={`${50 - 50 * Math.sin(((config.gradAngle ?? 135) * Math.PI) / 180)}%`}
                x2={`${50 + 50 * Math.cos(((config.gradAngle ?? 135) * Math.PI) / 180)}%`}
                y2={`${50 + 50 * Math.sin(((config.gradAngle ?? 135) * Math.PI) / 180)}%`}
              >
                {config.gradStops!.map((s, i) => (
                  <stop key={i} offset={`${s.offset * 100}%`} stopColor={s.color} />
                ))}
              </linearGradient>
            </defs>
          )}
          <rect width={OUTER} height={OUTER} fill={bg} rx={12} />
          <g transform={sticker ? `translate(${RING_PAD},${RING_PAD})` : undefined}>
            <QRWithShape
              shapeId={config?.shapeId ?? "square"} dotShape={config?.dotShape ?? "square"}
              finderStyle={config?.finderStyle ?? "square"} fg={config?.gradEnabled ? `url(#${gradId})` : fg}
              bg={bg} accentFg={config?.accentFg} accentBg={config?.accentBg}
              scale={config?.bodyScale ?? 1.0} eyeBall={config?.eyeBall ?? "square"}
              size={QR_SIZE} strokeEnabled={config?.strokeEnabled ?? false}
              strokeColor={config?.strokeColor ?? "#000000"} selectedLogo={config?.selectedLogo ?? null}
              customLogoUrl={config?.customLogoUrl ?? null} logoNode={config?.logoNode ?? null}
              logoBg={config?.logoBg ?? "#ffffff"} clipId={clipId} qrMatrix={qrMatrix} qrN={qrN}
            />
          </g>
          {sticker && sticker.render(OUTER, QR_SIZE)}
        </svg>
      </div>
    </div>
  );
}

export { LiveQrDisplay };

function Globe2({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

// ─── Stat row ─────────────────────────────────────────────────────────────────

function StatRow({ icon: Icon, label, value, accent }: {
  icon: React.ElementType; label: string; value: React.ReactNode; accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3 px-4"
      style={{ borderBottom: '1px solid rgba(0,128,1,0.08)' }}>
      <div className="flex items-center gap-2.5">
        <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#4a7a4a' }} />
        <span className="text-xs" style={{ color: '#7a9a7a' }}>{label}</span>
      </div>
      {accent ? (
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#49B618', boxShadow: '0 0 5px #49B618' }} />
          <span className="text-xs font-semibold" style={{ color: '#49B618' }}>{value}</span>
        </div>
      ) : (
        <span className="text-xs" style={{ color: '#8aaa8a' }}>{value}</span>
      )}
    </div>
  );
}

// ─── Action button ────────────────────────────────────────────────────────────

function ActionBtn({ icon: Icon, label, onClick, variant = 'ghost' }: {
  icon: React.ElementType; label: string; onClick: () => void; variant?: 'ghost' | 'primary';
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 w-full px-4 py-3 rounded-xl text-xs font-semibold transition-all active:scale-[0.98]"
      style={variant === 'primary' ? {
        background: 'linear-gradient(135deg, #006a01, #3a9a10)',
        boxShadow: '0 2px 12px rgba(0,128,1,0.3)',
        color: 'white',
      } : {
        background: 'rgba(0,128,1,0.07)',
        border: '1px solid rgba(0,128,1,0.18)',
        color: '#a0c8a0',
      }}
    >
      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
      {label}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function NfcQr({
  onConfigChange,
  cardId,
  allowFallbackToFirstCard = true,
}: {
  onConfigChange?: (config: QRCustomConfig) => void;
  cardId?: string;
  allowFallbackToFirstCard?: boolean;
}) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [resolvedCardId, setResolvedCardId] = useState<string | undefined>(cardId);
  const [cardSlug, setCardSlug] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    let active = true;

    if (cardId) {
      setResolvedCardId(cardId);
      // Fetch the slug for this specific card
      getCards().then(cards => {
        if (!active) return;
        const match = cards.find(c => c.id === cardId);
        if (match?.slug) setCardSlug(match.slug);
      }).catch(() => undefined);
      return () => {
        active = false;
      };
    }

    if (!allowFallbackToFirstCard) {
      setResolvedCardId(undefined);
      setCardSlug(undefined);
      return () => {
        active = false;
      };
    }

    getCards().then(cards => {
      if (!active) return;
      if (cards?.length) {
        setResolvedCardId(cards[0].id);
        setCardSlug(cards[0].slug);
      }
    }).catch(() => undefined);

    return () => {
      active = false;
    };
  }, [cardId, allowFallbackToFirstCard]);

  const activeQrStorageKey = qrStorageKeyForEditor(cardId, resolvedCardId, allowFallbackToFirstCard);

  const [qrConfig, setQrConfig] = useState<QRCustomConfig | null>(() => {
    if (typeof window === 'undefined') return null;
    return loadConfig(qrStorageKeyForEditor(cardId, cardId, allowFallbackToFirstCard));
  });

  useEffect(() => {
    setQrConfig(loadConfig(activeQrStorageKey));
  }, [activeQrStorageKey]);

  const qrRef = useRef<HTMLDivElement>(null);

  const PUBLIC_BASE =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ||
    'https://samcard.vercel.app';

  // Use the card's real public URL — falls back gracefully while slug is loading
  const CARD_URL = cardSlug
    ? `${PUBLIC_BASE}/${cardSlug}`
    : typeof window !== 'undefined'
      ? `${PUBLIC_BASE}/...`
      : PUBLIC_BASE;

  const { matrix: liveQrMatrix, N: liveQrN } = useMemo(() => makeQRMatrix(CARD_URL), [CARD_URL]);
  const setQr = useQrStore((s) => s.setQr);

  useEffect(() => {
    if (!resolvedCardId) return;

    getCardQRConfig(resolvedCardId)
      .then((savedConfig) => {
        if (!savedConfig) return;

        const qrFromBackend: QRCustomConfig = {
          shapeId: savedConfig.shapeId,
          dotShape: savedConfig.dotShape,
          finderStyle: savedConfig.finderStyle,
          eyeBall: savedConfig.eyeBall,
          bodyScale: savedConfig.bodyScale,
          fg: savedConfig.fg,
          bg: savedConfig.bg,
          accentFg: savedConfig.accentFg,
          accentBg: savedConfig.accentBg,
          strokeEnabled: savedConfig.strokeEnabled,
          strokeColor: savedConfig.strokeColor,
          gradEnabled: savedConfig.gradEnabled,
          gradStops: savedConfig.gradStops,
          gradAngle: savedConfig.gradAngle,
          selectedLogo: savedConfig.selectedLogo,
          customLogoUrl: savedConfig.customLogoUrl,
          logoNode: null,
          logoBg: savedConfig.logoBg,
          selectedSticker: savedConfig.stickerId ? STICKER_DEFS.find(s => s.id === savedConfig.stickerId) ?? null : null,
          designLabel: savedConfig.designLabel,
          shapeLabel: savedConfig.shapeLabel,
          qrMatrix: liveQrMatrix,
          qrN: liveQrN,
          decorateImageUrl: null,
          decorateCompositeDataUrl: null,
        };

        setQrConfig(qrFromBackend);
        setQr(qrFromBackend, liveQrMatrix, liveQrN);
        saveConfig(qrFromBackend, activeQrStorageKey);
      })
      .catch(() => {
        // ignore missing config
      });
  }, [resolvedCardId, liveQrMatrix, liveQrN, setQr, activeQrStorageKey]);

  useEffect(() => {
    setQr(qrConfig, liveQrMatrix, liveQrN);
  }, [qrConfig, liveQrMatrix, liveQrN, setQr]);

  const copyLink = useCallback(async () => {
    await navigator.clipboard.writeText(CARD_URL).catch(() => undefined);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }, [CARD_URL]);

  const downloadQR = useCallback(() => {
    const svgEl = qrRef.current?.querySelector('svg');
    if (!svgEl) return;
    const blob = new Blob([svgEl.outerHTML], { type: 'image/svg+xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'samcard-qr.svg';
    a.click();
    URL.revokeObjectURL(a.href);
  }, []);

  const shareQR = useCallback(async () => {
    if (navigator.share) await navigator.share({ title: 'My Digital Card', url: CARD_URL }).catch(() => undefined);
    else await copyLink();
  }, [copyLink, CARD_URL]);

  const printQR = useCallback(() => {
    const svgEl = qrRef.current?.querySelector('svg');
    if (!svgEl) return;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<html><head><title>QR Code</title><style>
      body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#0a0f0a;}
      svg{width:400px;height:400px;}
    </style></head><body>${svgEl.outerHTML}</body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 500);
  }, []);

  const handleCustomizerApply = useCallback(async (cfg: QRCustomConfig) => {
    setQrConfig(cfg);
    saveConfig(cfg, activeQrStorageKey);
    onConfigChange?.(cfg);

    const idToUse = resolvedCardId || cardId;
    if (idToUse) {
      try {
        await updateCardQR(idToUse, {
          shapeId: cfg.shapeId,
          dotShape: cfg.dotShape,
          finderStyle: cfg.finderStyle,
          eyeBall: cfg.eyeBall,
          bodyScale: cfg.bodyScale,
          fg: cfg.fg,
          bg: cfg.bg,
          accentFg: cfg.accentFg || cfg.fg,
          accentBg: cfg.accentBg || cfg.bg,
          strokeEnabled: cfg.strokeEnabled,
          strokeColor: cfg.strokeColor,
          gradEnabled: cfg.gradEnabled,
          gradStops: cfg.gradStops,
          gradAngle: cfg.gradAngle,
          selectedLogo: cfg.selectedLogo || '',
          customLogoUrl: cfg.customLogoUrl || '',
          logoBg: cfg.logoBg || '#ffffff',
          stickerId: cfg.selectedSticker?.id ?? null,
          designLabel: cfg.designLabel,
          shapeLabel: cfg.shapeLabel,
        });

        window.dispatchEvent(new Event('cardDataUpdated'));
      } catch {
        // Error handled silently for now
      }
    }

    setCustomizerOpen(false);
  }, [cardId, resolvedCardId, onConfigChange, activeQrStorageKey]);

  const handleReset = useCallback(() => {
    setQrConfig(null);
    clearConfig(activeQrStorageKey);
    setQr(null, liveQrMatrix, liveQrN);
  }, [setQr, liveQrMatrix, liveQrN, activeQrStorageKey]);

  useEffect(() => {
    if (customizerOpen) {
      const scrollY = window.scrollY;
      document.body.style.cssText = `overflow:hidden;position:fixed;top:-${scrollY}px;width:100%`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.cssText = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    return () => { document.body.style.cssText = ''; };
  }, [customizerOpen]);

  return (
    <>
      {/* ── Customizer Modal ── */}
      {customizerOpen && (
        <div onClick={() => setCustomizerOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)', overflowY: 'auto',
          }}
        >
          <div onClick={e => e.stopPropagation()}
            style={{ position: 'relative', zIndex: 10000, width: '100%', minHeight: '100vh' }}>
            <button onClick={() => setCustomizerOpen(false)}
              style={{
                position: 'fixed', top: 12, right: 12, zIndex: 10001,
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(0,128,1,0.15)', border: '1px solid rgba(0,128,1,0.4)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#f0f0f0', fontSize: 16,
              }}>✕</button>
            <QRCustomizer onApply={handleCustomizerApply} onClose={() => setCustomizerOpen(false)} initialConfig={qrConfig} targetUrl={CARD_URL} />
          </div>
        </div>
      )}

      {/* ── Page shell ── */}
      <div className="flex flex-col min-h-full" style={{ padding: '32px 24px 24px' }}>

        {/* ── Centered content container ── */}
        <div className="w-full mx-auto flex flex-col gap-5" style={{ maxWidth: 1100 }}>

          {/* ══ Main workspace card ══ */}
          <div className="rounded-2xl overflow-hidden"
            style={{
              background: '#111a11',
              border: '1px solid rgba(0,128,1,0.22)',
              boxShadow: '0 4px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,128,1,0.06)',
            }}
          >
            {/* Card header */}
            <div className="flex items-center justify-between px-7 py-4"
              style={{ borderBottom: '1px solid rgba(0,128,1,0.12)', background: 'rgba(0,0,0,0.15)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(73,182,24,0.12)', border: '1px solid rgba(73,182,24,0.22)' }}>
                  <QrCode className="w-4 h-4" style={{ color: '#49B618' }} />
                </div>
                <div>
                  <p className="text-sm font-bold leading-tight" style={{ color: '#e8f0e8' }}>QR Code</p>
                  <p className="text-xs leading-tight" style={{ color: '#3a6a3a' }}>Scan to view your digital card</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                {/* <button onClick={() => setCustomizerOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
                  style={{ background: 'rgba(0,204,68,0.08)', border: '1px solid rgba(0,204,68,0.25)', color: '#00CC44' }}>
                  <Palette className="w-3 h-3" />Customize
                </button> */}
                <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
                  style={{ background: 'rgba(0,128,1,0.1)', border: '1px solid rgba(73,182,24,0.25)', color: '#49B618' }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#49B618', boxShadow: '0 0 6px #49B618' }} />
                  Active
                </div>
              </div>
            </div>

            {/* ── 3-column body ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr] gap-0 divide-y lg:divide-y-0 lg:divide-x"
              style={{ '--tw-divide-color': 'rgba(0,128,1,0.1)' } as React.CSSProperties}>

              {/* ── Col 1: QR Preview ── */}
              <div className="flex flex-col gap-5 p-7">
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#2e5a2e' }}>Preview</p>

                <div ref={qrRef} className="flex justify-center">
                  <LiveQrDisplay config={qrConfig} qrMatrix={liveQrMatrix} qrN={liveQrN} />
                </div>

                {/* Style chip */}
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs"
                  style={{ background: 'rgba(0,128,1,0.06)', border: '1px solid rgba(0,128,1,0.14)' }}>
                  {qrConfig ? (
                    <>
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: qrConfig.fg, border: '1px solid rgba(255,255,255,0.15)' }} />
                      <span className="flex-1 truncate font-medium" style={{ color: '#b0d0b0' }}>
                        {qrConfig.shapeLabel}{qrConfig.designLabel ? ` · ${qrConfig.designLabel}` : ''}{qrConfig.gradEnabled ? ' · gradient' : ''}
                      </span>
                      <button onClick={handleReset}
                        style={{ color: '#3a5a3a', background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, flexShrink: 0 }}>
                        ✕ reset
                      </button>
                    </>
                  ) : (
                    <>
                      <Palette className="w-3 h-3 flex-shrink-0" style={{ color: '#3a6a3a' }} />
                      <span style={{ color: '#3a6a3a' }}>Default — click Customize to personalize</span>
                    </>
                  )}
                </div>

                {/* URL bar */}
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                  style={{ background: '#0c130c', border: '1px solid rgba(0,128,1,0.15)' }}>
                  <Globe2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#2e5a2e' }} />
                  <span className="text-xs flex-1 truncate" style={{ color: '#3a6a3a' }}>{CARD_URL}</span>
                  <button onClick={copyLink}
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: copiedLink ? 'rgba(73,182,24,0.18)' : 'rgba(0,128,1,0.07)',
                      border: '1px solid rgba(0,128,1,0.18)',
                    }}>
                    {copiedLink
                      ? <Check className="w-3 h-3" style={{ color: '#49B618' }} />
                      : <Copy className="w-3 h-3" style={{ color: '#3a6a3a' }} />}
                  </button>
                </div>
              </div>

              {/* ── Col 2: Statistics ── */}
              <div className="flex flex-col gap-5 p-7">
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#2e5a2e' }}>Scan Statistics</p>

                {/* Hero stat */}
                <div className="rounded-xl p-5 relative overflow-hidden"
                  style={{ background: '#0c130c', border: '1px solid rgba(73,182,24,0.18)' }}>
                  <div className="absolute -top-4 -right-4 w-28 h-28 pointer-events-none rounded-full"
                    style={{ background: 'radial-gradient(ellipse, rgba(73,182,24,0.2), transparent 70%)', filter: 'blur(16px)' }} />
                  <p className="text-xs mb-2" style={{ color: '#3a6a3a' }}>Total QR Scans</p>
                  <p className="text-5xl font-black tracking-tight" style={{ color: '#e8f0e8' }}>892</p>
                  <div className="flex items-center gap-1.5 mt-3">
                    <TrendingUp className="w-3.5 h-3.5" style={{ color: '#49B618' }} />
                    <span className="text-xs font-semibold" style={{ color: '#49B618' }}>+8.2% this month</span>
                  </div>
                </div>

                {/* Detail rows */}
                <div className="rounded-xl overflow-hidden"
                  style={{ background: '#0c130c', border: '1px solid rgba(0,128,1,0.12)' }}>
                  <StatRow icon={Clock} label="Last Scan" value="Feb 11, 2026 · 2:15 PM" />
                  <StatRow icon={AlertCircle} label="Status" value="Active" accent />
                  <StatRow icon={Activity} label="This Week" value="47 scans" />
                  <div className="flex items-center justify-between py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <QrCode className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#4a7a4a' }} />
                      <span className="text-xs" style={{ color: '#7a9a7a' }}>All-time peak</span>
                    </div>
                    <span className="text-xs" style={{ color: '#8aaa8a' }}>Dec 2025</span>
                  </div>
                </div>
              </div>

              {/* ── Col 3: Actions ── */}
              <div className="flex flex-col gap-5 p-7">
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#2e5a2e' }}>Actions</p>

                {/* Primary CTA */}
                <button onClick={() => setCustomizerOpen(true)}
                  className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  style={{
                    background: 'linear-gradient(135deg, #006a01 0%, #2e8a08 50%, #49B618 100%)',
                    boxShadow: '0 4px 20px rgba(0,128,1,0.35)',
                    color: 'white', fontSize: 13,
                  }}>
                  <Palette className="w-4 h-4" />
                  Design Your QR Code
                </button>

                {/* Action stack */}
                <div className="flex flex-col gap-2">
                  <ActionBtn icon={Download} label="Download SVG" onClick={downloadQR} variant="primary" />
                  <ActionBtn icon={Share2} label="Share QR Code" onClick={shareQR} />
                  <ActionBtn icon={RefreshCw} label="Regenerate" onClick={() => setCustomizerOpen(true)} />
                  <ActionBtn icon={Printer} label="Print" onClick={printQR} />
                </div>

                {/* Spacer + tip */}
                <div className="mt-auto pt-2 rounded-xl px-4 py-3"
                  style={{ background: 'rgba(0,128,1,0.04)', border: '1px solid rgba(0,128,1,0.1)' }}>
                  <p className="text-xs leading-relaxed" style={{ color: '#3a5a3a' }}>
                    Your QR code stays active as long as your card is published. You can redesign it anytime without changing the link.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* ── Footer nav ──
          <div className="flex items-center justify-between pt-1">
            <button
              className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl transition-all"
              style={{ background: 'rgba(0,128,1,0.07)', border: '1px solid rgba(0,128,1,0.18)', color: '#7a9a7a' }}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <p className="text-xs" style={{ color: '#2e5a2e' }}>Step 3 of 3</p>
            <button
              className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #006a01, #3a9a10)',
                boxShadow: '0 2px 16px rgba(0,128,1,0.35)',
                color: 'white',
              }}
            >
              Save & Finish ✓
            </button>
          </div> */}

        </div>
      </div>
    </>
  );
}
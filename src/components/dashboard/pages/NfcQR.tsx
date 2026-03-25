"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Smartphone, QrCode, Download, Share2, RefreshCw,
  Printer, Clock, TrendingUp, Copy, Check,
  Zap, Activity, Signal, AlertCircle, Palette,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

import QRCustomizer, { QRCustomConfig } from './Qrcustomizer';
import { QRWithShape, STICKER_DEFS } from '@/components/dashboard/pages/Qrrenderers';
import { LOGOS } from '@/components/dashboard/pages/constants';
import { makeQRMatrix } from '@/components/dashboard/pages/qr-engine';
import { useQrStore } from '@/components/dashboard/stores/Useqrstore';

// ─── Persistence helpers ──────────────────────────────────────────────────────

const STORAGE_KEY = 'samcard_qr_config_v1';

type PersistedConfig = Omit<QRCustomConfig, 'logoNode' | 'selectedSticker'> & {
  logoIndex: number | null;
  stickerId: string | null;
};

function saveConfig(cfg: QRCustomConfig): void {
  try {
    let logoIndex: number | null = null;
    if (cfg.selectedLogo && cfg.selectedLogo.startsWith('logo-')) {
      logoIndex = parseInt(cfg.selectedLogo.replace('logo-', ''), 10);
    }
    const persisted: PersistedConfig = {
      shapeId: cfg.shapeId,
      dotShape: cfg.dotShape,
      finderStyle: cfg.finderStyle,
      eyeBall: cfg.eyeBall,
      bodyScale: cfg.bodyScale,
      fg: cfg.fg,
      bg: cfg.bg,
      accentFg: cfg.accentFg,
      accentBg: cfg.accentBg,
      strokeEnabled: cfg.strokeEnabled,
      strokeColor: cfg.strokeColor,
      gradEnabled: cfg.gradEnabled,
      gradStops: cfg.gradStops,
      gradAngle: cfg.gradAngle,
      selectedLogo: cfg.selectedLogo,
      customLogoUrl: cfg.customLogoUrl,
      logoBg: cfg.logoBg,
      designLabel: cfg.designLabel,
      shapeLabel: cfg.shapeLabel,
      logoIndex,
      stickerId: cfg.selectedSticker?.id ?? null,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
  } catch {
    // localStorage unavailable — silently ignore
  }
}

function loadConfig(): QRCustomConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p: PersistedConfig = JSON.parse(raw);

    const logoEntry = p.logoIndex !== null ? LOGOS[p.logoIndex] : null;
    const logoNode = logoEntry?.icon ?? null;
    const logoBg = logoEntry?.bg ?? p.logoBg ?? '#ffffff';

    const selectedSticker = p.stickerId
      ? STICKER_DEFS.find(s => s.id === p.stickerId) ?? null
      : null;

    return {
      shapeId: p.shapeId,
      dotShape: p.dotShape,
      finderStyle: p.finderStyle,
      eyeBall: p.eyeBall,
      bodyScale: p.bodyScale,
      fg: p.fg,
      bg: p.bg,
      accentFg: p.accentFg,
      accentBg: p.accentBg,
      strokeEnabled: p.strokeEnabled,
      strokeColor: p.strokeColor,
      gradEnabled: p.gradEnabled,
      gradStops: p.gradStops,
      gradAngle: p.gradAngle,
      selectedLogo: p.selectedLogo,
      customLogoUrl: p.customLogoUrl,
      logoNode,
      logoBg,
      selectedSticker,
      designLabel: p.designLabel,
      shapeLabel: p.shapeLabel,
    };
  } catch {
    return null;
  }
}

function clearConfig(): void {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
}

// ─── Static data ──────────────────────────────────────────────────────────────

interface ScanDataPoint { month: string; nfc: number; qr: number; }
interface TooltipPayloadItem { name: string; value: number; color: string; }
interface ChartTooltipProps { active?: boolean; payload?: TooltipPayloadItem[]; label?: string; }

const scanData: ScanDataPoint[] = [
  { month: 'Sep', nfc: 320, qr: 180 },
  { month: 'Oct', nfc: 410, qr: 200 },
  { month: 'Nov', nfc: 380, qr: 220 },
  { month: 'Dec', nfc: 520, qr: 280 },
  { month: 'Jan', nfc: 480, qr: 300 },
  { month: 'Feb', nfc: 664, qr: 380 },
];

const NFC_SERIAL = 'NFC-7C3A-ED42-89F1';

// ─── Sub-components ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-4 py-3 shadow-2xl text-xs"
      style={{ background: '#111a11', border: '1px solid rgba(0,128,1,0.3)' }}>
      <p className="font-bold mb-2" style={{ color: '#f0f0f0' }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: '#7a9a7a' }}>{p.name}:</span>
          <span className="font-bold" style={{ color: '#f0f0f0' }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

function NfcRings({ active }: { active: boolean }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
      {[0, 1, 2].map((i) => (
        <div key={i} className="absolute rounded-full border" style={{
          width: 80 + i * 28, height: 80 + i * 28,
          borderColor: `rgba(0,128,1,${0.5 - i * 0.14})`,
          animation: `ping ${1.4 + i * 0.3}s cubic-bezier(0,0,0.2,1) infinite`,
          animationDelay: `${i * 0.2}s`,
        }} />
      ))}
      <div className="relative w-20 h-20 rounded-full flex items-center justify-center z-10"
        style={{
          background: active ? 'linear-gradient(135deg,#008001,#49B618)' : 'linear-gradient(135deg,#555,#333)',
          boxShadow: active ? '0 0 32px rgba(0,128,1,0.6), 0 0 64px rgba(73,182,24,0.2)' : 'none',
        }}>
        <Smartphone className="w-9 h-9 text-white" />
      </div>
      <style>{`@keyframes ping{0%{transform:scale(0.92);opacity:0.8}70%{transform:scale(1.12);opacity:0}100%{transform:scale(0.92);opacity:0}}`}</style>
    </div>
  );
}

// ── Live SVG QR Display ───────────────────────────────────────────────────────
const QR_SIZE_FIXED = 240;

function LiveQrDisplay({
  config,
  qrMatrix,
  qrN,
}: {
  config: QRCustomConfig | null;
  qrMatrix?: boolean[][];
  qrN?: number;
}) {
  const gradId = "nfcqr-fg-grad";
  const clipId = "nfcqr-clip";

  const fg = config?.fg ?? "#000000";
  const bg = config?.bg ?? "#ffffff";
  const shapeId = config?.shapeId ?? "square";
  const dotShape = config?.dotShape ?? "square";
  const finderStyle = config?.finderStyle ?? "square";
  const eyeBall = config?.eyeBall ?? "square";
  const scale = config?.bodyScale ?? 1.0;
  const accentFg = config?.accentFg;
  const accentBg = config?.accentBg;
  const strokeEnabled = config?.strokeEnabled ?? false;
  const strokeColor = config?.strokeColor ?? "#000000";
  const gradEnabled = config?.gradEnabled ?? false;
  const gradStops = config?.gradStops ?? [];
  const gradAngle = config?.gradAngle ?? 135;
  const selectedLogo = config?.selectedLogo ?? null;
  const customLogoUrl = config?.customLogoUrl ?? null;
  const logoNode = config?.logoNode ?? null;
  const logoBg = config?.logoBg ?? "#ffffff";
  const sticker = config?.selectedSticker ?? null;

  const RING_PAD = 44;
  const OUTER = sticker ? QR_SIZE_FIXED + RING_PAD * 2 : QR_SIZE_FIXED;

  return (
    <div className="relative flex items-center justify-center">
      <div
        className="absolute inset-0 blur-2xl opacity-20 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #49B618, transparent 70%)' }}
      />
      <div
        className="relative p-3 rounded-2xl"
        style={{
          background: '#0a0f0a',
          border: '2px solid rgba(0,128,1,0.5)',
          boxShadow: '0 0 24px rgba(0,128,1,0.25)',
          display: 'inline-block',
        }}
      >
        <svg
          width={QR_SIZE_FIXED}
          height={QR_SIZE_FIXED}
          viewBox={`0 0 ${OUTER} ${OUTER}`}
          style={{ display: 'block', borderRadius: 14, overflow: 'hidden' }}
        >
          {gradEnabled && gradStops.length >= 2 && (
            <defs>
              <linearGradient
                id={gradId}
                x1={`${50 - 50 * Math.cos((gradAngle * Math.PI) / 180)}%`}
                y1={`${50 - 50 * Math.sin((gradAngle * Math.PI) / 180)}%`}
                x2={`${50 + 50 * Math.cos((gradAngle * Math.PI) / 180)}%`}
                y2={`${50 + 50 * Math.sin((gradAngle * Math.PI) / 180)}%`}
              >
                {gradStops.map((s, i) => (
                  <stop key={i} offset={`${s.offset * 100}%`} stopColor={s.color} />
                ))}
              </linearGradient>
            </defs>
          )}

          <rect width={OUTER} height={OUTER} fill={bg} rx={14} />

          <g transform={sticker ? `translate(${RING_PAD},${RING_PAD})` : undefined}>
            <QRWithShape
              shapeId={shapeId}
              dotShape={dotShape}
              finderStyle={finderStyle}
              fg={gradEnabled ? `url(#${gradId})` : fg}
              bg={bg}
              accentFg={accentFg}
              accentBg={accentBg}
              scale={scale}
              eyeBall={eyeBall}
              size={QR_SIZE_FIXED}
              strokeEnabled={strokeEnabled}
              strokeColor={strokeColor}
              selectedLogo={selectedLogo}
              customLogoUrl={customLogoUrl}
              logoNode={logoNode}
              logoBg={logoBg}
              clipId={clipId}
              qrMatrix={qrMatrix}
              qrN={qrN}
            />
          </g>

          {sticker && sticker.render(OUTER, QR_SIZE_FIXED)}

          {/* ── SC badge removed — no default logo shown when user hasn't selected one ── */}
        </svg>
      </div>
    </div>
  );
}

export { LiveQrDisplay };

function Globe2({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function NfcQr() {
  const [copiedSerial, setCopiedSerial] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [nfcActive, setNfcActive] = useState(true);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [qrConfig, setQrConfig] = useState<QRCustomConfig | null>(() => {
    if (typeof window === 'undefined') return null;
    return loadConfig();
  });

  const qrRef = useRef<HTMLDivElement>(null);

  const CARD_URL = typeof window !== 'undefined'
    ? window.location.href
    : 'https://samcard.app/u/subaina';

  const { matrix: liveQrMatrix, N: liveQrN } = useMemo(
    () => makeQRMatrix(CARD_URL),
    [CARD_URL],
  );

  // ── Sync into shared store so QrPopup always shows this QR ────
  const setQr = useQrStore((s) => s.setQr);
  useEffect(() => {
    setQr(qrConfig, liveQrMatrix, liveQrN);
  }, [qrConfig, liveQrMatrix, liveQrN, setQr]);

  const copySerial = useCallback(async () => {
    await navigator.clipboard.writeText(NFC_SERIAL).catch(() => undefined);
    setCopiedSerial(true);
    setTimeout(() => setCopiedSerial(false), 2000);
  }, []);

  const copyLink = useCallback(async () => {
    await navigator.clipboard.writeText(CARD_URL).catch(() => undefined);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }, [CARD_URL]);

  const downloadQR = useCallback(() => {
    const svgEl = qrRef.current?.querySelector('svg');
    if (svgEl) {
      const blob = new Blob([svgEl.outerHTML], { type: 'image/svg+xml' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'samcard-qr.svg';
      a.click();
      URL.revokeObjectURL(a.href);
    }
  }, []);

  const shareQR = useCallback(async () => {
    if (navigator.share) {
      await navigator.share({ title: 'My Digital Card', url: CARD_URL }).catch(() => undefined);
    } else {
      await copyLink();
    }
  }, [copyLink, CARD_URL]);

  const printQR = useCallback(() => {
    const svgEl = qrRef.current?.querySelector('svg');
    if (!svgEl) return;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`
      <html><head><title>QR Code</title><style>
        body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#0a0f0a;}
        svg{width:400px;height:400px;}
      </style></head>
      <body>${svgEl.outerHTML}</body></html>
    `);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); }, 500);
  }, []);

  const handleCustomizerApply = useCallback((cfg: QRCustomConfig) => {
    setQrConfig(cfg);
    saveConfig(cfg);
    setCustomizerOpen(false);
  }, []);

  // ── FIX: Reset clears both local state AND the shared store ───
  const handleReset = useCallback(() => {
    setQrConfig(null);
    clearConfig();
    // Push null config + default matrix into store immediately
    setQr(null, liveQrMatrix, liveQrN);
  }, [setQr, liveQrMatrix, liveQrN]);

  const stats = [
    { label: 'Total NFC Taps', value: '2,547', delta: '+12.5%', icon: Smartphone, color: '#008001', glow: 'rgba(0,128,1,0.4)' },
    { label: 'Total QR Scans', value: '892', delta: '+8.2%', icon: QrCode, color: '#49B618', glow: 'rgba(73,182,24,0.35)' },
    { label: 'Total Interactions', value: '3,439', delta: '+18.5%', icon: Activity, color: '#22c55e', glow: 'rgba(34,197,94,0.3)' },
  ];

  useEffect(() => {
    if (customizerOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    };
  }, [customizerOpen]);

  return (
    <div className="space-y-6">

      {/* ── QR Customizer Modal Overlay ── */}
      {customizerOpen && (
        <div
          onClick={() => setCustomizerOpen(false)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            width: '100vw', height: '100vh', zIndex: 9999,
            background: 'rgba(0,0,0,0.95)',
            backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            overflowY: 'auto', display: 'flex',
            alignItems: 'flex-start', justifyContent: 'center', padding: '0',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ position: 'relative', zIndex: 10000, width: '100%', minHeight: '100vh' }}
          >
            <button
              onClick={() => setCustomizerOpen(false)}
              style={{
                position: 'fixed', top: 16, right: 16, zIndex: 10001,
                width: 40, height: 40, borderRadius: '50%',
                background: 'rgba(0,128,1,0.15)', border: '1px solid rgba(0,128,1,0.4)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#f0f0f0', fontSize: 18, lineHeight: 1, transition: 'all 0.2s',
              }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(0,128,1,0.35)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'rgba(0,128,1,0.15)'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              ✕
            </button>
            {/* ── FIX: Pass current qrConfig so customizer pre-loads saved state ── */}
            <QRCustomizer
              onApply={handleCustomizerApply}
              onClose={() => setCustomizerOpen(false)}
              initialConfig={qrConfig}
            />
          </div>
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {stats.map(({ label, value, delta, icon: Icon, color, glow }) => (
          <div key={label} className="relative rounded-2xl p-5 overflow-hidden"
            style={{ background: '#111a11', border: '1px solid rgba(0,128,1,0.25)' }}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
              style={{ background: `radial-gradient(ellipse at 80% 20%, ${glow}, transparent 70%)`, filter: 'blur(16px)' }} />
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}20`, border: `1px solid ${color}40`, boxShadow: `0 0 16px ${glow}` }}>
                <Icon className="w-7 h-7" style={{ color }} />
              </div>
              <div>
                <p className="text-xs mb-0.5" style={{ color: '#7a9a7a' }}>{label}</p>
                <p className="text-3xl font-black" style={{ color: '#f0f0f0' }}>{value}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" style={{ color: '#49B618' }} />
                  <span className="text-xs font-semibold" style={{ color: '#49B618' }}>{delta} this month</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* NFC Card */}
        <div className="rounded-2xl overflow-hidden" style={{ background: '#111a11', border: '1px solid rgba(0,128,1,0.25)' }}>
          <div className="flex items-center justify-between px-6 pt-6 pb-4" style={{ borderBottom: '1px solid rgba(0,128,1,0.15)' }}>
            <div className="flex items-center gap-2">
              <Signal className="w-5 h-5" style={{ color: '#49B618' }} />
              <h2 className="font-bold text-lg" style={{ color: '#f0f0f0' }}>NFC Card Status</h2>
            </div>
            <Badge className="text-xs px-2.5 py-1 rounded-full font-semibold"
              style={{
                background: nfcActive ? 'rgba(0,128,1,0.15)' : 'rgba(255,60,60,0.12)',
                color: nfcActive ? '#49B618' : '#f87171',
                border: `1px solid ${nfcActive ? 'rgba(73,182,24,0.35)' : 'rgba(248,113,113,0.3)'}`,
              }}>
              <div className="w-1.5 h-1.5 rounded-full mr-1.5 inline-block"
                style={{ background: nfcActive ? '#49B618' : '#f87171', boxShadow: nfcActive ? '0 0 6px #49B618' : 'none' }} />
              {nfcActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          <div className="p-6 space-y-5">
            <div className="flex justify-center py-4"><NfcRings active={nfcActive} /></div>

            <div className="rounded-xl overflow-hidden divide-y" style={{ background: '#0a0f0a', border: '1px solid rgba(0,128,1,0.18)' }}>
              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="text-xs" style={{ color: '#7a9a7a' }}>Serial Number</span>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono" style={{ color: '#f0f0f0' }}>{NFC_SERIAL}</code>
                  <button onClick={copySerial} className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                    style={{ background: copiedSerial ? 'rgba(73,182,24,0.2)' : 'rgba(0,128,1,0.1)', border: '1px solid rgba(0,128,1,0.25)' }}>
                    {copiedSerial ? <Check className="w-3.5 h-3.5" style={{ color: '#49B618' }} /> : <Copy className="w-3.5 h-3.5" style={{ color: '#7a9a7a' }} />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="text-xs" style={{ color: '#7a9a7a' }}>Last Tap</span>
                <div className="text-right">
                  <p className="text-xs font-semibold" style={{ color: '#f0f0f0' }}>Feb 11, 2026 · 3:42 PM</p>
                  <p className="text-[11px] mt-0.5" style={{ color: '#3a5a3a' }}>New York, USA</p>
                </div>
              </div>
              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="text-xs" style={{ color: '#7a9a7a' }}>Total Taps</span>
                <span className="text-2xl font-black" style={{ color: '#49B618' }}>2,547</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="text-xs" style={{ color: '#7a9a7a' }}>Tag Health</span>
                <div className="flex items-center gap-2">
                  {nfcActive
                    ? <><div className="w-2 h-2 rounded-full" style={{ background: '#49B618', boxShadow: '0 0 6px #49B618' }} /><span className="text-xs font-semibold" style={{ color: '#49B618' }}>Healthy</span></>
                    : <><div className="w-2 h-2 rounded-full bg-red-400" /><span className="text-xs font-semibold text-red-400">Inactive</span></>
                  }
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => alert('Tap history coming soon!')} className="text-xs h-10 rounded-xl font-semibold"
                style={{ background: 'rgba(0,128,1,0.12)', border: '1px solid rgba(0,128,1,0.3)', color: '#f0f0f0' }}>
                <Download className="w-4 h-4 mr-1.5" />View Tap History
              </Button>
              <Button onClick={() => setNfcActive(v => !v)} className="text-xs h-10 rounded-xl font-semibold"
                style={{ background: nfcActive ? 'rgba(255,60,60,0.1)' : 'rgba(0,128,1,0.12)', border: nfcActive ? '1px solid rgba(248,113,113,0.3)' : '1px solid rgba(0,128,1,0.3)', color: nfcActive ? '#f87171' : '#f0f0f0' }}>
                {nfcActive
                  ? <><AlertCircle className="w-4 h-4 mr-1.5" />Deactivate Tag</>
                  : <><Zap className="w-4 h-4 mr-1.5" />Activate Tag</>}
              </Button>
            </div>
          </div>
        </div>

        {/* QR Card */}
        <div className="rounded-2xl overflow-hidden" style={{ background: '#111a11', border: '1px solid rgba(0,128,1,0.25)' }}>
          <div className="flex items-center justify-between px-6 pt-6 pb-4" style={{ borderBottom: '1px solid rgba(0,128,1,0.15)' }}>
            <div>
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5" style={{ color: '#49B618' }} />
                <h2 className="font-bold text-lg" style={{ color: '#f0f0f0' }}>QR Code</h2>
              </div>
              <p className="text-xs mt-0.5" style={{ color: '#7a9a7a' }}>Scan to view your digital card</p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setCustomizerOpen(true)} className="text-xs h-8 px-3 rounded-xl font-semibold flex items-center gap-1.5"
                style={{ background: 'rgba(0,204,68,0.12)', border: '1px solid rgba(0,204,68,0.35)', color: '#00CC44' }}>
                <Palette className="w-3.5 h-3.5" />Customize
              </Button>
              <Badge className="text-xs px-2.5 py-1 rounded-full font-semibold"
                style={{ background: 'rgba(0,128,1,0.15)', color: '#49B618', border: '1px solid rgba(73,182,24,0.35)' }}>
                <div className="w-1.5 h-1.5 rounded-full mr-1.5 inline-block bg-[#49B618]" style={{ boxShadow: '0 0 6px #49B618' }} />Active
              </Badge>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div className="flex justify-center" ref={qrRef}>
              <LiveQrDisplay config={qrConfig} qrMatrix={liveQrMatrix} qrN={liveQrN} />
            </div>

            {qrConfig && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
                style={{ background: 'rgba(0,204,68,0.06)', border: '1px solid rgba(0,204,68,0.2)' }}>
                <Palette className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#49B618' }} />
                <span style={{ color: '#7a9a7a' }}>Custom style:</span>
                <div className="w-3.5 h-3.5 rounded-full border border-white/10 flex-shrink-0"
                  style={{ background: qrConfig.fg }} />
                <span style={{ color: '#f0f0f0', fontWeight: 600 }}>
                  {qrConfig.shapeLabel}
                  {qrConfig.designLabel ? ` · ${qrConfig.designLabel}` : ''}
                  {qrConfig.gradEnabled ? ' · gradient' : ''}
                </span>
                {/* ── FIX: Reset button now also clears the store ── */}
                <button onClick={handleReset} className="ml-auto"
                  style={{ color: '#555', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer' }}>
                  ✕ reset
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: '#0a0f0a', border: '1px solid rgba(0,128,1,0.18)' }}>
              <Globe2 className="w-4 h-4 flex-shrink-0" style={{ color: '#49B618' }} />
              <span className="text-xs flex-1 truncate" style={{ color: '#7a9a7a' }}>{CARD_URL}</span>
              <button onClick={copyLink} className="w-7 h-7 rounded-lg flex items-center justify-center transition-all flex-shrink-0"
                style={{ background: copiedLink ? 'rgba(73,182,24,0.2)' : 'rgba(0,128,1,0.1)', border: '1px solid rgba(0,128,1,0.25)' }}>
                {copiedLink ? <Check className="w-3.5 h-3.5" style={{ color: '#49B618' }} /> : <Copy className="w-3.5 h-3.5" style={{ color: '#7a9a7a' }} />}
              </button>
            </div>

            <div className="rounded-xl overflow-hidden divide-y" style={{ background: '#0a0f0a', border: '1px solid rgba(0,128,1,0.18)' }}>
              <div className="flex items-center justify-between px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4" style={{ color: '#49B618' }} />
                  <span className="text-xs font-medium" style={{ color: '#f0f0f0' }}>QR Scans</span>
                </div>
                <span className="text-xl font-black" style={{ color: '#49B618' }}>892</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" style={{ color: '#7a9a7a' }} />
                  <span className="text-xs font-medium" style={{ color: '#f0f0f0' }}>Last Scan</span>
                </div>
                <span className="text-xs" style={{ color: '#7a9a7a' }}>Feb 11, 2026 · 2:15 PM</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button onClick={downloadQR} className="text-xs h-10 rounded-xl font-semibold text-white"
                style={{ background: 'linear-gradient(135deg,#008001,#49B618)', boxShadow: '0 4px 14px rgba(0,128,1,0.35)' }}>
                <Download className="w-4 h-4 mr-1.5" />Download QR
              </Button>
              <Button onClick={shareQR} className="text-xs h-10 rounded-xl font-semibold"
                style={{ background: 'rgba(0,128,1,0.12)', border: '1px solid rgba(0,128,1,0.3)', color: '#f0f0f0' }}>
                <Share2 className="w-4 h-4 mr-1.5" />Share QR
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => setCustomizerOpen(true)} className="text-xs h-10 rounded-xl font-semibold"
                style={{ background: 'rgba(0,128,1,0.12)', border: '1px solid rgba(0,128,1,0.3)', color: '#f0f0f0' }}>
                <RefreshCw className="w-4 h-4 mr-1.5" />Regenerate
              </Button>
              <Button onClick={printQR} className="text-xs h-10 rounded-xl font-semibold"
                style={{ background: 'rgba(0,128,1,0.12)', border: '1px solid rgba(0,128,1,0.3)', color: '#f0f0f0' }}>
                <Printer className="w-4 h-4 mr-1.5" />Print
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Comparison Chart ── */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#111a11', border: '1px solid rgba(0,128,1,0.25)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 pt-6 pb-4" style={{ borderBottom: '1px solid rgba(0,128,1,0.15)' }}>
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" style={{ color: '#49B618' }} />
              <h2 className="font-bold text-lg" style={{ color: '#f0f0f0' }}>NFC vs QR Performance</h2>
            </div>
            <p className="text-xs mt-0.5" style={{ color: '#7a9a7a' }}>Last 6 months scan comparison</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-1.5 rounded-full" style={{ background: '#008001' }} />
              <span className="text-xs" style={{ color: '#7a9a7a' }}>NFC Taps</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1.5 rounded-full" style={{ background: '#49B618' }} />
              <span className="text-xs" style={{ color: '#7a9a7a' }}>QR Scans</span>
            </div>
          </div>
        </div>
        <div className="p-6 min-w-0 min-h-[320px]" style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={1}>
            <AreaChart data={scanData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <defs>
                <linearGradient id="nfcGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#008001" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#008001" stopOpacity={0.03} />
                </linearGradient>
                <linearGradient id="qrGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#49B618" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#49B618" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="0" stroke="rgba(0,128,1,0.08)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#3a5a3a', fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#3a5a3a', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="nfc" name="NFC Taps" stroke="#008001" strokeWidth={2.5} fill="url(#nfcGrad)" dot={false} activeDot={{ r: 5, fill: '#008001', stroke: '#0a0f0a', strokeWidth: 2 }} />
              <Area type="monotone" dataKey="qr" name="QR Scans" stroke="#49B618" strokeWidth={2.5} fill="url(#qrGrad)" dot={false} activeDot={{ r: 5, fill: '#49B618', stroke: '#0a0f0a', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
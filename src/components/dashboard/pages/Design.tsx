"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/dashboard/ui/button';
import { Label } from '@/components/dashboard/ui/label';
import { Input } from '@/components/dashboard/ui/input';
import { Slider } from '@/components/dashboard/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/dashboard/ui/select';
import {
  Check, RotateCcw, Save, Palette, Smartphone, ChevronDown, ChevronUp,
  Type, Layout, Sun, X, Download, Layers,
} from 'lucide-react';
import { PhonePreview, ThemeOverride, ExtraSection } from '@/components/dashboard/pages/PhonePreview';
import { CardPreviewModal } from '@/components/dashboard/pages/CardPreviewModal';
import { getBusinessProfile, getCardContent, getCardDesign, updateCardDesign, getSocialLinks, getCustomLinks, getCards } from '@/lib/api';
import type { LogoPosition } from '@/components/dashboard/pages/PhonePreview';

// ── Cache keys ────────────────────────────────────────────────────
const PROFILE_KEY = 'businessProfile_v1';
const DESIGN_KEY = 'cardDesign_v1';

const profileCacheKeyForCard = (cardId?: string): string =>
  cardId ? `${PROFILE_KEY}:${cardId}` : PROFILE_KEY;

const profileCacheKeyForEditor = (
  explicitCardId?: string,
  resolvedCardId?: string,
  allowFallbackToFirstCard: boolean = true,
): string => {
  if (explicitCardId) return profileCacheKeyForCard(explicitCardId);
  if (resolvedCardId) return profileCacheKeyForCard(resolvedCardId);
  if (!allowFallbackToFirstCard) return `${PROFILE_KEY}:draft`;
  return PROFILE_KEY;
};

const designCacheKeyForCard = (cardId?: string): string =>
  cardId ? `${DESIGN_KEY}:${cardId}` : DESIGN_KEY;

const designCacheKeyForEditor = (
  explicitCardId?: string,
  resolvedCardId?: string,
  allowFallbackToFirstCard: boolean = true,
): string => {
  if (explicitCardId) return designCacheKeyForCard(explicitCardId);
  if (resolvedCardId) return designCacheKeyForCard(resolvedCardId);
  if (!allowFallbackToFirstCard) return `${DESIGN_KEY}:draft`;
  return DESIGN_KEY;
};

// ── Profile cache shape ───────────────────────────────────────────
interface ProfileCache {
  profileImage?: string;
  brandLogo?: string;
  logoPosition?: LogoPosition;
  formData?: {
    name?: string; title?: string; company?: string; tagline?: string;
    email?: string; phone?: string; website?: string; location?: string;
    industry?: string; yearFounded?: string; appointmentUrl?: string;
    headingText?: string; bodyText?: string;
  };
  socialLinks?: { platform: number; value: string }[];
  customLinks?: { label: string; url: string }[];
  sections?: {
    profile?: boolean; headingText?: boolean; contactUs?: boolean;
    socialLinks?: boolean; links?: boolean; appointment?: boolean; collectContacts?: boolean;
  };
  extraSections?: ExtraSection[];
}

// ── Wallpaper presets ─────────────────────────────────────────────
interface WallpaperPreset {
  id: string;
  name: string;
  style: string;
  thumb: string;
}

const WALLPAPER_PRESETS: WallpaperPreset[] = [
  {
    id: 'deep-space',
    name: 'Deep Space',
    thumb: 'radial-gradient(ellipse at 20% 30%, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    style: 'radial-gradient(ellipse at 20% 80%, #0f2027 0%, #203a43 45%, #2c5364 100%)',
  },
  {
    id: 'aurora',
    name: 'Aurora',
    thumb: 'linear-gradient(135deg, #0a0a0a 0%, #003322 30%, #006644 55%, #001133 80%, #0a0a0a 100%)',
    style: 'linear-gradient(160deg, #0a0a0a 0%, #003322 25%, #006644 50%, #004422 70%, #001133 85%, #0a0a0a 100%)',
  },
  {
    id: 'midnight-purple',
    name: 'Midnight',
    thumb: 'radial-gradient(ellipse at 70% 20%, #1a0533 0%, #0d0118 50%, #050010 100%)',
    style: 'radial-gradient(ellipse at 60% 10%, #2d0855 0%, #1a0533 40%, #0d0118 70%, #050010 100%)',
  },
  {
    id: 'sunset-dusk',
    name: 'Dusk',
    thumb: 'linear-gradient(180deg, #1a0500 0%, #3d1000 35%, #1a0800 65%, #000 100%)',
    style: 'linear-gradient(170deg, #1a0500 0%, #3d1000 30%, #2a0a00 55%, #1a0800 75%, #000 100%)',
  },
  {
    id: 'ocean-depth',
    name: 'Ocean',
    thumb: 'radial-gradient(ellipse at 30% 40%, #001f3f 0%, #003366 50%, #000d1a 100%)',
    style: 'radial-gradient(ellipse at 30% 20%, #003366 0%, #001f3f 40%, #000d1a 75%, #000510 100%)',
  },
  {
    id: 'volcanic',
    name: 'Volcanic',
    thumb: 'radial-gradient(ellipse at 50% 80%, #2d0000 0%, #1a0000 50%, #050000 100%)',
    style: 'radial-gradient(ellipse at 50% 90%, #3d0000 0%, #2d0000 30%, #1a0000 60%, #050000 100%)',
  },
  {
    id: 'custom',
    name: 'Custom',
    thumb: 'linear-gradient(135deg, #111 0%, #222 100%)',
    style: '',
  },
];

// ── Design settings ───────────────────────────────────────────────
export interface DesignSettings {
  accentColor: string;
  accentLight: string;
  bgColor: string;
  cardColor: string;
  textPrimary: string;
  textMuted: string;
  palette: string;
  // Phone wallpaper
  phoneBgPreset: string;
  phoneBgColor1: string;
  phoneBgColor2: string;
  phoneBgAngle: number;
  phoneBgType: 'solid' | 'gradient';
  // Typography
  font: string;
  bodyFontSize: number;
  nameFontSize: number;
  boldHeadings: boolean;
  // Cards
  cardRadius: number;
  shadowIntensity: 'none' | 'soft' | 'medium' | 'strong';
  glowEffect: boolean;
}

// ── Color palette presets ─────────────────────────────────────────
interface Palette {
  name: string; emoji: string; accent: string; accentLight: string;
  bg: string; card: string; textPrimary: string; textMuted: string;
  // Which wallpaper preset best matches this palette
  wallpaper: string;
}
const PALETTES: Record<string, Palette> = {
  green: { name: 'Forest', emoji: '🌿', accent: '#008001', accentLight: '#49B618', bg: '#0a0f0a', card: '#111a11', textPrimary: '#f0f0f0', textMuted: '#7a9a7a', wallpaper: 'aurora' },
  ocean: { name: 'Ocean', emoji: '🌊', accent: '#0284c7', accentLight: '#38bdf8', bg: '#0c1a2e', card: '#112040', textPrimary: '#e0f2fe', textMuted: '#93c5fd', wallpaper: 'ocean-depth' },
  sunset: { name: 'Sunset', emoji: '🌅', accent: '#ea580c', accentLight: '#fb923c', bg: '#1c0a00', card: '#2d1200', textPrimary: '#fff7ed', textMuted: '#fcd34d', wallpaper: 'sunset-dusk' },
  violet: { name: 'Violet', emoji: '💜', accent: '#7c3aed', accentLight: '#a78bfa', bg: '#0d0618', card: '#1a0a2e', textPrimary: '#f5f3ff', textMuted: '#c4b5fd', wallpaper: 'midnight-purple' },
  rose: { name: 'Rose', emoji: '🌸', accent: '#db2777', accentLight: '#f472b6', bg: '#1a0011', card: '#2a0018', textPrimary: '#fdf2f8', textMuted: '#f9a8d4', wallpaper: 'volcanic' },
  mono: { name: 'Mono', emoji: '◆', accent: '#e5e5e5', accentLight: '#ffffff', bg: '#111111', card: '#1e1e1e', textPrimary: '#ffffff', textMuted: '#888888', wallpaper: 'deep-space' },
};

// ── Font map ──────────────────────────────────────────────────────
const FONTS: Record<string, { label: string; css: string }> = {
  inter: { label: 'Inter', css: 'Inter, sans-serif' },
  sora: { label: 'Sora', css: 'Sora, sans-serif' },
  'dm-sans': { label: 'DM Sans', css: '"DM Sans", sans-serif' },
  poppins: { label: 'Poppins', css: 'Poppins, sans-serif' },
  raleway: { label: 'Raleway', css: 'Raleway, sans-serif' },
  playfair: { label: 'Playfair Display', css: '"Playfair Display", serif' },
  mono: { label: 'Fira Code', css: '"Fira Code", monospace' },
};

const QUICK_COLORS = [
  '#008001', '#49B618', '#0284c7', '#38bdf8', '#7c3aed',
  '#a78bfa', '#db2777', '#f472b6', '#ea580c', '#fb923c',
  '#ca8a04', '#facc15', '#06b6d4', '#2dd4bf', '#e5e5e5',
];

const DEFAULT_DESIGN: DesignSettings = {
  accentColor: '#008001',
  accentLight: '#49B618',
  bgColor: '#0a0f0a',
  cardColor: '#111a11',
  textPrimary: '#f0f0f0',
  textMuted: '#7a9a7a',
  palette: 'green',
  phoneBgPreset: 'aurora',
  phoneBgColor1: '#0a0f0a',
  phoneBgColor2: '#003322',
  phoneBgAngle: 135,
  phoneBgType: 'gradient',
  font: 'inter',
  bodyFontSize: 11,
  nameFontSize: 22,
  boldHeadings: true,
  cardRadius: 16,
  shadowIntensity: 'soft',
  glowEffect: true,
};

const DEFAULT_PROFILE_FORM = {
  name: '', title: '', company: '',
  tagline: '', email: '',
  phone: '', website: '',
  location: '', industry: '', yearFounded: '',
  appointmentUrl: '', headingText: '', bodyText: '',
};
const DEFAULT_SECTIONS = {
  profile: true, headingText: true, contactUs: true,
  socialLinks: true, links: true, appointment: false, collectContacts: false,
  businessDetails: true,
};

// ── Compute phone bg CSS ──────────────────────────────────────────
function getPhoneBgStyle(d: DesignSettings): string {
  if (d.phoneBgPreset === 'custom') {
    return d.phoneBgType === 'gradient'
      ? `linear-gradient(${d.phoneBgAngle}deg, ${d.phoneBgColor1} 0%, ${d.phoneBgColor2} 100%)`
      : d.phoneBgColor1;
  }
  return WALLPAPER_PRESETS.find(p => p.id === d.phoneBgPreset)?.style || WALLPAPER_PRESETS[0].style;
}

// ── Storage helpers ───────────────────────────────────────────────
function loadDesign(cacheKey: string = DESIGN_KEY): DesignSettings {
  try {
    const raw = localStorage.getItem(cacheKey);
    if (!raw) return { ...DEFAULT_DESIGN };
    return { ...DEFAULT_DESIGN, ...JSON.parse(raw) };
  } catch { return { ...DEFAULT_DESIGN }; }
}

function saveDesign(d: DesignSettings, cacheKey: string = DESIGN_KEY) {
  try {
    const phoneBgStyle = getPhoneBgStyle(d);
    const payload = {
      ...d,
      green: d.accentColor,
      greenLight: d.accentLight,
      bg: d.bgColor,
      card: d.cardColor,
      cardBorder: `${d.accentColor}33`,
      textPrimary: d.textPrimary,
      textMuted: d.textMuted,
      divider: `${d.accentColor}1f`,
      muted: `${d.accentColor}55`,
      fontFamily: FONTS[d.font]?.css ?? FONTS.inter.css,
      nameFontSize: d.nameFontSize,
      bodyFontSize: d.bodyFontSize,
      boldHeadings: d.boldHeadings,
      cardRadius: d.cardRadius,
      phoneBgStyle,
    };
    localStorage.setItem(cacheKey, JSON.stringify(payload));
    window.dispatchEvent(new StorageEvent('storage', { key: cacheKey }));
    window.dispatchEvent(new CustomEvent('designSaved', { detail: { key: cacheKey } }));
  } catch { /* quota */ }
}

function loadProfile(cacheKey: string = PROFILE_KEY): ProfileCache {
  try {
    const raw = localStorage.getItem(cacheKey);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function asColor(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback;
  const normalized = value.trim();
  if (!normalized || normalized.includes('gradient(')) return fallback;
  return normalized;
}

function asNumber(value: unknown, fallback: number): number {
  const num = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function normalizeFontKey(value: unknown): DesignSettings['font'] {
  const raw = typeof value === 'string' ? value.trim().toLowerCase().replace(/_/g, '-') : '';
  if (raw === 'playfair-display' || raw === 'playfair display') return 'playfair';
  if (raw === 'fira-code' || raw === 'fira code') return 'mono';
  if (raw in FONTS) return raw as DesignSettings['font'];
  return DEFAULT_DESIGN.font;
}

function normalizeDesignSettings(value: Partial<DesignSettings> | null | undefined): DesignSettings {
  const source = (value ?? {}) as Record<string, unknown>;
  const phoneBgTypeRaw = typeof source.phoneBgType === 'string' ? source.phoneBgType.toLowerCase() : '';
  const shadowRaw = typeof source.shadowIntensity === 'string' ? source.shadowIntensity.toLowerCase() : '';
  const paletteRaw = typeof source.palette === 'string' ? source.palette.toLowerCase() : '';

  const phoneBgType: DesignSettings['phoneBgType'] =
    phoneBgTypeRaw === 'solid' || phoneBgTypeRaw === 'gradient'
      ? phoneBgTypeRaw
      : DEFAULT_DESIGN.phoneBgType;

  const shadowIntensity: DesignSettings['shadowIntensity'] =
    shadowRaw === 'none' || shadowRaw === 'soft' || shadowRaw === 'medium' || shadowRaw === 'strong'
      ? shadowRaw
      : DEFAULT_DESIGN.shadowIntensity;

  return {
    ...DEFAULT_DESIGN,
    ...value,
    palette: PALETTES[paletteRaw] ? paletteRaw : (paletteRaw || DEFAULT_DESIGN.palette),
    accentColor: asColor(source.accentColor ?? source.green, DEFAULT_DESIGN.accentColor),
    accentLight: asColor(source.accentLight ?? source.greenLight, DEFAULT_DESIGN.accentLight),
    bgColor: asColor(source.bgColor ?? source.backgroundColor ?? source.bg, DEFAULT_DESIGN.bgColor),
    cardColor: asColor(source.cardColor ?? source.card, DEFAULT_DESIGN.cardColor),
    textPrimary: asColor(source.textPrimary ?? source.textColor, DEFAULT_DESIGN.textPrimary),
    textMuted: asColor(source.textMuted, DEFAULT_DESIGN.textMuted),
    phoneBgPreset: typeof source.phoneBgPreset === 'string' ? source.phoneBgPreset : DEFAULT_DESIGN.phoneBgPreset,
    phoneBgColor1: asColor(source.phoneBgColor1, DEFAULT_DESIGN.phoneBgColor1),
    phoneBgColor2: asColor(source.phoneBgColor2, DEFAULT_DESIGN.phoneBgColor2),
    phoneBgAngle: asNumber(source.phoneBgAngle, DEFAULT_DESIGN.phoneBgAngle),
    phoneBgType,
    font: normalizeFontKey(source.font ?? source.fontFamily),
    bodyFontSize: asNumber(source.bodyFontSize, DEFAULT_DESIGN.bodyFontSize),
    nameFontSize: asNumber(source.nameFontSize, DEFAULT_DESIGN.nameFontSize),
    boldHeadings: typeof source.boldHeadings === 'boolean' ? source.boldHeadings : DEFAULT_DESIGN.boldHeadings,
    cardRadius: asNumber(source.cardRadius, DEFAULT_DESIGN.cardRadius),
    shadowIntensity,
    glowEffect: typeof source.glowEffect === 'boolean' ? source.glowEffect : DEFAULT_DESIGN.glowEffect,
  };
}

function buildThemeOverride(d: DesignSettings): Partial<ThemeOverride> {
  return {
    green: d.accentColor,
    greenLight: d.accentLight,
    bg: d.bgColor,
    card: d.cardColor,
    cardBorder: `${d.accentColor}33`,
    textPrimary: d.textPrimary,
    textMuted: d.textMuted,
    divider: `${d.accentColor}1f`,
    muted: `${d.accentColor}55`,
    fontFamily: FONTS[d.font]?.css ?? FONTS.inter.css,
    nameFontSize: d.nameFontSize,
    bodyFontSize: d.bodyFontSize,
    boldHeadings: d.boldHeadings,
    cardRadius: d.cardRadius,
    phoneBgStyle: getPhoneBgStyle(d),
  };
}

function lightenHex(hex: string, amount: number): string {
  try {
    const n = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, ((n >> 16) & 0xff) + amount);
    const g = Math.min(255, ((n >> 8) & 0xff) + amount);
    const b = Math.min(255, (n & 0xff) + amount);
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  } catch { return hex; }
}

// ── QR Modal ──────────────────────────────────────────────────────
function QRModal({ text, onClose }: { text: string; onClose: () => void }) {
  const encoded = encodeURIComponent(text || 'https://example.com');
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encoded}&bgcolor=000000&color=49B618&margin=20`;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative bg-[#0D0D0D] border border-[#008001]/40 rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-4 shadow-2xl w-full max-w-xs" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 text-[#555] hover:text-white"><X className="w-5 h-5" /></button>
        <h3 className="text-white font-semibold text-lg">Your QR Code</h3>
        <div className="p-3 rounded-xl bg-[#1a1a1a] border border-[#008001]/30">
          <img src={qrUrl} alt="QR Code" width={220} height={220} className="rounded-lg" />
        </div>
        <p className="text-[#A0A0A0] text-xs text-center max-w-[220px]">Scan to view your digital business card</p>
        <a href={qrUrl} download="business-card-qr.png"
          className="flex items-center gap-2 bg-gradient-to-r from-[#008001] to-[#49B618] text-white rounded-xl px-5 py-2 text-sm font-semibold">
          <Download className="w-4 h-4" /> Download QR
        </a>
      </div>
    </div>
  );
}

// ── PanelSection ──────────────────────────────────────────────────
function PanelSection({ title, icon, children, defaultOpen = true }: {
  title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(0,128,1,0.22)', background: '#080808', marginBottom: 10 }}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#008001]/10 transition-colors">
        <div className="flex items-center gap-2.5">
          <span style={{ color: '#49B618' }}>{icon}</span>
          <span className="text-sm font-semibold text-white">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-[#444]" /> : <ChevronDown className="w-4 h-4 text-[#444]" />}
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 space-y-3.5" style={{ borderTop: '1px solid rgba(0,128,1,0.12)' }}>
          {children}
        </div>
      )}
    </div>
  );
}

function Chips<T extends string>({ options, value, onChange }: {
  options: { value: T; label: string }[]; value: T; onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(o => (
        <button key={o.value} onClick={() => onChange(o.value)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{
            background: value === o.value ? 'linear-gradient(135deg,#008001,#49B618)' : '#151515',
            color: value === o.value ? '#fff' : '#888',
            border: value === o.value ? '1px solid transparent' : '1px solid rgba(0,128,1,0.2)',
          }}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Toggle({ label, sub, checked, onChange }: {
  label: string; sub?: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 px-3 rounded-xl"
      style={{ background: '#0d0d0d', border: '1px solid rgba(0,128,1,0.15)' }}>
      <div>
        <p className="text-xs font-medium text-white">{label}</p>
        {sub && <p className="text-[10px] mt-0.5" style={{ color: '#555' }}>{sub}</p>}
      </div>
      <button onClick={() => onChange(!checked)}
        className="relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors"
        style={{ background: checked ? 'linear-gradient(to right,#008001,#49B618)' : '#333' }}>
        <span className="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
          style={{ transform: checked ? 'translateX(18px)' : 'translateX(3px)' }} />
      </button>
    </div>
  );
}

function SliderRow({ label, value, min, max, step, unit, onChange }: {
  label: string; value: number; min: number; max: number; step: number;
  unit?: string; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <Label className="text-[10px] uppercase tracking-wider" style={{ color: '#555' }}>{label}</Label>
        <span className="text-[10px] font-bold" style={{ color: '#49B618' }}>{value}{unit ?? ''}</span>
      </div>
      <Slider value={[value]} onValueChange={v => onChange(v[0])} min={min} max={max} step={step}
        className="[&_[role=slider]]:bg-[#49B618] [&_[role=slider]]:border-[#49B618]" />
    </div>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label className="text-[10px] uppercase tracking-wider mb-1.5 block" style={{ color: '#555' }}>{label}</Label>
      <div className="flex items-center gap-2">
        <input type="color" value={value} onChange={e => onChange(e.target.value)}
          className="w-9 h-9 rounded-lg cursor-pointer border-0 bg-transparent p-0 flex-shrink-0" />
        <Input value={value}
          onChange={e => { if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) onChange(e.target.value); }}
          className="flex-1 bg-[#0d0d0d] border-[#008001]/25 text-white font-mono text-xs h-9"
          placeholder="#000000" />
      </div>
    </div>
  );
}

// ── Wallpaper picker ──────────────────────────────────────────────
function WallpaperPicker({ draft, set }: {
  draft: DesignSettings;
  set: <K extends keyof DesignSettings>(key: K, val: DesignSettings[K]) => void;
}) {
  const customBg = draft.phoneBgType === 'gradient'
    ? `linear-gradient(${draft.phoneBgAngle}deg, ${draft.phoneBgColor1} 0%, ${draft.phoneBgColor2} 100%)`
    : draft.phoneBgColor1;

  return (
    <div className="space-y-3">
      {/* 3-column wallpaper grid */}
      <div className="grid grid-cols-3 gap-2">
        {WALLPAPER_PRESETS.map(preset => {
          const isSelected = draft.phoneBgPreset === preset.id;
          const thumb = preset.id === 'custom' ? customBg : preset.thumb;
          return (
            <button
              key={preset.id}
              onClick={() => set('phoneBgPreset', preset.id)}
              className="relative rounded-xl overflow-hidden transition-all"
              style={{
                height: 60,
                background: thumb,
                border: isSelected ? `2px solid ${draft.accentLight}` : '2px solid rgba(255,255,255,0.07)',
                boxShadow: isSelected ? `0 0 14px ${draft.accentLight}66` : 'none',
              }}
            >
              <div className="absolute bottom-0 inset-x-0 py-1 text-center"
                style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
                <span className="text-[9px] font-semibold text-white">{preset.name}</span>
              </div>
              {isSelected && (
                <div className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: draft.accentLight }}>
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Custom controls */}
      {draft.phoneBgPreset === 'custom' && (
        <div className="space-y-3 pt-2 px-3 pb-3 rounded-xl"
          style={{ background: '#0d0d0d', border: '1px solid rgba(0,128,1,0.2)' }}>

          <Chips
            options={[
              { value: 'solid', label: 'Solid Color' },
              { value: 'gradient', label: 'Gradient' },
            ]}
            value={draft.phoneBgType}
            onChange={v => set('phoneBgType', v as 'solid' | 'gradient')}
          />

          {/* Live preview */}
          <div className="h-8 rounded-lg w-full transition-all" style={{ background: customBg }} />

          <div className={`grid gap-3 ${draft.phoneBgType === 'gradient' ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <ColorRow
              label={draft.phoneBgType === 'gradient' ? 'Color 1' : 'Background Color'}
              value={draft.phoneBgColor1}
              onChange={v => set('phoneBgColor1', v)}
            />
            {draft.phoneBgType === 'gradient' && (
              <ColorRow
                label="Color 2"
                value={draft.phoneBgColor2}
                onChange={v => set('phoneBgColor2', v)}
              />
            )}
          </div>

          {draft.phoneBgType === 'gradient' && (
            <SliderRow
              label="Gradient Angle"
              value={draft.phoneBgAngle}
              min={0} max={360} step={5} unit="°"
              onChange={v => set('phoneBgAngle', v)}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// Main component
// ══════════════════════════════════════════════════════════════════
export function DesignNew({
  onSettingsChange,
  cardId,
  allowFallbackToFirstCard = true,
}: {
  onSettingsChange?: (settings: DesignSettings) => void;
  cardId?: string;
  allowFallbackToFirstCard?: boolean;
}) {
  const [resolvedCardId, setResolvedCardId] = useState<string | undefined>(cardId);
  useEffect(() => {
    let active = true;

    if (cardId) {
      setResolvedCardId(cardId);
      return () => {
        active = false;
      };
    }

    if (!allowFallbackToFirstCard) {
      setResolvedCardId(undefined);
      return () => {
        active = false;
      };
    }

    getCards().then(cards => {
      if (!active) return;
      if (cards?.length) setResolvedCardId(cards[0].id);
    }).catch(() => undefined);

    return () => {
      active = false;
    };
  }, [cardId, allowFallbackToFirstCard]);

  const activeProfileCacheKey = profileCacheKeyForEditor(cardId, resolvedCardId, allowFallbackToFirstCard);
  const activeDesignCacheKey = designCacheKeyForEditor(cardId, resolvedCardId, allowFallbackToFirstCard);

  const [saved, setSaved] = useState<DesignSettings>(() =>
    loadDesign(designCacheKeyForEditor(cardId, cardId, allowFallbackToFirstCard)),
  );
  const [draft, setDraft] = useState<DesignSettings>(() =>
    loadDesign(designCacheKeyForEditor(cardId, cardId, allowFallbackToFirstCard)),
  );
  const [profile, setProfile] = useState<ProfileCache>(() =>
    loadProfile(profileCacheKeyForEditor(cardId, cardId, allowFallbackToFirstCard)),
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState(false);
  const [toast, setToast] = useState('');
  const [mobileTab, setMobileTab] = useState<'controls' | 'preview'>('controls');
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedContact, setSavedContact] = useState(false);

  useEffect(() => {
    onSettingsChange?.(draft);
  }, [draft, onSettingsChange]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    setProfile(loadProfile(activeProfileCacheKey));
  }, [activeProfileCacheKey]);

  useEffect(() => {
    const cachedDesign = loadDesign(activeDesignCacheKey);
    setDraft(cachedDesign);
    setSaved(cachedDesign);
  }, [activeDesignCacheKey]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === activeProfileCacheKey || e.key === null) {
        setProfile(loadProfile(activeProfileCacheKey));
      }
    };
    const onFocus = () => setProfile(loadProfile(activeProfileCacheKey));
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', onFocus);

    const onCardUpdate = () => {
      if (resolvedCardId) {
        setIsLoading(true);
        Promise.all([getCardDesign(resolvedCardId), getCardContent(resolvedCardId), getBusinessProfile()])
          .then(([designData, contentData, profileData]) => {
            if (designData) {
              const normalizedDesign = normalizeDesignSettings(designData as Partial<DesignSettings>);
              setDraft(normalizedDesign);
              setSaved(normalizedDesign);
              saveDesign(normalizedDesign, activeDesignCacheKey);
            }
            if (!allowFallbackToFirstCard) {
              setProfile(loadProfile(activeProfileCacheKey));
              return;
            }
            if (contentData) {
              setProfile(prev => ({
                ...prev,
                profileImage: contentData.profileImage || prev.profileImage,
                brandLogo: contentData.brandLogo || prev.brandLogo,
                logoPosition: (contentData.logoPosition as LogoPosition) || prev.logoPosition,
                formData: { ...prev.formData, ...(contentData.formData ?? {}) },
              }));
            }
            if (profileData) {
              setProfile(prev => {
                const existingFormData = prev.formData ?? {
                  name: '', title: '', company: '', tagline: '', email: '',
                  phone: '', website: '', location: '', industry: '', yearFounded: '',
                  appointmentUrl: '', headingText: '', bodyText: '',
                };

                return {
                  ...prev,
                  profileImage: profileData.profileImageUrl || prev.profileImage,
                  brandLogo: profileData.brandLogoUrl || prev.brandLogo,
                  logoPosition: (profileData.logoPosition as LogoPosition) || prev.logoPosition,
                  formData: {
                    ...existingFormData,
                    name: profileData.name || existingFormData.name,
                    title: profileData.title || existingFormData.title,
                    company: profileData.company || existingFormData.company,
                    tagline: profileData.tagline || existingFormData.tagline,
                  },
                };
              });
            }
          })
          .finally(() => setIsLoading(false));
      }
    };

    window.addEventListener('cardDataUpdated', onCardUpdate as EventListener);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('cardDataUpdated', onCardUpdate as EventListener);
    };
  }, [resolvedCardId, allowFallbackToFirstCard, activeProfileCacheKey, activeDesignCacheKey]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  useEffect(() => {
    if (!resolvedCardId) return;

    setIsLoading(true);
    Promise.all([getCardDesign(resolvedCardId), getCardContent(resolvedCardId), getBusinessProfile()])
      .then(([designData, contentData, profileData]) => {
        if (designData) {
          const normalizedDesign = normalizeDesignSettings(designData as Partial<DesignSettings>);
          setDraft(normalizedDesign);
          setSaved(normalizedDesign);
          saveDesign(normalizedDesign, activeDesignCacheKey);
        } else {
          getCards()
            .then((cards) => {
              const selected = cards.find((c) => c.id === resolvedCardId);
              const fallback: DesignSettings = {
                ...DEFAULT_DESIGN,
                accentColor: selected?.accentColor || DEFAULT_DESIGN.accentColor,
                accentLight: selected?.accentLight || DEFAULT_DESIGN.accentLight,
                bgColor: selected?.backgroundColor || DEFAULT_DESIGN.bgColor,
                cardColor: selected?.cardColor || DEFAULT_DESIGN.cardColor,
                phoneBgType:
                  String(selected?.phoneBgType || '').toLowerCase() === 'gradient'
                    ? 'gradient'
                    : 'solid',
                phoneBgColor1: selected?.phoneBgColor1 || DEFAULT_DESIGN.phoneBgColor1,
                phoneBgColor2: selected?.phoneBgColor2 || DEFAULT_DESIGN.phoneBgColor2,
                phoneBgAngle: selected?.phoneBgAngle ?? DEFAULT_DESIGN.phoneBgAngle,
              };
              setDraft(fallback);
              setSaved(fallback);
              saveDesign(fallback, activeDesignCacheKey);
            })
            .catch(() => {
              setDraft(DEFAULT_DESIGN);
              setSaved(DEFAULT_DESIGN);
              saveDesign(DEFAULT_DESIGN, activeDesignCacheKey);
            });
        }

        if (!allowFallbackToFirstCard) {
          setProfile(loadProfile(activeProfileCacheKey));
          return;
        }

        if (contentData) {
          setProfile(prev => ({
            ...prev,
            profileImage: contentData.profileImage || prev.profileImage,
            brandLogo: contentData.brandLogo || prev.brandLogo,
            logoPosition: (contentData.logoPosition as LogoPosition) || prev.logoPosition,
            formData: { ...prev.formData, ...(contentData.formData ?? {}) },
          }));
        }

        if (profileData) {
          setProfile(prev => {
            const existingFormData = prev.formData ?? {
              name: '', title: '', company: '', tagline: '', email: '',
              phone: '', website: '', location: '', industry: '', yearFounded: '',
              appointmentUrl: '', headingText: '', bodyText: '',
            };

            return {
              ...prev,
              profileImage: profileData.profileImageUrl || prev.profileImage,
              brandLogo: profileData.brandLogoUrl || prev.brandLogo,
              logoPosition: (profileData.logoPosition as LogoPosition) || prev.logoPosition,
              formData: {
                ...existingFormData,
                name: profileData.name || existingFormData.name,
                title: profileData.title || existingFormData.title,
                company: profileData.company || existingFormData.company,
                tagline: profileData.tagline || existingFormData.tagline,
              },
            };
          });
        }
      })
      .catch(() => { /* ignore load error */ })
      .finally(() => setIsLoading(false));
  }, [resolvedCardId, allowFallbackToFirstCard, activeProfileCacheKey, activeDesignCacheKey]);

  const set = useCallback(<K extends keyof DesignSettings>(key: K, val: DesignSettings[K]) =>
    setDraft(prev => ({ ...prev, [key]: val })), []);

  const handleSave = useCallback(async () => {
    saveDesign(draft, activeDesignCacheKey);
    setSaved(draft);
    setIsSaved(true); showToast('Design saved!');
    setTimeout(() => setIsSaved(false), 2000);

  if (resolvedCardId) {
    await updateCardDesign(resolvedCardId, draft);
  }
}, [draft, resolvedCardId, activeDesignCacheKey]);

  const handleReset = useCallback(() => { setDraft(saved); showToast('Reverted to last saved'); }, [saved]);

  const applyPalette = useCallback((key: string) => {
    const p = PALETTES[key]; if (!p) return;
    setDraft(prev => ({
      ...prev,
      palette: key,
      accentColor: p.accent,
      accentLight: p.accentLight,
      bgColor: p.bg,
      cardColor: p.card,
      textPrimary: p.textPrimary,
      textMuted: p.textMuted,
      // ── NEW: auto-switch wallpaper to the palette's matching preset ──
      phoneBgPreset: p.wallpaper,
    }));
  }, []);

  const applyAccent = useCallback((color: string) => {
    setDraft(prev => ({ ...prev, palette: 'custom', accentColor: color, accentLight: lightenHex(color, 35) }));
  }, []);

  const publicBase =
    (process.env.NEXT_PUBLIC_APP_URL ?? '').replace(/\/$/, '') ||
    (typeof window !== 'undefined' ? window.location.origin : '');
  const publishedShareUrl = resolvedCardId && publicBase ? `${publicBase}/${resolvedCardId}` : '';
  const hasPublishedUrl = !!(resolvedCardId && publishedShareUrl);

  const handleShareLink = useCallback(async () => {
    if (!publishedShareUrl) return;
    const url = publishedShareUrl;
    try { await navigator.clipboard.writeText(url); }
    catch { const el = document.createElement('input'); el.value = url; document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el); }
    setCopied(true); setTimeout(() => setCopied(false), 2500);
  }, [publishedShareUrl]);

  const handleSaveContact = useCallback(() => {
    const fd = {
      name: profile.formData?.name || '',
      title: profile.formData?.title || '',
      company: profile.formData?.company || '',
      email: profile.formData?.email || '',
      phone: profile.formData?.phone || '',
      website: profile.formData?.website || '',
      location: profile.formData?.location || '',
    };
    const parts = fd.name.trim().split(' '); const last = parts.slice(-1)[0] || ''; const first = parts.slice(0, -1).join(' ') || fd.name;
    const vcf = ['BEGIN:VCARD', 'VERSION:3.0', `N:${last};${first};;;`, `FN:${fd.name}`, fd.title ? `TITLE:${fd.title}` : '', fd.company ? `ORG:${fd.company}` : '', fd.email ? `EMAIL:${fd.email}` : '', fd.phone ? `TEL:${fd.phone}` : '', fd.website ? `URL:${fd.website}` : '', fd.location ? `ADR:;;${fd.location};;;;` : '', 'END:VCARD'].filter(Boolean).join('\n');
    const blob = new Blob([vcf], { type: 'text/vcard' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${fd.name.replace(/\s+/g, '_')}.vcf`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    setSavedContact(true); setTimeout(() => setSavedContact(false), 2500);
  }, [profile.formData]);

  const hasUnsaved = JSON.stringify(draft) !== JSON.stringify(saved);

  const profileImage = profile.profileImage || '';
  const brandLogo = profile.brandLogo || '';
  const logoPosition = profile.logoPosition || 'top-right';
  const formData = {
    name: profile.formData?.name || '', title: profile.formData?.title || '',
    company: profile.formData?.company || '', tagline: profile.formData?.tagline || '',
    email: profile.formData?.email || '', phone: profile.formData?.phone || '',
    website: profile.formData?.website || '', location: profile.formData?.location || '',
    industry: profile.formData?.industry || '', yearFounded: profile.formData?.yearFounded || '',
    appointmentUrl: profile.formData?.appointmentUrl || '',
    headingText: profile.formData?.headingText || '',
    bodyText: profile.formData?.bodyText || '',
  };
  const socialLinks = profile.socialLinks || [];
  const customLinks = profile.customLinks || [];
  const sections = { ...DEFAULT_SECTIONS, ...(profile.sections ?? {}) };
  const extraSections = profile.extraSections || [];
  const themeOverride = buildThemeOverride(draft);

  const shadowMap = { none: 'none', soft: `0 4px 24px ${draft.accentColor}25`, medium: `0 8px 48px ${draft.accentColor}45`, strong: `0 12px 72px ${draft.accentColor}70` };
  const wrapperShadow = draft.glowEffect ? `${shadowMap[draft.shadowIntensity]}, 0 0 40px ${draft.accentColor}22` : shadowMap[draft.shadowIntensity];

  const sharedPreviewProps = { cardId: resolvedCardId, publishedLink: publishedShareUrl, profileImage, brandLogo, logoPosition, formData, socialLinks, customLinks, extraSections, sections, savedContact, copied, themeOverride };

  // ── Controls ──────────────────────────────────────────────────────
  const ControlsPanel = (
    <div className="space-y-0">
      {hasUnsaved && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl mb-3" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)' }}>
          <div className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ background: '#fbbf24' }} />
          <p className="text-xs flex-1" style={{ color: '#fde68a' }}>Unsaved changes</p>
          <button onClick={handleReset} className="text-xs underline" style={{ color: '#fbbf24' }}>Revert</button>
        </div>
      )}
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl mb-3" style={{ background: 'rgba(0,128,1,0.08)', border: '1px solid rgba(0,128,1,0.22)' }}>
        <div className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ background: '#49B618' }} />
        <p className="text-[11px]" style={{ color: '#7a9a7a' }}>Preview syncs live from <span style={{ color: '#49B618', fontWeight: 600 }}>Business Profile</span>. Press Save to keep changes.</p>
      </div>

      {/* 1. COLOR PALETTES */}
      <PanelSection title="Color Palette" icon={<Palette className="w-4 h-4" />}>
        <p className="text-[10px]" style={{ color: '#555', marginTop: -4 }}>
          Each theme sets colors <span style={{ color: '#49B618' }}>+</span> phone wallpaper together
        </p>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(PALETTES).map(([key, p]) => {
            const isActive = draft.palette === key;
            const linkedWallpaper = WALLPAPER_PRESETS.find(w => w.id === p.wallpaper);
            return (
              <button
                key={key}
                onClick={() => applyPalette(key)}
                className="relative rounded-xl overflow-hidden transition-all text-left"
                style={{
                  border: isActive ? `2px solid ${p.accentLight}` : '2px solid rgba(255,255,255,0.06)',
                  boxShadow: isActive ? `0 0 18px ${p.accent}55` : 'none',
                  transform: isActive ? 'scale(1.03)' : 'scale(1)',
                  transition: 'all 0.18s ease',
                }}
              >
                {/* Wallpaper fills the card background */}
                <div className="absolute inset-0" style={{ background: linkedWallpaper?.thumb || p.bg }} />
                {/* Subtle dark scrim so text is readable */}
                <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.38)' }} />

                {/* Card body */}
                <div className="relative z-10 p-2">
                  {/* Mini "card" strip showing accent + text colors */}
                  <div className="w-full rounded-md overflow-hidden mb-1.5"
                    style={{ background: `${p.card}dd`, border: `1px solid ${p.accent}55` }}>
                    {/* Accent bar */}
                    <div style={{ height: 3, background: `linear-gradient(90deg,${p.accent},${p.accentLight})` }} />
                    <div className="px-1.5 py-1">
                      {/* Fake name line */}
                      <div className="rounded-sm mb-0.5" style={{ height: 4, width: '70%', background: p.textPrimary, opacity: 0.9 }} />
                      {/* Fake subtitle */}
                      <div className="rounded-sm" style={{ height: 3, width: '50%', background: p.accentLight, opacity: 0.85 }} />
                    </div>
                    {/* Color dots */}
                    <div className="flex gap-0.5 px-1.5 pb-1">
                      {[p.accent, p.accentLight, p.textMuted].map((c, i) => (
                        <div key={i} className="rounded-full" style={{ width: 5, height: 5, background: c }} />
                      ))}
                    </div>
                  </div>

                  {/* Name + active indicator row */}
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-bold text-white drop-shadow">{p.emoji} {p.name}</p>
                    {isActive && (
                      <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: p.accentLight }}>
                        <Check className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </PanelSection>

      {/* 2. ACCENT & TEXT COLORS */}
      <PanelSection title="Accent & Text Colors" icon={<Sun className="w-4 h-4" />}>
        <div>
          <Label className="text-[10px] uppercase tracking-wider mb-2 block" style={{ color: '#555' }}>Quick Colors</Label>
          <div className="grid grid-cols-5 gap-1.5">
            {QUICK_COLORS.map(c => (
              <button key={c} onClick={() => applyAccent(c)} className="w-full aspect-square rounded-lg transition-all hover:scale-105"
                style={{ background: c, border: draft.accentColor === c ? '2px solid white' : '2px solid transparent', boxShadow: draft.accentColor === c ? '0 0 0 2px rgba(255,255,255,0.2)' : 'none', transform: draft.accentColor === c ? 'scale(1.1)' : undefined }} />
            ))}
          </div>
          <div className="h-3 rounded-full cursor-pointer mt-2"
            style={{ background: 'linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)' }}
            onClick={e => {
              const rect = (e.target as HTMLElement).getBoundingClientRect();
              const hue = Math.round(((e.clientX - rect.left) / rect.width) * 360);
              const h = hue / 360, s = 1, l = 0.45; const q = l < 0.5 ? l * (1 + s) : l + s - l * s; const p2 = 2 * l - q;
              const toHex = (t: number) => { const x = t < 0 ? t + 1 : t > 1 ? t - 1 : t; const v = x < 1 / 6 ? p2 + (q - p2) * 6 * x : x < 0.5 ? q : x < 2 / 3 ? p2 + (q - p2) * (2 / 3 - x) * 6 : p2; return Math.round(v * 255).toString(16).padStart(2, '0'); };
              applyAccent(`#${toHex(h + 1 / 3)}${toHex(h)}${toHex(h - 1 / 3)}`);
            }} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <ColorRow label="Primary Accent" value={draft.accentColor} onChange={v => { set('accentColor', v); set('palette', 'custom'); }} />
          <ColorRow label="Light Accent" value={draft.accentLight} onChange={v => { set('accentLight', v); set('palette', 'custom'); }} />
          <ColorRow label="Card Background" value={draft.cardColor} onChange={v => { set('cardColor', v); set('palette', 'custom'); }} />
          <ColorRow label="Body Background" value={draft.bgColor} onChange={v => { set('bgColor', v); set('palette', 'custom'); }} />
          <ColorRow label="Primary Text" value={draft.textPrimary} onChange={v => { set('textPrimary', v); set('palette', 'custom'); }} />
          <ColorRow label="Muted Text" value={draft.textMuted} onChange={v => { set('textMuted', v); set('palette', 'custom'); }} />
        </div>
      </PanelSection>

      {/* 3. PHONE WALLPAPER */}
      <PanelSection title="Phone Wallpaper" icon={<Layers className="w-4 h-4" />}>
        <WallpaperPicker draft={draft} set={set} />
      </PanelSection>

      {/* 4. TYPOGRAPHY */}
      <PanelSection title="Typography" icon={<Type className="w-4 h-4" />}>
        <div>
          <Label className="text-[10px] uppercase tracking-wider mb-1.5 block" style={{ color: '#555' }}>Font Family</Label>
          <Select value={draft.font} onValueChange={v => set('font', v)}>
            <SelectTrigger className="bg-[#0d0d0d] border-[#008001]/25 text-white text-sm h-9"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-[#111a11] border-[#008001]/30">
              {Object.entries(FONTS).map(([key, { label }]) => (<SelectItem key={key} value={key} className="text-white focus:bg-[#008001]/30 focus:text-white">{label}</SelectItem>))}
            </SelectContent>
          </Select>
          <div className="mt-2 px-3 py-2 rounded-xl text-center" style={{ background: '#0d0d0d', border: '1px solid rgba(0,128,1,0.15)', fontFamily: FONTS[draft.font]?.css }}>
            <p style={{ fontSize: 14, color: '#fff', fontWeight: draft.boldHeadings ? 700 : 400 }}>Alex Johnson</p>
            <p style={{ fontSize: 11, color: '#49B618' }}>Senior Product Designer</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <SliderRow label="Name Size" value={draft.nameFontSize} min={14} max={30} step={1} unit="px" onChange={v => set('nameFontSize', v)} />
          <SliderRow label="Body Size" value={draft.bodyFontSize} min={9} max={16} step={1} unit="px" onChange={v => set('bodyFontSize', v)} />
        </div>
        <Toggle label="Bold Headings" sub="Bold name, section titles, and labels" checked={draft.boldHeadings} onChange={v => set('boldHeadings', v)} />
      </PanelSection>

      {/* 5. CARD SHAPE & EFFECTS */}
      <PanelSection title="Card Shape & Effects" icon={<Layout className="w-4 h-4" />}>
        <SliderRow label="Section Card Radius" value={draft.cardRadius} min={0} max={32} step={2} unit="px" onChange={v => set('cardRadius', v)} />
        <div>
          <Label className="text-[10px] uppercase tracking-wider mb-1.5 block" style={{ color: '#555' }}>Shadow</Label>
          <Chips options={[{ value: 'none', label: 'None' }, { value: 'soft', label: 'Soft' }, { value: 'medium', label: 'Medium' }, { value: 'strong', label: 'Strong' }]} value={draft.shadowIntensity} onChange={v => set('shadowIntensity', v as DesignSettings['shadowIntensity'])} />
        </div>
        <Toggle label="Glow Effect" sub="Accent-colored ambient glow behind preview" checked={draft.glowEffect} onChange={v => set('glowEffect', v)} />
      </PanelSection>

      {/* Save / Reset */}
      <div className="flex gap-3 pt-1 pb-6">
        <Button onClick={handleSave} className="flex-1 h-11 gap-2 font-semibold text-white" style={{ background: 'linear-gradient(135deg,#008001,#49B618)' }}>
          <Save className="w-4 h-4" />{isSaved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );

  // ── Preview ───────────────────────────────────────────────────────
  const PreviewPanel = (
    <div className="lg:sticky lg:top-8">
      <div className="rounded-2xl p-4 sm:p-6 transition-all duration-500"
        style={{ background: 'linear-gradient(135deg,#0a0a0a 0%,#000 100%)', boxShadow: wrapperShadow, border: `1px solid ${draft.accentColor}22` }}>
        <PhonePreview {...sharedPreviewProps} onPreviewOpen={() => setIsPreviewOpen(true)} onShareLink={hasPublishedUrl ? handleShareLink : undefined} onSaveContact={handleSaveContact} />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {[
          { k: 'Palette', v: draft.palette === 'custom' ? 'Custom' : PALETTES[draft.palette]?.name ?? draft.palette },
          { k: 'Wallpaper', v: WALLPAPER_PRESETS.find(p => p.id === draft.phoneBgPreset)?.name ?? draft.phoneBgPreset },
          { k: 'Font', v: FONTS[draft.font]?.label ?? draft.font },
          { k: 'Radius', v: `${draft.cardRadius}px` },
          { k: 'Name', v: `${draft.nameFontSize}px` },
          { k: 'Body', v: `${draft.bodyFontSize}px` },
        ].map(({ k, v }) => (
          <div key={k} className="text-center py-2 px-1 rounded-xl" style={{ background: '#0a0a0a', border: '1px solid rgba(0,128,1,0.12)' }}>
            <p className="text-[9px] uppercase tracking-wider" style={{ color: '#444' }}>{k}</p>
            <p className="text-[11px] font-semibold text-white capitalize truncate mt-0.5">{v}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 sm:p-8" style={{ background: 'linear-gradient(135deg,#0a0a0a 0%,#000 100%)' }}>
      <CardPreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} {...sharedPreviewProps} onShareLink={hasPublishedUrl ? handleShareLink : undefined} onSaveContact={handleSaveContact} />
      {showQR && <QRModal text={formData.website || window.location.href} onClose={() => setShowQR(false)} />}
      {toast && (
        <div className="fixed top-5 right-4 sm:right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium text-white" style={{ background: '#008001' }}>
          <Check className="w-4 h-4 flex-shrink-0" /> {toast}
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-start sm:items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Design & Customization</h1>
              <p className="text-sm mt-1" style={{ color: '#555' }}>
                All changes preview instantly — save when ready
                {hasUnsaved && <span className="ml-2 font-medium" style={{ color: '#fbbf24' }}>· Unsaved changes</span>}
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleReset} variant="outline" size="sm" className="gap-2 text-sm"
                style={{ borderColor: hasUnsaved ? 'rgba(251,191,36,0.5)' : 'rgba(0,128,1,0.3)', color: hasUnsaved ? '#fbbf24' : '#a0a0a0' }}>
                <RotateCcw className="w-3.5 h-3.5" /><span className="hidden sm:inline">Reset</span>
              </Button>
              <Button onClick={handleSave} size="sm" className="gap-2 text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg,#008001,#49B618)' }}>
                <Save className="w-3.5 h-3.5" />{isSaved ? 'Saved!' : 'Save'}
              </Button>
            </div>
          </div>
          <div className="mt-4 flex lg:hidden rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,128,1,0.25)' }}>
            {(['controls', 'preview'] as const).map(tab => (
              <button key={tab} onClick={() => setMobileTab(tab)}
                className="flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-all"
                style={{ background: mobileTab === tab ? '#008001' : '#000', color: mobileTab === tab ? '#fff' : '#555' }}>
                {tab === 'controls' ? <><Palette className="w-4 h-4" />Customize</> : <><Smartphone className="w-4 h-4" />Preview</>}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className={`lg:col-span-2 ${mobileTab === 'preview' ? 'hidden lg:block' : 'block'}`}>{ControlsPanel}</div>
          <div className={`lg:col-span-3 ${mobileTab === 'controls' ? 'hidden lg:block' : 'block'}`}>{PreviewPanel}</div>
        </div>
      </div>
    </div>
  );
}
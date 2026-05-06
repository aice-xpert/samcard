"use client";

import Image from 'next/image';
import { useState, useRef, useCallback, useEffect, useDeferredValue, useMemo } from 'react';
import { Card, CardContent } from '@/components/dashboard/ui/card';
import { Button } from '@/components/dashboard/ui/button';
import { Input } from '@/components/dashboard/ui/input';
import { Label } from '@/components/dashboard/ui/label';
import { Textarea } from '@/components/dashboard/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/dashboard/ui/select';
import { Badge } from '@/components/dashboard/ui/badge';
import {
  Upload, Eye, Save, Trash2,
  Linkedin, Instagram, Facebook, Twitter, Youtube,
  MapPin, Mail, Phone, Globe, Share2,
  User, Briefcase, Plus, Minus, GripVertical, Image as ImageIcon,
  Link2, Calendar, MessageSquare, Check, X,
  AlignLeft, Users, ChevronDown, MousePointerClick,
  FileText, UserCheck,
  ShoppingBag, LayoutTemplate, Megaphone,
  Smartphone, LayoutDashboard, QrCode,
} from 'lucide-react';
import { CardPreviewModal } from '@/components/dashboard/pages/CardPreviewModal';
import { QrPopup } from '@/components/dashboard/pages/Qrpopup';
import { PhonePreview, ExtraSection, ThemeOverride } from '@/components/dashboard/pages/PhonePreview';
import TemplatePicker from '@/components/TemplatePicker/TemplatePicker';
import { makeQRMatrix } from '@/components/dashboard/pages/qr-engine';
import { useQrStore } from '@/components/dashboard/stores/Useqrstore';
import {
  getBusinessProfile,
  getCustomLinks,
  getSocialLinks,
  getCardDesign,
  updateCardDesign,
  CardDesignResponse,
  updateBusinessProfile,
  updateCustomLinks,
  updateSocialLinks,
  getCards,
  getCardContent,
  updateCardContent,
  CardContentPayload,
  uploadFile,
} from '@/lib/api';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
export type LogoPosition = 'top-left' | 'top-right' | 'below-photo' | 'below-name';

interface FormData {
  name: string; title: string; company: string; tagline: string;
  email: string; phone: string; website: string; location: string;
  industry: string; yearFounded: string; appointmentUrl: string;
  headingText: string; bodyText: string;
}
interface SocialLink { platform: number; value: string; }
interface ConnectField { type: string; label: string; value: string; }
interface CustomLink { label: string; url: string; }
interface ApiCustomLinkPayload { label: string; url: string; icon: string; color: string; enabled: boolean; }
interface ApiSocialLinkPayload { platform: string; url: string; handle: string; label: string; icon: string; enabled: boolean; }
interface Sections {
  profile: boolean; headingText: boolean; contactUs: boolean;
  socialLinks: boolean; links: boolean; appointment: boolean; collectContacts: boolean;
  businessDetails: boolean;
}
interface Expanded {
  profile: boolean; headingText: boolean; contactUs: boolean;
  socialLinks: boolean; links: boolean; appointment: boolean; collectContacts: boolean;
  businessDetails: boolean;
}
interface CacheShape {
  profileImage: string; brandLogo: string; logoPosition: LogoPosition; formData: FormData;
  socialLinks: SocialLink[]; connectFields: ConnectField[];
  sections: Sections; expanded: Expanded; customLinks: CustomLink[];
  extraSections: ExtraSection[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const CACHE_KEY = 'businessProfile_v1';
const DESIGN_KEY = 'cardDesign_v1';

const cacheKeyForCard = (cardId?: string): string =>
  cardId ? `${CACHE_KEY}:${cardId}` : CACHE_KEY;

const cacheKeyForEditor = (
  explicitCardId?: string,
  resolvedCardId?: string,
  allowFallbackToFirstCard: boolean = true,
): string => {
  if (explicitCardId) return cacheKeyForCard(explicitCardId);
  if (resolvedCardId) return cacheKeyForCard(resolvedCardId);
  if (!allowFallbackToFirstCard) return `${CACHE_KEY}:draft`;
  return CACHE_KEY;
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

const DESIGN_WALLPAPER_STYLES: Record<string, string> = {
  'deep-space': 'radial-gradient(ellipse at 20% 80%, #0f2027 0%, #203a43 45%, #2c5364 100%)',
  aurora: 'linear-gradient(160deg, #0a0a0a 0%, #003322 25%, #006644 50%, #004422 70%, #001133 85%, #0a0a0a 100%)',
  'midnight-purple': 'radial-gradient(ellipse at 60% 10%, #2d0855 0%, #1a0533 40%, #0d0118 70%, #050010 100%)',
  'sunset-dusk': 'linear-gradient(170deg, #1a0500 0%, #3d1000 30%, #2a0a00 55%, #1a0800 75%, #000 100%)',
  'ocean-depth': 'radial-gradient(ellipse at 30% 20%, #003366 0%, #001f3f 40%, #000d1a 75%, #000510 100%)',
  volcanic: 'radial-gradient(ellipse at 50% 90%, #3d0000 0%, #2d0000 30%, #1a0000 60%, #050000 100%)',
};

const DESIGN_FONT_FAMILY: Record<string, string> = {
  inter: 'Inter, sans-serif',
  sora: 'Sora, sans-serif',
  'dm-sans': '"DM Sans", sans-serif',
  poppins: 'Poppins, sans-serif',
  raleway: 'Raleway, sans-serif',
  playfair: '"Playfair Display", serif',
  mono: '"Fira Code", monospace',
  'fira-code': '"Fira Code", monospace',
  system: 'system-ui, sans-serif',
};

const SOCIAL_OPTIONS = [
  { icon: Linkedin, name: 'LinkedIn', color: '#008001', placeholder: 'https://linkedin.com/in/username', baseUrl: 'https://linkedin.com/in/' },
  { icon: Instagram, name: 'Instagram', color: '#49B618', placeholder: 'https://instagram.com/username', baseUrl: 'https://instagram.com/' },
  { icon: Twitter, name: 'Twitter', color: '#009200', placeholder: 'https://twitter.com/username', baseUrl: 'https://twitter.com/' },
  { icon: Facebook, name: 'Facebook', color: '#006312', placeholder: 'https://facebook.com/username', baseUrl: 'https://facebook.com/' },
  { icon: Youtube, name: 'YouTube', color: '#008001', placeholder: 'https://youtube.com/@channel', baseUrl: 'https://youtube.com/' },
] as const;

const INDUSTRIES = [
  { value: 'tech', label: 'Technology' },
  { value: 'finance', label: 'Finance' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'realestate', label: 'Real Estate' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'education', label: 'Education' },
  { value: 'legal', label: 'Legal' },
  { value: 'creative', label: 'Creative / Design' },
  { value: 'other', label: 'Other' },
] as const;

const ADDABLE_COMPONENTS = [
  { key: 'appointment', label: 'Appointment / Calendar', icon: Calendar, group: 'builtin' },
  { key: 'headingText', label: 'Title + Text', icon: AlignLeft, group: 'builtin' },
  { key: 'links', label: 'Links', icon: Link2, group: 'builtin' },
  { key: 'socialLinks', label: 'Social Links', icon: Share2, group: 'builtin' },
  { key: 'contactUs', label: 'Contact Us', icon: Mail, group: 'builtin' },
  { key: 'collectContacts', label: 'Collect Contacts', icon: Users, group: 'builtin' },
  { key: 'extra-button', label: 'Button', icon: MousePointerClick, group: 'extra' },
  { key: 'extra-pdf', label: 'PDF Gallery', icon: FileText, group: 'extra' },
  { key: 'extra-other', label: 'Other Details', icon: LayoutTemplate, group: 'extra' },
  { key: 'extra-team', label: 'Team', icon: UserCheck, group: 'extra' },
  { key: 'extra-customer', label: 'Customer', icon: Users, group: 'extra' },
  { key: 'extra-products', label: 'Products', icon: ShoppingBag, group: 'extra' },
  { key: 'extra-imagetext', label: 'Image', icon: Megaphone, group: 'extra' },
] as const;

const DEFAULT_EXPANDED: Expanded = {
  profile: true, headingText: true, contactUs: true,
  socialLinks: true, links: true, appointment: true, collectContacts: true,
  businessDetails: true,
};

const DEFAULT_STATE: CacheShape = {
  profileImage: '',
  brandLogo: '',
  logoPosition: 'top-right',
  formData: {
    name: '', title: '', company: '',
    tagline: '', email: '',
    phone: '', website: '',
    location: '', industry: '', yearFounded: '',
    appointmentUrl: '', headingText: '', bodyText: '',
  },
  socialLinks: [
    { platform: 0, value: '' }, { platform: 1, value: '' },
    { platform: 2, value: '' }, { platform: 3, value: '' },
  ],
  connectFields: [
    { type: 'Mobile', label: 'Call Us', value: '' },
    { type: 'E-mail', label: 'Email', value: '' },
  ],
  sections: {
    profile: true, headingText: true, contactUs: true,
    socialLinks: true, links: true, appointment: false, collectContacts: false,
    businessDetails: true,
  },
  expanded: DEFAULT_EXPANDED,
  customLinks: [{ label: '', url: '' }],
  extraSections: [],
};

function normalizeLogoPositionFromApi(value: unknown): LogoPosition {
  if (typeof value !== 'string') return DEFAULT_STATE.logoPosition;
  const raw = value.trim().toLowerCase();
  switch (raw) {
    case 'top-left':
    case 'top_left':
    case 'top left':
    case 'top_left':
      return 'top-left';
    case 'top-right':
    case 'top_right':
    case 'top right':
      return 'top-right';
    case 'below-photo':
    case 'below_photo':
    case 'below photo':
      return 'below-photo';
    case 'below-name':
    case 'below_name':
    case 'below name':
      return 'below-name';
    case 'top_left':
      return 'top-left';
    case 'topright':
      return 'top-right';
    default:
      return DEFAULT_STATE.logoPosition;
  }
}

function normalizeLogoPositionForCardContent(value: unknown): "top-left" | "top-right" | "below-photo" | "below-name" {
  return normalizeLogoPositionFromApi(value);
}

function normalizeLogoPositionForBusinessProfile(value: unknown): 'TOP_LEFT' | 'TOP_RIGHT' | 'BELOW_PHOTO' | 'BELOW_NAME' {
  const normalized = normalizeLogoPositionFromApi(value);
  switch (normalized) {
    case 'top-left': return 'TOP_LEFT';
    case 'top-right': return 'TOP_RIGHT';
    case 'below-photo': return 'BELOW_PHOTO';
    case 'below-name': return 'BELOW_NAME';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Cache helpers
// ─────────────────────────────────────────────────────────────────────────────
function loadCache(cacheKey: string = CACHE_KEY): CacheShape {
  try {
    const raw = localStorage.getItem(cacheKey);
    if (!raw) return DEFAULT_STATE;
    const p = JSON.parse(raw) as Partial<CacheShape>;
    return {
      profileImage: p.profileImage ?? DEFAULT_STATE.profileImage,
      brandLogo: p.brandLogo ?? DEFAULT_STATE.brandLogo,
      logoPosition: p.logoPosition ?? DEFAULT_STATE.logoPosition,
      formData: { ...DEFAULT_STATE.formData, ...(p.formData ?? {}) },
      socialLinks: p.socialLinks ?? DEFAULT_STATE.socialLinks,
      connectFields: p.connectFields ?? DEFAULT_STATE.connectFields,
      sections: { ...DEFAULT_STATE.sections, ...(p.sections ?? {}) },
      expanded: { ...DEFAULT_EXPANDED, ...(p.expanded ?? {}) },
      customLinks: p.customLinks ?? DEFAULT_STATE.customLinks,
      extraSections: p.extraSections ?? DEFAULT_STATE.extraSections,
    };
  } catch { return DEFAULT_STATE; }
}

function saveCacheForKey(data: CacheShape, cacheKey: string): void {
  try {
    localStorage.setItem(cacheKey, JSON.stringify(data));
    window.dispatchEvent(new StorageEvent('storage', { key: cacheKey }));
  } catch { /* quota */ }
}

function loadThemeOverride(cacheKey: string = DESIGN_KEY): Partial<ThemeOverride> {
  try {
    const raw = localStorage.getItem(cacheKey);
    if (!raw) return {};
    const p = JSON.parse(raw) as Record<string, unknown>;

    const direct: Partial<ThemeOverride> = {};
    if (typeof p.green === 'string') direct.green = p.green;
    if (typeof p.greenLight === 'string') direct.greenLight = p.greenLight;
    if (typeof p.bg === 'string') direct.bg = p.bg;
    if (typeof p.card === 'string') direct.card = p.card;
    if (typeof p.cardBorder === 'string') direct.cardBorder = p.cardBorder;
    if (typeof p.textPrimary === 'string') direct.textPrimary = p.textPrimary;
    if (typeof p.textMuted === 'string') direct.textMuted = p.textMuted;
    if (typeof p.divider === 'string') direct.divider = p.divider;
    if (typeof p.muted === 'string') direct.muted = p.muted;
    if (typeof p.fontFamily === 'string') direct.fontFamily = p.fontFamily;
    if (typeof p.nameFontSize === 'number') direct.nameFontSize = p.nameFontSize;
    if (typeof p.bodyFontSize === 'number') direct.bodyFontSize = p.bodyFontSize;
    if (typeof p.boldHeadings === 'boolean') direct.boldHeadings = p.boldHeadings;
    if (typeof p.cardRadius === 'number') direct.cardRadius = p.cardRadius;
    if (typeof p.phoneBgStyle === 'string') direct.phoneBgStyle = p.phoneBgStyle;
    if (typeof p.heroLayout === 'string') direct.heroLayout = p.heroLayout;

    if (!direct.green && typeof p.accentColor === 'string') {
      const accent = p.accentColor as string;
      direct.green = accent;
      direct.greenLight = accent;
      direct.cardBorder = `${accent}33`;
      direct.divider = `${accent}1f`;
    }

    return direct;
  } catch {
    return {};
  }
}

function saveThemeOverride(cacheKey: string, override: Partial<ThemeOverride>): void {
  try {
    localStorage.setItem(cacheKey, JSON.stringify(override));
    window.dispatchEvent(new StorageEvent('storage', { key: cacheKey }));
    window.dispatchEvent(new CustomEvent('designSaved', { detail: { key: cacheKey } }));
  } catch {
    // ignore local storage failures
  }
}

function pickString(source: Record<string, unknown>, keys: string[], fallback: string): string {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }
  return fallback;
}

function pickNumber(source: Record<string, unknown>, keys: string[], fallback: number): number {
  for (const key of keys) {
    const value = source[key];
    const parsed = typeof value === 'number' ? value : Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
}

function buildThemeOverrideFromCardDesign(design: Partial<CardDesignResponse>): Partial<ThemeOverride> {
  const source = design as Record<string, unknown>;
  const accent = pickString(source, ['accentColor', 'green'], '#008001');
  const accentLight = pickString(source, ['accentLight', 'greenLight'], '#49B618');
  const preset = pickString(source, ['phoneBgPreset'], 'aurora');
  const bgTypeRaw = pickString(source, ['phoneBgType'], 'gradient').toLowerCase();
  const bgType = bgTypeRaw === 'solid' ? 'solid' : 'gradient';
  const bgColor1 = pickString(source, ['phoneBgColor1'], '#0a0f0a');
  const bgColor2 = pickString(source, ['phoneBgColor2'], '#003322');
  const bgAngle = pickNumber(source, ['phoneBgAngle'], 135);
  const normalizedFont = pickString(source, ['font', 'fontFamily'], 'inter').toLowerCase();

  const phoneBgStyle =
    preset === 'custom'
      ? (bgType === 'gradient'
        ? `linear-gradient(${bgAngle}deg, ${bgColor1} 0%, ${bgColor2} 100%)`
        : bgColor1)
      : (DESIGN_WALLPAPER_STYLES[preset] || undefined);

  return {
    green: accent,
    greenLight: accentLight,
    bg: pickString(source, ['bgColor', 'backgroundColor', 'bg'], '#0a0f0a'),
    card: pickString(source, ['cardColor', 'card'], '#111a11'),
    cardBorder: `${accent}33`,
    textPrimary: pickString(source, ['textPrimary', 'textColor'], '#f0f0f0'),
    textMuted: pickString(source, ['textMuted', 'muted'], '#7a9a7a'),
    divider: `${accent}1f`,
    muted: `${accent}55`,
    fontFamily: DESIGN_FONT_FAMILY[normalizedFont] || DESIGN_FONT_FAMILY.inter,
    nameFontSize: pickNumber(source, ['nameFontSize'], 22),
    bodyFontSize: pickNumber(source, ['bodyFontSize'], 11),
    boldHeadings: typeof source.boldHeadings === 'boolean' ? source.boldHeadings : true,
    cardRadius: pickNumber(source, ['cardRadius'], 16),
    phoneBgStyle,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────
function downloadVCard(fd: FormData, profileImage: string) {
  const parts = fd.name.trim().split(' ');
  const last = parts.slice(-1)[0] || '';
  const first = parts.slice(0, -1).join(' ') || fd.name;
  const photo = profileImage.startsWith('data:image')
    ? `PHOTO;ENCODING=b;TYPE=JPEG:${profileImage.split(',')[1]}\n` : '';
  const vcf = [
    'BEGIN:VCARD', 'VERSION:3.0',
    `N:${last};${first};;;`, `FN:${fd.name}`,
    fd.title ? `TITLE:${fd.title}` : '',
    fd.company ? `ORG:${fd.company}` : '',
    fd.email ? `EMAIL:${fd.email}` : '',
    fd.phone ? `TEL:${fd.phone}` : '',
    fd.website ? `URL:${fd.website}` : '',
    fd.location ? `ADR:;;${fd.location};;;;` : '',
    photo, 'END:VCARD',
  ].filter(Boolean).join('\n');
  const blob = new Blob([vcf], { type: 'text/vcard' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `${fd.name.replace(/\s+/g, '_')}.vcf`;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

function openSocialLink(value: string, platform: number) {
  if (!value.trim()) return;
  let url = value.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    const base = SOCIAL_OPTIONS[platform]?.baseUrl ?? 'https://';
    url = base + url.replace(/^@/, '');
  }
  window.open(url, '_blank', 'noopener,noreferrer');
}

// ─────────────────────────────────────────────────────────────────────────────
// QR Modal
// ─────────────────────────────────────────────────────────────────────────────
// function QRModal({ text, onClose }: { text: string; onClose: () => void }) {
//   const encoded = encodeURIComponent(text || 'https://example.com');
//   const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encoded}&bgcolor=000000&color=49B618&margin=20`;
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
//       <div className="relative bg-[#0D0D0D] border border-[#008001]/40 rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-4 shadow-2xl w-full max-w-xs" onClick={e => e.stopPropagation()}>
//         <button onClick={onClose} className="absolute top-3 right-3 text-[#555] hover:text-white"><X className="w-5 h-5" /></button>
//         <h3 className="text-white font-semibold text-lg">Your QR Code</h3>
//         <div className="p-3 rounded-xl bg-[#1a1a1a] border border-[#008001]/30">
//           <img src={qrUrl} alt="QR Code" width={220} height={220} className="rounded-lg" />
//         </div>
//         <p className="text-[#A0A0A0] text-xs text-center max-w-[220px]">Scan to view your digital business card</p>
//         <a href={qrUrl} download="business-card-qr.png"
//           className="flex items-center gap-2 bg-gradient-to-r from-[#008001] to-[#49B618] text-white rounded-xl px-5 py-2 text-sm font-semibold">
//           <Download className="w-4 h-4" /> Download QR
//         </a>
//       </div>
//     </div>
//   );
// }

// ─────────────────────────────────────────────────────────────────────────────
// Add a Component dropdown
// ─────────────────────────────────────────────────────────────────────────────
function AddComponentMenu({ onAdd }: { onAdd: (key: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="flex justify-center relative">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 bg-gradient-to-r from-[#008001] to-[#49B618] hover:from-[#006312] hover:to-[#008001] text-white px-6 sm:px-8 py-2 rounded-full font-medium transition-all text-sm">
        <Plus className="w-4 h-4" />Add a component
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 sm:w-72 bg-[#0D0D0D] border border-[#008001]/40 rounded-2xl shadow-2xl z-30 max-h-[380px] overflow-y-auto">
          <p className="text-[10px] font-semibold text-[#49B618] uppercase tracking-wider px-4 pt-3 pb-1">Core Sections</p>
          {ADDABLE_COMPONENTS.filter(c => c.group === 'builtin').map(({ key, label, icon: Icon }) => (
            <button key={key} type="button" onClick={() => { onAdd(key); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-white hover:bg-[#008001]/20 transition-colors text-sm text-left">
              <div className="w-7 h-7 rounded-lg bg-[#008001]/20 flex items-center justify-center flex-shrink-0"><Icon className="w-3.5 h-3.5 text-[#49B618]" /></div>{label}
            </button>
          ))}
          <p className="text-[10px] font-semibold text-[#49B618] uppercase tracking-wider px-4 pt-3 pb-1 border-t border-[#008001]/20 mt-1">Extra Components</p>
          {ADDABLE_COMPONENTS.filter(c => c.group === 'extra').map(({ key, label, icon: Icon }) => (
            <button key={key} type="button" onClick={() => { onAdd(key); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-white hover:bg-[#008001]/20 transition-colors text-sm text-left">
              <div className="w-7 h-7 rounded-lg bg-[#008001]/20 flex items-center justify-center flex-shrink-0"><Icon className="w-3.5 h-3.5 text-[#49B618]" /></div>{label}
            </button>
          ))}
          <div className="h-2" />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ImageUploader
// ─────────────────────────────────────────────────────────────────────────────
interface ImageUploaderProps {
  value: string; onChange: (v: string) => void;
  label: string; ratio: string; roundedClass?: string; size?: string;
  pendingFile?: File | null;
  onFileSelect?: (file: File | null) => void;
}
function ImageUploader({ value, onChange, label, ratio, roundedClass = 'rounded-2xl', size = 'w-20 h-20', pendingFile, onFileSelect }: ImageUploaderProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>('');

  useEffect(() => {
    if (pendingFile) {
      const reader = new FileReader();
      reader.onload = e => setPreview(e.target?.result as string);
      reader.readAsDataURL(pendingFile);
    } else {
      setPreview('');
    }
  }, [pendingFile]);

  const handleFileSelect = (file: File) => {
    if (onFileSelect) {
      onFileSelect(file);
    }

    // Push a local preview to parent state immediately so live card preview updates before save.
    const reader = new FileReader();
    reader.onload = e => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        onChange(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const displaySrc = preview || value;
  const hasContent = !!displaySrc;

  return (
    <div className="space-y-2">
      <Label className="text-[#A0A0A0] text-xs">{label} <span className="text-[#555]">({ratio})</span></Label>
      <div className="flex items-center gap-3 flex-wrap">
        <div className={`relative ${size} ${roundedClass} overflow-hidden ring-2 ring-[#008001]/30 bg-[#1E1E1E] flex-shrink-0 flex items-center justify-center`}>
          {hasContent
            ? <Image src={displaySrc} alt={label} fill className="object-cover" />
            : <ImageIcon className="w-5 h-5 text-[#555]" />
          }
        </div>
        <button type="button" onClick={() => ref.current?.click()}
          className="flex flex-col items-center justify-center gap-1 w-14 h-14 rounded-xl border-2 border-dashed border-[#008001]/40 hover:border-[#49B618] hover:bg-[#008001]/10 transition-all text-[#A0A0A0] hover:text-[#49B618]">
          <Upload className="w-4 h-4" />
          <span className="text-[10px]">Upload</span>
        </button>
        <input ref={ref} type="file" accept="image/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); e.target.value = ''; }} />
        {hasContent && <button type="button" onClick={() => { onChange(''); onFileSelect?.(null); }} className="text-xs text-red-400 hover:text-red-300 underline">Remove</button>}
      </div>
    </div>
  );
}

interface ToggleProps { checked: boolean; onChange: (v: boolean) => void; }
function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none ${checked ? 'bg-gradient-to-r from-[#008001] to-[#49B618]' : 'bg-[#333]'}`}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

interface SectionBlockProps {
  id?: string; title: string; icon: React.ElementType;
  enabled: boolean; onToggle: () => void;
  expanded: boolean; onExpand: () => void;
  children: React.ReactNode;
}
function SectionBlock({ id, title, icon: Icon, enabled, onToggle, expanded, onExpand, children }: SectionBlockProps) {
  const handleToggle = () => {
    const turningOn = !enabled; onToggle();
    if (turningOn && !expanded) onExpand();
    if (!turningOn && expanded) onExpand();
  };
  return (
    <Card id={id} className="bg-[#000000] border-[#008001]/30 overflow-hidden scroll-mt-4">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#008001]/20">
        <div className="flex items-center gap-2 min-w-0">
          <GripVertical className="w-4 h-4 text-[#555] cursor-grab flex-shrink-0" />
          <Icon className="w-4 h-4 text-[#49B618] flex-shrink-0" />
          <span className="font-semibold text-white text-sm truncate">{title}</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2">
          <Toggle checked={enabled} onChange={handleToggle} />
          <button type="button" onClick={onExpand}
            className="w-7 h-7 rounded-md flex items-center justify-center text-[#A0A0A0] hover:text-white hover:bg-[#008001]/20 transition-colors">
            {expanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
      </div>
      {expanded && <CardContent className="p-4 sm:p-6">{children}</CardContent>}
    </Card>
  );
}

function LogoPositionPicker({ value, onChange }: { value: LogoPosition; onChange: (v: LogoPosition) => void }) {
  const opts: { v: LogoPosition; label: string; desc: string; logoClass: string }[] = [
    { v: 'top-left', label: 'Top Left', desc: 'Corner of card', logoClass: 'top-0.5 left-0.5' },
    { v: 'top-right', label: 'Top Right', desc: 'Corner of card', logoClass: 'top-0.5 right-0.5' },
    { v: 'below-photo', label: 'Below Photo', desc: 'Under profile picture', logoClass: 'bottom-[18px] left-1/2 -translate-x-1/2' },
    { v: 'below-name', label: 'Below Name', desc: 'Under your name', logoClass: 'bottom-[6px] left-1/2 -translate-x-1/2' },
  ];
  return (
    <div className="grid grid-cols-2 gap-2 mt-2">
      {opts.map(opt => (
        <button key={opt.v} type="button" onClick={() => onChange(opt.v)}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all text-center gap-1.5 ${value === opt.v
            ? 'border-[#49B618] bg-[#49B618]/10 text-white'
            : 'border-[#008001]/20 bg-[#0D0D0D] text-[#A0A0A0] hover:border-[#008001]/50 hover:text-white'
            }`}>
          <div className="w-12 h-8 rounded-md bg-[#1a2e1a] border border-[#008001]/30 relative overflow-hidden flex-shrink-0">
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#49B618]/40 border border-[#49B618]/60" />
            <div className={`absolute w-4 h-1.5 rounded-sm bg-[#49B618]/80 ${opt.logoClass}`} />
          </div>
          <span className="text-[11px] font-medium leading-tight">{opt.label}</span>
          <span className="text-[9px] opacity-55 leading-tight">{opt.desc}</span>
        </button>
      ))}
    </div>
  );
}

interface ExtraSectionBlockProps {
  section: ExtraSection;
  onToggle: (id: string, field: 'enabled' | 'expanded') => void;
  onRemove: (id: string) => void;
  onUpdateData: (id: string, field: string, value: string) => void;
}
function ExtraSectionBlock({ section, onToggle, onRemove, onUpdateData }: ExtraSectionBlockProps) {
  const comp = ADDABLE_COMPONENTS.find(c => c.key === section.type);
  const Icon = comp?.icon ?? LayoutTemplate;
  const handleToggle = () => {
    const turningOn = !section.enabled; onToggle(section.id, 'enabled');
    if (turningOn && !section.expanded) onToggle(section.id, 'expanded');
    if (!turningOn && section.expanded) onToggle(section.id, 'expanded');
  };
  const renderFields = () => {
    switch (section.type) {
      case 'extra-button':
        return (<div className="space-y-3"><div><Label className="text-[#A0A0A0] text-xs">Button Label</Label><Input value={(section.data.btnLabel as string) ?? ''} onChange={e => onUpdateData(section.id, 'btnLabel', e.target.value)} placeholder="Click here" className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" /></div><div><Label className="text-[#A0A0A0] text-xs">Button URL</Label><Input value={(section.data.btnUrl as string) ?? ''} onChange={e => onUpdateData(section.id, 'btnUrl', e.target.value)} placeholder="https://..." className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" /></div></div>);
      case 'extra-pdf':
        return (<div className="space-y-3"><div><Label className="text-[#A0A0A0] text-xs">PDF Title</Label><Input value={(section.data.pdfTitle as string) ?? ''} onChange={e => onUpdateData(section.id, 'pdfTitle', e.target.value)} placeholder="Our Brochure" className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" /></div><div><Label className="text-[#A0A0A0] text-xs">PDF URL</Label><Input value={(section.data.pdfUrl as string) ?? ''} onChange={e => onUpdateData(section.id, 'pdfUrl', e.target.value)} placeholder="https://example.com/brochure.pdf" className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" /></div></div>);
      case 'extra-imagetext':
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-[#A0A0A0] text-xs">Image</Label>
              <div className="mt-1 relative">
                {section.data.imgUrl ? (
                  <div className="relative group w-full h-32 rounded-xl overflow-hidden">
                    <Image src={section.data.imgUrl as string} alt="" fill className="object-cover" />
                    <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer rounded-xl">
                      <Upload className="w-5 h-5 text-white" />
                      <input type="file" accept="image/*" className="hidden"
                        onChange={async e => {
                          const file = e.target.files?.[0]; if (!file) return;
                          try {
                            const res = await uploadFile(file);
                            onUpdateData(section.id, 'imgUrl', res.url);
                          } catch (err: any) {
                            alert('Upload failed: ' + err.message);
                          }
                        }} />
                    </label>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-24 rounded-xl cursor-pointer transition-colors border-dashed border-2 border-[#008001]/30 bg-[#0D0D0D] hover:bg-[#008001]/10">
                    <Upload className="w-5 h-5 text-[#49B618] mb-1" />
                    <span className="text-xs text-[#A0A0A0]">Upload Image</span>
                    <input type="file" accept="image/*" className="hidden"
                      onChange={async e => {
                        const file = e.target.files?.[0]; if (!file) return;
                        try {
                          const res = await uploadFile(file);
                          onUpdateData(section.id, 'imgUrl', res.url);
                        } catch (err: any) {
                          alert('Upload failed: ' + err.message);
                        }
                      }} />
                  </label>
                )}
              </div>
            </div>
          </div>
        );
      case 'extra-team': case 'extra-customer':
        return (<div className="space-y-3"><div><Label className="text-[#A0A0A0] text-xs">Section Title</Label><Input value={(section.data.title as string) ?? ''} onChange={e => onUpdateData(section.id, 'title', e.target.value)} placeholder={section.type === 'extra-team' ? 'Meet Our Team' : 'Our Customers'} className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" /></div><div><Label className="text-[#A0A0A0] text-xs">Description</Label><Textarea value={(section.data.desc as string) ?? ''} onChange={e => onUpdateData(section.id, 'desc', e.target.value)} placeholder="Add a description..." className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" rows={3} /></div></div>);
      case 'extra-products':
        return (<div className="space-y-3"><div><Label className="text-[#A0A0A0] text-xs">Product Name</Label><Input value={(section.data.productName as string) ?? ''} onChange={e => onUpdateData(section.id, 'productName', e.target.value)} placeholder="Product name" className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" /></div><div><Label className="text-[#A0A0A0] text-xs">Price</Label><Input value={(section.data.price as string) ?? ''} onChange={e => onUpdateData(section.id, 'price', e.target.value)} placeholder="$99" className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" /></div><div><Label className="text-[#A0A0A0] text-xs">Buy Link</Label><Input value={(section.data.buyUrl as string) ?? ''} onChange={e => onUpdateData(section.id, 'buyUrl', e.target.value)} placeholder="https://..." className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" /></div></div>);
      default:
        return (<div className="space-y-3"><div><Label className="text-[#A0A0A0] text-xs">Title</Label><Input value={(section.data.title as string) ?? ''} onChange={e => onUpdateData(section.id, 'title', e.target.value)} placeholder="Section title" className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" /></div><div><Label className="text-[#A0A0A0] text-xs">Content</Label><Textarea value={(section.data.content as string) ?? ''} onChange={e => onUpdateData(section.id, 'content', e.target.value)} placeholder="Content..." className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" rows={4} /></div></div>);
    }
  };
  return (
    <Card id={section.id} className="bg-[#000000] border-[#008001]/30 overflow-hidden scroll-mt-4">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#008001]/20">
        <div className="flex items-center gap-2 min-w-0">
          <GripVertical className="w-4 h-4 text-[#555] cursor-grab flex-shrink-0" />
          <Icon className="w-4 h-4 text-[#49B618] flex-shrink-0" />
          <span className="font-semibold text-white text-sm truncate">{section.label}</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2">
          <Toggle checked={section.enabled} onChange={handleToggle} />
          <button type="button" onClick={() => onToggle(section.id, 'expanded')} className="w-7 h-7 rounded-md flex items-center justify-center text-[#A0A0A0] hover:text-white hover:bg-[#008001]/20 transition-colors">
            {section.expanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
          <button type="button" onClick={() => onRemove(section.id)} className="w-7 h-7 rounded-md flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      {section.expanded && <CardContent className="p-4 sm:p-6">{renderFields()}</CardContent>}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export default function BusinessProfile({
  cardId,
  onContentChange,
  allowFallbackToFirstCard = true,
}: {
  cardId?: string;
  onContentChange?: (content: CardContentPayload) => void;
  allowFallbackToFirstCard?: boolean;
}) {
  const [initial] = useState(() => loadCache(cacheKeyForEditor(cardId, undefined, allowFallbackToFirstCard)));
  const [resolvedCardId, setResolvedCardId] = useState<string | undefined>(cardId);
  const activeDesignCacheKey = designCacheKeyForEditor(cardId, resolvedCardId, allowFallbackToFirstCard);
  const shouldPersistGlobalProfile = !cardId && allowFallbackToFirstCard;

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

  const [profileImage, setProfileImage] = useState<string>(initial.profileImage);
  const [brandLogo, setBrandLogo] = useState<string>(initial.brandLogo);
  const [pendingProfileImage, setPendingProfileImage] = useState<File | null>(null);
  const [pendingBrandLogo, setPendingBrandLogo] = useState<File | null>(null);
  const [logoPosition, setLogoPosition] = useState<LogoPosition>(initial.logoPosition);
  const [formData, setFormData] = useState<FormData>(initial.formData);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(initial.socialLinks);
  const [connectFields] = useState<ConnectField[]>(initial.connectFields);
  const [sections, setSections] = useState<Sections>(initial.sections);
  const [expanded, setExpanded] = useState<Expanded>(initial.expanded);
  const [customLinks, setCustomLinks] = useState<CustomLink[]>(initial.customLinks);
  const [extraSections, setExtraSections] = useState<ExtraSection[]>(initial.extraSections);

  const [themeOverride, setThemeOverride] = useState<Partial<ThemeOverride>>(() =>
    loadThemeOverride(designCacheKeyForEditor(cardId, cardId, allowFallbackToFirstCard)),
  );

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showQrPopup, setShowQrPopup] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedContact, setSavedContact] = useState(false);
  const [saveFlash, setSaveFlash] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');
  const [profileShareUrl, setProfileShareUrl] = useState('');
  const hasPublishedUrl = !!profileShareUrl.trim();
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const formDataRef = useRef(formData);
  const profileImageRef = useRef(profileImage);

  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  useEffect(() => {
    profileImageRef.current = profileImage;
  }, [profileImage]);

  const previewResolvedCardId = useDeferredValue(resolvedCardId);
  const previewProfileImage = useDeferredValue(profileImage);
  const previewBrandLogo = useDeferredValue(brandLogo);
  const previewLogoPosition = useDeferredValue(logoPosition);
  const previewFormData = useDeferredValue(formData);
  const previewSocialLinks = useDeferredValue(socialLinks);
  const previewCustomLinks = useDeferredValue(customLinks);
  const previewExtraSections = useDeferredValue(extraSections);
  const previewSections = useDeferredValue(sections);
  const previewExpanded = useDeferredValue(expanded);
  const previewSavedContact = useDeferredValue(savedContact);
  const previewCopied = useDeferredValue(copied);
  const previewThemeOverride = useDeferredValue(themeOverride);

  useEffect(() => {
    const cached = loadCache(cacheKeyForEditor(cardId, resolvedCardId, allowFallbackToFirstCard));
    setProfileImage(cached.profileImage);
    setBrandLogo(cached.brandLogo);
    setLogoPosition(cached.logoPosition);
    setFormData(cached.formData);
    setSocialLinks(cached.socialLinks);
    setSections(cached.sections);
    setExpanded(cached.expanded);
    setCustomLinks(cached.customLinks);
    setExtraSections(cached.extraSections);
  }, [cardId, resolvedCardId, allowFallbackToFirstCard]);

  useEffect(() => {
    setThemeOverride(loadThemeOverride(activeDesignCacheKey));
  }, [activeDesignCacheKey]);

  const qrConfig = useQrStore(state => state.qrConfig);
  const setQr = useQrStore(state => state.setQr);

  const qrCardUrl = useMemo(() => {
    const raw = profileShareUrl.trim() || (typeof window !== 'undefined' ? window.location.href : 'https://samcard.app');
    if (!raw.startsWith('http://') && !raw.startsWith('https://')) {
      return `https://${raw}`;
    }
    return raw;
  }, [profileShareUrl]);

  useEffect(() => {
    const { matrix, N } = makeQRMatrix(qrCardUrl);
    setQr(qrConfig, matrix, N);
  }, [qrCardUrl, setQr, qrConfig]);

  const loadFromApi = useCallback(async () => {
    const [profileResult, socialResult, customResult] = await Promise.allSettled([

      getBusinessProfile(),
      getSocialLinks(),
      getCustomLinks(),
    ]);

    if (profileResult.status === 'fulfilled' && profileResult.value) {
      const profile = profileResult.value;
      // profileShareUrl is authoritative from getCards() in loadCardContent;
      // only seed it from the business profile if it hasn't been populated yet.
      if (profile.shareUrl) {
        setProfileShareUrl(prev => prev || profile.shareUrl!);
      }

      if (shouldPersistGlobalProfile) {
        setProfileImage(profile.profileImageUrl || initial.profileImage);
        setBrandLogo(profile.brandLogoUrl || initial.brandLogo);
        setLogoPosition(normalizeLogoPositionFromApi(profile.logoPosition));
      }

      // For a new card (!cardId && !allowFallbackToFirstCard), never pre-fill from the global profile.
      const isNewCard = !cardId && !allowFallbackToFirstCard;
      if (!isNewCard) {
        setFormData(prev => ({
          ...prev,
          name: shouldPersistGlobalProfile ? (profile.name || prev.name) : (prev.name || profile.name || ''),
          title: shouldPersistGlobalProfile ? (profile.title || '') : (prev.title || profile.title || ''),
          company: shouldPersistGlobalProfile ? (profile.company || '') : (prev.company || profile.company || ''),
          tagline: shouldPersistGlobalProfile ? (profile.tagline || '') : (prev.tagline || profile.tagline || ''),
          email: shouldPersistGlobalProfile ? (profile.primaryEmail || '') : (prev.email || profile.primaryEmail || ''),
          phone: shouldPersistGlobalProfile ? (profile.primaryPhone || '') : (prev.phone || profile.primaryPhone || ''),
          website: shouldPersistGlobalProfile ? (profile.website || '') : (prev.website || profile.website || ''),
          location: shouldPersistGlobalProfile
            ? [profile.city, profile.state, profile.country].filter(Boolean).join(', ')
            : (prev.location || [profile.city, profile.state, profile.country].filter(Boolean).join(', ')),
        }));
      }
    }

    if (socialResult.status === 'fulfilled' && shouldPersistGlobalProfile) {
      const mappedSocials = socialResult.value.map(link => {
        const platformIndex = SOCIAL_OPTIONS.findIndex(
          option => option.name.toLowerCase() === (link.platform || '').toLowerCase(),
        );

        return {
          platform: platformIndex >= 0 ? platformIndex : 0,
          value: link.url || link.handle || '',
        };
      });

      if (mappedSocials.length > 0) {
        setSocialLinks(mappedSocials);
      }
    }

    if (customResult.status === 'fulfilled' && shouldPersistGlobalProfile) {
      const mappedLinks = customResult.value.map(link => ({
        label: link.label || '',
        url: link.url || '',
      }));

      if (mappedLinks.length > 0) {
        setCustomLinks(mappedLinks);
      }
    }
  }, [initial.brandLogo, initial.logoPosition, initial.profileImage, shouldPersistGlobalProfile, cardId, allowFallbackToFirstCard]);

  useEffect(() => {
    loadFromApi().catch(() => null);
  }, [loadFromApi, reloadTrigger]);

  const loadCardContent = useCallback(async () => {
    if (!resolvedCardId) return;
    try {
      const [content, cards] = await Promise.all([
        getCardContent(resolvedCardId),
        getCards().catch(() => [] as Awaited<ReturnType<typeof getCards>>),
      ]);
      const matchedCard = cards.find(c => c.id === resolvedCardId);
      if (matchedCard?.slug) {
        const PUBLIC_BASE = (process.env.NEXT_PUBLIC_APP_URL || 'https://samcard.vercel.app').replace(/\/$/, '');
        setProfileShareUrl(`${PUBLIC_BASE}/${matchedCard.slug}`);
      }
      if (!content) {
        const fallback = loadCache(cacheKeyForEditor(cardId, resolvedCardId, allowFallbackToFirstCard));
        setProfileImage(fallback.profileImage);
        setBrandLogo(fallback.brandLogo);
        setLogoPosition(fallback.logoPosition);
        setFormData(fallback.formData);
        setSocialLinks(fallback.socialLinks);
        setSections(fallback.sections);
        setCustomLinks(fallback.customLinks);
        setExtraSections(fallback.extraSections);
        return;
      }

      setProfileImage(content.profileImage || initial.profileImage);
      setBrandLogo(content.brandLogo || initial.brandLogo);
      setLogoPosition(normalizeLogoPositionFromApi(content.logoPosition));

      if (content.formData) {
        setFormData(prev => ({ ...prev, ...content.formData }));
      }

      if (content.socialLinks) {
        const mappedSocials = (content.socialLinks as { platform: string; url: string }[])
          .map(sl => {
            const platformIndex = SOCIAL_OPTIONS.findIndex(
              option => option.name.toLowerCase() === (sl.platform || '').toLowerCase(),
            );
            return {
              platform: platformIndex >= 0 ? platformIndex : 0,
              value: sl.url || '',
            };
          });
        if (mappedSocials.length > 0) setSocialLinks(mappedSocials);
      }

      if (content.customLinks) {
        setCustomLinks(content.customLinks.map(link => ({ label: link.label || '', url: link.url || '' })));
      }

      if (content.sections) {
        setSections(content.sections as Sections);
      }

      if (content.extraSections) {
        setExtraSections(content.extraSections as ExtraSection[]);
      }
    } catch {
      // ignore load errors
    }
  }, [resolvedCardId, initial.brandLogo, initial.logoPosition, initial.profileImage, cardId, allowFallbackToFirstCard]);

  useEffect(() => {
    loadCardContent();
  }, [loadCardContent, reloadTrigger]);

  const loadCardDesign = useCallback(async () => {
    if (!resolvedCardId) return;

    try {
      const design = await getCardDesign(resolvedCardId);
      if (!design) return;

      const override = buildThemeOverrideFromCardDesign(design);
      setThemeOverride(override);
      saveThemeOverride(activeDesignCacheKey, override);
    } catch {
      // ignore load errors
    }
  }, [resolvedCardId, activeDesignCacheKey]);

  useEffect(() => {
    loadCardDesign();
  }, [loadCardDesign, reloadTrigger]);

  useEffect(() => {
    const refresh = () => setThemeOverride(loadThemeOverride(activeDesignCacheKey));
    const onStorage = (e: StorageEvent) => {
      if (e.key === activeDesignCacheKey || e.key === null) refresh();
    };
    const onFocus = () => refresh();
    const onDesignSaved = (event: Event) => {
      const designEvent = event as CustomEvent<{ key?: string }>;
      const eventKey = designEvent.detail?.key;
      if (!eventKey || eventKey === activeDesignCacheKey) {
        refresh();
      }
    };
    const onCardUpdated = () => setReloadTrigger(prev => prev + 1);
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', onFocus);
    window.addEventListener('designSaved', onDesignSaved);
    window.addEventListener('cardDataUpdated', onCardUpdated);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('designSaved', onDesignSaved);
      window.removeEventListener('cardDataUpdated', onCardUpdated);
    };
  }, [activeDesignCacheKey]);

  // Debounce onContentChange so typing in any field doesn't trigger an
  // expensive parent re-render on every keystroke (root cause of 1,520ms INP).
  useEffect(() => {
    if (!onContentChange) return;
    const timer = setTimeout(() => {
      onContentChange({
        profileImage,
        brandLogo,
        logoPosition,
        formData,
        socialLinks: socialLinks
          .filter(link => Boolean(link.value.trim()))
          .map(link => ({
            platform: SOCIAL_OPTIONS[link.platform]?.name || SOCIAL_OPTIONS[0].name,
            url: link.value.trim(),
          })),
        connectFields,
        sections,
        customLinks,
        extraSections,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [onContentChange, profileImage, brandLogo, logoPosition, formData, socialLinks, connectFields, sections, customLinks, extraSections]);

  const handleSaveChanges = useCallback(async () => {
    setSaveError(null);
    setIsSaving(true);

    let updatedProfileImage = profileImage;
    let updatedBrandLogo = brandLogo;

    if (pendingProfileImage) {
      try {
        const res = await uploadFile(pendingProfileImage);
        updatedProfileImage = res.url;
        setProfileImage(res.url);
        setPendingProfileImage(null);
      } catch (e: any) {
        setIsSaving(false);
        setSaveError('Failed to upload profile image: ' + e.message);
        return;
      }
    }

    if (pendingBrandLogo) {
      try {
        const res = await uploadFile(pendingBrandLogo);
        updatedBrandLogo = res.url;
        setBrandLogo(res.url);
        setPendingBrandLogo(null);
      } catch (e: any) {
        setIsSaving(false);
        setSaveError('Failed to upload brand logo: ' + e.message);
        return;
      }
    }

    saveCacheForKey(
      { profileImage: updatedProfileImage, brandLogo: updatedBrandLogo, logoPosition, formData, socialLinks, connectFields, sections, expanded, customLinks, extraSections },
      cacheKeyForEditor(cardId, resolvedCardId, allowFallbackToFirstCard),
    );

    const normalizedSocialLinks: ApiSocialLinkPayload[] = socialLinks
      .filter(link => Boolean(link.value.trim()))
      .map(link => ({
        platform: SOCIAL_OPTIONS[link.platform]?.name || SOCIAL_OPTIONS[0].name,
        url: link.value.trim(),
        handle: '',
        label: '',
        icon: '',
        enabled: true,
      }));

    const normalizedCustomLinks: ApiCustomLinkPayload[] = customLinks
      .filter(link => Boolean(link.label.trim() || link.url.trim()))
      .map(link => ({
        label: link.label.trim(),
        url: link.url.trim(),
        icon: '',
        color: '',
        enabled: true,
      }));

    const locationParts = formData.location.split(',').map(part => part.trim());

    try {
      const normalizedLogoPosition = normalizeLogoPositionForBusinessProfile(logoPosition);
      const contentLogoPosition = normalizeLogoPositionForCardContent(logoPosition);

      if (shouldPersistGlobalProfile) {
        const savedProfile = await updateBusinessProfile({
          name: formData.name,
          title: formData.title,
          company: formData.company,
          tagline: formData.tagline,
          profileImageUrl: updatedProfileImage,
          brandLogoUrl: updatedBrandLogo,
          logoPosition: normalizedLogoPosition,
          primaryEmail: formData.email,
          primaryPhone: formData.phone,
          website: formData.website,
          address: formData.location,
          city: locationParts[0] || '',
          state: locationParts[1] || '',
          country: locationParts[2] || '',
        });

        setProfileShareUrl(savedProfile.shareUrl || '');
      }

      // Always persist social and custom links regardless of card vs global mode
      await Promise.all([
        updateSocialLinks(normalizedSocialLinks),
        updateCustomLinks(normalizedCustomLinks),
      ]);

      if (cardId) {
        await updateCardContent(cardId, {
          profileImage: updatedProfileImage,
          brandLogo: updatedBrandLogo,
          logoPosition: contentLogoPosition,
          formData,
          socialLinks: normalizedSocialLinks.map(sl => ({ platform: sl.platform, url: sl.url })),
          connectFields,
          sections,
          customLinks,
          extraSections,
        });
      }

      setSaveFlash(true);
      window.dispatchEvent(new CustomEvent('profileUpdated'));
      setTimeout(() => window.dispatchEvent(new CustomEvent('notifications:refresh')), 1500);
      setTimeout(() => setSaveFlash(false), 2200);
      setReloadTrigger(prev => prev + 1);
    } catch (error: unknown) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  }, [profileImage, brandLogo, pendingProfileImage, pendingBrandLogo, logoPosition, formData, socialLinks, connectFields, sections, expanded, customLinks, extraSections, cardId, resolvedCardId, allowFallbackToFirstCard, shouldPersistGlobalProfile]);


  const updateField = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => setFormData(prev => ({ ...prev, [key]: value })), []);
  const toggleSection = useCallback((key: keyof Sections) => setSections(prev => ({ ...prev, [key]: !prev[key] })), []);
  const toggleExpand = useCallback((key: keyof Expanded) => setExpanded(prev => ({ ...prev, [key]: !prev[key] })), []);
  const addSocial = useCallback(() => setSocialLinks(p => [...p, { platform: 0, value: '' }]), []);
  const removeSocial = useCallback((i: number) => setSocialLinks(p => p.filter((_, idx) => idx !== i)), []);
  const updateSocial = useCallback((i: number, field: keyof SocialLink, val: SocialLink[keyof SocialLink]) => setSocialLinks(p => p.map((s, idx) => idx === i ? { ...s, [field]: val } : s)), []);
  const addLink = useCallback(() => setCustomLinks(p => [...p, { label: '', url: '' }]), []);
  const removeLink = useCallback((i: number) => setCustomLinks(p => p.filter((_, idx) => idx !== i)), []);
  const updateLink = useCallback((i: number, field: keyof CustomLink, val: string) => setCustomLinks(p => p.map((l, idx) => idx === i ? { ...l, [field]: val } : l)), []);

  const handleProfileFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setPendingProfileImage(file);
    const reader = new FileReader();
    reader.onload = ev => { if (ev.target?.result) setProfileImage(ev.target.result as string); };
    reader.readAsDataURL(file); e.target.value = '';
  }, []);

  const handleShareLink = useCallback(async () => {
    if (!profileShareUrl.trim()) return;
    const url = profileShareUrl.trim();
    try { await navigator.clipboard.writeText(url); }
    catch { const el = document.createElement('input'); el.value = url; document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el); }
    setCopied(true); setTimeout(() => setCopied(false), 2500);
  }, [profileShareUrl]);

  const handleSaveContact = useCallback(() => {
    if (!formDataRef.current.name.trim()) return;
    downloadVCard(formDataRef.current, profileImageRef.current);
    setSavedContact(true); setTimeout(() => setSavedContact(false), 2500);
  }, []);

  const openPreview = useCallback(() => setIsPreviewOpen(true), []);
  const openQrPopup = useCallback(() => setShowQrPopup(true), []);
  const closeQrPopup = useCallback(() => setShowQrPopup(false), []);

  const handleAddComponent = useCallback((key: string) => {
    if (key.startsWith('extra-')) {
      const comp = ADDABLE_COMPONENTS.find(c => c.key === key);
      const ns: ExtraSection = { id: `${key}-${Date.now()}`, type: key, label: comp?.label ?? key, enabled: true, expanded: true, data: {} };
      setExtraSections(prev => [...prev, ns]);
      setTimeout(() => document.getElementById(ns.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
    } else {
      setSections(prev => ({ ...prev, [key as keyof Sections]: true }));
      setExpanded(prev => ({ ...prev, [key as keyof Expanded]: true }));
      setTimeout(() => document.getElementById(`section-${key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
    }
  }, []);

  const updateExtraData = useCallback((id: string, field: string, value: string) => setExtraSections(prev => prev.map(s => s.id === id ? { ...s, data: { ...s.data, [field]: value } } : s)), []);
  const toggleExtra = useCallback((id: string, field: 'enabled' | 'expanded') => setExtraSections(prev => prev.map(s => s.id === id ? { ...s, [field]: !s[field] } : s)), []);
  const removeExtra = useCallback((id: string) => setExtraSections(prev => prev.filter(s => s.id !== id)), []);

  const sharedPreviewProps = useMemo(() => ({
    cardId: previewResolvedCardId,
    publishedLink: profileShareUrl,
    profileImage: previewProfileImage,
    brandLogo: previewBrandLogo,
    logoPosition: previewLogoPosition,
    formData: previewFormData,
    socialLinks: previewSocialLinks,
    customLinks: previewCustomLinks,
    extraSections: previewExtraSections,
    sections: previewSections,
    expanded: previewExpanded,
    savedContact: previewSavedContact,
    copied: previewCopied,
    themeOverride: previewThemeOverride,
  }), [
    previewResolvedCardId,
    profileShareUrl,
    previewProfileImage,
    previewBrandLogo,
    previewLogoPosition,
    previewFormData,
    previewSocialLinks,
    previewCustomLinks,
    previewExtraSections,
    previewSections,
    previewExpanded,
    previewSavedContact,
    previewCopied,
    previewThemeOverride,
  ]);

  const PhonePreviewPanel = (
    <PhonePreview
      {...sharedPreviewProps}
      onPreviewOpen={openPreview}
      onShareLink={hasPublishedUrl ? handleShareLink : undefined}
      onSaveContact={handleSaveContact}
    />
  );

  const EditorContent = (
    <div className="space-y-4">

      {/* Template picker - prefill profile + design */}
      
      {/* Profile header card */}
      <Card className="bg-gradient-to-br from-[#000000] to-[#008001]/10 border-[#008001]/30">
        <CardContent className="p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <div className="relative group flex-shrink-0 self-center sm:self-start">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden ring-4 ring-[#008001]/30 bg-[#1E1E1E] flex items-center justify-center">
                {profileImage
                  ? <Image src={profileImage} alt="Profile" fill className="object-cover" />
                  : <User className="w-10 h-10 text-[#333]" />
                }
              </div>
              <label className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Upload className="w-7 h-7 text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handleProfileFileChange} />
              </label>
              <div className="absolute -bottom-2 -right-2 w-9 h-9 bg-gradient-to-br from-[#49B618] to-[#009200] rounded-full border-4 border-[#000000] flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex-1 min-w-0 w-full">
              <div className="flex items-start justify-between mb-3 gap-2">
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold mb-1 text-white truncate">{formData.name}</h2>
                  <p className="text-[#49B618] text-sm truncate">{formData.title}</p>
                  <p className="text-sm text-[#A0A0A0] truncate">{formData.company}</p>
                </div>
                <Badge className="bg-gradient-to-r from-[#008001] to-[#49B618] text-white border-0 flex-shrink-0 text-xs">Active</Badge>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" className="bg-gradient-to-r from-[#008001] to-[#49B618] hover:from-[#006312] hover:to-[#008001] text-white text-xs h-8" onClick={openPreview}>
                  <Eye className="w-3.5 h-3.5 mr-1.5" />Preview
                </Button>
                <Button variant="outline" size="sm" className="border-[#008001]/30 text-[#A0A0A0] hover:text-white hover:bg-[#008001]/20 text-xs h-8 disabled:opacity-35 disabled:cursor-not-allowed" onClick={handleShareLink} disabled={!hasPublishedUrl} title={!hasPublishedUrl ? 'Publish your card first to share the link' : undefined}>
                  {copied ? <Check className="w-3.5 h-3.5 mr-1.5 text-[#49B618]" /> : <Share2 className="w-3.5 h-3.5 mr-1.5" />}
                  {copied ? 'Copied!' : 'Share'}
                </Button>
                <Button variant="outline" size="sm" className="border-[#008001]/30 text-[#A0A0A0] hover:text-white hover:bg-[#008001]/20 text-xs h-8 disabled:opacity-35 disabled:cursor-not-allowed" onClick={openQrPopup} disabled={!hasPublishedUrl} title={!hasPublishedUrl ? 'Publish your card first to view the QR code' : undefined}>
                  <QrCode className="w-3.5 h-3.5 mr-1.5" />QR Code
                </Button>
              </div >
            </div >
          </div >
        </CardContent >
      </Card >

<div className="mb-6">
  <h2 className="text-white text-lg font-bold mb-1">Templates</h2>
  <p className="text-[#7a9a7a] text-xs mb-3">Pick a template — fields and colors will be filled in. Edit anything below.</p>
        <TemplatePicker
          cardId={resolvedCardId ?? cardId ?? null}
          onApply={(content) => {
            try {
              // merge known fields into formData
              const incoming = content as Record<string, unknown>;
              const updates: Partial<FormData> = {};
              if (typeof incoming.name === 'string') updates.name = incoming.name;
              if (typeof incoming.jobTitle === 'string') updates.title = incoming.jobTitle;
              if (typeof incoming.company === 'string') updates.company = incoming.company;
              if (typeof incoming.tagline === 'string') updates.tagline = incoming.tagline;
              if (typeof incoming.headingText === 'string') updates.headingText = incoming.headingText;
              if (typeof incoming.bio === 'string') updates.bodyText = incoming.bio;
              if (typeof incoming.email === 'string') updates.email = incoming.email;
              if (typeof incoming.phone === 'string') updates.phone = incoming.phone;
              if (typeof incoming.website === 'string') updates.website = incoming.website;

              setFormData(prev => ({ ...prev, ...updates }));

              // profileImage and brandLogo
              if (typeof incoming.profileImage === 'string') setProfileImage(incoming.profileImage);
              if (typeof incoming.brandLogo === 'string') setBrandLogo(incoming.brandLogo);

              // social links mapping: from {platform: string, url: string} to our SocialLink[] (platform index)
              if (Array.isArray(incoming.socialLinks)) {
                const arr = incoming.socialLinks as Array<Record<string, unknown>>;
                const newSocial = [...socialLinks];
                for (const item of arr) {
                  const p = typeof item.platform === 'string' ? item.platform.toLowerCase() : undefined;
                  const url = typeof item.url === 'string' ? item.url : (typeof item.value === 'string' ? item.value : '');
                  if (!p) continue;
                  const idx = SOCIAL_OPTIONS.findIndex(o => o.name.toLowerCase() === p || o.name.toLowerCase().includes(p));
                  if (idx >= 0) newSocial[idx] = { platform: idx, value: url };
                }
                setSocialLinks(newSocial);
              }

              // sections enablement
              if (Array.isArray(incoming.sections)) {
                const sec = { ...sections };
                for (const s of (incoming.sections as Array<Record<string, unknown>>)) {
                  const t = typeof s.type === 'string' ? s.type.toLowerCase() : '';
                  if (!t) continue;
                  if (t === 'about') sec.profile = true;
                  if (t === 'contact') sec.contactUs = true;
                  if (t === 'social') sec.socialLinks = true;
                  if (t === 'links') sec.links = true;
                  if (t === 'heading' || t === 'headingtext') sec.headingText = true;
                }
                setSections(sec);
              }

              // custom links (from sections content)
              if (Array.isArray(incoming.sections)) {
                for (const s of (incoming.sections as Array<Record<string, unknown>>)) {
                  const content = s.content as { links?: unknown } | undefined;
                  if (s.type === 'links' && Array.isArray(content?.links)) {
                    const links = (content!.links as Array<Record<string, unknown>>).map(l => ({ label: String(l.label ?? ''), url: String(l.url ?? '') }));
                    if (links.length) setCustomLinks(links as any);
                  }
                }
              }

              // persist merged cache
              try {
                const ck = cacheKeyForEditor(cardId, resolvedCardId, allowFallbackToFirstCard);
                const newCache: CacheShape = {
                  profileImage: typeof incoming.profileImage === 'string' ? incoming.profileImage : profileImage,
                  brandLogo: typeof incoming.brandLogo === 'string' ? incoming.brandLogo : brandLogo,
                  logoPosition,
                  formData: { ...formData, ...updates },
                  socialLinks: socialLinks,
                  connectFields: connectFields,
                  sections: { ...sections },
                  expanded: { ...expanded },
                  customLinks: customLinks,
                  extraSections: extraSections,
                };
                saveCacheForKey(newCache, ck);
              } catch (e) {
                // ignore persistence errors
              }
            } catch (err) {
              console.error('Failed applying template content', err);
            }
          }}
          onDesignApply={(design) => {
            try {
              const d = design as Record<string, unknown>;
              const accent = (typeof d.accentColor === 'string' ? d.accentColor : '#008001');
              const accentLight = (typeof d.accentLight === 'string' ? d.accentLight : accent);
              const bgColor = (typeof d.bgColor === 'string' ? d.bgColor : '#0a0f0a');
              const cardColor = (typeof d.cardColor === 'string' ? d.cardColor : '#111a11');
              const textPrimary = (typeof d.textPrimary === 'string' ? d.textPrimary : '#f0f0f0');
              const textMuted = (typeof d.textMuted === 'string' ? d.textMuted : '#7a9a7a');
              const fontKey = (typeof d.font === 'string' ? d.font : 'inter').toLowerCase();
              const phoneBgPreset = (typeof d.phoneBgPreset === 'string' ? d.phoneBgPreset : 'aurora');
              const phoneBgColor1 = (typeof d.phoneBgColor1 === 'string' ? d.phoneBgColor1 : bgColor);
              const phoneBgColor2 = (typeof d.phoneBgColor2 === 'string' ? d.phoneBgColor2 : bgColor);
              const phoneBgAngle = (typeof d.phoneBgAngle === 'number' ? d.phoneBgAngle : 135);
              const phoneBgType = (d.phoneBgType === 'solid' ? 'solid' : 'gradient') as 'solid' | 'gradient';
              const palette = (typeof d.palette === 'string' ? d.palette : 'green');
              const nameFontSize = (typeof d.nameFontSize === 'number' ? d.nameFontSize : 22);
              const bodyFontSize = (typeof d.bodyFontSize === 'number' ? d.bodyFontSize : 11);
              const boldHeadings = (typeof d.boldHeadings === 'boolean' ? d.boldHeadings : true);
              const cardRadius = (typeof d.cardRadius === 'number' ? d.cardRadius : 16);

              const phoneBgStyle = phoneBgPreset === 'custom'
                ? (phoneBgType === 'gradient'
                  ? `linear-gradient(${phoneBgAngle}deg, ${phoneBgColor1} 0%, ${phoneBgColor2} 100%)`
                  : phoneBgColor1)
                : (DESIGN_WALLPAPER_STYLES[phoneBgPreset] || `linear-gradient(${phoneBgAngle}deg, ${phoneBgColor1} 0%, ${phoneBgColor2} 100%)`);

              const fontFamily = DESIGN_FONT_FAMILY[fontKey] ?? DESIGN_FONT_FAMILY.inter;

              const PALETTE_HERO_MAP: Record<string, string> = {
                'medical-teal': 'wave-panel', 'teamwork-orange': 'side-panel',
                'heritage-gold': 'wave-panel', 'team-pro': 'group-diagonal',
                'royal-purple': 'circle-overlap', 'minimal-mono': 'circle-center',
                'sunset-banner': 'top-banner', 'sky-circle': 'circle-overlap',
                'onyx-pro': 'default', 'mocha-torn': 'torn-edge',
              };

              const themeForPreview: Partial<ThemeOverride> = {
                green: accent,
                greenLight: accentLight,
                bg: bgColor,
                card: cardColor,
                cardBorder: `${accent}33`,
                textPrimary,
                textMuted,
                divider: `${accent}1f`,
                muted: `${accent}55`,
                fontFamily,
                nameFontSize,
                bodyFontSize,
                boldHeadings,
                cardRadius,
                phoneBgStyle,
                heroLayout: PALETTE_HERO_MAP[palette] ?? 'default',
              };

              const designKey = designCacheKeyForEditor(cardId, resolvedCardId, allowFallbackToFirstCard);
              const cachePayload = {
                ...d,
                ...themeForPreview,
                accentColor: accent,
                accentLight,
                bgColor,
                cardColor,
                textPrimary,
                textMuted,
                font: fontKey,
                phoneBgPreset,
                phoneBgColor1,
                phoneBgColor2,
                phoneBgAngle,
                phoneBgType,
                palette,
                nameFontSize,
                bodyFontSize,
                boldHeadings,
                cardRadius,
              };
              saveThemeOverride(designKey, cachePayload as any);
              setThemeOverride(prev => ({ ...prev, ...themeForPreview }));

              // Persist to backend so the published /[slug] page uses the template's design
              if (resolvedCardId) {
                updateCardDesign(resolvedCardId, {
                  palette,
                  accentColor: accent,
                  accentLight,
                  bgColor,
                  cardColor,
                  textPrimary,
                  textMuted,
                  phoneBgPreset,
                  phoneBgColor1,
                  phoneBgColor2,
                  phoneBgAngle,
                  phoneBgType,
                  font: fontKey,
                  nameFontSize,
                  bodyFontSize,
                  boldHeadings,
                  cardRadius,
                  shadowIntensity: (typeof d.shadowIntensity === 'string' ? d.shadowIntensity : 'soft') as any,
                  glowEffect: typeof d.glowEffect === 'boolean' ? d.glowEffect : false,
                }).catch((err) => console.error('Failed to persist template design', err));
              }
            } catch (e) {
              console.error('Failed to apply template design', e);
            }
          }}
        />
      </div>

      {/* PROFILE section */}
      < SectionBlock id="section-profile" title="Profile" icon={User}
        enabled={sections.profile} onToggle={() => toggleSection('profile')
        }
        expanded={expanded.profile} onExpand={() => toggleExpand('profile')}>
        <div className="space-y-4 sm:space-y-5">
          <div className="p-3 sm:p-4 rounded-xl bg-[#0A0A0A] border border-[#008001]/20 space-y-4">
            <ImageUploader value={profileImage} onChange={setProfileImage} label="Profile Photo" ratio="500×625px" roundedClass="rounded-xl" size="w-16 h-16 sm:w-20 sm:h-20" pendingFile={pendingProfileImage} onFileSelect={setPendingProfileImage} />
            <div className="border-t border-[#008001]/10 pt-4">
              <ImageUploader value={brandLogo} onChange={setBrandLogo} label="Brand Logo" ratio="160×80px" roundedClass="rounded-lg" size="w-20 h-12 sm:w-24 sm:h-14" pendingFile={pendingBrandLogo} onFileSelect={setPendingBrandLogo} />
              {brandLogo && (
                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-1">
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#49B618]" />
                    <Label className="text-[#49B618] text-xs font-semibold">Logo Position on Card</Label>
                  </div>
                  <LogoPositionPicker value={logoPosition} onChange={setLogoPosition} />
                </div>
              )}
            </div>
          </div>
          <div>
            <Label className="text-[#A0A0A0] text-xs">Name</Label>
            <Input value={formData.name} onChange={e => updateField('name', e.target.value)} placeholder="Full name" className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-[#A0A0A0] text-xs">Heading (Job Title)</Label>
              <Input value={formData.title} onChange={e => updateField('title', e.target.value)} placeholder="Title" className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" />
            </div>
            <div>
              <Label className="text-[#A0A0A0] text-xs">Subheading (Company)</Label>
              <Input value={formData.company} onChange={e => updateField('company', e.target.value)} placeholder="Company" className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" />
            </div>
          </div>
          <div>
            <Label className="text-[#A0A0A0] text-xs">Tagline / Bio</Label>
            <Textarea value={formData.tagline} onChange={e => updateField('tagline', e.target.value)} placeholder="A short bio..." className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" rows={3} />
          </div>
        </div>
      </SectionBlock >

      {/* HEADING + TEXT */}
      < SectionBlock id="section-headingText" title="Heading + Text" icon={MessageSquare}
        enabled={sections.headingText} onToggle={() => toggleSection('headingText')}
        expanded={expanded.headingText} onExpand={() => toggleExpand('headingText')}>
        <div className="space-y-4">
          <div><Label className="text-[#A0A0A0] text-xs">Heading</Label><Input value={formData.headingText} onChange={e => updateField('headingText', e.target.value)} placeholder="Section heading..." className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" /></div>
          <div><Label className="text-[#A0A0A0] text-xs">Text</Label><Textarea value={formData.bodyText} onChange={e => updateField('bodyText', e.target.value)} placeholder="Description or body text..." className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" rows={4} /></div>
        </div>
      </SectionBlock >

      {/* CONTACT US */}
      < SectionBlock id="section-contactUs" title="Contact Us" icon={Mail}
        enabled={sections.contactUs} onToggle={() => toggleSection('contactUs')}
        expanded={expanded.contactUs} onExpand={() => toggleExpand('contactUs')}>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-[#0D0D0D] border border-[#008001]/20 gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#A0A0A0] mb-1">Floating Button Text</p>
              <Input defaultValue="Add to Contact" className="bg-[#1E1E1E] border-[#008001]/30 text-white h-8 text-sm" />
            </div>
            <button type="button" onClick={() => downloadVCard(formData, profileImage)}
              className="flex-shrink-0 flex items-center gap-2 bg-white text-[#008001] rounded-full px-4 py-2 text-sm font-semibold hover:bg-[#f0f0f0] transition-colors self-end sm:self-auto">
              Add to Contact <Plus className="w-4 h-4" />
            </button>
          </div>
          {([
            { icon: Phone, label: 'Contact Number', field: 'phone' as const, color: '#49B618', placeholder: '+1 (555) 000-0000' },
            { icon: Mail, label: 'Email Address', field: 'email' as const, color: '#008001', placeholder: 'contact@domain.com' },
            { icon: MapPin, label: 'Address', field: 'location' as const, color: '#009200', placeholder: 'City, Country' },
            { icon: Globe, label: 'Website', field: 'website' as const, color: '#006312', placeholder: 'https://...' },
          ]).map(({ icon: Icon, label, field, color, placeholder }) => (
            <div key={field} className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-[#0D0D0D] border border-[#008001]/20">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-[#555] mb-1 uppercase tracking-wider font-medium">{label}</p>
                <Input value={formData[field]} onChange={e => updateField(field, e.target.value)} placeholder={placeholder} className="bg-[#1E1E1E] border-[#008001]/30 text-white h-8 text-sm w-full" />
              </div>
            </div>
          ))}
        </div>
      </SectionBlock >

      {/* BUSINESS DETAILS */}
      < SectionBlock id="section-businessDetails" title="Business Details" icon={Briefcase}
        enabled={sections.businessDetails} onToggle={() => toggleSection('businessDetails')}
        expanded={expanded.businessDetails} onExpand={() => toggleExpand('businessDetails')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><Label className="text-[#A0A0A0] text-xs">Company Name</Label><Input value={formData.company} onChange={e => updateField('company', e.target.value)} className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" /></div>
          <div>
            <Label className="text-[#A0A0A0] text-xs">Industry</Label>
            <Select value={formData.industry} onValueChange={v => updateField('industry', v)}>
              <SelectTrigger className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-[#0D0D0D] border-[#008001]/30">
                {INDUSTRIES.map(({ value, label }) => (<SelectItem key={value} value={value} className="text-white focus:bg-[#008001]/20 focus:text-white">{label}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div><Label className="text-[#A0A0A0] text-xs">Year Founded</Label><Input type="text" inputMode="numeric" pattern="[0-9]{0,4}" maxLength={4} placeholder="e.g. 2015" value={formData.yearFounded} onChange={e => { const v = e.target.value.replace(/\D/g, '').slice(0, 4); updateField('yearFounded', v); }} className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" /></div>
          <div><Label className="text-[#A0A0A0] text-xs">Location</Label><Input value={formData.location} onChange={e => updateField('location', e.target.value)} className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" /></div>
        </div>
      </SectionBlock >

      {/* SOCIAL LINKS */}
      < SectionBlock id="section-socialLinks" title="Social Links" icon={Share2}
        enabled={sections.socialLinks} onToggle={() => toggleSection('socialLinks')}
        expanded={expanded.socialLinks} onExpand={() => toggleExpand('socialLinks')}>
        <div className="space-y-3">
          {socialLinks.map((s, i) => {
            const opt = SOCIAL_OPTIONS[s.platform] ?? SOCIAL_OPTIONS[0]; const Icon = opt.icon;
            return (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-xl bg-[#0D0D0D] border border-[#008001]/20">
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => openSocialLink(s.value, s.platform)} className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${s.value ? 'opacity-100 hover:scale-110 cursor-pointer' : 'opacity-40 cursor-not-allowed'}`} style={{ backgroundColor: `${opt.color}20` }}><Icon className="w-4 h-4" style={{ color: opt.color }} /></button>
                  <Select value={String(s.platform)} onValueChange={v => updateSocial(i, 'platform', Number(v))}>
                    <SelectTrigger className="w-28 bg-[#1E1E1E] border-[#008001]/30 text-white text-xs h-9 flex-shrink-0"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-[#0D0D0D] border-[#008001]/30">
                      {SOCIAL_OPTIONS.map((o, idx) => (<SelectItem key={idx} value={String(idx)} className="text-white focus:bg-[#008001]/20 focus:text-white">{o.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <Input value={s.value} onChange={e => updateSocial(i, 'value', e.target.value)} placeholder={opt.placeholder} className="flex-1 bg-[#1E1E1E] border-[#008001]/30 text-white h-9 text-sm" />
                  <button type="button" onClick={() => removeSocial(i)} className="text-red-400 hover:text-red-300 p-1 flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            );
          })}
          <Button type="button" variant="outline" size="sm" onClick={addSocial} className="border-dashed border-[#008001]/40 text-[#49B618] hover:bg-[#008001]/10 w-full"><Plus className="w-4 h-4 mr-2" />Add Social Link</Button>
        </div>
      </SectionBlock >

      {/* LINKS */}
      < SectionBlock id="section-links" title="Links" icon={Link2}
        enabled={sections.links} onToggle={() => toggleSection('links')}
        expanded={expanded.links} onExpand={() => toggleExpand('links')}>
        <div className="space-y-3">
          {customLinks.map((l, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-xl bg-[#0D0D0D] border border-[#008001]/20">
              <Input value={l.label} onChange={e => updateLink(i, 'label', e.target.value)} placeholder="Label" className="w-full sm:w-32 bg-[#1E1E1E] border-[#008001]/30 text-white h-9 text-sm flex-shrink-0" />
              <div className="flex items-center gap-2 flex-1">
                <Input value={l.url} onChange={e => updateLink(i, 'url', e.target.value)} placeholder="https://..." className="flex-1 bg-[#1E1E1E] border-[#008001]/30 text-white h-9 text-sm" />
                {l.url && (<button type="button" onClick={() => window.open(l.url, '_blank', 'noopener,noreferrer')} className="text-[#49B618] hover:text-white p-1 flex-shrink-0"><Globe className="w-4 h-4" /></button>)}
                <button type="button" onClick={() => removeLink(i)} className="text-red-400 hover:text-red-300 p-1 flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addLink} className="border-dashed border-[#008001]/40 text-[#49B618] hover:bg-[#008001]/10 w-full"><Plus className="w-4 h-4 mr-2" />Add Link</Button>
        </div>
      </SectionBlock >

      {/* APPOINTMENT */}
      < SectionBlock id="section-appointment" title="Appointment / Calendar" icon={Calendar}
        enabled={sections.appointment} onToggle={() => toggleSection('appointment')}
        expanded={expanded.appointment} onExpand={() => toggleExpand('appointment')}>
        <div>
          <Label className="text-[#A0A0A0] text-xs">Booking URL (Calendly, Cal.com, etc.)</Label>
          <div className="flex gap-2 mt-1">
            <Input value={formData.appointmentUrl} onChange={e => updateField('appointmentUrl', e.target.value)} placeholder="https://calendly.com/username" className="flex-1 bg-[#1E1E1E] border-[#008001]/30 text-white" />
            {formData.appointmentUrl && (<Button type="button" size="sm" variant="outline" className="border-[#008001]/30 text-[#49B618] hover:bg-[#008001]/20 flex-shrink-0" onClick={() => window.open(formData.appointmentUrl, '_blank', 'noopener,noreferrer')}><Globe className="w-4 h-4" /></Button>)}
          </div>
        </div>
      </SectionBlock >

      {/* COLLECT CONTACTS */}
      < Card id="section-collectContacts" className="bg-[#000000] border-[#008001]/30 overflow-hidden scroll-mt-4" >
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 min-w-0">
            <GripVertical className="w-4 h-4 text-[#555] cursor-grab flex-shrink-0" />
            <User className="w-4 h-4 text-[#49B618] flex-shrink-0" />
            <span className="font-semibold text-white text-sm truncate">Collect Contacts</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2">
            <Toggle checked={sections.collectContacts} onChange={() => {
              const turningOn = !sections.collectContacts;
              toggleSection('collectContacts');
              if (turningOn && !expanded.collectContacts) toggleExpand('collectContacts');
              if (!turningOn && expanded.collectContacts) toggleExpand('collectContacts');
            }} />
            <button type="button" onClick={() => toggleExpand('collectContacts')} className="w-7 h-7 rounded-md flex items-center justify-center text-[#A0A0A0] hover:text-white hover:bg-[#008001]/20 transition-colors">
              {expanded.collectContacts ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="px-4 sm:px-6 pb-4 -mt-1"><p className="text-xs text-[#555]">Enable this feature to collect your prospects contact details</p></div>
      </Card >

      {
        extraSections.map((section, index) => (
          <ExtraSectionBlock key={section.id || `extra-sec-${index}`} section={section} onToggle={toggleExtra} onRemove={removeExtra} onUpdateData={updateExtraData} />
        ))
      }

      < AddComponentMenu onAdd={handleAddComponent} />

      {/* Action buttons */}
      < div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-8" >
         <Button
           variant="outline"
           className="text-red-400 border-red-500/30 hover:bg-red-500/10 text-sm"
           onClick={() => {
             setFormData(DEFAULT_STATE.formData);
             setSocialLinks(DEFAULT_STATE.socialLinks);
             setCustomLinks(DEFAULT_STATE.customLinks);
             setSections(DEFAULT_STATE.sections);
             setExpanded(DEFAULT_EXPANDED);
             setExtraSections([]);
             setLogoPosition(DEFAULT_STATE.logoPosition);
             setBrandLogo('');
             setProfileImage('');
             setPendingProfileImage(null);
             setPendingBrandLogo(null);
             // Clear the localStorage cache so the reset persists on refresh
             const ck = cacheKeyForEditor(cardId, resolvedCardId, allowFallbackToFirstCard);
             try { localStorage.removeItem(ck); } catch { /* quota */ }
           }}
         >
           <Trash2 className="w-4 h-4 mr-2" />
           Delete Profile
         </Button>
        <div className="flex gap-3">
          <Button onClick={() => {
            void handleSaveChanges();
          }}
            disabled={isSaving}
            className={`flex-1 sm:flex-none text-white text-sm transition-all duration-300 ${saveFlash ? 'bg-[#49B618] hover:bg-[#3a9012]' : 'bg-gradient-to-r from-[#008001] to-[#49B618] hover:from-[#006312] hover:to-[#008001]'}`}>
            {saveFlash ? <Check className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {isSaving ? 'Saving...' : saveFlash ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>
      </div >
      {saveError && <p className="text-xs text-red-400 -mt-6 pb-6">{saveError}</p>}
    </div >
  );

  return (
    <>
      {
        isPreviewOpen && (
          <CardPreviewModal
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            {...sharedPreviewProps}
            onShareLink={hasPublishedUrl ? handleShareLink : undefined}
            onSaveContact={handleSaveContact}
          />
        )
      }
      {
        showQrPopup && (
          <QrPopup
            isOpen={showQrPopup}
            onClose={closeQrPopup}
            cardUrl={qrCardUrl}
            cardId={resolvedCardId}
            allowFallbackToFirstCard={allowFallbackToFirstCard}
          />
        )
      }

      <div className="xl:hidden flex rounded-xl overflow-hidden border border-[#008001]/30 mb-4">
        <button onClick={() => setMobileTab('edit')} className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-all ${mobileTab === 'edit' ? 'bg-[#008001] text-white' : 'bg-[#000000] text-[#A0A0A0] hover:text-white hover:bg-[#008001]/20'}`}>
          <User className="w-4 h-4" /> Edit Profile
        </button>
        <button onClick={() => setMobileTab('preview')} className={`flex-1 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-all ${mobileTab === 'preview' ? 'bg-[#008001] text-white' : 'bg-[#000000] text-[#A0A0A0] hover:text-white hover:bg-[#008001]/20'}`}>
          <Smartphone className="w-4 h-4" /> Preview Card
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 items-start">
        <div className={`xl:col-span-3 ${mobileTab === 'preview' ? 'hidden xl:block' : 'block'}`}>{EditorContent}</div>

        <div className={`xl:col-span-2 xl:sticky xl:top-8 xl:self-start ${mobileTab === 'edit' ? 'hidden xl:block' : 'block'}`}>{PhonePreviewPanel} </div>
        {/* <div className={`xl:col-span-2 xl:sticky xl:top-6 xl:h-fit ${mobileTab === 'edit' ? 'hidden xl:block' : 'block'}`
      }>
          {PhonePreviewPanel}</div> */}
      </div>
    </>
  );
}
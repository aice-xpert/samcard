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
import { PhonePreview, ExtraSection, ThemeOverride, SectionKey } from '@/components/dashboard/pages/PhonePreview';
import  ExtraSectionBlockWithDragDrop from '@/components/dashboard/pages/ExtraSectionBlockWithDragDrop';
import { makeQRMatrix } from '@/components/dashboard/pages/qr-engine';
import { useQrStore } from '@/components/dashboard/stores/Useqrstore';
import {
  getBusinessProfile,
  getCustomLinks,
  getSocialLinks,
  getCardDesign,
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
  sectionOrder: SectionKey[];
  // Single interleaved order for both core sections and extra section IDs.
  // When present, this is the authoritative render order.
  unifiedOrder?: string[];
}

// Section metadata for drag and drop
const SECTION_INFO: Record<SectionKey, { title: string; icon: React.ElementType }> = {
  profile: { title: 'Profile', icon: User },
  headingText: { title: 'Heading + Text', icon: MessageSquare },
  contactUs: { title: 'Contact Us', icon: Mail },
  businessDetails: { title: 'Business Details', icon: Briefcase },
  socialLinks: { title: 'Social Links', icon: Share2 },
  links: { title: 'Links', icon: Link2 },
  appointment: { title: 'Appointment / Calendar', icon: Calendar },
  collectContacts: { title: 'Collect Contacts', icon: Users },
};

// Default section order
const DEFAULT_SECTION_ORDER: SectionKey[] = [
  'profile',
  'headingText',
  'contactUs',
  'businessDetails',
  'socialLinks',
  'links',
  'appointment',
  'collectContacts',
];

// ── Helper to reorder array ──
function reorderArray<T>(arr: T[], from: number, to: number): T[] {
  const newArr = [...arr];
  const [moved] = newArr.splice(from, 1);
  newArr.splice(to, 0, moved);
  return newArr;
}

// ── Constants ─────────────────────────────────────────────────────────────
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
  { key: 'extra-hours', label: 'Business Hours', icon: Calendar, group: 'extra' },
  { key: 'extra-video', label: 'Video', icon: LayoutTemplate, group: 'extra' },
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
  sectionOrder: [...DEFAULT_SECTION_ORDER],
  unifiedOrder: [...DEFAULT_SECTION_ORDER],
};

function normalizeLogoPositionFromApi(value: unknown): LogoPosition {
  if (typeof value !== 'string') return DEFAULT_STATE.logoPosition;
  const raw = value.trim().toLowerCase();
  switch (raw) {
    case 'top-left': case 'top_left': case 'top left': return 'top-left';
    case 'top-right': case 'top_right': case 'top right': return 'top-right';
    case 'below-photo': case 'below_photo': case 'below photo': return 'below-photo';
    case 'below-name': case 'below_name': case 'below name': return 'below-name';
    default: return DEFAULT_STATE.logoPosition;
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
    const sectionOrder = p.sectionOrder ?? DEFAULT_SECTION_ORDER;
    const extraSections = p.extraSections ?? DEFAULT_STATE.extraSections;
    // Reconstruct unifiedOrder: use saved value if present and valid, else fall back
    // to core sections first, then extra sections (legacy behaviour).
    let unifiedOrder: string[];
    if (p.unifiedOrder && p.unifiedOrder.length > 0) {
      // Validate: ensure every core key and extra id is represented exactly once.
      const allIds = new Set([...sectionOrder, ...extraSections.map(s => s.id)]);
      const saved = p.unifiedOrder.filter(id => allIds.has(id));
      const missing = [...allIds].filter(id => !saved.includes(id));
      unifiedOrder = [...saved, ...missing];
    } else {
      unifiedOrder = [...sectionOrder, ...extraSections.map(s => s.id)];
    }
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
      extraSections,
      sectionOrder,
      unifiedOrder,
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

// ── Add a Component dropdown ─────────────────────────────────────────────────
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

// ── ImageUploader ─────────────────────────────────────────────────────────────
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

// ── Draggable Section Component ─────────────────────────────────────────────
interface DraggableSectionBlockProps {
  id: string;
  sectionKey: SectionKey;
  title: string;
  icon: React.ElementType;
  enabled: boolean;
  onToggle: () => void;
  expanded: boolean;
  onExpand: () => void;
  children: React.ReactNode;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  isDragging?: boolean;
}

function DraggableSectionBlock({
  id,
  title,
  icon: Icon,
  enabled,
  onToggle,
  expanded,
  onExpand,
  children,
  dragHandleProps,
  isDragging,
}: DraggableSectionBlockProps) {
  const handleToggle = () => {
    const turningOn = !enabled;
    onToggle();
    if (turningOn && !expanded) onExpand();
    if (!turningOn && expanded) onExpand();
  };

  return (
    <Card
      id={id}
      className={`bg-[#000000] border-[#008001]/30 overflow-hidden scroll-mt-4 transition-all duration-200 ${
        isDragging ? 'opacity-50 shadow-2xl scale-[1.02]' : ''
      }`}
      style={{ cursor: 'default' }}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#008001]/20">
        <div className="flex items-center gap-2 min-w-0">
          <div
            {...dragHandleProps}
            className="cursor-grab active:cursor-grabbing p-1 -ml-1 rounded-md hover:bg-[#008001]/20 transition-colors"
            style={{ touchAction: 'none' }}
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4 text-[#555] cursor-grab active:cursor-grabbing flex-shrink-0" />
          </div>
          <Icon className="w-4 h-4 text-[#49B618] flex-shrink-0" />
          <span className="font-semibold text-white text-sm truncate">{title}</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2">
          <Toggle checked={enabled} onChange={handleToggle} />
          <button
            type="button"
            onClick={onExpand}
            className="w-7 h-7 rounded-md flex items-center justify-center text-[#A0A0A0] hover:text-white hover:bg-[#008001]/20 transition-colors"
          >
            {expanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
      </div>
      {expanded && <CardContent className="p-4 sm:p-6">{children}</CardContent>}
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
  onContentChange?: (content: CardContentPayload & { sectionOrder?: SectionKey[] }) => void;
  allowFallbackToFirstCard?: boolean;
}) {
  const [initial] = useState(() => loadCache(cacheKeyForEditor(cardId, undefined, allowFallbackToFirstCard)));
  const [resolvedCardId, setResolvedCardId] = useState<string | undefined>(cardId);
  const activeDesignCacheKey = designCacheKeyForEditor(cardId, resolvedCardId, allowFallbackToFirstCard);
  const shouldPersistGlobalProfile = !cardId && allowFallbackToFirstCard;

  // Section order for core sections (kept for API/cache compatibility)
  const [sectionOrder, setSectionOrder] = useState<SectionKey[]>(initial.sectionOrder);
  // Extra sections state
  const [extraSections, setExtraSections] = useState<ExtraSection[]>(initial.extraSections);
  // SINGLE authoritative render order — holds both core SectionKey strings and extra section IDs interleaved.
  const [unifiedOrder, setUnifiedOrder] = useState<string[]>(
    initial.unifiedOrder ?? [...initial.sectionOrder, ...initial.extraSections.map(s => s.id)]
  );

  // Drag state — one flat index into unifiedOrder
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const draggedIndexRef = useRef<number | null>(null);
  const dragOverIndexRef = useRef<number | null>(null);
  // Snapshot of unifiedOrder captured at drag-start to avoid stale closures
  const unifiedOrderSnapshotRef = useRef<string[]>([]);

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

  // ── Drag handlers operating on unifiedOrder ───────────────────────────────
  const handleDragStart = useCallback((index: number) => {
    // Snapshot the current unifiedOrder at drag-start to avoid stale closure in handleDragEnd
    setUnifiedOrder(latest => { unifiedOrderSnapshotRef.current = latest; return latest; });
    setDraggedIndex(index);
    draggedIndexRef.current = index;
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndexRef.current === null || draggedIndexRef.current === index) return;
    setDragOverIndex(index);
    dragOverIndexRef.current = index;
  }, []);

  const handleDragEnd = useCallback(() => {
    const from = draggedIndexRef.current;
    const to = dragOverIndexRef.current;

    if (from !== null && to !== null && from !== to) {
      const snapshot = unifiedOrderSnapshotRef.current;
      const reordered = reorderArray(snapshot, from, to);

      // Derive sectionOrder (core keys only, in their new positions) and keep extraSections data
      const newSectionOrder = reordered.filter(id =>
        DEFAULT_SECTION_ORDER.includes(id as SectionKey)
      ) as SectionKey[];

      setUnifiedOrder(reordered);
      setSectionOrder(newSectionOrder);
      // extraSections data doesn't change — only their position in unifiedOrder changes

      // Persist
      const cacheKey = cacheKeyForEditor(cardId, resolvedCardId, allowFallbackToFirstCard);
      const currentCache = loadCache(cacheKey);
      saveCacheForKey(
        { ...currentCache, unifiedOrder: reordered, sectionOrder: newSectionOrder },
        cacheKey
      );
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
    draggedIndexRef.current = null;
    dragOverIndexRef.current = null;
  }, [cardId, resolvedCardId, allowFallbackToFirstCard]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // Only clear when pointer truly leaves the draggable container (not just skims a child).
    const related = e.relatedTarget as Node | null;
    if (related && (e.currentTarget as Node).contains(related)) return;
    setDragOverIndex(null);
    dragOverIndexRef.current = null;
  }, []);



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
  const previewSectionOrder = useDeferredValue(sectionOrder);
  const previewUnifiedOrder = useDeferredValue(unifiedOrder);

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
    setSectionOrder(cached.sectionOrder);
    setUnifiedOrder(cached.unifiedOrder ?? [...cached.sectionOrder, ...cached.extraSections.map(s => s.id)]);
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
      if (profile.shareUrl) {
        setProfileShareUrl(prev => prev || profile.shareUrl!);
      }

      if (shouldPersistGlobalProfile) {
        setProfileImage(profile.profileImageUrl || initial.profileImage);
        setBrandLogo(profile.brandLogoUrl || initial.brandLogo);
        setLogoPosition(normalizeLogoPositionFromApi(profile.logoPosition));
      }

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
      if (mappedSocials.length > 0) setSocialLinks(mappedSocials);
    }

    if (customResult.status === 'fulfilled' && shouldPersistGlobalProfile) {
      const mappedLinks = customResult.value.map(link => ({
        label: link.label || '',
        url: link.url || '',
      }));
      if (mappedLinks.length > 0) setCustomLinks(mappedLinks);
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
        setSectionOrder(fallback.sectionOrder);
        setUnifiedOrder(fallback.unifiedOrder ?? [...fallback.sectionOrder, ...fallback.extraSections.map(s => s.id)]);
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

      // ── Restore drag-and-drop order from the API ────────────────────────────
      // The backend now persists sectionOrder and unifiedOrder. Restore them so
      // the editor immediately reflects the saved drag order on every page load.
      // Falls back gracefully for old records that pre-date this feature.
      const apiSectionOrder = Array.isArray(content.sectionOrder) && content.sectionOrder.length > 0
        ? (content.sectionOrder as SectionKey[])
        : null;

      if (apiSectionOrder) {
        setSectionOrder(apiSectionOrder);
      }

      const apiUnifiedOrder = Array.isArray(content.unifiedOrder) && content.unifiedOrder.length > 0
        ? (content.unifiedOrder as string[])
        : null;

      if (apiUnifiedOrder) {
        setUnifiedOrder(apiUnifiedOrder);
      } else if (apiSectionOrder) {
        // Fallback: core order + extra section IDs appended at the end
        const extraIds = ((content.extraSections ?? []) as ExtraSection[]).map(s => s.id);
        setUnifiedOrder([...apiSectionOrder, ...extraIds]);
      }
      // ── End restore ─────────────────────────────────────────────────────────

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
      if (!eventKey || eventKey === activeDesignCacheKey) refresh();
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

  useEffect(() => {
    if (!onContentChange) return;
    console.log('[BusinessProfile] sectionOrder:', sectionOrder);
    console.log('[BusinessProfile] unifiedOrder:', unifiedOrder);
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
      sectionOrder,
      unifiedOrder,
    });
  }, [onContentChange, profileImage, brandLogo, logoPosition, formData, socialLinks, connectFields, sections, customLinks, extraSections, sectionOrder, unifiedOrder]);

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
      { 
        profileImage: updatedProfileImage, 
        brandLogo: updatedBrandLogo, 
        logoPosition, 
        formData, 
        socialLinks, 
        connectFields, 
        sections, 
        expanded, 
        customLinks, 
        extraSections, 
        sectionOrder,
        unifiedOrder,
      },
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
          sectionOrder,
          unifiedOrder,
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
  }, [profileImage, brandLogo, pendingProfileImage, pendingBrandLogo, logoPosition, formData, socialLinks, connectFields, sections, expanded, customLinks, extraSections, sectionOrder, unifiedOrder, cardId, resolvedCardId, allowFallbackToFirstCard, shouldPersistGlobalProfile]);

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
      const newId = `${key}-${Date.now()}`;
      const ns: ExtraSection = { 
        id: newId, 
        type: key, 
        label: comp?.label ?? key, 
        enabled: true, 
        expanded: true, 
        data: {} 
      };
      setExtraSections(prev => [...prev, ns]);
      // Append new extra section id to the end of unifiedOrder
      setUnifiedOrder(prev => [...prev, newId]);
      setTimeout(() => document.getElementById(ns.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
    } else {
      setSections(prev => ({ ...prev, [key as keyof Sections]: true }));
      setExpanded(prev => ({ ...prev, [key as keyof Expanded]: true }));
      
      setUnifiedOrder(prev =>
        prev.includes(key) ? prev : [...prev, key]
      );
      setSectionOrder(prev =>
        prev.includes(key as SectionKey) ? prev : [...prev, key as SectionKey]
      );
      setTimeout(() => document.getElementById(`section-${key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
    }
  }, []);

  const updateExtraData = useCallback((id: string, field: string, value: string) => {
    setExtraSections(prev => prev.map(s => 
      s.id === id ? { ...s, data: { ...s.data, [field]: value } } : s
    ));
  }, []);

  const toggleExtra = useCallback((id: string, field: 'enabled' | 'expanded') => {
    setExtraSections(prev => prev.map(s => 
      s.id === id ? { ...s, [field]: !s[field] } : s
    ));
  }, []);

  const removeExtra = useCallback((id: string) => {
    setExtraSections(prev => prev.filter(s => s.id !== id));
    setUnifiedOrder(prev => prev.filter(item => item !== id));
  }, []);

  // Render main draggable section
  const renderDraggableSection = useCallback((sectionKey: SectionKey, index: number) => {
    const info = SECTION_INFO[sectionKey];
    if (!info) return null;

    const isEnabled = sections[sectionKey];
    const isExpanded = expanded[sectionKey];
    const sectionId = `section-${sectionKey}`;
    const isBeingDragged = draggedIndex === index;
    const isDragOver = dragOverIndex === index && draggedIndex !== null && draggedIndex !== index;

    let content = null;
    switch (sectionKey) {
      case 'profile':
        content = (
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
            <div><Label className="text-[#A0A0A0] text-xs">Name</Label><Input value={formData.name} onChange={e => updateField('name', e.target.value)} placeholder="Full name" className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label className="text-[#A0A0A0] text-xs">Heading (Job Title)</Label><Input value={formData.title} onChange={e => updateField('title', e.target.value)} placeholder="Title" className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" /></div>
              <div><Label className="text-[#A0A0A0] text-xs">Subheading (Company)</Label><Input value={formData.company} onChange={e => updateField('company', e.target.value)} placeholder="Company" className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" /></div>
            </div>
            <div><Label className="text-[#A0A0A0] text-xs">Tagline / Bio</Label><Textarea value={formData.tagline} onChange={e => updateField('tagline', e.target.value)} placeholder="A short bio..." className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" rows={3} /></div>
          </div>
        );
        break;
      case 'headingText':
        content = (
          <div className="space-y-4">
            <div><Label className="text-[#A0A0A0] text-xs">Heading</Label><Input value={formData.headingText} onChange={e => updateField('headingText', e.target.value)} placeholder="Section heading..." className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" /></div>
            <div><Label className="text-[#A0A0A0] text-xs">Text</Label><Textarea value={formData.bodyText} onChange={e => updateField('bodyText', e.target.value)} placeholder="Description or body text..." className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" rows={4} /></div>
          </div>
        );
        break;
      case 'contactUs':
        content = (
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
            {[
              { icon: Phone, label: 'Contact Number', field: 'phone' as const, color: '#49B618', placeholder: '+1 (555) 000-0000' },
              { icon: Mail, label: 'Email Address', field: 'email' as const, color: '#008001', placeholder: 'contact@domain.com' },
              { icon: MapPin, label: 'Address', field: 'location' as const, color: '#009200', placeholder: 'City, Country' },
              { icon: Globe, label: 'Website', field: 'website' as const, color: '#006312', placeholder: 'https://...' },
            ].map(({ icon: Icon, label, field, color, placeholder }) => (
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
        );
        break;
      case 'businessDetails':
        content = (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><Label className="text-[#A0A0A0] text-xs">Company Name</Label><Input value={formData.company} onChange={e => updateField('company', e.target.value)} className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" /></div>
            <div><Label className="text-[#A0A0A0] text-xs">Industry</Label><Select value={formData.industry} onValueChange={v => updateField('industry', v)}><SelectTrigger className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white"><SelectValue /></SelectTrigger><SelectContent className="bg-[#0D0D0D] border-[#008001]/30">{INDUSTRIES.map(({ value, label }) => (<SelectItem key={value} value={value} className="text-white focus:bg-[#008001]/20 focus:text-white">{label}</SelectItem>))}</SelectContent></Select></div>
            <div><Label className="text-[#A0A0A0] text-xs">Year Founded</Label><Input type="text" inputMode="numeric" pattern="[0-9]{0,4}" maxLength={4} placeholder="e.g. 2015" value={formData.yearFounded} onChange={e => { const v = e.target.value.replace(/\D/g, '').slice(0, 4); updateField('yearFounded', v); }} className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" /></div>
            <div><Label className="text-[#A0A0A0] text-xs">Location</Label><Input value={formData.location} onChange={e => updateField('location', e.target.value)} className="mt-1 bg-[#1E1E1E] border-[#008001]/30 text-white" /></div>
          </div>
        );
        break;
      case 'socialLinks':
        content = (
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
        );
        break;
      case 'links':
        content = (
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
        );
        break;
      case 'appointment':
        content = (
          <div>
            <Label className="text-[#A0A0A0] text-xs">Booking URL (Calendly, Cal.com, etc.)</Label>
            <div className="flex gap-2 mt-1">
              <Input value={formData.appointmentUrl} onChange={e => updateField('appointmentUrl', e.target.value)} placeholder="https://calendly.com/username" className="flex-1 bg-[#1E1E1E] border-[#008001]/30 text-white" />
              {formData.appointmentUrl && (<Button type="button" size="sm" variant="outline" className="border-[#008001]/30 text-[#49B618] hover:bg-[#008001]/20 flex-shrink-0" onClick={() => window.open(formData.appointmentUrl, '_blank', 'noopener,noreferrer')}><Globe className="w-4 h-4" /></Button>)}
            </div>
          </div>
        );
        break;
      case 'collectContacts':
        content = <div><p className="text-xs text-[#555]">Enable this feature to collect your prospects contact details</p></div>;
        break;
    }

    return (
      <div
        key={sectionKey}
        draggable
        onDragStart={() => handleDragStart(index)}
        onDragOver={(e) => handleDragOver(e, index)}
        onDragEnd={handleDragEnd}
        onDragLeave={handleDragLeave}
        className={`transition-all duration-200 ${isDragOver ? 'border-t-2 border-t-[#49B618]' : ''}`}
        style={{ cursor: 'grab' }}
      >
        <DraggableSectionBlock
          id={sectionId}
          sectionKey={sectionKey}
          title={info.title}
          icon={info.icon}
          enabled={isEnabled}
          onToggle={() => toggleSection(sectionKey)}
          expanded={isExpanded}
          onExpand={() => toggleExpand(sectionKey)}
          dragHandleProps={{ onMouseDown: (e) => e.stopPropagation(), onTouchStart: (e) => e.stopPropagation() }}
          isDragging={isBeingDragged}
        >
          {content}
        </DraggableSectionBlock>
      </div>
    );
  }, [sections, expanded, profileImage, brandLogo, logoPosition, formData, socialLinks, customLinks, pendingProfileImage, pendingBrandLogo, updateField, toggleSection, toggleExpand, updateSocial, removeSocial, updateLink, removeLink, addSocial, addLink, handleDragStart, handleDragOver, handleDragEnd, handleDragLeave, draggedIndex, dragOverIndex]);

  // Render all sections (core + extra) in the single interleaved unifiedOrder.
  // Each item gets its flat index into unifiedOrder so drag events share one index space.
  const renderAllSections = useMemo(() => {
    return unifiedOrder.map((id, index) => {
      const isBeingDragged = draggedIndex === index;
      const isDragOver = dragOverIndex === index && draggedIndex !== null && draggedIndex !== index;
      const wrapperClass = `transition-all duration-200 ${isDragOver ? 'border-t-2 border-t-[#49B618]' : ''}`;

      // Core section?
      if (DEFAULT_SECTION_ORDER.includes(id as SectionKey)) {
        const sectionKey = id as SectionKey;
        // Delegate to renderDraggableSection — pass the flat index
        const rendered = renderDraggableSection(sectionKey, index);
        if (!rendered) return null;
        // renderDraggableSection already wraps with the drag div, so return as-is
        return rendered;
      }

      // Extra section
      const section = extraSections.find(s => s.id === id);
      if (!section) return null;

      return (
        <div
          key={section.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          onDragLeave={handleDragLeave}
          className={wrapperClass}
          style={{ cursor: 'grab' }}
        >
          <ExtraSectionBlockWithDragDrop
            section={section}
            index={index}
            onToggle={toggleExtra}
            onRemove={removeExtra}
            onUpdateData={updateExtraData}
            dragHandleProps={{
              onMouseDown: (e) => e.stopPropagation(),
              onTouchStart: (e) => e.stopPropagation(),
            }}
            isDragging={isBeingDragged}
          />
        </div>
      );
    });
  }, [unifiedOrder, extraSections, draggedIndex, dragOverIndex, renderDraggableSection, handleDragStart, handleDragOver, handleDragEnd, handleDragLeave, toggleExtra, removeExtra, updateExtraData]);

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
    sectionOrder: previewSectionOrder,
    unifiedOrder: previewUnifiedOrder,
  }), [previewResolvedCardId, profileShareUrl, previewProfileImage, previewBrandLogo, previewLogoPosition, previewFormData, previewSocialLinks, previewCustomLinks, previewExtraSections, previewSections, previewExpanded, previewSavedContact, previewCopied, previewThemeOverride, previewSectionOrder, previewUnifiedOrder]);

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
      <Card className="bg-gradient-to-br from-[#000000] to-[#008001]/10 border-[#008001]/30">
        <CardContent className="p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <div className="relative group flex-shrink-0 self-center sm:self-start">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden ring-4 ring-[#008001]/30 bg-[#1E1E1E] flex items-center justify-center">
                {profileImage ? <Image src={profileImage} alt="Profile" fill className="object-cover" /> : <User className="w-10 h-10 text-[#333]" />}
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
                <Button size="sm" className="bg-gradient-to-r from-[#008001] to-[#49B618] hover:from-[#006312] hover:to-[#008001] text-white text-xs h-8" onClick={openPreview}><Eye className="w-3.5 h-3.5 mr-1.5" />Preview</Button>
                <Button variant="outline" size="sm" className="border-[#008001]/30 text-[#A0A0A0] hover:text-white hover:bg-[#008001]/20 text-xs h-8 disabled:opacity-35 disabled:cursor-not-allowed" onClick={handleShareLink} disabled={!hasPublishedUrl} title={!hasPublishedUrl ? 'Publish your card first to share the link' : undefined}>
                  {copied ? <Check className="w-3.5 h-3.5 mr-1.5 text-[#49B618]" /> : <Share2 className="w-3.5 h-3.5 mr-1.5" />}
                  {copied ? 'Copied!' : 'Share'}
                </Button>
                <Button variant="outline" size="sm" className="border-[#008001]/30 text-[#A0A0A0] hover:text-white hover:bg-[#008001]/20 text-xs h-8 disabled:opacity-35 disabled:cursor-not-allowed" onClick={openQrPopup} disabled={!hasPublishedUrl} title={!hasPublishedUrl ? 'Publish your card first to view the QR code' : undefined}>
                  <QrCode className="w-3.5 h-3.5 mr-1.5" />QR Code
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {renderAllSections}

      <AddComponentMenu onAdd={handleAddComponent} />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-8">
        <Button variant="outline" className="text-red-400 border-red-500/30 hover:bg-red-500/10 text-sm" onClick={() => {
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
          setSectionOrder(DEFAULT_SECTION_ORDER);
          setUnifiedOrder([...DEFAULT_SECTION_ORDER]);
          const ck = cacheKeyForEditor(cardId, resolvedCardId, allowFallbackToFirstCard);
          try { localStorage.removeItem(ck); } catch { /* quota */ }
        }}><Trash2 className="w-4 h-4 mr-2" />Delete Profile</Button>
        <div className="flex gap-3">
          <Button onClick={() => { void handleSaveChanges(); }} disabled={isSaving}
            className={`flex-1 sm:flex-none text-white text-sm transition-all duration-300 ${saveFlash ? 'bg-[#49B618] hover:bg-[#3a9012]' : 'bg-gradient-to-r from-[#008001] to-[#49B618] hover:from-[#006312] hover:to-[#008001]'}`}>
            {saveFlash ? <Check className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {isSaving ? 'Saving...' : saveFlash ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>
      </div>
      {saveError && <p className="text-xs text-red-400 -mt-6 pb-6">{saveError}</p>}
    </div>
  );

  return (
    <>
      {isPreviewOpen && (
        <CardPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          {...sharedPreviewProps}
          onShareLink={hasPublishedUrl ? handleShareLink : undefined}
          onSaveContact={handleSaveContact}
        />
      )}
      {showQrPopup && (
        <QrPopup
          isOpen={showQrPopup}
          onClose={closeQrPopup}
          cardUrl={qrCardUrl}
          cardId={resolvedCardId}
          allowFallbackToFirstCard={allowFallbackToFirstCard}
        />
      )}

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
        <div className={`xl:col-span-2 xl:sticky xl:top-8 xl:self-start ${mobileTab === 'edit' ? 'hidden xl:block' : 'block'}`}>{PhonePreviewPanel}</div>
      </div>
    </>
  );
}
"use client";
import { useEffect, useId, useState, useCallback } from 'react';
import {
  X, Mail, Phone, Globe, MapPin,
  Linkedin, Instagram, Twitter, Facebook, Youtube,
  Share2, Link2, Calendar, Check,
  Video as VideoIcon, ChevronRight, MessageSquare, Briefcase,
} from 'lucide-react';
import { Button } from '@/components/dashboard/ui/button';

// ── Types ──────────────────────────────────────────────────────────
export type LogoPosition = 'top-left' | 'top-right' | 'below-photo' | 'below-name';

export type SectionKey = 
  | 'profile'
  | 'headingText'
  | 'contactUs'
  | 'businessDetails'
  | 'socialLinks'
  | 'links'
  | 'appointment'
  | 'collectContacts';

interface SocialLink { platform: number; value: string; }
interface CustomLink { label: string; url: string; }

export interface ExtraSection {
  id: string; type: string; label: string;
  enabled: boolean; expanded: boolean;
  data: Record<string, string | { label: string; url: string }[]>;
}

interface Sections {
  profile: boolean; headingText: boolean; contactUs: boolean;
  socialLinks: boolean; links: boolean; appointment: boolean; collectContacts: boolean;
  businessDetails: boolean;
}

export interface ThemeOverride {
  green: string;
  greenLight: string;
  bg: string;
  card: string;
  cardBorder: string;
  textPrimary: string;
  textMuted: string;
  divider: string;
  muted: string;
  fontFamily: string;
  nameFontSize: number;
  bodyFontSize: number;
  boldHeadings: boolean;
  cardRadius: number;
  phoneBgStyle?: string;
}

export interface CardPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardId?: string;
  profileImage: string;
  brandLogo?: string;
  logoPosition?: LogoPosition;
  formData: {
    name: string; title: string; company: string; tagline: string;
    email: string; phone: string; website: string; location: string;
    headingText?: string; bodyText?: string; appointmentUrl?: string;
    industry?: string; yearFounded?: string;
  };
  socialLinks?: SocialLink[];
  customLinks?: CustomLink[];
  extraSections?: ExtraSection[];
  sections?: Sections;
  savedContact?: boolean;
  copied?: boolean;
  onShareLink?: () => void;
  onSaveContact?: () => void;
  themeOverride?: Partial<ThemeOverride>;
  sectionOrder?: SectionKey[];
  // Interleaved order of both core SectionKeys and extra section IDs.
  unifiedOrder?: string[];
}

// ── Social config ──────────────────────────────────────────────────
const SOCIAL_OPTIONS = [
  { icon: Linkedin, name: 'LinkedIn', color: '#0A66C2', baseUrl: 'https://linkedin.com/in/' },
  { icon: Instagram, name: 'Instagram', color: '#E1306C', baseUrl: 'https://instagram.com/' },
  { icon: Twitter, name: 'Twitter', color: '#1DA1F2', baseUrl: 'https://twitter.com/' },
  { icon: Facebook, name: 'Facebook', color: '#1877F2', baseUrl: 'https://facebook.com/' },
  { icon: Youtube, name: 'YouTube', color: '#FF0000', baseUrl: 'https://youtube.com/' },
] as const;

const CONTACT_CONFIG = [
  { key: 'phone', icon: Phone, label: 'Call Us', hrefFn: (v: string) => `tel:${v}` },
  { key: 'email', icon: Mail, label: 'Email', hrefFn: (v: string) => `mailto:${v}` },
  { key: 'location', icon: MapPin, label: 'Address', hrefFn: (v: string) => `https://maps.google.com/?q=${encodeURIComponent(v)}` },
  { key: 'website', icon: Globe, label: 'Website', hrefFn: (v: string) => v },
] as const;

// ── Default Theme ──────────────────────────────────────────────────
const DEFAULT_T: ThemeOverride = {
  bg: '#0a0f0a',
  card: '#111a11',
  cardBorder: 'rgba(0,128,1,0.2)',
  green: '#008001',
  greenLight: '#49B618',
  muted: '#3a4a3a',
  textPrimary: '#f0f0f0',
  textMuted: '#7a9a7a',
  divider: 'rgba(0,128,1,0.12)',
  fontFamily: 'inherit',
  nameFontSize: 22,
  bodyFontSize: 11,
  boldHeadings: true,
  cardRadius: 16,
};

// Default section order (fallback)
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

function resolveSocialUrl(value: string, platform: number): string {
  if (!value.trim()) return '';
  let url = value.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    const base = SOCIAL_OPTIONS[platform]?.baseUrl ?? 'https://';
    url = base + url.replace(/^@/, '');
  }
  return url;
}

function openLink(url: string) {
  if (!url) return;
  const u = url.startsWith('http') ? url : `https://${url}`;
  window.open(u, '_blank', 'noopener,noreferrer');
}

function str(data: Record<string, string | { label: string; url: string }[]>, key: string): string {
  const v = data[key];
  return typeof v === 'string' ? v : '';
}

// ── Brand Logo Badge ───────────────────────────────────────────────
function BrandLogoBadge({
  src, alt = 'Brand', bg = 'rgba(0,0,0,0.55)', blur = true,
  maxSize = 52, padding = '4px', borderRadius = 10, border,
}: {
  src: string; alt?: string; bg?: string; blur?: boolean;
  maxSize?: number; padding?: string; borderRadius?: number; border?: string;
}) {
  return (
    <div style={{
      display: 'inline-block', padding, borderRadius, background: bg,
      lineHeight: 0, flexShrink: 0,
      ...(blur ? { backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' } : {}),
      ...(border ? { border } : {}),
    }}>
      <img src={src} alt={alt} style={{
        display: 'block', maxWidth: maxSize, maxHeight: maxSize,
        width: 'auto', height: 'auto', objectFit: 'contain',
        borderRadius: Math.max(0, borderRadius - 4),
      }} />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────
function CardBlock({ children, T }: { children: React.ReactNode; T: ThemeOverride }) {
  return (
    <div className="mx-3 mb-2.5 overflow-hidden"
      style={{ background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: T.cardRadius }}>
      {children}
    </div>
  );
}

function SectionHeader({ icon, title, T }: { icon: React.ReactNode; title: string; T: ThemeOverride }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5" style={{ borderBottom: `1px solid ${T.divider}` }}>
      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `linear-gradient(135deg,${T.green},${T.greenLight})` }}>
        {icon}
      </div>
      <span style={{ fontWeight: T.boldHeadings ? 700 : 500, fontSize: T.bodyFontSize, color: T.textPrimary, fontFamily: T.fontFamily }}>
        {title}
      </span>
    </div>
  );
}

function Divider({ T }: { T: ThemeOverride }) {
  return <div style={{ height: 1, background: T.divider, margin: '0 16px' }} />;
}

// ── Section Components ─────────────────────────────────────────────

function ProfileSection({ T, profileImage, formData, brandLogo, logoPosition, hasBrandLogo, hasProfileImage, contactItems }: any) {
  return (
    <>
      <div className="relative" style={{ aspectRatio: '4/3', maxHeight: '240px', overflow: 'hidden' }}>
        {hasProfileImage ? (
          <img src={profileImage} alt={formData.name} className="w-full h-full object-contain object-center" />
        ) : (
          <div className="w-full h-full"
            style={{ background: `linear-gradient(160deg, ${T.muted} 0%, ${T.card} 100%)` }} />
        )}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.75) 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, transparent, ${T.green}, ${T.greenLight}, ${T.green}, transparent)` }} />
        {hasBrandLogo && logoPosition === 'top-left' && (
          <div className="absolute top-3 left-3 z-10">
            <BrandLogoBadge src={brandLogo!} maxSize={48} padding="5px" borderRadius={10} />
          </div>
        )}
        {hasBrandLogo && logoPosition === 'top-right' && (
          <div className="absolute top-3 right-3 z-10">
            <BrandLogoBadge src={brandLogo!} maxSize={48} padding="5px" borderRadius={10} />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 z-10">
          <h1 style={{ fontWeight: T.boldHeadings ? 800 : 600, fontSize: T.nameFontSize, lineHeight: 1.2, color: '#fff', textShadow: '0 1px 8px rgba(0,0,0,0.7)', fontFamily: T.fontFamily, wordBreak: 'break-all', overflowWrap: 'break-word' }}>
            {formData.name}
          </h1>
          {formData.title && <p style={{ fontSize: T.bodyFontSize, marginTop: 2, color: T.greenLight, fontFamily: T.fontFamily, wordBreak: 'break-all', overflowWrap: 'break-word' }}>{formData.title}</p>}

          {hasBrandLogo && logoPosition === 'below-name' && (
            <div className="flex justify-center mt-1">
              <BrandLogoBadge src={brandLogo!} bg="rgba(0,0,0,0.45)" blur={false} maxSize={22} padding="2px 4px" borderRadius={5} />
            </div>
          )}

          {formData.company && (
            <div className="flex items-center gap-1.5 mt-0.5 justify-center">
              <p style={{ fontSize: T.bodyFontSize, color: 'rgba(255,255,255,0.65)', fontFamily: T.fontFamily, wordBreak: 'break-all', overflowWrap: 'break-word' }}>{formData.company}</p>
            </div>
          )}
        </div>
      </div>

      {hasBrandLogo && logoPosition === 'below-photo' && (
        <div className="flex justify-center py-2.5">
          <BrandLogoBadge src={brandLogo!} bg={T.card} blur={false} maxSize={80} padding="8px 12px" borderRadius={12} border={`1px solid ${T.cardBorder}`} />
        </div>
      )}

      {formData.tagline && (
        <div className="px-4 py-2.5 text-center">
          <p style={{ fontSize: T.bodyFontSize, fontStyle: 'italic', lineHeight: 1.5, color: T.textMuted, fontFamily: T.fontFamily, wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{formData.tagline}</p>
        </div>
      )}

      {contactItems.length > 0 && (
        <div className="flex justify-center gap-3 py-3 mx-3 mb-2.5"
          style={{ background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: T.cardRadius }}>
          {contactItems.slice(0, 4).map(({ hrefFn, value, icon: Icon }: any, i: number) => (
            <a key={i} href={hrefFn(value)} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()} className="flex flex-col items-center gap-1 modal-tap">
              <div className="w-11 h-11 rounded-full flex items-center justify-center"
                style={{ background: `linear-gradient(135deg,${T.green},${T.greenLight})`, boxShadow: `0 3px 10px ${T.green}66` }}>
                <Icon className="w-4 h-4 text-white" />
              </div>
            </a>
          ))}
        </div>
      )}
    </>
  );
}

function HeadingTextSection({ T, formData }: any) {
  if (!formData.headingText && !formData.bodyText) return null;
  return (
    <CardBlock T={T}>
      <div className="px-4 py-3">
        {formData.headingText && <p style={{ fontWeight: T.boldHeadings ? 700 : 500, fontSize: T.bodyFontSize, marginBottom: 4, color: T.textPrimary, fontFamily: T.fontFamily }}>{formData.headingText}</p>}
        {formData.bodyText && <p style={{ fontSize: T.bodyFontSize, lineHeight: 1.5, color: T.textMuted, fontFamily: T.fontFamily }}>{formData.bodyText}</p>}
      </div>
    </CardBlock>
  );
}

function ContactUsSection({ T, contactItems, formData }: any) {
  if (contactItems.length === 0) return null;
  return (
    <CardBlock T={T}>
      <SectionHeader T={T} icon={<Phone className="w-3.5 h-3.5 text-white" />} title="Contact Us" />
      {contactItems.map(({ icon: Icon, label, value, hrefFn }: any, i: number) => (
        <div key={i}>
          <a href={hrefFn(value)} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
            className="modal-tap flex items-center gap-3 px-4 py-2.5" style={{ color: 'inherit' }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${T.green}26`, border: `1px solid ${T.green}40` }}>
              <Icon className="w-3.5 h-3.5" style={{ color: T.greenLight }} />
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ fontWeight: T.boldHeadings ? 700 : 500, fontSize: T.bodyFontSize, color: T.textPrimary, fontFamily: T.fontFamily }}>{label}</p>
              <p style={{ fontSize: Math.max(9, T.bodyFontSize - 1), color: T.textMuted, fontFamily: T.fontFamily }} className="truncate">{value}</p>
            </div>
            <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: T.muted }} />
          </a>
          {i < contactItems.length - 1 && <Divider T={T} />}
        </div>
      ))}
      {formData.location && (
        <div className="px-4 py-2.5">
          <a href={`https://maps.google.com/?q=${encodeURIComponent(formData.location)}`}
            target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-semibold text-white modal-tap"
            style={{ background: `linear-gradient(135deg,${T.green},${T.greenLight})`, fontSize: T.bodyFontSize, fontFamily: T.fontFamily }}>
            <MapPin className="w-3 h-3" /> Direction
          </a>
        </div>
      )}
    </CardBlock>
  );
}

function BusinessDetailsSection({ T, formData }: any) {
  const items = [
    formData.company && { label: 'Company', val: formData.company },
    formData.industry && { label: 'Industry', val: formData.industry },
    formData.yearFounded && { label: 'Year Founded', val: formData.yearFounded },
    formData.location && { label: 'Location', val: formData.location },
  ].filter(Boolean);
  
  if (items.length === 0) return null;
  
  return (
    <CardBlock T={T}>
      <SectionHeader T={T} icon={<Briefcase className="w-3.5 h-3.5 text-white" />} title="Business Details" />
      {items.map((row: any, i: number, arr: any[]) => (
        <div key={row.label}>
          <div className="flex items-center justify-between px-4 py-2.5">
            <span style={{ fontSize: T.bodyFontSize, color: T.textMuted, fontFamily: T.fontFamily }}>{row.label}</span>
            <span style={{ fontSize: T.bodyFontSize, fontWeight: T.boldHeadings ? 700 : 400, color: T.textPrimary, fontFamily: T.fontFamily, wordBreak: 'break-word', overflowWrap: 'anywhere', maxWidth: '55%', display: 'inline-block', textAlign: 'right' }}>{row.val}</span>
          </div>
          {i < arr.length - 1 && <Divider T={T} />}
        </div>
      ))}
    </CardBlock>
  );
}

function SocialLinksSection({ T, activeSocials }: any) {
  if (activeSocials.length === 0) return null;
  return (
    <CardBlock T={T}>
      <SectionHeader T={T} icon={<Share2 className="w-3.5 h-3.5 text-white" />} title="Social Links" />
      {activeSocials.map((s: any, i: number) => {
        const opt = SOCIAL_OPTIONS[s.platform] ?? SOCIAL_OPTIONS[0];
        const Icon = opt.icon;
        const url = resolveSocialUrl(s.value, s.platform);
        return (
          <div key={i}>
            <a href={url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
              className="modal-tap flex items-center gap-3 px-4 py-2.5" style={{ color: 'inherit' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${opt.color}1a`, border: `1px solid ${opt.color}35` }}>
                <Icon className="w-4 h-4" style={{ color: opt.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ fontWeight: T.boldHeadings ? 700 : 500, fontSize: T.bodyFontSize, color: T.textPrimary, fontFamily: T.fontFamily }}>{opt.name}</p>
                <p style={{ fontSize: Math.max(9, T.bodyFontSize - 1), color: T.textMuted, fontFamily: T.fontFamily }} className="truncate">{s.value}</p>
              </div>
              <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: T.muted }} />
            </a>
            {i < activeSocials.length - 1 && <Divider T={T} />}
          </div>
        );
      })}
    </CardBlock>
  );
}

function LinksSection({ T, activeLinks }: any) {
  if (activeLinks.length === 0) return null;
  return (
    <CardBlock T={T}>
      <SectionHeader T={T} icon={<Link2 className="w-3.5 h-3.5 text-white" />} title="Web Links" />
      {activeLinks.map((l: any, i: number) => (
        <div key={i}>
          <button type="button" onClick={e => { e.stopPropagation(); openLink(l.url); }}
            className="modal-tap w-full flex items-center gap-3 px-4 py-2.5 text-left">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${T.green}1f`, border: `1px solid ${T.green}40` }}>
              <Link2 className="w-4 h-4" style={{ color: T.greenLight }} />
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ fontWeight: T.boldHeadings ? 700 : 500, fontSize: T.bodyFontSize, color: T.textPrimary, fontFamily: T.fontFamily }}>{l.label || 'Title'}</p>
              <p style={{ fontSize: Math.max(9, T.bodyFontSize - 1), color: T.textMuted, fontFamily: T.fontFamily }} className="truncate">{l.url || 'URL'}</p>
            </div>
            <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: T.muted }} />
          </button>
          {i < activeLinks.length - 1 && <Divider T={T} />}
        </div>
      ))}
    </CardBlock>
  );
}

function AppointmentSection({ T, formData }: any) {
  if (!formData.appointmentUrl) return null;
  return (
    <CardBlock T={T}>
      <div className="px-4 pt-4 pb-2 text-center">
        <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center"
          style={{ background: `linear-gradient(135deg,${T.green},${T.greenLight})` }}>
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <h3 style={{ fontWeight: T.boldHeadings ? 700 : 500, fontSize: T.bodyFontSize + 1, color: T.textPrimary, fontFamily: T.fontFamily }}>Schedule Meeting</h3>
        <p style={{ fontSize: T.bodyFontSize, marginTop: 4, lineHeight: 1.5, color: T.textMuted, fontFamily: T.fontFamily }} className="px-2">
          Book a time to discuss potential opportunities
        </p>
      </div>
      <div className="px-4 pb-4 space-y-2">
        {['Book on Calendly', 'Add to Calendar'].map((label, idx) => (
          <button key={idx} type="button"
            onClick={e => { e.stopPropagation(); openLink(formData.appointmentUrl!); }}
            className="modal-tap w-full py-2.5 rounded-full font-semibold"
            style={{ border: `1px solid ${T.green}59`, color: T.greenLight, background: `${T.green}1a`, fontSize: T.bodyFontSize, fontFamily: T.fontFamily }}>
            {label}
          </button>
        ))}
      </div>
    </CardBlock>
  );
}

function CollectContactsSection({ T }: any) {
  return (
    <CardBlock T={T}>
      <SectionHeader T={T} icon={<MessageSquare className="w-3.5 h-3.5 text-white" />} title="Get in Touch" />
      <div className="px-4 py-3 space-y-2">
        {['Your name', 'Email address', 'Phone number'].map((ph, i) => (
          <input key={i} readOnly placeholder={ph} className="w-full px-3 py-2 rounded-xl outline-none"
            style={{ background: T.bg, border: `1px solid ${T.green}33`, color: T.textPrimary, fontSize: T.bodyFontSize, fontFamily: T.fontFamily }} />
        ))}
        <button className="w-full py-2.5 rounded-full font-bold text-white"
          style={{ background: `linear-gradient(135deg,${T.green},${T.greenLight})`, fontSize: T.bodyFontSize, fontFamily: T.fontFamily }}>
          Submit
        </button>
      </div>
    </CardBlock>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CardPreviewModal
// ═══════════════════════════════════════════════════════════════════
export function CardPreviewModal({
  isOpen, onClose, cardId,
  profileImage, brandLogo, logoPosition = 'top-right',
  formData,
  socialLinks = [], customLinks = [], extraSections = [],
  sections,
  savedContact = false, copied = false,
  onShareLink, onSaveContact,
  themeOverride,
  sectionOrder,
  unifiedOrder,
}: CardPreviewModalProps) {

  const T: ThemeOverride = { ...DEFAULT_T, ...themeOverride };
  const ff = { fontFamily: T.fontFamily };
  const uid = useId();

  const sec: Sections = sections ?? {
    profile: true, headingText: true, contactUs: true,
    socialLinks: true, links: true, appointment: true, collectContacts: false,
    businessDetails: true,
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const hasProfileImage = !!profileImage?.trim();
  const hasBrandLogo = !!brandLogo?.trim();

  const contactItems = CONTACT_CONFIG
    .map(c => ({ ...c, value: (formData as Record<string, string>)[c.key] ?? '' }))
    .filter(c => c.value.trim());

  const activeSocials = socialLinks.filter(s => s.value.trim());
  const activeLinks = customLinks.filter(l => l.label || l.url);

  const dynamicStyles = `
    @keyframes modal-in {
      from { opacity: 0; transform: scale(0.93) translateY(14px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }
    .modal-in { animation: modal-in 0.25s cubic-bezier(0.34,1.4,0.64,1) both; }
    [data-modalscroll="${uid}"]::-webkit-scrollbar { width: 2px; }
    [data-modalscroll="${uid}"]::-webkit-scrollbar-track { background: transparent; }
    [data-modalscroll="${uid}"]::-webkit-scrollbar-thumb { background: ${T.green}99; border-radius: 999px; }
    [data-modalscroll="${uid}"]::-webkit-scrollbar-thumb:hover { background: ${T.green}; }
    [data-modalscroll="${uid}"] { scrollbar-width: thin; scrollbar-color: ${T.green}99 transparent; }
    .modal-tap { transition: transform 0.12s ease; }
    .modal-tap:active { transform: scale(0.96); }
  `;

  // Section component map
  const sectionComponentMap: Record<SectionKey, React.FC<any>> = {
    profile: ProfileSection,
    headingText: HeadingTextSection,
    contactUs: ContactUsSection,
    businessDetails: BusinessDetailsSection,
    socialLinks: SocialLinksSection,
    links: LinksSection,
    appointment: AppointmentSection,
    collectContacts: CollectContactsSection,
  };

  // Build extra section lookup map
  const extraSectionById = new Map<string, ExtraSection>();
  extraSections.forEach(s => extraSectionById.set(s.id, s));

  // Determine render order: use unifiedOrder if provided (interleaved core + extra),
  // otherwise fall back to legacy: ordered core sections, then extras appended.
  const renderItems: string[] = (() => {
    if (unifiedOrder && unifiedOrder.length > 0) return unifiedOrder;
    const order = sectionOrder && sectionOrder.length > 0 ? sectionOrder : DEFAULT_SECTION_ORDER;
    const coreIds = order.filter(key => sec[key]);
    const extraIds = extraSections.filter(s => s.enabled).map(s => s.id);
    return [...coreIds, ...extraIds];
  })();

  return (
    <>
      <style>{dynamicStyles}</style>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
        onClick={onClose}
      >
        <div
          className="relative flex flex-col items-center gap-3 modal-in"
          style={{ height: 'min(96vh, 820px)', maxHeight: '96vh' }}
          onClick={e => e.stopPropagation()}
        >
          <p style={{ color: '#888', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Live Card Preview</p>

          <div className="relative flex-1 min-h-0" style={{ aspectRatio: '9 / 19.5' }}>
            <div className="absolute pointer-events-none"
              style={{
                inset: '-20px', borderRadius: '50%', zIndex: 0,
                background: `radial-gradient(ellipse at 50% 60%, ${T.green}2e 0%, transparent 70%)`,
                filter: 'blur(16px)',
              }} />

            <div className="absolute inset-0" style={{ zIndex: 1 }}>
              <div className="relative h-full" style={{
                borderRadius: '2.8rem', padding: '3px',
                background: 'linear-gradient(160deg,#444,#1c1c1c)',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 40px 80px rgba(0,0,0,0.95)',
              }}>
                <div className="absolute rounded-l-sm" style={{ left: -3, top: 88, width: 3, height: 28, background: '#2a2a2a' }} />
                <div className="absolute rounded-l-sm" style={{ left: -3, top: 124, width: 3, height: 40, background: '#2a2a2a' }} />
                <div className="absolute rounded-l-sm" style={{ left: -3, top: 172, width: 3, height: 40, background: '#2a2a2a' }} />
                <div className="absolute rounded-r-sm" style={{ right: -3, top: 120, width: 3, height: 56, background: '#2a2a2a' }} />

                <div className="w-full h-full overflow-hidden flex flex-col" style={{ borderRadius: '2.6rem', background: T.bg }}>

                  {/* Status bar */}
                  <div className="relative flex items-center justify-between px-5 pt-2 pb-1 flex-shrink-0" style={{ background: T.bg }}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-end justify-center pb-[5px]"
                      style={{ width: 88, height: 26, background: T.bg, borderRadius: '0 0 18px 18px', zIndex: 10 }}>
                      <div style={{ width: 40, height: 4, background: '#222', borderRadius: 999 }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: T.textPrimary, ...ff }}>9:41</span>
                    <div className="flex items-center gap-[5px]">
                      <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
                        <rect x="0" y="7" width="3" height="4" rx="0.8" fill={T.greenLight} />
                        <rect x="4.5" y="4.5" width="3" height="6.5" rx="0.8" fill={T.greenLight} />
                        <rect x="9" y="2" width="3" height="9" rx="0.8" fill={T.greenLight} />
                        <rect x="13.5" y="0" width="2.5" height="11" rx="0.8" fill={T.greenLight} opacity="0.3" />
                      </svg>
                      <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
                        <circle cx="7.5" cy="8.5" r="1.2" fill={T.greenLight} />
                        <path d="M4.1 6.8a4.8 4.8 0 0 1 6.8 0" stroke={T.greenLight} strokeWidth="1.3" strokeLinecap="round" fill="none" />
                        <path d="M1.3 4a8.7 8.7 0 0 1 12.4 0" stroke={T.greenLight} strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.35" />
                      </svg>
                      <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
                        <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke={T.greenLight} strokeOpacity="0.5" />
                        <rect x="2" y="2" width="14" height="8" rx="1.5" fill={T.greenLight} />
                        <path d="M23 4v4a2 2 0 0 0 0-4z" fill={T.greenLight} fillOpacity="0.4" />
                      </svg>
                    </div>
                  </div>

                  {/* Scrollable content with ordered sections */}
                  <div data-modalscroll={uid} className="overflow-y-auto overscroll-contain flex-1 min-h-0"
                    style={{ background: T.phoneBgStyle || T.bg, overflowX: 'hidden', ...ff }}>

                    {/* Render all sections in unified order (core + extra interleaved) */}
                    {renderItems.map((id) => {
                      // Core section?
                      if (DEFAULT_SECTION_ORDER.includes(id as SectionKey)) {
                        const sectionKey = id as SectionKey;
                        if (!sec[sectionKey]) return null;
                        const SectionComponent = sectionComponentMap[sectionKey];
                        if (!SectionComponent) return null;
                        return (
                          <SectionComponent key={sectionKey} T={T}
                            profileImage={profileImage} formData={formData}
                            brandLogo={brandLogo} logoPosition={logoPosition}
                            hasBrandLogo={hasBrandLogo} hasProfileImage={hasProfileImage}
                            contactItems={contactItems}
                            activeSocials={activeSocials} activeLinks={activeLinks}
                          />
                        );
                      }
                      // Extra section
                      const section = extraSectionById.get(id);
                      if (!section || !section.enabled) return null;
                      return <ExtraModalSection key={section.id} section={section} T={T} />;
                    })}

                    <div className="px-4 py-3 flex justify-center">
                      <p style={{ fontSize: 8, color: '#555', fontFamily: T.fontFamily }}>Powered by Digital Cards</p>
                    </div>
                    <div style={{ height: 8 }} />
                  </div>

                  {/* Sticky bottom bar */}
                  <div className="flex items-center justify-between px-3 py-2 flex-shrink-0"
                    style={{ background: T.card, borderTop: `1px solid ${T.cardBorder}` }}>
                    <div className="flex items-center gap-2">
                      {onShareLink && (
                        <button onClick={e => { e.stopPropagation(); onShareLink(); }}
                          className="modal-tap w-9 h-9 rounded-full flex items-center justify-center"
                          style={{ background: T.bg, border: `1px solid ${T.green}4d` }}>
                          {copied
                            ? <Check className="w-4 h-4" style={{ color: T.greenLight }} />
                            : <Share2 className="w-4 h-4" style={{ color: T.textMuted }} />}
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {sec.profile && (
                        <button onClick={onSaveContact}
                          disabled={!formData.name?.trim()}
                          className="modal-tap flex items-center gap-1.5 rounded-full px-3.5 py-2 font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{ background: savedContact ? T.greenLight : `linear-gradient(135deg,${T.green},${T.greenLight})`, fontSize: T.bodyFontSize, fontFamily: T.fontFamily }}>
                          {savedContact ? '✓ Saved!' : 'Add to Contact'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Home bar */}
                  <div className="flex justify-center py-1.5 flex-shrink-0" style={{ background: T.card }}>
                    <div className="w-24 h-1 rounded-full" style={{ background: `${T.green}4d` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Bottom buttons (outside phone) ── */}
          <div className="flex gap-2 flex-shrink-0">
            {onShareLink && (
              <Button variant="outline" size="sm" className="gap-2 text-xs"
                style={{ borderColor: `${T.green}66`, color: copied ? T.greenLight : '#A0A0A0' }}
                onClick={onShareLink}>
                {copied ? <Check className="w-3.5 h-3.5" style={{ color: T.greenLight }} /> : <Share2 className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Share Link'}
              </Button>
            )}
          </div>

          {/* Close button */}
          <button onClick={onClose}
            className="absolute -top-1 -right-12 w-9 h-9 rounded-full flex items-center justify-center modal-tap"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </>
  );
}

// ── Extra section preview ──────────────────────────────────────────
function ExtraModalSection({ section, T }: { section: ExtraSection; T: ThemeOverride }) {
  const d = section.data;
  const ff = { fontFamily: T.fontFamily };

  switch (section.type) {
    case 'extra-pdf': {
      const pdfTitle = str(d, 'pdfTitle'), pdfUrl = str(d, 'pdfUrl');
      return pdfTitle || pdfUrl ? (
        <div className="mx-3 mb-2.5 overflow-hidden" key={section.id}
          style={{ background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: T.cardRadius }}>
          <div className="flex items-center gap-2.5 px-4 py-2.5" style={{ borderBottom: `1px solid ${T.divider}` }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `linear-gradient(135deg,${T.green},${T.greenLight})` }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <span style={{ fontWeight: T.boldHeadings ? 700 : 500, fontSize: T.bodyFontSize, color: T.textPrimary, ...ff }}>PDF Gallery</span>
          </div>
          <button type="button" onClick={e => { e.stopPropagation(); if (pdfUrl) openLink(pdfUrl); }}
            className="modal-tap w-full flex items-center gap-3 px-4 py-2.5 text-left">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${T.green}1f`, border: `1px solid ${T.green}40` }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" style={{ color: T.greenLight }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ fontWeight: T.boldHeadings ? 700 : 500, fontSize: T.bodyFontSize, color: T.textPrimary, ...ff }}>{pdfTitle || 'View PDF'}</p>
              <p style={{ fontSize: Math.max(9, T.bodyFontSize - 1), color: T.textMuted, ...ff }} className="truncate">{pdfUrl || 'Tap to open'}</p>
            </div>
            <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: T.muted }} />
          </button>
        </div>
      ) : null;
    }

    case 'extra-button': {
      const btnLabel = str(d, 'btnLabel'), btnUrl = str(d, 'btnUrl');
      return btnLabel || btnUrl ? (
        <div className="mx-3 mb-2.5" key={section.id}>
          <button onClick={e => { e.stopPropagation(); if (btnUrl) openLink(btnUrl); }}
            className="modal-tap w-full py-3 font-bold text-white"
            style={{ background: `linear-gradient(135deg,${T.green},${T.greenLight})`, borderRadius: T.cardRadius, fontSize: T.bodyFontSize, ...ff }}>
            {btnLabel || 'Click Here'}
          </button>
        </div>
      ) : null;
    }
    case 'extra-video': {
      const videoUrl = str(d, 'videoUrl');
      return videoUrl ? (
        <div className="mx-3 mb-2.5 overflow-hidden" key={section.id}
          style={{ background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: T.cardRadius }}>
          <button onClick={e => { e.stopPropagation(); openLink(videoUrl); }}
            className="modal-tap w-full h-24 flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg,${T.green},${T.greenLight})` }}>
              <VideoIcon className="w-5 h-5 text-white" />
            </div>
            <span style={{ fontSize: T.bodyFontSize, color: T.textMuted, ...ff }}>Watch Video</span>
          </button>
        </div>
      ) : null;
    }
    case 'extra-hours': {
      const days = ['Monday–Friday', 'Saturday', 'Sunday'];
      const hasAny = days.some(day => str(d, day));
      return hasAny ? (
        <div className="mx-3 mb-2.5 overflow-hidden" key={section.id}
          style={{ background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: T.cardRadius }}>
          <div className="flex items-center gap-2.5 px-4 py-2.5" style={{ borderBottom: `1px solid ${T.divider}` }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
              style={{ background: `linear-gradient(135deg,${T.green},${T.greenLight})` }}>🕐</div>
            <span style={{ fontWeight: T.boldHeadings ? 700 : 500, fontSize: T.bodyFontSize, color: T.textPrimary, ...ff }}>Business Hours</span>
          </div>
          {days.map(day => {
            const val = str(d, day); return val ? (
              <div key={day} className="flex items-center justify-between px-4 py-2">
                <span style={{ fontSize: T.bodyFontSize, color: T.textMuted, ...ff }}>{day}</span>
                <span style={{ fontWeight: T.boldHeadings ? 700 : 500, fontSize: T.bodyFontSize, color: T.textPrimary, ...ff }}>{val}</span>
              </div>
            ) : null;
          })}
        </div>
      ) : null;
    }
    case 'extra-products': {
      const productName = str(d, 'productName'), price = str(d, 'price'), buyUrl = str(d, 'buyUrl');
      return productName ? (
        <div className="mx-3 mb-2.5 overflow-hidden" key={section.id}
          style={{ background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: T.cardRadius }}>
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontWeight: T.boldHeadings ? 700 : 500, fontSize: T.bodyFontSize, color: T.textPrimary, ...ff }}>{productName}</span>
              {price && <span style={{ fontWeight: 700, fontSize: T.bodyFontSize + 2, color: T.greenLight, ...ff }}>{price}</span>}
            </div>
            {buyUrl && (
              <button onClick={e => { e.stopPropagation(); openLink(buyUrl); }}
                className="modal-tap w-full py-2 rounded-full font-bold text-white"
                style={{ background: `linear-gradient(135deg,${T.green},${T.greenLight})`, fontSize: T.bodyFontSize, ...ff }}>
                Buy Now
              </button>
            )}
          </div>
        </div>
      ) : null;
    }
    case 'extra-imagetext': {
      const heading = str(d, 'heading'), body = str(d, 'body'), imgUrl = str(d, 'imgUrl');
      if (!heading && !body && !imgUrl) return null;
      return (
        <div className="mx-3 mb-2.5 overflow-hidden" key={section.id}
          style={{ background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: T.cardRadius }}>
          {imgUrl && (
            <div className="w-full overflow-hidden" style={{ maxHeight: 140 }}>
              <img src={imgUrl} alt={heading || ''} className="w-full object-cover" style={{ maxHeight: 140 }} />
            </div>
          )}
          {(heading || body) && (
            <div className="px-4 py-3">
              {heading && <p style={{ fontWeight: T.boldHeadings ? 700 : 500, fontSize: T.bodyFontSize, marginBottom: 4, color: T.textPrimary, ...ff }}>{heading}</p>}
              {body && <p style={{ fontSize: T.bodyFontSize, lineHeight: 1.5, color: T.textMuted, ...ff }}>{body}</p>}
            </div>
          )}
        </div>
      );
    }
    case 'extra-customer':
    case 'extra-team': {
      const title = str(d, 'title'), desc = str(d, 'desc');
      return title || desc ? (
        <div className="mx-3 mb-2.5 overflow-hidden" key={section.id}
          style={{ background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: T.cardRadius }}>
          <div className="px-4 py-3">
            {title && <p style={{ fontWeight: T.boldHeadings ? 700 : 500, fontSize: T.bodyFontSize, marginBottom: 4, color: T.textPrimary, ...ff }}>{title}</p>}
            {desc && <p style={{ fontSize: T.bodyFontSize, lineHeight: 1.5, color: T.textMuted, ...ff }}>{desc}</p>}
          </div>
        </div>
      ) : null;
    }
    default: {
      const title = str(d, 'title'), content = str(d, 'content');
      return title || content ? (
        <div className="mx-3 mb-2.5 overflow-hidden" key={section.id}
          style={{ background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: T.cardRadius }}>
          <div className="px-4 py-3">
            {title && <p style={{ fontWeight: T.boldHeadings ? 700 : 500, fontSize: T.bodyFontSize, marginBottom: 4, color: T.textPrimary, ...ff }}>{title}</p>}
            {content && <p style={{ fontSize: T.bodyFontSize, lineHeight: 1.5, color: T.textMuted, ...ff }}>{content}</p>}
          </div>
        </div>
      ) : null;
    }
  }
}
"use client";

import { useId, useState, useEffect } from 'react';
import { useQrStore } from '@/components/dashboard/stores/Useqrstore';
import { getCardQRConfig } from '@/lib/api';
import { makeQRMatrix } from '@/components/dashboard/pages/qr-engine';
import {
  Linkedin, Instagram, Facebook, Twitter, Youtube,
  Mail, Phone, Globe, MapPin, Calendar, Link2,
  Share2, QrCode, Check, Copy, Eye,
  Video as VideoIcon, ChevronRight, Upload,
  MessageSquare, Briefcase, Layout, Smartphone, ChevronDown,
} from 'lucide-react';
import { STICKER_DEFS } from '@/components/dashboard/pages/Qrrenderers';
import { QrPopup } from '@/components/dashboard/pages/Qrpopup';

// ── Types ──────────────────────────────────────────────────────────
export type LogoPosition = 'top-left' | 'top-right' | 'below-photo' | 'below-name';

interface FormData {
  name: string; title: string; company: string; tagline: string;
  email: string; phone: string; website: string; location: string;
  industry: string; yearFounded: string; appointmentUrl: string;
  headingText: string; bodyText: string;
}
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

export interface PhonePreviewProps {
  cardId?: string;
  profileImage: string;
  brandLogo: string;
  logoPosition: LogoPosition;
  formData: FormData;
  socialLinks: SocialLink[];
  customLinks: CustomLink[];
  extraSections: ExtraSection[];
  sections: Sections;
  savedContact: boolean;
  copied: boolean;
  onPreviewOpen: () => void;
  onShareLink: () => void;
  onSaveContact: () => void;
  onShowQR: () => void;
  themeOverride?: Partial<ThemeOverride>;
}

// ── Constants ──────────────────────────────────────────────────────
const SOCIAL_ICONS = [Linkedin, Instagram, Twitter, Facebook, Youtube] as const;
const SOCIAL_COLORS = ['#0a66c2', '#e1306c', '#1da1f2', '#1877f2', '#ff0000'] as const;
const SOCIAL_NAMES = ['LinkedIn', 'Instagram', 'Twitter', 'Facebook', 'YouTube'] as const;

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

// ── Helpers ────────────────────────────────────────────────────────
function openLink(url: string) {
  if (!url) return;
  window.open(url.startsWith('http') ? url : `https://${url}`, '_blank', 'noopener,noreferrer');
}

function str(data: Record<string, string | { label: string; url: string }[]>, key: string): string {
  const v = data[key];
  return typeof v === 'string' ? v : '';
}

// ── Brand Logo Component ───────────────────────────────────────────
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

// ── Sub-components ────────────────────────────────────────────────
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

// ═══════════════════════════════════════════════════════════════════
// Main PhonePreview
// ═══════════════════════════════════════════════════════════════════
export function PhonePreview({
  cardId,
  profileImage, brandLogo, logoPosition,
  formData, socialLinks, customLinks, extraSections, sections,
  savedContact, copied,
  onPreviewOpen, onShareLink, onSaveContact,
  themeOverride,
}: PhonePreviewProps) {

  const T: ThemeOverride = { ...DEFAULT_T, ...themeOverride };
  const ff = { fontFamily: T.fontFamily };
  const uid = `pp-${useId().replace(/:/g, '')}`;

  // ── QR popup state ─────────────────────────────────────────────
  const [qrPopupOpen, setQrPopupOpen] = useState(false);
  const cardUrl = typeof window !== 'undefined' ? window.location.href : 'https://samcard.app/u/card';

  const scrollCss = `
    [data-scrollid="${uid}"]::-webkit-scrollbar { width: 2px; }
    [data-scrollid="${uid}"]::-webkit-scrollbar-track { background: transparent; }
    [data-scrollid="${uid}"]::-webkit-scrollbar-thumb { background: ${T.green}99; border-radius: 999px; }
    [data-scrollid="${uid}"]::-webkit-scrollbar-thumb:hover { background: ${T.green}; }
    [data-scrollid="${uid}"] { scrollbar-width: thin; scrollbar-color: ${T.green}99 transparent; }
  `;

  const setQr = useQrStore((s) => s.setQr);

  useEffect(() => {
    if (!cardId) return;

    getCardQRConfig(cardId)
      .then((savedConfig) => {
        if (!savedConfig) return;

        const qrFromBackend: any = {
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
        };

        setQr(qrFromBackend, makeQRMatrix(cardUrl).matrix, makeQRMatrix(cardUrl).N);
      })
      .catch(() => {
        // ignore
      });
  }, [cardId, cardUrl, setQr]);

  const filledSocials = socialLinks.filter(s => s.value.trim());
  const filledLinks = customLinks.filter(l => l.label || l.url);

  const contactItems = [
    formData.phone && { label: 'Call Us', sub: formData.phone, href: `tel:${formData.phone}`, Icon: Phone },
    formData.email && { label: 'Email', sub: formData.email, href: `mailto:${formData.email}`, Icon: Mail },
    formData.location && { label: 'Address', sub: formData.location, href: `https://maps.google.com/?q=${encodeURIComponent(formData.location)}`, Icon: MapPin },
    formData.website && { label: 'Website', sub: formData.website, href: formData.website, Icon: Globe },
  ].filter(Boolean) as { label: string; sub: string; href: string; Icon: React.ElementType }[];

  const hasBrandLogo = !!brandLogo?.trim();

  return (
    <>
      <style>{scrollCss}</style>

      {/* ── QR Popup ── */}
      <QrPopup
        isOpen={qrPopupOpen}
        onClose={() => setQrPopupOpen(false)}
        cardUrl={cardUrl}
      />

      {/* Panel wrapper */}
      <div className="rounded-2xl p-4" style={{ background: '#000', border: `1px solid ${T.green}4d` }}>

        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: T.greenLight }} />
            <span className="text-sm font-semibold" style={{ color: T.textPrimary, ...ff }}>Live Preview</span>
          </div>
          <div className="flex gap-1.5">
            <button onClick={onPreviewOpen}
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: '#1a1a1a', border: `1px solid ${T.green}33`, color: '#888' }}>
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button onClick={onShareLink}
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: '#1a1a1a', border: `1px solid ${T.green}33`, color: copied ? T.greenLight : '#888' }}>
              {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* iPhone shell */}
        <div className="relative mx-auto" style={{ width: 'min(272px,100%)' }}>
          <div className="absolute pointer-events-none"
            style={{
              inset: '-20px', borderRadius: '50%', zIndex: 0,
              background: `radial-gradient(ellipse at 50% 60%, ${T.green}2e 0%, transparent 70%)`,
              filter: 'blur(16px)',
            }} />

          <div className="relative" style={{ zIndex: 1 }}>
            <div className="rounded-[2.8rem] p-[3px]"
              style={{
                background: 'linear-gradient(160deg,#444,#1c1c1c)',
                boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 28px 70px rgba(0,0,0,0.95)',
              }}>
              <div className="rounded-[2.6rem] overflow-hidden" style={{ background: T.phoneBgStyle || T.bg }}>

                {/* Status bar */}
                <div className="relative flex items-center justify-between px-5 pt-2 pb-1" style={{ background: T.bg }}>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-end justify-center pb-[5px]"
                    style={{ width: 88, height: 26, background: T.bg, borderRadius: '0 0 18px 18px', zIndex: 10 }}>
                    <div style={{ width: 40, height: 4, background: '#222', borderRadius: 999 }} />
                  </div>
                  <span className="text-[11px] font-bold" style={{ color: T.textPrimary, ...ff }}>9:41</span>
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

                {/* Scrollable body */}
                <div data-scrollid={uid} className="overflow-y-auto"
                  style={{ maxHeight: 560, background: T.phoneBgStyle || T.bg, ...ff }}>

                  {/* HERO */}
                  {sections.profile && (
                    <div className="relative" style={{ aspectRatio: '4/3', maxHeight: '200px' }}>
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt={formData.name}
                          className="w-full h-full object-contain object-center"
                          style={{ backgroundColor: '#000' }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${T.green}66 0%, ${T.bg} 50%, ${T.greenLight}44 100%)` }}>
                          <div className="flex flex-col items-center gap-2 opacity-50">
                            <Upload className="w-8 h-8" style={{ color: T.greenLight }} />
                            <span style={{ fontSize: 10, color: T.textMuted, fontFamily: T.fontFamily }}>Add photo</span>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0"
                        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.75) 100%)' }} />
                      <div className="absolute bottom-0 left-0 right-0 h-[2px]"
                        style={{ background: `linear-gradient(90deg, transparent, ${T.green}, ${T.greenLight}, ${T.green}, transparent)` }} />
                      {hasBrandLogo && logoPosition === 'top-left' && (
                        <div className="absolute top-3 left-3 z-10">
                          <BrandLogoBadge src={brandLogo} maxSize={48} padding="5px" borderRadius={10} />
                        </div>
                      )}
                      {hasBrandLogo && logoPosition === 'top-right' && (
                        <div className="absolute top-3 right-3 z-10">
                          <BrandLogoBadge src={brandLogo} maxSize={48} padding="5px" borderRadius={10} />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 z-10">
                        <h1 style={{ fontWeight: T.boldHeadings ? 800 : 600, fontSize: T.nameFontSize, lineHeight: 1.2, color: '#fff', textShadow: '0 1px 8px rgba(0,0,0,0.7)', fontFamily: T.fontFamily }}>
                          {formData.name || 'Your Name'}
                        </h1>
                        {formData.title && (
                          <p style={{ fontSize: T.bodyFontSize, marginTop: 2, color: T.greenLight, fontFamily: T.fontFamily }}>{formData.title}</p>
                        )}
                        {formData.company && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {hasBrandLogo && logoPosition === 'below-name' && (
                              <BrandLogoBadge src={brandLogo} bg="rgba(0,0,0,0.45)" blur={false} maxSize={22} padding="2px 4px" borderRadius={5} />
                            )}
                            <p style={{ fontSize: T.bodyFontSize, color: 'rgba(255,255,255,0.65)', fontFamily: T.fontFamily }}>{formData.company}</p>
                          </div>
                        )}
                      </div>
                    </div>)}

                  {hasBrandLogo && logoPosition === 'below-photo' && (
                    <div className="flex justify-center py-2.5">
                      <BrandLogoBadge src={brandLogo} bg={T.card} blur={false} maxSize={80} padding="8px 12px" borderRadius={12} border={`1px solid ${T.cardBorder}`} />
                    </div>
                  )}

                  {sections.profile && formData.tagline && (
                    <div className="px-4 py-2.5 text-center">
                      <p style={{ fontSize: T.bodyFontSize, fontStyle: 'italic', lineHeight: 1.5, color: T.textMuted, fontFamily: T.fontFamily }}>{formData.tagline}</p>
                    </div>
                  )}

                  {sections.profile && contactItems.length > 0 && (
                    <div className="flex justify-center gap-3 py-3 mx-3 mb-2.5"
                      style={{ background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: T.cardRadius }}>
                      {contactItems.slice(0, 4).map(({ href, Icon }, i) => (
                        <a key={i} href={href} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="flex flex-col items-center gap-1">
                          <div className="w-11 h-11 rounded-full flex items-center justify-center"
                            style={{ background: `linear-gradient(135deg,${T.green},${T.greenLight})`, boxShadow: `0 3px 10px ${T.green}66` }}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                        </a>
                      ))}
                    </div>
                  )}

                  {sections.headingText && (formData.headingText || formData.bodyText) && (
                    <CardBlock T={T}>
                      <div className="px-4 py-3">
                        {formData.headingText && <p style={{ fontWeight: T.boldHeadings ? 700 : 500, fontSize: T.bodyFontSize, marginBottom: 4, color: T.textPrimary, fontFamily: T.fontFamily }}>{formData.headingText}</p>}
                        {formData.bodyText && <p style={{ fontSize: T.bodyFontSize, lineHeight: 1.5, color: T.textMuted, fontFamily: T.fontFamily }}>{formData.bodyText}</p>}
                      </div>
                    </CardBlock>
                  )}

                  {sections.contactUs && contactItems.length > 0 && (
                    <CardBlock T={T}>
                      <SectionHeader T={T} icon={<Phone className="w-3.5 h-3.5 text-white" />} title="Contact Us" />
                      {contactItems.map(({ label, sub, href, Icon }, i) => (
                        <div key={i}>
                          <a href={href} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                            className="flex items-center gap-3 px-4 py-2.5 transition-colors" style={{ color: 'inherit' }}>
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ background: `${T.green}26`, border: `1px solid ${T.green}40` }}>
                              <Icon className="w-3.5 h-3.5" style={{ color: T.greenLight }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p style={{ fontWeight: T.boldHeadings ? 700 : 500, fontSize: T.bodyFontSize, color: T.textPrimary, fontFamily: T.fontFamily }}>{label}</p>
                              <p style={{ fontSize: Math.max(9, T.bodyFontSize - 1), color: T.textMuted, fontFamily: T.fontFamily }} className="truncate">{sub}</p>
                            </div>
                          </a>
                          {i < contactItems.length - 1 && <Divider T={T} />}
                        </div>
                      ))}
                      {formData.location && (
                        <div className="px-4 py-2.5">
                          <a href={`https://maps.google.com/?q=${encodeURIComponent(formData.location)}`}
                            target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-semibold text-white"
                            style={{ background: `linear-gradient(135deg,${T.green},${T.greenLight})`, fontSize: T.bodyFontSize, fontFamily: T.fontFamily }}>
                            <MapPin className="w-3 h-3" /> Direction
                          </a>
                        </div>
                      )}
                    </CardBlock>
                  )}

                  {sections.businessDetails && (formData.company || formData.industry || formData.yearFounded || formData.location) && (
                    <CardBlock T={T}>
                      <SectionHeader T={T} icon={<Briefcase className="w-3.5 h-3.5 text-white" />} title="Business Details" />
                      {[
                        formData.company && { label: 'Company', val: formData.company },
                        formData.industry && { label: 'Industry', val: formData.industry },
                        formData.yearFounded && { label: 'Year Founded', val: formData.yearFounded },
                        formData.location && { label: 'Location', val: formData.location },
                      ].filter(Boolean).map((row, i, arr) => {
                        const { label, val } = row as { label: string; val: string };
                        return (
                          <div key={label}>
                            <div className="flex items-center justify-between px-4 py-2.5">
                              <span style={{ fontSize: T.bodyFontSize, color: T.textMuted, fontFamily: T.fontFamily }}>{label}</span>
                              <span style={{ fontSize: T.bodyFontSize, fontWeight: T.boldHeadings ? 700 : 400, color: T.textPrimary, fontFamily: T.fontFamily }} className="text-right max-w-[55%]">{val}</span>
                            </div>
                            {i < arr.length - 1 && <Divider T={T} />}
                          </div>
                        );
                      })}
                    </CardBlock>
                  )}

                  {sections.socialLinks && filledSocials.length > 0 && (
                    <CardBlock T={T}>
                      <SectionHeader T={T} icon={<Share2 className="w-3.5 h-3.5 text-white" />} title="Social Links" />
                      {filledSocials.map((s, i) => {
                        const Icon = SOCIAL_ICONS[s.platform] ?? SOCIAL_ICONS[0];
                        const color = SOCIAL_COLORS[s.platform] ?? T.green;
                        const name = SOCIAL_NAMES[s.platform] ?? 'Social';
                        return (
                          <div key={i}>
                            <button type="button" onClick={e => { e.stopPropagation(); openLink(s.value); }}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-left">
                              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ background: `${color}1a`, border: `1px solid ${color}35` }}>
                                <Icon className="w-4 h-4" style={{ color }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p style={{ fontWeight: T.boldHeadings ? 700 : 500, fontSize: T.bodyFontSize, color: T.textPrimary, fontFamily: T.fontFamily }}>{name}</p>
                                <p style={{ fontSize: Math.max(9, T.bodyFontSize - 1), color: T.textMuted, fontFamily: T.fontFamily }} className="truncate">{s.value}</p>
                              </div>
                              <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: T.muted }} />
                            </button>
                            {i < filledSocials.length - 1 && <Divider T={T} />}
                          </div>
                        );
                      })}
                    </CardBlock>
                  )}

                  {sections.links && filledLinks.length > 0 && (
                    <CardBlock T={T}>
                      <SectionHeader T={T} icon={<Link2 className="w-3.5 h-3.5 text-white" />} title="Web Links" />
                      {filledLinks.map((l, i) => (
                        <div key={i}>
                          <button type="button" onClick={e => { e.stopPropagation(); openLink(l.url); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ background: `${T.green}1f`, border: `1px solid ${T.green}40` }}>
                              <Link2 className="w-4 h-4" style={{ color: T.greenLight }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p style={{ fontWeight: T.boldHeadings ? 700 : 500, fontSize: T.bodyFontSize, color: T.textPrimary, fontFamily: T.fontFamily }}>{l.label || 'Title'}</p>
                              <p style={{ fontSize: Math.max(9, T.bodyFontSize - 1), color: T.textMuted, fontFamily: T.fontFamily }} className="truncate">{l.url || 'Sub Title'}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: T.muted }} />
                          </button>
                          {i < filledLinks.length - 1 && <Divider T={T} />}
                        </div>
                      ))}
                    </CardBlock>
                  )}

                  {sections.appointment && formData.appointmentUrl && (
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
                        {['Book on Calendly', 'Add to Calendar'].map(label => (
                          <button key={label} type="button" onClick={e => { e.stopPropagation(); openLink(formData.appointmentUrl); }}
                            className="w-full py-2.5 rounded-full font-semibold"
                            style={{ border: `1px solid ${T.green}59`, color: T.greenLight, background: `${T.green}1a`, fontSize: T.bodyFontSize, fontFamily: T.fontFamily }}>
                            {label}
                          </button>
                        ))}
                      </div>
                    </CardBlock>
                  )}

                  {sections.collectContacts && (
                    <CardBlock T={T}>
                      <SectionHeader T={T} icon={<MessageSquare className="w-3.5 h-3.5 text-white" />} title="Get in Touch" />
                      <div className="px-4 py-3 space-y-2">
                        {['Your Name', 'Your Email', 'Your Phone'].map(ph => (
                          <input key={ph} placeholder={ph} className="w-full px-3 py-2 rounded-xl outline-none"
                            style={{ background: T.bg, border: `1px solid ${T.green}33`, color: T.textPrimary, fontSize: T.bodyFontSize, fontFamily: T.fontFamily }} />
                        ))}
                        <button className="w-full py-2.5 rounded-full font-bold text-white"
                          style={{ background: `linear-gradient(135deg,${T.green},${T.greenLight})`, fontSize: T.bodyFontSize, fontFamily: T.fontFamily }}>
                          Submit
                        </button>
                      </div>
                    </CardBlock>
                  )}

                  {extraSections.filter(s => s.enabled).map(section => (
                    <ExtraSectionPreview key={section.id} section={section} T={T} />
                  ))}

                  <div style={{ height: 64 }} />
                </div>

                {/* Sticky bottom bar */}
                <div className="flex items-center justify-between px-3 py-2"
                  style={{ background: T.card, borderTop: `1px solid ${T.cardBorder}` }}>
                  <div className="flex items-center gap-2">
                    {/* ── QR button — opens our popup only, does NOT call onShowQR ── */}
                    <button
                      onClick={e => { e.stopPropagation(); setQrPopupOpen(true); }}
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ background: '#1a1a1a', border: `1px solid ${T.green}4d` }}>
                      <QrCode className="w-4 h-4" style={{ color: T.textMuted }} />
                    </button>
                    <button onClick={e => { e.stopPropagation(); onShareLink(); }}
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ background: '#1a1a1a', border: `1px solid ${T.green}4d` }}>
                      {copied ? <Check className="w-4 h-4" style={{ color: T.greenLight }} /> : <Upload className="w-4 h-4" style={{ color: T.textMuted }} />}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={e => { e.stopPropagation(); onSaveContact(); }}
                      className="flex items-center gap-1.5 rounded-full px-3.5 py-2 font-bold text-white"
                      style={{ background: savedContact ? T.greenLight : `linear-gradient(135deg,${T.green},${T.greenLight})`, fontSize: T.bodyFontSize, fontFamily: T.fontFamily }}>
                      {savedContact ? '✓ Saved!' : 'Add to Contact'}
                    </button>
                    <button onClick={e => { e.stopPropagation(); onPreviewOpen(); }}
                      className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white"
                      style={{ background: `linear-gradient(135deg,${T.green},${T.greenLight})` }}>
                      <span className="text-lg leading-none">+</span>
                    </button>
                  </div>
                </div>

                {/* Home bar */}
                <div className="flex justify-center py-1.5" style={{ background: T.card }}>
                  <div className="w-24 h-1 rounded-full" style={{ background: `${T.green}4d` }} />
                </div>
              </div>
            </div>

            {/* Physical side buttons */}
            <div className="absolute rounded-l-sm" style={{ left: -3, top: 88, width: 3, height: 28, background: '#2a2a2a' }} />
            <div className="absolute rounded-l-sm" style={{ left: -3, top: 124, width: 3, height: 40, background: '#2a2a2a' }} />
            <div className="absolute rounded-l-sm" style={{ left: -3, top: 172, width: 3, height: 40, background: '#2a2a2a' }} />
            <div className="absolute rounded-r-sm" style={{ right: -3, top: 120, width: 3, height: 56, background: '#2a2a2a' }} />
          </div>
        </div>

        {/* Share panel */}
        <div className="mt-4 p-3 rounded-xl" style={{ background: `${T.green}0f`, border: `1px solid ${T.green}2e` }}>
          <p className="text-[10px] uppercase tracking-wider font-semibold mb-2" style={{ color: '#555', ...ff }}>Share Your Card</p>
          <div className="grid grid-cols-2 gap-2">
            {/* ── QR button — opens our popup only, does NOT call onShowQR ── */}
            <button
              onClick={() => setQrPopupOpen(true)}
              className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium"
              style={{ border: `1px solid ${T.green}33`, color: '#888', ...ff }}>
              <QrCode className="w-3.5 h-3.5" />QR Code
            </button>
            <button onClick={onShareLink}
              className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium"
              style={{
                border: copied ? `1px solid ${T.greenLight}66` : `1px solid ${T.green}33`,
                color: copied ? T.greenLight : '#888',
                background: copied ? `${T.greenLight}14` : 'transparent',
                ...ff,
              }}>
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Extra Section Renderers ────────────────────────────────────────
function ExtraSectionPreview({ section, T }: { section: ExtraSection; T: ThemeOverride }) {
  const d = section.data;
  const ff = { fontFamily: T.fontFamily };

  switch (section.type) {
    case 'extra-button': {
      const btnLabel = str(d, 'btnLabel'), btnUrl = str(d, 'btnUrl');
      return btnLabel || btnUrl ? (
        <div className="mx-3 mb-2.5">
          <button onClick={e => { e.stopPropagation(); if (btnUrl) openLink(btnUrl); }}
            className="w-full py-3 font-bold text-white"
            style={{ background: `linear-gradient(135deg,${T.green},${T.greenLight})`, borderRadius: T.cardRadius, fontSize: T.bodyFontSize, ...ff }}>
            {btnLabel || 'Click Here'}
          </button>
        </div>
      ) : null;
    }
    case 'extra-video': {
      const videoUrl = str(d, 'videoUrl');
      return videoUrl ? (
        <div className="mx-3 mb-2.5 overflow-hidden"
          style={{ background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: T.cardRadius }}>
          <button onClick={e => { e.stopPropagation(); openLink(videoUrl); }}
            className="w-full h-24 flex flex-col items-center justify-center gap-2">
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
        <div className="mx-3 mb-2.5 overflow-hidden"
          style={{ background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: T.cardRadius }}>
          <div className="flex items-center gap-2.5 px-4 py-2.5" style={{ borderBottom: `1px solid ${T.divider}` }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm"
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
        <div className="mx-3 mb-2.5 overflow-hidden"
          style={{ background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: T.cardRadius }}>
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontWeight: T.boldHeadings ? 700 : 500, fontSize: T.bodyFontSize, color: T.textPrimary, ...ff }}>{productName}</span>
              {price && <span style={{ fontWeight: 700, fontSize: T.bodyFontSize + 2, color: T.greenLight, ...ff }}>{price}</span>}
            </div>
            {buyUrl && (
              <button onClick={e => { e.stopPropagation(); openLink(buyUrl); }}
                className="w-full py-2 rounded-full font-bold text-white"
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
      return heading || body || imgUrl ? (
        <div className="mx-3 mb-2.5 overflow-hidden"
          style={{ background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: T.cardRadius }}>
          {imgUrl ? (
            <div className="w-full overflow-hidden" style={{ maxHeight: 140 }}>
              <img src={imgUrl} alt={heading || ''} className="w-full object-cover" style={{ maxHeight: 140 }} />
            </div>
          ) : (
            <div className="w-full flex flex-col items-center justify-center gap-1.5"
              style={{ height: 80, background: `${T.green}12`, borderBottom: `1px solid ${T.green}26` }}>
              <Upload className="w-4 h-4" style={{ color: T.greenLight }} />
              <span style={{ fontSize: T.bodyFontSize, color: T.textMuted, ...ff }}>Add image in editor</span>
            </div>
          )}
          {(heading || body) && (
            <div className="px-4 py-3">
              {heading && <p style={{ fontWeight: T.boldHeadings ? 700 : 500, fontSize: T.bodyFontSize, marginBottom: 4, color: T.textPrimary, ...ff }}>{heading}</p>}
              {body && <p style={{ fontSize: T.bodyFontSize, lineHeight: 1.5, color: T.textMuted, ...ff }}>{body}</p>}
            </div>
          )}
        </div>
      ) : null;
    }
    default: {
      const title = str(d, 'title'), content = str(d, 'content');
      return title || content ? (
        <div className="mx-3 mb-2.5 overflow-hidden"
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
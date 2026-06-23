{/* theme: converted */}
"use client";

import React from 'react';
import { Mail, Phone, Globe, MapPin, Upload } from 'lucide-react';
import type { ThemeOverride, LogoPosition } from '@/components/dashboard/pages/PhonePreview';

// ── Brand Logo Component (shared with PhonePreview) ─────────────────
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

interface HeroFormData {
  name: string;
  title: string;
  company: string;
  tagline?: string;
  email?: string;
  phone?: string;
  website?: string;
  location?: string;
}

export interface ProfileHeroProps {
  T: ThemeOverride;
  profileImage?: string;
  brandLogo?: string;
  logoPosition?: LogoPosition;
  formData: HeroFormData;
  /** When false the hero renders nothing (Profile section disabled). */
  enabled?: boolean;
}

/**
 * Layout-aware profile hero — renders the photo/name/logo header for every
 * `heroLayout` variant, plus the below-photo logo, tagline and quick-contact
 * grid. Shared by PhonePreview (dashboard live preview) and CardPreviewModal
 * (the Eye-icon popup) so both render identically.
 */
export function ProfileHero({
  T,
  profileImage = '',
  brandLogo = '',
  logoPosition = 'top-right',
  formData,
  enabled = true,
}: ProfileHeroProps) {
  if (enabled === false) return null;

  const heroLayout = T.heroLayout || 'default';
  const hasBrandLogo = !!brandLogo?.trim();
  const pName = formData.name;
  const pTitle = formData.title;
  const pCompany = formData.company;

  // `fit="contain"` shows the whole photo (no cropping) on full-bleed hero
  // banners; the default `cover` is kept for small circular avatars where a
  // filled frame is the expected look. In contain mode a blurred, zoomed copy
  // of the same photo fills the frame behind the sharp image — this keeps the
  // banner edge-to-edge (so wave/curve overlays stay visible) instead of
  // leaving flat letterbox bars.
  const PPhoto = ({ h, style: s, fit = 'cover' }: { h?: number | string; style?: React.CSSProperties; fit?: 'cover' | 'contain' }) => {
    if (!profileImage) {
      return (
        <div style={{ width: '100%', height: h ?? '100%', background: `linear-gradient(135deg, ${T.green}66 0%, ${T.bg} 50%, ${T.greenLight}44 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', ...s }}>
          <Upload className="w-7 h-7 opacity-30" style={{ color: T.greenLight }} />
        </div>
      );
    }
    if (fit === 'contain') {
      return (
        <div style={{ position: 'relative', width: '100%', height: h ?? '100%', overflow: 'hidden', ...s }}>
          <img src={profileImage} alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', filter: 'blur(16px) brightness(0.55)', transform: 'scale(1.15)', display: 'block' }} />
          <img src={profileImage} alt={pName} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', display: 'block' }} />
        </div>
      );
    }
    return <img src={profileImage} alt={pName} style={{ width: '100%', height: h ?? '100%', objectFit: 'cover', objectPosition: 'center 20%', display: 'block', ...s }} />;
  };

  const PNameInfo = ({ color = '#fff', titleColor = T.greenLight, companyColor = 'rgba(255,255,255,0.65)', align = 'left' as 'left'|'center' }) => (
    <div style={{ textAlign: align }}>
      {pName && <h1 style={{ color, fontSize: T.nameFontSize, lineHeight: 1.2, fontWeight: T.boldHeadings ? 800 : 600, fontFamily: T.fontFamily, wordBreak: 'break-word' }}>{pName}</h1>}
      {pTitle && <p style={{ color: titleColor, fontSize: T.bodyFontSize, marginTop: 2, fontFamily: T.fontFamily }}>{pTitle}</p>}
      {(pCompany || (hasBrandLogo && logoPosition === 'below-name')) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 1, justifyContent: align === 'center' ? 'center' : 'flex-start' }}>
          {hasBrandLogo && logoPosition === 'below-name' && (
            <div style={{ background: 'rgba(0,0,0,0.45)', padding: '2px 4px', borderRadius: 4, lineHeight: 0 }}>
              <img src={brandLogo} alt="Brand" style={{ maxWidth: 18, maxHeight: 18, objectFit: 'contain', borderRadius: 2 }} />
            </div>
          )}
          {pCompany && <p style={{ color: companyColor, fontSize: T.bodyFontSize - 1, fontFamily: T.fontFamily, fontWeight: T.boldHeadings ? 700 : 400 }}>{pCompany}</p>}
        </div>
      )}
    </div>
  );

  const PLogo = ({ pos }: { pos: string }) => hasBrandLogo && logoPosition === pos ? (
    <div style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', padding: 4, borderRadius: 8, lineHeight: 0 }}>
      <img src={brandLogo} alt="Brand" style={{ maxWidth: 40, maxHeight: 40, objectFit: 'contain', borderRadius: 6 }} />
    </div>
  ) : null;

  const contactItems = [
    formData.phone && { label: 'Call Us', sub: formData.phone, href: `tel:${formData.phone}`, Icon: Phone },
    formData.email && { label: 'Email', sub: formData.email, href: `mailto:${formData.email}`, Icon: Mail },
    formData.location && { label: 'Address', sub: formData.location, href: `https://maps.google.com/?q=${encodeURIComponent(formData.location)}`, Icon: MapPin },
    formData.website && { label: 'Website', sub: formData.website, href: formData.website, Icon: Globe },
  ].filter(Boolean) as { label: string; sub: string; href: string; Icon: React.ElementType }[];

  return (
    <>
      {/* ── HERO — layout-aware ── */}
      {heroLayout === 'wave-panel' && (
        <div style={{ position: 'relative', fontFamily: T.fontFamily }}>
          <div style={{ width: '100%', height: 160, overflow: 'hidden', position: 'relative', background: T.bg }}>
            <PPhoto h="100%" fit="contain" />
            <svg viewBox="0 0 200 36" preserveAspectRatio="none"
              style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 42, zIndex: 2 }}>
              <path d="M0,0 Q100,22 200,0 L200,36 L0,36 Z" fill={T.bg} />
            </svg>
          </div>
          {hasBrandLogo && logoPosition === 'top-right' && (
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 5 }}><PLogo pos="top-right" /></div>
          )}
          {hasBrandLogo && logoPosition === 'top-left' && (
            <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 5 }}><PLogo pos="top-left" /></div>
          )}
          <div style={{ background: T.bg, paddingTop: 12, paddingBottom: 4, paddingLeft: 16, paddingRight: 16, textAlign: 'center' }}>
            <PNameInfo align="center" companyColor={T.textMuted} titleColor={T.greenLight} />
          </div>
          <div style={{ height: 40, background: `linear-gradient(to bottom, ${T.bg} 0%, ${T.bg}99 30%, ${T.bg}44 60%, transparent 100%)`, pointerEvents: 'none' }} />
        </div>
      )}

      {heroLayout === 'side-panel' && (
        <div style={{ fontFamily: T.fontFamily }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '10px 14px', gap: 8, background: T.bg }}>
            {hasBrandLogo && !['below-photo','below-name','top-right','top-left'].includes(logoPosition) ? (
              <img src={brandLogo} alt="Brand" style={{ width: 28, height: 28, objectFit: 'contain', borderRadius: 6 }} />
            ) : !hasBrandLogo ? (
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: T.green, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                {(pCompany || pName || 'T')[0]?.toUpperCase()}
              </div>
            ) : null}
            {pCompany && <span style={{ fontWeight: 700, fontSize: 12, color: T.textPrimary, fontFamily: T.fontFamily }}>{pCompany}</span>}
          </div>
          <div style={{ margin: '0 10px 10px', borderRadius: T.cardRadius, overflow: 'hidden', display: 'flex', height: 110, position: 'relative' }}>
            <div style={{ width: '45%', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
              <PPhoto h="100%" />
              {hasBrandLogo && logoPosition === 'top-left' && (
                <div style={{ position: 'absolute', top: 6, left: 6, zIndex: 5 }}><PLogo pos="top-left" /></div>
              )}
            </div>
            <div style={{ flex: 1, background: T.card, padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
              {hasBrandLogo && logoPosition === 'top-right' && (
                <div style={{ position: 'absolute', top: 6, right: 6, zIndex: 5 }}><PLogo pos="top-right" /></div>
              )}
              <PNameInfo color={T.textPrimary} titleColor={T.greenLight} companyColor={T.textMuted} />
            </div>
          </div>
          <div style={{ height: 40, background: `linear-gradient(to bottom, ${T.bg} 0%, ${T.bg}99 30%, ${T.bg}44 60%, transparent 100%)`, pointerEvents: 'none' }} />
        </div>
      )}

      {heroLayout === 'group-diagonal' && (
        <div style={{ fontFamily: T.fontFamily }}>
          <div style={{ width: '100%', height: 130, position: 'relative', overflow: 'hidden', background: T.bg }}>
            <PPhoto h="100%" fit="contain" />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.5) 100%)' }} />
            {(!hasBrandLogo || logoPosition === 'top-right') && (
              <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 3 }}>
                {hasBrandLogo ? <PLogo pos="top-right" /> : (
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: T.green, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12 }}>
                    {(pCompany || pName || 'T')[0]?.toUpperCase()}
                  </div>
                )}
              </div>
            )}
            {hasBrandLogo && logoPosition === 'top-left' && (
              <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 3 }}><PLogo pos="top-left" /></div>
            )}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 130" preserveAspectRatio="none">
              <line x1="65" y1="0" x2="100" y2="90" stroke={T.green} strokeWidth="10" opacity="0.65" />
              <line x1="80" y1="0" x2="100" y2="45" stroke={T.greenLight} strokeWidth="7" opacity="0.45" />
            </svg>
          </div>
          <div style={{ position: 'relative', background: T.card, padding: '8px 14px 6px 74px', minHeight: 70 }}>
            <div style={{ position: 'absolute', top: -22, left: 12, width: 52, height: 64, borderRadius: 6, overflow: 'hidden', border: `2px solid ${T.green}` }}>
              <PPhoto h="100%" style={{ objectPosition: 'top' }} />
            </div>
            <PNameInfo color={T.textPrimary} titleColor={T.greenLight} companyColor={T.textMuted} />
          </div>
          <div style={{ height: 40, background: `linear-gradient(to bottom, ${T.card} 0%, ${T.card}99 30%, ${T.card}44 60%, transparent 100%)`, pointerEvents: 'none' }} />
        </div>
      )}

      {heroLayout === 'circle-overlap' && (
        <div style={{ fontFamily: T.fontFamily }}>
          <div style={{ width: '100%', height: 140, position: 'relative', overflow: 'hidden', background: T.bg }}>
            <PPhoto h="100%" fit="contain" />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.5) 100%)' }} />
            {hasBrandLogo && logoPosition === 'top-right' && (
              <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 5 }}><PLogo pos="top-right" /></div>
            )}
            {hasBrandLogo && logoPosition === 'top-left' && (
              <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 5 }}><PLogo pos="top-left" /></div>
            )}
          </div>
          <div style={{ background: T.bg, paddingBottom: 4, textAlign: 'center' }}>
            <div style={{ marginTop: -42, display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', border: '3px solid #fff', boxShadow: '0 4px 16px rgba(0,0,0,0.3)', background: T.card }}>
                <PPhoto h="100%" style={{ objectPosition: 'top' }} />
              </div>
            </div>
            <div style={{ padding: '8px 16px 0' }}>
              <PNameInfo align="center" companyColor={T.textMuted} titleColor={T.greenLight} />
            </div>
          </div>
          <div style={{ height: 40, background: `linear-gradient(to bottom, ${T.bg} 0%, ${T.bg}99 30%, ${T.bg}44 60%, transparent 100%)`, pointerEvents: 'none' }} />
        </div>
      )}

      {heroLayout === 'circle-center' && (
        <div style={{ position: 'relative', background: T.bg, padding: '32px 16px 12px', fontFamily: T.fontFamily }}>
          {hasBrandLogo && logoPosition === 'top-left' && (
            <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 5 }}><PLogo pos="top-left" /></div>
          )}
          {hasBrandLogo && logoPosition === 'top-right' && (
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 5 }}><PLogo pos="top-right" /></div>
          )}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <div style={{ width: 86, height: 86, borderRadius: '50%', overflow: 'hidden', boxShadow: '0 4px 18px rgba(0,0,0,0.15)', background: T.card }}>
              <PPhoto h="100%" style={{ objectPosition: 'top' }} />
            </div>
          </div>
          <PNameInfo color={T.textPrimary} titleColor={T.textMuted} companyColor={T.green} />
          <div style={{ position: 'absolute', bottom: -40, left: 0, right: 0, height: 40, background: `linear-gradient(to bottom, ${T.bg} 0%, ${T.bg}99 30%, ${T.bg}44 60%, transparent 100%)`, pointerEvents: 'none', zIndex: 1 }} />
        </div>
      )}

      {heroLayout === 'top-banner' && (
        <div style={{ fontFamily: T.fontFamily }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '10px 14px', gap: 8, background: T.bg }}>
            {hasBrandLogo && !['below-photo','below-name','top-right','top-left'].includes(logoPosition) ? (
              <img src={brandLogo} alt="Brand" style={{ width: 26, height: 26, objectFit: 'contain', borderRadius: 6 }} />
            ) : !hasBrandLogo ? (
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: T.green, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>
                {(pCompany || pName || 'T')[0]?.toUpperCase()}
              </div>
            ) : null}
            {pCompany && <span style={{ fontWeight: 700, fontSize: 11, color: T.textPrimary, fontFamily: T.fontFamily }}>{pCompany}</span>}
          </div>
          <div style={{ background: T.green, padding: '12px 16px' }}>
            <PNameInfo color="#fff" titleColor="rgba(255,255,255,0.9)" companyColor="rgba(255,255,255,0.7)" />
          </div>
          <div style={{ width: '100%', height: 160, overflow: 'hidden', position: 'relative', background: T.bg }}>
            <PPhoto h="100%" fit="contain" />
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 30%, ${T.bg}88 65%, ${T.bg}cc 80%, ${T.bg} 100%)` }} />
            {hasBrandLogo && logoPosition === 'top-left' && (
              <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 5 }}><PLogo pos="top-left" /></div>
            )}
            {hasBrandLogo && logoPosition === 'top-right' && (
              <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 5 }}><PLogo pos="top-right" /></div>
            )}
          </div>
        </div>
      )}

      {heroLayout === 'torn-edge' && (
        <div style={{ fontFamily: T.fontFamily, position: 'relative' }}>
          <div style={{
            width: '100%', height: 170, position: 'relative',
            clipPath: 'polygon(0 0, 100% 0, 100% 80%, 97% 68%, 93% 82%, 89% 68%, 85% 81%, 81% 66%, 77% 80%, 73% 68%, 69% 82%, 65% 68%, 61% 81%, 57% 67%, 53% 81%, 49% 68%, 45% 81%, 41% 68%, 37% 80%, 33% 66%, 29% 78%, 25% 66%, 21% 78%, 17% 65%, 13% 77%, 9% 65%, 5% 76%, 2% 65%, 0 74%)',
          }}>
            <PPhoto h="100%" style={{ objectPosition: 'center top' }} />
          </div>
          {/* "Top Left" feeds the dedicated circular badge below for this layout; other
              positions render as normal floating overlays (badge falls back to initials). */}
          {hasBrandLogo && logoPosition === 'top-right' && (
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}><PLogo pos="top-right" /></div>
          )}
          <div style={{ position: 'relative', background: T.bg, paddingTop: 6, paddingLeft: 64, paddingRight: 14, paddingBottom: 6, minHeight: 68 }}>
            <div style={{
              position: 'absolute', top: -26, left: 14, width: 52, height: 52,
              borderRadius: '50%', border: '3px solid #fff', boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
              background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              {hasBrandLogo && logoPosition === 'top-left' ? (
                <img src={brandLogo} alt="Brand" style={{ width: 38, height: 38, objectFit: 'contain', borderRadius: '50%' }} />
              ) : (
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: T.green, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 18 }}>
                  {(pCompany || pName || 'T')[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <PNameInfo color={T.textPrimary} titleColor={T.textMuted} companyColor={T.green} />
          </div>
          <div style={{ height: 40, background: `linear-gradient(to bottom, ${T.bg} 0%, ${T.bg}99 30%, ${T.bg}44 60%, transparent 100%)`, pointerEvents: 'none' }} />
        </div>
      )}

      {heroLayout === 'wave-logo' && (
        <div style={{ fontFamily: T.fontFamily, position: 'relative' }}>
          <div style={{ width: '100%', height: 190, position: 'relative', overflow: 'hidden', background: T.bg }}>
            <PPhoto h="100%" fit="contain" />
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 35%, ${T.green}55 100%)` }} />
            <svg viewBox="0 0 400 60" preserveAspectRatio="none"
              style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 38, zIndex: 1 }}>
              <path d="M0,40 C100,10 300,55 400,20 L400,60 L0,60 Z" fill={T.green} opacity="0.3" />
            </svg>
            <svg viewBox="0 0 400 60" preserveAspectRatio="none"
              style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 34, zIndex: 2 }}>
              <path d="M0,36 C100,6 300,54 400,22 L400,60 L0,60 Z" fill={T.bg} />
            </svg>
            {/* "Top Left" feeds the dedicated circular badge below for this layout; other
                positions render as normal floating overlays (badge falls back to initials). */}
            {hasBrandLogo && logoPosition === 'top-right' && (
              <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}><PLogo pos="top-right" /></div>
            )}
          </div>
          <div style={{
            position: 'absolute', top: 160, left: 16, zIndex: 5,
          }}>
            <div style={{
              width: 58, height: 58, borderRadius: '50%',
              border: `3px solid ${T.green}`, boxShadow: `0 3px 14px rgba(0,0,0,0.3)`,
              background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              {hasBrandLogo && logoPosition === 'top-left' ? (
                <img src={brandLogo} alt="Brand" style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: '50%' }} />
              ) : (
                <div style={{ width: 50, height: 50, borderRadius: '50%', background: T.green, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 20 }}>
                  {(pCompany || pName || 'T')[0]?.toUpperCase()}
                </div>
              )}
            </div>
          </div>
          <div style={{ background: T.bg, paddingTop: 10, paddingLeft: 82, paddingRight: 14, paddingBottom: 6, minHeight: 68 }}>
            <PNameInfo color={T.textPrimary} titleColor={T.greenLight} companyColor={T.textMuted} />
          </div>
          <div style={{ height: 40, background: `linear-gradient(to bottom, ${T.bg} 0%, ${T.bg}99 30%, ${T.bg}44 60%, transparent 100%)`, pointerEvents: 'none' }} />
        </div>
      )}

      {heroLayout === 'wave-side' && (
        <div style={{ fontFamily: T.fontFamily, position: 'relative' }}>
          <div style={{ width: '100%', height: 180, position: 'relative', overflow: 'hidden', display: 'flex' }}>
            <div style={{ flex: 1, background: T.bg, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '14px 14px 36px 14px', position: 'relative', zIndex: 2 }}>
              <PNameInfo color={T.textPrimary} titleColor={T.green} companyColor={T.textMuted} />
            </div>
            <div style={{ width: '46%', position: 'relative', overflow: 'hidden', flexShrink: 0, alignSelf: 'stretch' }}>
              <PPhoto h="100%" style={{ objectPosition: 'center top' }} />
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, ${T.bg} 0%, ${T.bg}dd 18%, ${T.bg}88 35%, transparent 62%)` }} />
            </div>
            <svg viewBox="0 0 400 60" preserveAspectRatio="none"
              style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 40, zIndex: 3, opacity: 0.45 }}>
              <path d="M0,28 C60,4 160,50 260,16 C330,0 375,30 400,12 L400,60 L0,60 Z" fill={T.green} />
            </svg>
            <svg viewBox="0 0 400 60" preserveAspectRatio="none"
              style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 30, zIndex: 4 }}>
              <path d="M0,18 C70,0 170,34 275,8 C342,0 380,22 400,8 L400,60 L0,60 Z" fill={T.bg} />
            </svg>
            {hasBrandLogo && logoPosition === 'top-left' && (
              <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 6 }}><PLogo pos="top-left" /></div>
            )}
            {hasBrandLogo && logoPosition === 'top-right' && (
              <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 6 }}><PLogo pos="top-right" /></div>
            )}
            <div style={{ position: 'absolute', bottom: 12, right: 12, zIndex: 5 }}>
              {hasBrandLogo && !['top-left', 'top-right'].includes(logoPosition) ? (
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#fff', border: `2px solid ${T.green}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                  <img src={brandLogo} alt="Brand" style={{ width: 22, height: 22, objectFit: 'contain' }} />
                </div>
              ) : (
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: T.green, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12, border: `2px solid ${T.bg}` }}>
                  {(pCompany || pName || 'T')[0]?.toUpperCase()}
                </div>
              )}
            </div>
          </div>
          <div style={{ height: 40, background: `linear-gradient(to bottom, ${T.bg} 0%, ${T.bg}99 30%, ${T.bg}44 60%, transparent 100%)`, pointerEvents: 'none' }} />
        </div>
      )}

      {heroLayout === 'wave-icons' && (
        <div style={{ fontFamily: T.fontFamily, position: 'relative' }}>
          <div style={{ width: '100%', height: 162, position: 'relative', overflow: 'hidden', background: T.bg }}>
            <PPhoto h="100%" fit="contain" />
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 30%, ${T.green}88 100%)` }} />
            {hasBrandLogo && logoPosition === 'top-right' && (
              <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 5 }}><PLogo pos="top-right" /></div>
            )}
            {hasBrandLogo && logoPosition === 'top-left' && (
              <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 5 }}><PLogo pos="top-left" /></div>
            )}
            <svg viewBox="0 0 400 60" preserveAspectRatio="none"
              style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 42, zIndex: 1, opacity: 0.4 }}>
              <path d="M0,38 C60,10 150,50 230,18 C300,0 360,36 400,16 L400,60 L0,60 Z" fill={T.greenLight} />
            </svg>
            <svg viewBox="0 0 400 60" preserveAspectRatio="none"
              style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 34, zIndex: 2, opacity: 0.65 }}>
              <path d="M0,26 C80,4 190,46 280,14 C345,2 385,28 400,10 L400,60 L0,60 Z" fill={T.bg} />
            </svg>
            <svg viewBox="0 0 400 60" preserveAspectRatio="none"
              style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 24, zIndex: 3 }}>
              <path d="M0,16 C70,0 165,30 265,8 C330,0 375,20 400,6 L400,60 L0,60 Z" fill={T.bg} />
            </svg>
          </div>
          <div style={{ background: T.bg, padding: '10px 14px 6px' }}>
            <PNameInfo color={T.textPrimary} titleColor={T.greenLight} companyColor={T.textMuted} />
          </div>
          <div style={{ height: 40, background: `linear-gradient(to bottom, ${T.bg} 0%, ${T.bg}99 30%, ${T.bg}44 60%, transparent 100%)`, pointerEvents: 'none' }} />
        </div>
      )}

      {heroLayout === 'slash-wave' && (
        <div style={{ fontFamily: T.fontFamily, position: 'relative' }}>
          <div style={{ width: '100%', height: 148, position: 'relative', overflow: 'hidden', background: T.bg }}>
            <PPhoto h="100%" fit="contain" />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.55) 100%)' }} />
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 148" preserveAspectRatio="none">
              <line x1="60" y1="0" x2="100" y2="90" stroke={T.green} strokeWidth="9" opacity="0.7" />
              <line x1="76" y1="0" x2="100" y2="50" stroke={T.greenLight} strokeWidth="6" opacity="0.45" />
              <line x1="50" y1="0" x2="95" y2="110" stroke={T.green} strokeWidth="3" opacity="0.28" />
            </svg>
            {(!hasBrandLogo || logoPosition === 'top-right') && (
              <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 3 }}>
                {hasBrandLogo ? <PLogo pos="top-right" /> : (
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: T.green, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12 }}>
                    {(pCompany || pName || 'T')[0]?.toUpperCase()}
                  </div>
                )}
              </div>
            )}
            {hasBrandLogo && logoPosition === 'top-left' && (
              <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 3 }}><PLogo pos="top-left" /></div>
            )}
            <svg viewBox="0 0 400 60" preserveAspectRatio="none"
              style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 40, zIndex: 4, opacity: 0.7 }}>
              <path d="M0,30 C60,6 160,50 260,16 C330,0 375,30 400,12 L400,60 L0,60 Z" fill={T.green} />
            </svg>
            <svg viewBox="0 0 400 60" preserveAspectRatio="none"
              style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 28, zIndex: 5 }}>
              <path d="M0,16 C80,0 185,30 290,8 C352,0 385,20 400,6 L400,60 L0,60 Z" fill={T.card} />
            </svg>
          </div>
          <div style={{ position: 'relative', background: T.card, padding: '10px 14px 6px 82px', minHeight: 68 }}>
            <div style={{ position: 'absolute', top: -26, left: 14, width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${T.green}`, boxShadow: `0 2px 12px rgba(0,0,0,0.3)` }}>
              <PPhoto h="100%" style={{ objectPosition: 'center top' }} />
            </div>
            <PNameInfo color={T.textPrimary} titleColor={T.greenLight} companyColor={T.textMuted} />
          </div>
          <div style={{ height: 40, background: `linear-gradient(to bottom, ${T.card} 0%, ${T.card}99 30%, ${T.card}44 60%, transparent 100%)`, pointerEvents: 'none' }} />
        </div>
      )}

      {heroLayout === 'default' && (
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'relative', minHeight: 220, width: '100%', overflow: 'hidden', background: '#000', display: 'flex', flexDirection: 'column', justifyItems: 'flex-end', justifyContent: 'flex-end' }}>
            {profileImage ? (
              <>
                <img src={profileImage} alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', filter: 'blur(16px) brightness(0.55)', transform: 'scale(1.15)', display: 'block' }} />
                <img src={profileImage} alt={pName} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center', display: 'block' }} />
              </>
            ) : (
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${T.green}66 0%, ${T.bg} 50%, ${T.greenLight}44 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Upload className="w-7 h-7 opacity-30" style={{ color: T.greenLight }} />
              </div>
            )}
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 15%, ${T.bg}66 50%, ${T.bg}cc 75%, ${T.bg} 100%)` }} />
            {hasBrandLogo && logoPosition === 'top-left' && (
              <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 10 }}><BrandLogoBadge src={brandLogo} maxSize={48} padding="5px" borderRadius={10} /></div>
            )}
            {hasBrandLogo && logoPosition === 'top-right' && (
              <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}><BrandLogoBadge src={brandLogo} maxSize={48} padding="5px" borderRadius={10} /></div>
            )}
            <div style={{ position: 'relative', padding: '40px 16px 8px', zIndex: 10 }}>
              <PNameInfo color="#fff" titleColor={T.greenLight} companyColor="rgba(255,255,255,0.65)" />
            </div>
          </div>
          <div style={{ height: 40, background: `linear-gradient(to bottom, ${T.bg} 0%, ${T.bg}99 30%, ${T.bg}44 60%, transparent 100%)`, pointerEvents: 'none', marginTop: -1 }} />
        </div>
      )}

      {/* Below-photo brand logo (for layouts where it's not already inside hero) */}
      {hasBrandLogo && logoPosition === 'below-photo' && (
        <div className="flex justify-center py-2.5">
          <BrandLogoBadge src={brandLogo} bg={T.card} blur={false} maxSize={80} padding="8px 12px" borderRadius={12} border={`1px solid ${T.cardBorder}`} />
        </div>
      )}

      {/* Tagline (if any) */}
      {formData.tagline && (
        <div className="px-4 py-2.5 text-center">
          <p style={{ fontSize: T.bodyFontSize, fontStyle: 'italic', lineHeight: 1.5, color: T.textMuted, fontFamily: T.fontFamily, wordBreak: 'break-word', overflowWrap: 'anywhere', maxWidth: '100%' }}>{formData.tagline}</p>
        </div>
      )}

      {/* Quick contact icons (phone, email, map, website) */}
      {contactItems.length > 0 && (
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
    </>
  );
}

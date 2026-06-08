"use client";

import React from 'react';
import type { CardTemplate } from '@/data/cardTemplates';

const PhoneFrame: React.FC<{ children: React.ReactNode; bg: string }> = ({ children, bg }) => (
  <div style={{
    position: 'relative', width: '100%', aspectRatio: '9 / 16',
    borderRadius: 14, overflow: 'hidden', background: bg,
    border: '2px solid rgba(255,255,255,0.08)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
  }}>
    <div style={{
      position: 'absolute', top: 5, left: '50%', transform: 'translateX(-50%)',
      width: '30%', height: 5, background: '#000', borderRadius: 4, zIndex: 10,
    }} />
    {children}
  </div>
);

const Portrait: React.FC<{ src: string; style?: React.CSSProperties; filter?: string }> = ({ src, style, filter }) => (
  <img
    src={src}
    alt="Profile"
    style={{
      width: '100%', height: '100%',
      objectFit: 'cover', objectPosition: 'top center',
      display: 'block',
      ...(filter ? { filter } : {}),
      ...style,
    }}
  />
);

// Renders the brand logo image, or a plain colored square if no logo is provided.
const LogoBadge: React.FC<{ src: string | null | undefined; size: number; accent: string; radius?: number }> = ({
  src, size, accent, radius = 2,
}) => {
  if (src) {
    return (
      <img
        src={src}
        alt="Brand"
        style={{ width: size, height: size, objectFit: 'contain', borderRadius: radius, display: 'block' }}
      />
    );
  }
  return <div style={{ width: size, height: size, borderRadius: radius, background: accent }} />;
};

// Renders the brand logo inside a circle (replaces the "T" / "A" letter circles).
const LogoCircle: React.FC<{ src: string | null | undefined; size: number; accent: string; border?: string; bg?: string }> = ({
  src, size, accent, border, bg = 'rgba(255,255,255,0.12)',
}) => {
  if (src) {
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%', overflow: 'hidden',
        background: '#fff',
        border: border ?? `1px solid ${accent}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <img src={src} alt="Brand" style={{ width: '80%', height: '80%', objectFit: 'contain', display: 'block' }} />
      </div>
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontSize: size * 0.38, fontWeight: 700,
      border: border ?? 'none', flexShrink: 0,
    }}>B</div>
  );
};

const IconRow: React.FC<{ gradient: string; accent: string; filled?: boolean }> = ({ gradient, accent, filled }) => (
  <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginTop: 5 }}>
    {['☎','✉','💬'].map((g, i) => (
      <div key={i} style={{
        width: 12, height: 12, borderRadius: '50%',
        background: filled ? gradient : 'transparent',
        border: `1.5px solid ${accent}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 5, color: filled ? '#fff' : accent,
      }}>{g}</div>
    ))}
  </div>
);

const AboutCard: React.FC<{ bg: string; textColor: string; accent: string }> = ({ bg, textColor, accent }) => (
  <div style={{ margin: '4px 6px', background: bg, borderRadius: 5, padding: '4px 6px' }}>
    <div style={{ fontSize: 5, fontWeight: 700, color: accent, marginBottom: 2 }}>About Me</div>
    <div style={{ width: '90%', height: 2.5, background: textColor, borderRadius: 999, opacity: 0.4 }} />
    <div style={{ marginTop: 1.5, width: '70%', height: 2.5, background: textColor, borderRadius: 999, opacity: 0.25 }} />
  </div>
);

const LogoBar: React.FC<{ accent: string; accentGradient: string; textColor: string; label: string; logo?: string | null }> = ({ accent, accentGradient, textColor, label, logo }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 8px 3px' }}>
    <LogoCircle src={logo} size={10} accent={accent} border="none" bg={accentGradient} />
    <div style={{ fontSize: 5, fontWeight: 700, color: textColor }}>{label}</div>
  </div>
);

const NameBlock: React.FC<{ name?: string; title?: string; company?: string; textColor: string; accent: string; muteColor?: string; align?: 'left'|'center' }> = ({
  name = 'Name', title = 'Title', company = 'Company', textColor, accent, muteColor, align = 'left'
}) => (
  <div style={{ textAlign: align }}>
    <div style={{ fontSize: 7, fontWeight: 700, color: textColor, lineHeight: 1.2 }}>{name}</div>
    <div style={{ fontSize: 5, color: accent, marginTop: 1.5 }}>{title}</div>
    <div style={{ fontSize: 5, color: muteColor || textColor, opacity: 0.65, marginTop: 1, fontWeight: 600 }}>{company}</div>
  </div>
);

export default function TemplateThumb({ template }: { template: CardTemplate }) {
  const { preview: p, defaultContent: c } = template;
  const layout = p.layout;
  const profileImg = c.profileImage ?? '/profileImages/alex-morgan.jpg';
  const brandLogo = c.brandLogo ?? null;

  // ── 1. full-photo-wave — Medical Teal ──────────────────────────
  if (layout === 'full-photo-wave') {
    return (
      <PhoneFrame bg={p.bg}>
        <div style={{ width: '100%', height: '52%', position: 'relative', overflow: 'hidden' }}>
          <Portrait src={profileImg} />
          {/* Flowing colour wash over the photo bottom */}
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 45%, ${p.accent}55 100%)` }} />
          <svg viewBox="0 0 200 32" preserveAspectRatio="none"
            style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 20, zIndex: 2 }}>
            <defs>
              <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={p.accent} stopOpacity="1" />
                <stop offset="100%" stopColor={p.accentLight} stopOpacity="0.85" />
              </linearGradient>
            </defs>
            <path d="M0,0 Q100,20 200,0 L200,32 L0,32 Z" fill={p.panel} />
          </svg>
        </div>
        <div style={{ background: p.panelGradient, padding: '8px 8px 6px', textAlign: 'center' }}>
          <NameBlock textColor={p.text} accent={p.accentLight} muteColor={p.accentLight} align="center" />
          <IconRow accent={p.accentLight} gradient={p.accentGradient} filled />
        </div>
        <AboutCard bg="rgba(255,255,255,0.07)" textColor={p.text} accent={p.accentLight} />
      </PhoneFrame>
    );
  }

  // ── 2. side-panel — Teamwork Orange ───────────────────────────
  if (layout === 'side-panel') {
    return (
      <PhoneFrame bg={p.bg}>
        <LogoBar accent={p.accent} accentGradient={p.accentGradient} textColor={p.text} label={c.company ?? 'Company'} logo={brandLogo} />
        <div style={{ display: 'flex', margin: '4px 6px', borderRadius: 6, overflow: 'hidden', height: '36%' }}>
          <div style={{ width: '44%', flexShrink: 0, position: 'relative' }}>
            <Portrait src={profileImg} />
            {/* Warm gradient bleed into side panel */}
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, transparent 60%, ${p.accent}44 100%)` }} />
          </div>
          <div style={{ flex: 1, background: p.panelGradient, padding: '5px 6px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <NameBlock textColor={p.text} accent={p.accentLight} muteColor={p.text} />
          </div>
        </div>
        {/* Gradient pill button */}
        <div style={{ margin: '5px 6px', background: p.accentGradient, borderRadius: 999, padding: '4px 0', display: 'flex', justifyContent: 'center', gap: 5 }}>
          {['☎','✉','💬'].map((g, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', border: '1.5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 4, color: '#fff' }}>{g}</div>
          ))}
        </div>
        <AboutCard bg={p.panelGradient} textColor={p.text} accent={p.accent} />
      </PhoneFrame>
    );
  }

  // ── 3. group-photo — Team Pro ──────────────────────────────────
  if (layout === 'group-photo') {
    return (
      <PhoneFrame bg={p.panelGradient}>
        <div style={{ width: '100%', height: '38%', position: 'relative', overflow: 'hidden' }}>
          <Portrait src={profileImg} />
          {/* Gradient ribbon lines */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 80">
            <defs>
              <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={p.accent} stopOpacity="0.9" />
                <stop offset="100%" stopColor={p.accentLight} stopOpacity="0.5" />
              </linearGradient>
            </defs>
            <line x1="65" y1="0" x2="100" y2="60" stroke="url(#ribbonGrad)" strokeWidth="8" />
            <line x1="80" y1="0" x2="100" y2="32" stroke={p.accentLight} strokeWidth="5" opacity="0.55" />
          </svg>
          {/* Brand logo circle top-right */}
          <div style={{ position: 'absolute', top: 4, right: 4, zIndex: 2 }}>
            <LogoCircle src={brandLogo} size={13} accent={p.accent} border="none" bg={p.accentGradient} />
          </div>
          {/* Brand logo badge top-left */}
          <div style={{ position: 'absolute', top: 4, left: 4, width: 13, height: 13, borderRadius: 3, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}>
            <LogoBadge src={brandLogo} size={9} accent={p.accentLight} />
          </div>
          {/* Bottom fade into panel */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', background: `linear-gradient(180deg, transparent 0%, ${p.panel}cc 100%)` }} />
        </div>
        <div style={{ position: 'relative', padding: '28px 8px 6px 8px' }}>
          <div style={{
            position: 'absolute', top: -16, left: 6,
            width: 26, height: 34, borderRadius: 3, overflow: 'hidden',
            border: `1.5px solid ${p.accent}`,
          }}>
            <Portrait src={profileImg} />
          </div>
          <div style={{ paddingLeft: 36 }}>
            <NameBlock textColor="#fff" accent={p.accentLight} muteColor="rgba(255,255,255,0.6)" />
          </div>
          <IconRow accent={p.accent} gradient={p.accentGradient} filled />
        </div>
        <AboutCard bg="rgba(255,255,255,0.06)" textColor="#fff" accent={p.accentLight} />
      </PhoneFrame>
    );
  }

  // ── 4. gold-curve — Heritage Gold ─────────────────────────────
  if (layout === 'gold-curve') {
    return (
      <PhoneFrame bg={p.bg}>
        <div style={{ width: '100%', height: '50%', position: 'relative', overflow: 'hidden' }}>
          <Portrait src={profileImg} />
          <div style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(0,0,0,0.5)', padding: 2, borderRadius: 3, lineHeight: 0, zIndex: 3 }}>
            <LogoBadge src={brandLogo} size={9} accent={p.accentLight} />
          </div>
          {/* Gold shimmer wash at bottom */}
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 50%, ${p.accent}66 100%)` }} />
          <svg viewBox="0 0 200 32" preserveAspectRatio="none"
            style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 20, zIndex: 2 }}>
            <defs>
              <linearGradient id="goldWave" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={p.panel} />
                <stop offset="100%" stopColor={p.accent + '33'} />
              </linearGradient>
            </defs>
            <path d="M0,0 Q100,20 200,0 L200,32 L0,32 Z" fill={p.panel} />
          </svg>
        </div>
        <div style={{ background: p.panelGradient, padding: '8px 8px 6px', textAlign: 'center' }}>
          <NameBlock textColor={p.text} accent={p.accentLight} muteColor="rgba(255,255,255,0.6)" align="center" />
          <IconRow accent={p.accent} gradient={p.accentGradient} filled />
        </div>
        <AboutCard bg="rgba(255,255,255,0.06)" textColor={p.text} accent={p.accentLight} />
      </PhoneFrame>
    );
  }

  // ── 5. curve-photo — Royal Purple ─────────────────────────────
  if (layout === 'curve-photo') {
    return (
      <PhoneFrame bg={p.bg}>
        <div style={{ width: '100%', height: '42%', overflow: 'hidden', position: 'relative' }}>
          <Portrait src={profileImg} />
          {/* Purple colour wash over photo */}
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 30%, ${p.accent}88 100%)` }} />
          <div style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(0,0,0,0.5)', padding: 2, borderRadius: 3, lineHeight: 0, zIndex: 4 }}>
            <LogoBadge src={brandLogo} size={9} accent={p.accentLight} />
          </div>
        </div>
        <svg viewBox="0 0 200 28" preserveAspectRatio="none"
          style={{ position: 'absolute', top: 'calc(42% - 15px)', left: 0, width: '100%', height: 18, zIndex: 2 }}>
          <defs>
            <linearGradient id="purveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={p.panel} />
              <stop offset="100%" stopColor={p.accentLight + '44'} />
            </linearGradient>
          </defs>
          <path d="M0,28 L0,8 Q80,28 200,6 L200,28 Z" fill={p.panel} />
        </svg>
        {/* Brand logo circle at right edge of curve */}
        <div style={{
          position: 'absolute', top: 'calc(42% - 20px)', right: 10, zIndex: 4,
        }}>
          <LogoCircle src={brandLogo} size={18} accent={p.accentLight} border="none" bg={p.accentGradient} />
        </div>
        <div style={{ position: 'absolute', top: 'calc(42% + 3px)', left: 0, right: 0, bottom: 0, padding: '14px 8px 6px', background: p.panelGradient, zIndex: 1 }}>
          <NameBlock textColor="#fff" accent={p.accentLight} muteColor="rgba(255,255,255,0.55)" />
          <div style={{ display: 'flex', gap: 4, marginTop: 5 }}>
            {['☎','✉','💬'].map((g, i) => (
              <div key={i} style={{ width: 13, height: 13, borderRadius: '50%', background: p.accentGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 5, color: '#fff' }}>{g}</div>
            ))}
          </div>
        </div>
        <AboutCard bg="rgba(255,255,255,0.08)" textColor="#fff" accent={p.accentLight} />
      </PhoneFrame>
    );
  }

  // ── 6. circle-center — Minimal Mono ───────────────────────────
  if (layout === 'circle-center') {
    return (
      <PhoneFrame bg={p.bg}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: 5, left: 5, background: 'rgba(255,255,255,0.15)', padding: 2, borderRadius: 3, lineHeight: 0, zIndex: 5 }}>
            <LogoBadge src={brandLogo} size={9} accent={p.accent} />
          </div>
          <div style={{ position: 'absolute', top: 5, right: 5, background: 'rgba(255,255,255,0.15)', padding: 2, borderRadius: 3, lineHeight: 0, zIndex: 5 }}>
            <LogoBadge src={brandLogo} size={9} accent={p.accent} />
          </div>
          <div style={{ paddingTop: '18%', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '36%', aspectRatio: '1', borderRadius: '50%', overflow: 'hidden',
              border: `2px solid transparent`,
              background: `${p.accentGradient} border-box`,
              boxShadow: `0 0 12px ${p.accent}55`,
            }}>
              <Portrait src={profileImg} />
            </div>
          </div>
        </div>
        <div style={{ padding: '8px 10px 4px' }}>
          <NameBlock textColor={p.text} accent={p.accent} muteColor={p.accentLight} />
        </div>
        <div style={{ display: 'flex', gap: 4, padding: '3px 10px' }}>
          {['☎','✉','💬'].map((g, i) => (
            <div key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: p.accentGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 4, color: '#fff' }}>{g}</div>
          ))}
        </div>
        <AboutCard bg={p.panelGradient} textColor={p.text} accent={p.accent} />
      </PhoneFrame>
    );
  }

  // ── 7. top-banner — Sunset Banner ─────────────────────────────
  if (layout === 'top-banner') {
    return (
      <PhoneFrame bg={p.bg}>
        <LogoBar accent={p.accent} accentGradient={p.accentGradient} textColor="rgba(255,255,255,0.85)" label={c.company ?? 'Company'} logo={brandLogo} />
        {/* Gradient name banner */}
        <div style={{ margin: '0 6px', background: p.accentGradient, borderRadius: 6, padding: '5px 7px' }}>
          <NameBlock textColor="#fff" accent="rgba(255,255,255,0.9)" muteColor="rgba(255,255,255,0.65)" />
        </div>
        <div style={{ margin: '5px 6px', height: '32%', borderRadius: 5, overflow: 'hidden', position: 'relative' }}>
          <Portrait src={profileImg} />
          {/* Warm sunset overlay */}
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${p.accent}22 0%, transparent 60%)` }} />
        </div>
        <IconRow accent={p.accent} gradient={p.accentGradient} filled />
        <AboutCard bg={p.panelGradient} textColor="#fff" accent={p.accentLight} />
      </PhoneFrame>
    );
  }

  // ── 8. sky-circle — Sky Circle ────────────────────────────────
  if (layout === 'sky-circle') {
    return (
      <PhoneFrame bg={p.panelGradient}>
        <div style={{ width: '100%', height: '30%', overflow: 'hidden', position: 'relative' }}>
          <Portrait src={profileImg} />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 40%, ${p.accent}88 100%)` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: -16, position: 'relative', zIndex: 2 }}>
          <div style={{
            width: '26%', aspectRatio: '1', borderRadius: '50%', overflow: 'hidden',
            border: '2px solid #fff',
            boxShadow: `0 0 10px ${p.accent}88`,
          }}>
            <Portrait src={profileImg} />
          </div>
        </div>
        <div style={{ padding: '4px 8px', textAlign: 'center' }}>
          <NameBlock textColor="#fff" accent={p.accentLight} muteColor="rgba(255,255,255,0.7)" align="center" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginTop: 3 }}>
          {['☎','✉','💬'].map((g, i) => (
            <div key={i} style={{ width: 13, height: 13, borderRadius: '50%', background: p.accentGradient, border: '1.5px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 5, color: '#fff' }}>{g}</div>
          ))}
        </div>
        <AboutCard bg="rgba(255,255,255,0.12)" textColor="#fff" accent="#fff" />
      </PhoneFrame>
    );
  }

  // ── 9. dark-hero — Onyx Pro ───────────────────────────────────
  if (layout === 'dark-hero') {
    return (
      <PhoneFrame bg={p.bg}>
        <div style={{ width: '100%', height: '55%', position: 'relative', overflow: 'hidden' }}>
          <Portrait src={profileImg} filter="grayscale(80%)" />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.75) 75%, ${p.panel} 100%)` }} />
          {/* Neon glow accent at bottom */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: p.accentGradient, opacity: 0.8 }} />
          {/* Brand logo circle centered above name */}
          <div style={{ position: 'absolute', bottom: 22, left: '50%', transform: 'translateX(-50%)', zIndex: 3 }}>
            <LogoCircle src={brandLogo} size={16} accent={p.accent} border={`1px solid ${p.accent}`} bg={p.accentGradient} />
          </div>
          <div style={{ position: 'absolute', bottom: 4, left: 8, right: 8 }}>
            <NameBlock textColor="#fff" accent={p.accentLight} muteColor="rgba(255,255,255,0.5)" />
          </div>
        </div>
        <div style={{ padding: '6px 8px', background: p.panelGradient }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {['☎','✉','💬'].map((g, i) => (
              <div key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: p.accentGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 4, color: '#000' }}>{g}</div>
            ))}
          </div>
        </div>
        <AboutCard bg="rgba(255,255,255,0.04)" textColor={p.accentLight} accent={p.accentLight} />
      </PhoneFrame>
    );
  }

  // ── 10. torn-paper — Mocha Torn ───────────────────────────────
  if (layout === 'torn-paper') {
    return (
      <PhoneFrame bg={p.bg}>
        <div style={{
          width: '100%', height: '38%', position: 'relative', overflow: 'visible',
          clipPath: 'polygon(0 0, 100% 0, 100% 84%, 95% 70%, 90% 86%, 85% 70%, 80% 84%, 74% 68%, 68% 82%, 62% 68%, 56% 83%, 50% 68%, 44% 84%, 38% 70%, 32% 83%, 26% 68%, 20% 80%, 14% 68%, 8% 78%, 3% 66%, 0 76%)',
        }}>
          <Portrait src={profileImg} />
          {/* Warm mocha gradient wash at bottom of torn image */}
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 55%, ${p.accent}66 100%)` }} />
        </div>
        {/* Brand logo circle at torn edge */}
        <div style={{ position: 'absolute', top: 'calc(38% - 18px)', left: 8, width: 22, height: 22, borderRadius: '50%', background: p.accentGradient, border: '2px solid #fff', zIndex: 3, boxShadow: '0 1px 4px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LogoCircle src={brandLogo} size={16} accent={p.accent} border="none" bg={p.accentGradient} />
        </div>
        <div style={{ padding: '6px 8px 4px 36px', marginTop: -4 }}>
          <NameBlock textColor={p.text} accent={p.accent} muteColor={p.accentLight} />
        </div>
        <div style={{ display: 'flex', gap: 4, padding: '3px 8px' }}>
          {['☎','✉','💬'].map((g, i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: p.accentGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 4, color: '#fff' }}>{g}</div>
          ))}
        </div>
        {/* Gradient "About Me" pill */}
        <div style={{ margin: '4px 6px', background: p.accentGradient, borderRadius: 999, padding: '3px 0', textAlign: 'center' }}>
          <span style={{ fontSize: 4, color: '#fff', fontWeight: 700 }}>About Me</span>
        </div>
      </PhoneFrame>
    );
  }

  // ── 11/12. wave-logo-curve — Navy Gold / Emerald Wave ───────────
  if (layout === 'wave-logo-curve') {
    return (
      <PhoneFrame bg={p.bg}>
        <div style={{ width: '100%', height: '46%', position: 'relative', overflow: 'hidden' }}>
          <Portrait src={profileImg} />
          {/* Colour wash at bottom of photo */}
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 40%, ${p.accent}55 100%)` }} />
          {/* S-curve wave SVG */}
          <svg viewBox="0 0 200 40" preserveAspectRatio="none"
            style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 22, zIndex: 2 }}>
            <path d="M0,24 C50,0 150,40 200,16 L200,40 L0,40 Z" fill={p.panel} />
          </svg>
          {/* Secondary wave for depth */}
          <svg viewBox="0 0 200 40" preserveAspectRatio="none"
            style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 26, zIndex: 1, opacity: 0.35 }}>
            <path d="M0,28 C60,8 140,36 200,12 L200,40 L0,40 Z" fill={p.accent} />
          </svg>
        </div>
        {/* Circular logo overlapping wave */}
        <div style={{ position: 'absolute', top: 'calc(46% - 14px)', left: 8, zIndex: 4 }}>
          <div style={{
            width: 22, height: 22, borderRadius: '50%',
            background: '#fff', border: `2px solid ${p.accent}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}>
            <LogoCircle src={brandLogo} size={16} accent={p.accent} border="none" bg={p.accentGradient} />
          </div>
        </div>
        <div style={{ background: p.panelGradient, padding: '10px 8px 4px 8px' }}>
          <NameBlock textColor={p.text} accent={p.accentLight} muteColor="rgba(255,255,255,0.6)" />
          <IconRow accent={p.accentLight} gradient={p.accentGradient} filled />
        </div>
        <AboutCard bg="rgba(255,255,255,0.06)" textColor={p.text} accent={p.accentLight} />
      </PhoneFrame>
    );
  }

  // ── 15. wave-badge-center — Navy Amber ───────────────────────
  if (layout === 'wave-badge-center') {
    return (
      <PhoneFrame bg={p.bg}>
        <div style={{ width: '100%', height: '50%', position: 'relative', overflow: 'hidden' }}>
          <Portrait src={profileImg} filter="grayscale(25%)" />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 30%, ${p.accent}55 100%)` }} />
          {/* Wave layer 1 — deep amber ripple */}
          <svg viewBox="0 0 200 50" preserveAspectRatio="none"
            style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 30, zIndex: 1, opacity: 0.45 }}>
            <path d="M0,35 C30,10 60,45 100,20 C140,-5 170,38 200,15 L200,50 L0,50 Z" fill={p.accent} />
          </svg>
          {/* Wave layer 2 — mid panel */}
          <svg viewBox="0 0 200 50" preserveAspectRatio="none"
            style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 28, zIndex: 2, opacity: 0.6 }}>
            <path d="M0,28 C45,5 90,42 135,18 C165,2 185,30 200,14 L200,50 L0,50 Z" fill={p.panel} />
          </svg>
          {/* Wave layer 3 — solid front */}
          <svg viewBox="0 0 200 50" preserveAspectRatio="none"
            style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 24, zIndex: 3 }}>
            <path d="M0,20 C55,0 110,34 160,12 C180,4 195,20 200,10 L200,50 L0,50 Z" fill={p.panel} />
          </svg>
        </div>
        {/* Amber badge circle sitting on the wave crest */}
        <div style={{
          position: 'absolute', top: 'calc(50% - 13px)',
          left: '50%', transform: 'translateX(-50%)', zIndex: 5,
        }}>
          <div style={{
            width: 22, height: 22, borderRadius: '50%',
            background: p.accentGradient, border: `2px solid ${p.bg}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 10px ${p.accent}88`,
          }}>
            <LogoCircle src={brandLogo} size={15} accent={p.accent} border="none" bg="transparent" />
          </div>
        </div>
        <div style={{ background: p.panelGradient, padding: '12px 8px 4px 8px', textAlign: 'center' }}>
          <NameBlock textColor={p.text} accent={p.accentLight} muteColor="rgba(255,255,255,0.6)" align="center" />
          <IconRow accent={p.accentLight} gradient={p.accentGradient} filled />
        </div>
        {/* Wavy divider before About */}
        <svg viewBox="0 0 200 12" preserveAspectRatio="none"
          style={{ width: '100%', height: 7, display: 'block', marginTop: 1 }}>
          <path d="M0,6 C40,0 80,12 120,5 C160,-2 185,8 200,4 L200,12 L0,12 Z" fill={`${p.accent}22`} />
        </svg>
        <AboutCard bg="rgba(255,255,255,0.06)" textColor={p.text} accent={p.accentLight} />
      </PhoneFrame>
    );
  }

  // ── 16. photo-right-side — Blush Soft ────────────────────────
  if (layout === 'photo-right-side') {
    const darkText = '#1a0a12';
    return (
      <PhoneFrame bg={p.bg}>
        <div style={{ display: 'flex', height: '44%', position: 'relative', overflow: 'hidden', marginTop: 12 }}>
          <div style={{ flex: 1, padding: '6px 8px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <NameBlock textColor={darkText} accent={p.accent} muteColor={`${darkText}99`} />
            <div style={{ display: 'flex', gap: 3, marginTop: 4 }}>
              {['☎','✉','💬'].map((g, i) => (
                <div key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: p.accentGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 4, color: '#fff' }}>{g}</div>
              ))}
            </div>
          </div>
          <div style={{ width: '46%', position: 'relative', overflow: 'hidden' }}>
            <Portrait src={profileImg} />
            {/* Wavy left edge blending photo into text area */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 60 100" preserveAspectRatio="none">
              <path d="M0,0 C12,20 4,40 16,60 C6,75 14,88 0,100 L60,100 L60,0 Z" fill={p.panel} opacity="0.9" />
            </svg>
          </div>
          {/* Triple wave bottom of hero */}
          <svg viewBox="0 0 200 36" preserveAspectRatio="none"
            style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 20, zIndex: 2, opacity: 0.35 }}>
            <path d="M0,18 C50,4 100,28 150,10 C175,2 190,18 200,8 L200,36 L0,36 Z" fill={p.accent} />
          </svg>
          <svg viewBox="0 0 200 36" preserveAspectRatio="none"
            style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 16, zIndex: 3 }}>
            <path d="M0,10 C40,0 90,20 140,6 C168,0 188,14 200,4 L200,36 L0,36 Z" fill={p.panel} />
          </svg>
        </div>
        {/* Logo circle at wave right edge */}
        <div style={{ position: 'absolute', top: 'calc(12px + 44% - 12px)', right: 8, zIndex: 4 }}>
          <LogoCircle src={brandLogo} size={17} accent={p.accent} border={`2px solid ${p.bg}`} bg={p.accentGradient} />
        </div>
        <AboutCard bg={`${p.accent}18`} textColor={darkText} accent={p.accent} />
        {/* Wavy accent strip before Contact */}
        <svg viewBox="0 0 200 10" preserveAspectRatio="none"
          style={{ width: '100%', height: 6, display: 'block', margin: '2px 0' }}>
          <path d="M0,5 C35,0 70,10 105,4 C140,-1 170,8 200,3 L200,10 L0,10 Z" fill={`${p.accent}30`} />
        </svg>
        <div style={{ margin: '0 6px 3px', background: p.accentGradient, borderRadius: 4, padding: '3px 6px' }}>
          <div style={{ fontSize: 5, fontWeight: 700, color: '#fff' }}>Contact Us</div>
        </div>
      </PhoneFrame>
    );
  }

  // ── 17. hero-wave-icons — Violet Pro ─────────────────────────
  if (layout === 'hero-wave-icons') {
    return (
      <PhoneFrame bg={p.bg}>
        <div style={{ width: '100%', height: '48%', position: 'relative', overflow: 'hidden' }}>
          <Portrait src={profileImg} />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 25%, ${p.accent}99 100%)` }} />
          {/* Logo circle top-right */}
          <div style={{ position: 'absolute', top: 5, right: 5, zIndex: 4 }}>
            <LogoCircle src={brandLogo} size={13} accent={p.accent} border="none" bg={p.accentGradient} />
          </div>
          {/* Wave layer 1 — accent glow */}
          <svg viewBox="0 0 200 50" preserveAspectRatio="none"
            style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 32, zIndex: 1, opacity: 0.5 }}>
            <path d="M0,30 C35,8 75,42 115,18 C150,0 180,32 200,14 L200,50 L0,50 Z" fill={p.accentLight} />
          </svg>
          {/* Wave layer 2 — mid */}
          <svg viewBox="0 0 200 50" preserveAspectRatio="none"
            style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 28, zIndex: 2, opacity: 0.65 }}>
            <path d="M0,22 C50,2 95,36 145,14 C170,4 190,24 200,10 L200,50 L0,50 Z" fill={p.panel} />
          </svg>
          {/* Wave layer 3 — solid front */}
          <svg viewBox="0 0 200 50" preserveAspectRatio="none"
            style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 22, zIndex: 3 }}>
            <path d="M0,16 C40,0 85,28 130,10 C160,0 185,18 200,6 L200,50 L0,50 Z" fill={p.panel} />
          </svg>
        </div>
        {/* Social icons floating on the wave */}
        <div style={{ display: 'flex', gap: 5, justifyContent: 'center', padding: '5px 0', position: 'relative', zIndex: 2 }}>
          {['☎','✉','💬'].map((g, i) => (
            <div key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: p.accentGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 5, color: '#fff', boxShadow: `0 2px 6px ${p.accent}66` }}>{g}</div>
          ))}
        </div>
        <div style={{ padding: '2px 8px 3px', background: p.panelGradient }}>
          <NameBlock textColor={p.text} accent={p.accentLight} muteColor="rgba(255,255,255,0.55)" />
        </div>
        {/* Wavy separator */}
        <svg viewBox="0 0 200 12" preserveAspectRatio="none"
          style={{ width: '100%', height: 7, display: 'block' }}>
          <path d="M0,6 C45,0 90,12 135,4 C165,-1 188,8 200,3 L200,12 L0,12 Z" fill={`${p.accentLight}30`} />
        </svg>
        <AboutCard bg="rgba(255,255,255,0.06)" textColor={p.text} accent={p.accentLight} />
      </PhoneFrame>
    );
  }

  // ── 18. slash-group — Slash Dark ─────────────────────────────
  if (layout === 'slash-group') {
    return (
      <PhoneFrame bg={p.panelGradient}>
        <div style={{ width: '100%', height: '40%', position: 'relative', overflow: 'hidden' }}>
          <Portrait src={profileImg} />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 45%, ${p.panel}dd 100%)` }} />
          {/* Orange diagonal slash lines */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 80">
            <line x1="65" y1="0" x2="100" y2="55" stroke={p.accent} strokeWidth="4" opacity="0.9" />
            <line x1="78" y1="0" x2="100" y2="32" stroke={p.accentLight} strokeWidth="2.5" opacity="0.6" />
            <line x1="55" y1="0" x2="95" y2="65" stroke={p.accent} strokeWidth="2" opacity="0.35" />
          </svg>
          {/* Logo circle top-right */}
          <div style={{ position: 'absolute', top: 4, right: 4, zIndex: 2 }}>
            <LogoCircle src={brandLogo} size={13} accent={p.accent} border="none" bg={p.accentGradient} />
          </div>
          {/* Wave layer 1 — accent glow */}
          <svg viewBox="0 0 200 40" preserveAspectRatio="none"
            style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 24, zIndex: 3, opacity: 0.4 }}>
            <path d="M0,22 C40,4 85,36 130,14 C160,2 185,24 200,10 L200,40 L0,40 Z" fill={p.accent} />
          </svg>
          {/* Wave layer 2 — solid front */}
          <svg viewBox="0 0 200 40" preserveAspectRatio="none"
            style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 20, zIndex: 4 }}>
            <path d="M0,14 C50,0 100,24 150,8 C175,0 192,16 200,6 L200,40 L0,40 Z" fill={p.panel} />
          </svg>
        </div>
        {/* Small profile circle overlapping wave */}
        <div style={{ marginTop: -13, paddingLeft: 8, position: 'relative', zIndex: 5 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%', overflow: 'hidden',
            border: `2px solid ${p.accent}`, display: 'inline-block',
            boxShadow: `0 0 8px ${p.accent}66`,
          }}>
            <Portrait src={profileImg} />
          </div>
        </div>
        <div style={{ padding: '3px 8px 2px' }}>
          <NameBlock textColor="#fff" accent={p.accentLight} muteColor="rgba(255,255,255,0.6)" />
          <IconRow accent={p.accent} gradient={p.accentGradient} filled />
        </div>
        {/* Wavy divider before About */}
        <svg viewBox="0 0 200 10" preserveAspectRatio="none"
          style={{ width: '100%', height: 6, display: 'block', margin: '2px 0' }}>
          <path d="M0,5 C40,0 80,10 120,3 C155,-1 180,7 200,2 L200,10 L0,10 Z" fill={`${p.accent}30`} />
        </svg>
        <AboutCard bg="rgba(255,255,255,0.06)" textColor="#fff" accent={p.accentLight} />
      </PhoneFrame>
    );
  }

  // Fallback
  return (
    <PhoneFrame bg={p.bg}>
      <div style={{ width: '100%', height: '50%' }}><Portrait src={profileImg} /></div>
      <div style={{ padding: 8 }}>
        <NameBlock textColor={p.text} accent={p.accentLight} />
      </div>
    </PhoneFrame>
  );
}
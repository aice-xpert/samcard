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

const PROFILE_IMG = '/profileImages/alex-morgan.jpg';

// Real photo portrait — uses the public dummy profile image
const Portrait: React.FC<{ style?: React.CSSProperties; filter?: string }> = ({ style, filter }) => (
  <img
    src={PROFILE_IMG}
    alt="Profile"
    style={{
      width: '100%', height: '100%',
      objectFit: 'cover', objectPosition: 'center top',
      display: 'block',
      ...(filter ? { filter } : {}),
      ...style,
    }}
  />
);

// Icon ring (phone / mail / chat)
const IconRing: React.FC<{ color: string; size?: number; glyph?: string }> = ({ color, size = 11, glyph = '○' }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%',
    border: `1.5px solid ${color}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 4, color, flexShrink: 0,
  }}>{glyph}</div>
);

const IconRow: React.FC<{ color: string; filled?: boolean }> = ({ color, filled }) => (
  <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginTop: 5 }}>
    {['☎','✉','💬'].map((g, i) => (
      <div key={i} style={{
        width: 12, height: 12, borderRadius: '50%',
        background: filled ? color : 'transparent',
        border: `1.5px solid ${color}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 5, color: filled ? '#fff' : color,
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

const LogoBar: React.FC<{ accent: string; textColor: string; label: string }> = ({ accent, textColor, label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 8px 3px' }}>
    <div style={{ width: 10, height: 10, borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 5, fontWeight: 700 }}>T</div>
    <div style={{ fontSize: 5, fontWeight: 700, color: textColor }}>{label}</div>
  </div>
);

// Name/Title/Company text block
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
  const { preview: p } = template;
  const layout = p.layout;

  // ── 1. full-photo-wave — Medical Teal ──────────────────────────
  if (layout === 'full-photo-wave') {
    return (
      <PhoneFrame bg={p.bg}>
        {/* Photo top ~52% with concave inward curve at bottom */}
        <div style={{ width: '100%', height: '52%', position: 'relative', overflow: 'hidden' }}>
          <Portrait />
          {/* Concave wave — curved inward from below */}
          <svg viewBox="0 0 200 32" preserveAspectRatio="none"
            style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 20, zIndex: 2 }}>
            <path d="M0,0 Q100,20 200,0 L200,32 L0,32 Z" fill={p.panel} />
          </svg>
        </div>
        {/* Info panel */}
        <div style={{ background: p.panel, padding: '8px 8px 6px', textAlign: 'center' }}>
          <NameBlock textColor={p.text} accent={p.accentLight} muteColor={p.accentLight} align="center" />
          <IconRow color={p.accentLight} filled />
        </div>
        <AboutCard bg="rgba(255,255,255,0.07)" textColor={p.text} accent={p.accentLight} />
      </PhoneFrame>
    );
  }

  // ── 2. side-panel — Teamwork Orange ───────────────────────────
  if (layout === 'side-panel') {
    return (
      <PhoneFrame bg={p.bg}>
        <LogoBar accent={p.accent} textColor={p.text} label="Teamwork.Co" />
        {/* Side card */}
        <div style={{ display: 'flex', margin: '4px 6px', borderRadius: 6, overflow: 'hidden', height: '36%' }}>
          <div style={{ width: '44%', flexShrink: 0 }}><Portrait /></div>
          <div style={{ flex: 1, background: p.panel, padding: '5px 6px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <NameBlock textColor={p.text} accent={p.accentLight} muteColor={p.text} />
          </div>
        </div>
        {/* Orange icon pill */}
        <div style={{ margin: '5px 6px', background: p.accent, borderRadius: 999, padding: '4px 0', display: 'flex', justifyContent: 'center', gap: 5 }}>
          {['☎','✉','💬'].map((g, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', border: '1.5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 4, color: '#fff' }}>{g}</div>
          ))}
        </div>
        <AboutCard bg={p.panel} textColor={p.text} accent={p.accent} />
      </PhoneFrame>
    );
  }

  // ── 3. group-photo — Team Pro ──────────────────────────────────
  if (layout === 'group-photo') {
    return (
      <PhoneFrame bg={p.panel}>
        {/* Group photo banner */}
        <div style={{ width: '100%', height: '38%', position: 'relative', overflow: 'hidden' }}>
          <Portrait />
          {/* T logo circle top-right */}
          <div style={{ position: 'absolute', top: 4, right: 4, width: 13, height: 13, borderRadius: '50%', background: p.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 5, fontWeight: 700, zIndex: 2 }}>T</div>
          {/* Diagonal accent stripes */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 80">
            <line x1="65" y1="0" x2="100" y2="60" stroke={p.accent} strokeWidth="8" opacity="0.75" />
            <line x1="80" y1="0" x2="100" y2="32" stroke={p.accentLight} strokeWidth="5" opacity="0.55" />
          </svg>
        </div>
        {/* Panel with small portrait inset */}
        <div style={{ position: 'relative', padding: '28px 8px 6px 8px' }}>
          {/* Small portrait card */}
          <div style={{
            position: 'absolute', top: -16, left: 6,
            width: 26, height: 34, borderRadius: 3, overflow: 'hidden',
            border: `1.5px solid ${p.accent}`,
          }}>
            <Portrait />
          </div>
          <div style={{ paddingLeft: 36 }}>
            <NameBlock textColor="#fff" accent={p.accentLight} muteColor="rgba(255,255,255,0.6)" />
          </div>
          <IconRow color={p.accent} filled />
        </div>
        <AboutCard bg="rgba(255,255,255,0.06)" textColor="#fff" accent={p.accentLight} />
      </PhoneFrame>
    );
  }

  // ── 4. gold-curve — Heritage Gold ─────────────────────────────
  if (layout === 'gold-curve') {
    return (
      <PhoneFrame bg={p.bg}>
        {/* Photo top ~50% with concave inward curve at bottom */}
        <div style={{ width: '100%', height: '50%', position: 'relative', overflow: 'hidden' }}>
          <Portrait />
          {/* Concave wave — curved inward from below */}
          <svg viewBox="0 0 200 32" preserveAspectRatio="none"
            style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 20, zIndex: 2 }}>
            <path d="M0,0 Q100,20 200,0 L200,32 L0,32 Z" fill={p.panel} />
          </svg>
        </div>
        <div style={{ background: p.panel, padding: '8px 8px 6px', textAlign: 'center' }}>
          <NameBlock textColor={p.text} accent={p.accentLight} muteColor="rgba(255,255,255,0.6)" align="center" />
          <IconRow color={p.accent} filled />
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
          <Portrait />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(28,13,58,0.6) 100%)' }} />
        </div>
        {/* Asymmetric curve — sweeps from left high to right lower */}
        <svg viewBox="0 0 200 28" preserveAspectRatio="none"
          style={{ position: 'absolute', top: 'calc(42% - 15px)', left: 0, width: '100%', height: 18, zIndex: 2 }}>
          <path d="M0,28 L0,8 Q80,28 200,6 L200,28 Z" fill={p.panel} />
        </svg>
        {/* T circle at right edge of curve */}
        <div style={{
          position: 'absolute', top: 'calc(42% - 20px)', right: 10,
          width: 18, height: 18, borderRadius: '50%', background: p.accentLight,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 6, fontWeight: 700, zIndex: 4,
        }}>T</div>
        <div style={{ position: 'absolute', top: 'calc(42% + 3px)', left: 0, right: 0, bottom: 0, padding: '14px 8px 6px', zIndex: 1 }}>
          <NameBlock textColor="#fff" accent={p.accentLight} muteColor="rgba(255,255,255,0.55)" />
          {/* Icon circles with accent color */}
          <div style={{ display: 'flex', gap: 4, marginTop: 5 }}>
            {['☎','✉','💬'].map((g, i) => (
              <div key={i} style={{ width: 13, height: 13, borderRadius: '50%', background: p.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 5, color: '#fff' }}>{g}</div>
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
        {/* Circular portrait centered high */}
        <div style={{ paddingTop: '18%', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '36%', aspectRatio: '1', borderRadius: '50%', overflow: 'hidden', border: `2px solid ${p.accent}44`, boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
            <Portrait />
          </div>
        </div>
        {/* Left-aligned text */}
        <div style={{ padding: '8px 10px 4px' }}>
          <NameBlock textColor={p.text} accent={p.accent} muteColor={p.accentLight} />
        </div>
        {/* Icon row */}
        <div style={{ display: 'flex', gap: 4, padding: '3px 10px' }}>
          {['☎','✉','💬'].map((g, i) => (
            <div key={i} style={{ width: 11, height: 11, borderRadius: '50%', border: `1.5px solid ${p.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 4, color: p.accent }}>{g}</div>
          ))}
        </div>
        <AboutCard bg={p.panel} textColor={p.text} accent={p.accent} />
      </PhoneFrame>
    );
  }

  // ── 7. top-banner — Sunset Banner ─────────────────────────────
  if (layout === 'top-banner') {
    return (
      <PhoneFrame bg={p.bg}>
        <LogoBar accent={p.accent} textColor="rgba(255,255,255,0.85)" label="Teamwork.Co" />
        {/* Name banner */}
        <div style={{ margin: '0 6px', background: p.accent, borderRadius: 6, padding: '5px 7px' }}>
          <NameBlock textColor="#fff" accent="rgba(255,255,255,0.85)" muteColor="rgba(255,255,255,0.65)" />
        </div>
        {/* Photo below */}
        <div style={{ margin: '5px 6px', height: '32%', borderRadius: 5, overflow: 'hidden' }}>
          <Portrait />
        </div>
        <IconRow color={p.accent} filled />
        <AboutCard bg="rgba(255,255,255,0.07)" textColor="#fff" accent={p.accentLight} />
      </PhoneFrame>
    );
  }

  // ── 8. sky-circle — Sky Circle ────────────────────────────────
  if (layout === 'sky-circle') {
    return (
      <PhoneFrame bg={p.panel}>
        {/* Banner photo */}
        <div style={{ width: '100%', height: '30%', overflow: 'hidden', position: 'relative' }}>
          <Portrait />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(91,120,255,0.6) 100%)' }} />
        </div>
        {/* Overlapping circular portrait */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: -16, position: 'relative', zIndex: 2 }}>
          <div style={{ width: '26%', aspectRatio: '1', borderRadius: '50%', overflow: 'hidden', border: '2px solid #fff' }}>
            <Portrait />
          </div>
        </div>
        {/* Centered name */}
        <div style={{ padding: '4px 8px', textAlign: 'center' }}>
          <NameBlock textColor="#fff" accent={p.accentLight} muteColor="rgba(255,255,255,0.7)" align="center" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginTop: 3 }}>
          {['☎','✉','💬'].map((g, i) => (
            <div key={i} style={{ width: 13, height: 13, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '1.5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 5, color: '#fff' }}>{g}</div>
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
          <Portrait filter="grayscale(80%)" />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 35%, rgba(0,0,0,0.88) 100%)' }} />
          {/* T logo at bottom */}
          <div style={{ position: 'absolute', bottom: 22, left: '50%', transform: 'translateX(-50%)', width: 16, height: 16, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: `1px solid ${p.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: p.accent, fontSize: 6, fontWeight: 700 }}>T</div>
          <div style={{ position: 'absolute', bottom: 4, left: 8, right: 8 }}>
            <NameBlock textColor="#fff" accent={p.accentLight} muteColor="rgba(255,255,255,0.5)" />
          </div>
        </div>
        <div style={{ padding: '6px 8px' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {['☎','✉','💬'].map((g, i) => (
              <div key={i} style={{ width: 11, height: 11, borderRadius: '50%', border: `1.5px solid ${p.accentLight}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 4, color: p.accentLight }}>{g}</div>
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
          <Portrait />
        </div>
        {/* Brand logo circle at torn edge (Fix 4) */}
        <div style={{ position: 'absolute', top: 'calc(38% - 18px)', left: 8, width: 22, height: 22, borderRadius: '50%', background: '#fff', border: '2px solid #fff', zIndex: 3, boxShadow: '0 1px 4px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 14, height: 14, borderRadius: '50%', background: p.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 6, fontWeight: 700 }}>A</div>
        </div>
        <div style={{ padding: '6px 8px 4px 36px', marginTop: -4 }}>
          <NameBlock textColor={p.text} accent={p.accent} muteColor={p.accentLight} />
        </div>
        <div style={{ display: 'flex', gap: 4, padding: '3px 8px' }}>
          {['☎','✉','💬'].map((g, i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: p.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 4, color: '#fff' }}>{g}</div>
          ))}
        </div>
        {/* Pill button */}
        <div style={{ margin: '4px 6px', background: p.accent, borderRadius: 999, padding: '3px 0', textAlign: 'center' }}>
          <span style={{ fontSize: 4, color: '#fff', fontWeight: 700 }}>About Me</span>
        </div>
      </PhoneFrame>
    );
  }

  // Fallback
  return (
    <PhoneFrame bg={p.bg}>
      <div style={{ width: '100%', height: '50%' }}><Portrait /></div>
      <div style={{ padding: 8 }}>
        <NameBlock textColor={p.text} accent={p.accentLight} />
      </div>
    </PhoneFrame>
  );
}

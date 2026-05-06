"use client";

import React from 'react';
import type { CardTemplate } from '@/data/cardTemplates';

// Tiny phone-shaped thumbnail that visually approximates the template layout.
// Width 100%, fixed aspect ratio so the grid stays tidy.

const PhoneFrame: React.FC<{ children: React.ReactNode; bg: string }> = ({ children, bg }) => (
  <div
    style={{
      position: 'relative',
      width: '100%',
      aspectRatio: '9 / 16',
      borderRadius: 14,
      overflow: 'hidden',
      background: bg,
      border: '2px solid #1a1a1a',
      boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.06)',
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: 4,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '32%',
        height: 6,
        background: '#000',
        borderRadius: 4,
        zIndex: 5,
      }}
    />
    {children}
  </div>
);

const PortraitBlock: React.FC<{ tone?: 'light' | 'dark' | 'mono' }> = ({ tone = 'light' }) => {
  const c1 = tone === 'dark' ? '#3a3a3a' : tone === 'mono' ? '#bdbdbd' : '#d8b89a';
  const c2 = tone === 'dark' ? '#1c1c1c' : tone === 'mono' ? '#7a7a7a' : '#a37a5e';
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: `linear-gradient(135deg, ${c1}, ${c2})`,
      }}
    />
  );
};

const Pill: React.FC<{ w: string; bg: string; h?: number }> = ({ w, bg, h = 4 }) => (
  <div style={{ width: w, height: h, background: bg, borderRadius: 999 }} />
);

const Dot: React.FC<{ size: number; bg: string }> = ({ size, bg }) => (
  <div style={{ width: size, height: size, borderRadius: '50%', background: bg }} />
);

const IconRow: React.FC<{ accent: string; light?: boolean }> = ({ accent, light }) => (
  <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginTop: 6 }}>
    <Dot size={10} bg={light ? '#fff' : accent} />
    <Dot size={10} bg={light ? '#fff' : accent} />
    <Dot size={10} bg={light ? '#fff' : accent} />
  </div>
);

const InfoCard: React.FC<{ bg: string; textBg: string; subBg: string }> = ({ bg, textBg, subBg }) => (
  <div style={{ background: bg, borderRadius: 6, padding: 6, marginTop: 4 }}>
    <Pill w="60%" bg={textBg} h={3} />
    <div style={{ height: 3 }} />
    <Pill w="40%" bg={subBg} h={3} />
  </div>
);

export default function TemplateThumb({ template }: { template: CardTemplate }) {
  const { preview } = template;
  const layout = preview.layout;

  // ----- Layout 1: full photo with curved bottom panel + small T avatar (medical) -----
  if (layout === 'full-photo-wave') {
    return (
      <PhoneFrame bg={preview.bg}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <div style={{ width: '100%', height: '52%' }}>
            <PortraitBlock />
          </div>
          <div
            style={{
              position: 'absolute',
              top: '46%',
              left: 0,
              right: 0,
              bottom: 0,
              background: preview.panel,
              borderTopLeftRadius: '50% 18%',
              borderTopRightRadius: '50% 18%',
              padding: '14px 10px 8px',
              color: preview.text,
            }}
          >
            <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', width: 24, height: 24, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: preview.accent, color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>T</div>
            </div>
            <div style={{ marginTop: 8 }}>
              <Pill w="55%" bg="#fff" />
              <div style={{ height: 3 }} />
              <Pill w="35%" bg={preview.accentLight} />
              <div style={{ height: 3 }} />
              <Pill w="40%" bg="#fff" />
              <IconRow accent={preview.accentLight} />
            </div>
          </div>
        </div>
      </PhoneFrame>
    );
  }

  // ----- Layout 2: side-panel (Teamwork.Co) -----
  if (layout === 'side-panel') {
    return (
      <PhoneFrame bg={preview.bg}>
        <div style={{ padding: '14px 8px 0', display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: preview.accent }} />
          <Pill w="35%" bg="#222" />
        </div>
        <div style={{ display: 'flex', margin: '10px 8px', borderRadius: 6, overflow: 'hidden', height: '36%' }}>
          <div style={{ width: '50%' }}><PortraitBlock /></div>
          <div style={{ width: '50%', background: preview.panel, padding: 6, color: preview.text }}>
            <Pill w="80%" bg="#fff" />
            <div style={{ height: 4 }} />
            <Pill w="60%" bg={preview.accentLight} h={3} />
            <div style={{ height: 3 }} />
            <Pill w="50%" bg="#fff" h={3} />
          </div>
        </div>
        <div style={{ margin: '0 8px', background: preview.accent, borderRadius: 999, padding: 5, display: 'flex', justifyContent: 'center', gap: 5 }}>
          <Dot size={6} bg="#fff" />
          <Dot size={6} bg="#fff" />
          <Dot size={6} bg="#fff" />
        </div>
        <div style={{ margin: '8px', background: '#fff', borderRadius: 6, padding: 6, textAlign: 'center' }}>
          <Pill w="50%" bg={preview.accent} />
        </div>
      </PhoneFrame>
    );
  }

  // ----- Layout 3: gold curve over deep navy (Heritage Gold) -----
  if (layout === 'gold-curve') {
    return (
      <PhoneFrame bg={preview.bg}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <div style={{ width: '100%', height: '50%' }}><PortraitBlock /></div>
          <div
            style={{
              position: 'absolute',
              top: '42%',
              left: 0,
              right: 0,
              bottom: 0,
              background: preview.panel,
              borderTopLeftRadius: '60% 22%',
              borderTopRightRadius: '60% 22%',
              padding: '14px 10px',
              color: preview.text,
            }}
          >
            <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', width: 22, height: 22, borderRadius: '50%', background: preview.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 10, height: 8, background: '#fff', clipPath: 'polygon(50% 0,100% 60%,80% 60%,80% 100%,20% 100%,20% 60%,0 60%)' }} />
            </div>
            <div style={{ marginTop: 6 }}>
              <Pill w="55%" bg="#fff" />
              <div style={{ height: 3 }} />
              <Pill w="35%" bg={preview.accentLight} />
              <div style={{ height: 3 }} />
              <Pill w="40%" bg="#fff" />
              <IconRow accent={preview.accent} />
            </div>
          </div>
        </div>
      </PhoneFrame>
    );
  }

  // ----- Layout 4: group photo + small portrait (Team Pro) -----
  if (layout === 'group-photo') {
    return (
      <PhoneFrame bg={preview.bg}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <div style={{ width: '100%', height: '38%', position: 'relative' }}>
            <PortraitBlock tone="light" />
            <div style={{ position: 'absolute', top: 4, right: 4, width: 14, height: 14, borderRadius: '50%', background: preview.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 7, fontWeight: 700 }}>T</div>
            <div style={{ position: 'absolute', left: '50%', top: 8, height: 2, width: '40%', background: preview.accent, transform: 'rotate(20deg)' }} />
          </div>
          <div style={{ position: 'absolute', top: '30%', left: 8, width: '32%', aspectRatio: '4/5', borderRadius: 4, overflow: 'hidden', border: `2px solid ${preview.accent}` }}>
            <PortraitBlock tone="mono" />
          </div>
          <div style={{ position: 'absolute', top: '36%', left: 0, right: 0, bottom: 0, background: preview.panel, padding: '32px 10px 8px 8px', color: preview.text }}>
            <div style={{ marginLeft: '38%' }}>
              <Pill w="80%" bg="#fff" />
              <div style={{ height: 3 }} />
              <Pill w="50%" bg={preview.accentLight} h={3} />
              <div style={{ height: 3 }} />
              <Pill w="60%" bg="#fff" h={3} />
            </div>
            <IconRow accent={preview.accent} />
          </div>
        </div>
      </PhoneFrame>
    );
  }

  // ----- Layout 5: curve photo (Royal Purple) -----
  if (layout === 'curve-photo') {
    return (
      <PhoneFrame bg="#1c0d3a">
        <div style={{ position: 'absolute', inset: 0 }}>
          <div style={{ width: '100%', height: '46%' }}>
            <PortraitBlock tone="mono" />
          </div>
          <div
            style={{
              position: 'absolute',
              top: '36%',
              left: 0,
              right: 0,
              bottom: 0,
              background: preview.panel,
              borderTopLeftRadius: '70% 30%',
              padding: '16px 10px 6px',
              color: preview.text,
            }}
          >
            <div style={{ position: 'absolute', top: -10, right: 12, width: 22, height: 22, borderRadius: '50%', background: preview.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 9, fontWeight: 700 }}>T</div>
            <Pill w="55%" bg="#fff" />
            <div style={{ height: 3 }} />
            <Pill w="35%" bg="#fff" h={3} />
            <div style={{ height: 3 }} />
            <Pill w="45%" bg={preview.accentLight} h={3} />
            <IconRow accent="#ff7a3a" />
            <div style={{ background: '#fff', borderRadius: 6, padding: 5, marginTop: 6 }}>
              <Pill w="40%" bg={preview.accent} h={3} />
              <div style={{ height: 3 }} />
              <Pill w="60%" bg="#aaa" h={3} />
            </div>
          </div>
        </div>
      </PhoneFrame>
    );
  }

  // ----- Layout 6: circular avatar centered on cream (Minimal Mono) -----
  if (layout === 'circle-center') {
    return (
      <PhoneFrame bg={preview.bg}>
        <div style={{ paddingTop: '22%', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '38%', aspectRatio: '1/1', borderRadius: '50%', overflow: 'hidden', border: '2px solid #fff', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
            <PortraitBlock tone="mono" />
          </div>
        </div>
        <div style={{ padding: '10px 12px 6px', textAlign: 'left' }}>
          <Pill w="50%" bg={preview.accent} h={5} />
          <div style={{ height: 3 }} />
          <Pill w="35%" bg="#777" h={3} />
          <div style={{ height: 4 }} />
          <Pill w="40%" bg={preview.accent} h={3} />
        </div>
        <div style={{ display: 'flex', gap: 4, padding: '0 12px' }}>
          <Dot size={10} bg="#1a1a1a" />
          <Dot size={10} bg="#1a1a1a" />
          <Dot size={10} bg="#1a1a1a" />
        </div>
        <div style={{ margin: '8px 12px', background: '#fff', borderRadius: 6, padding: 6 }}>
          <Pill w="40%" bg="#1a1a1a" h={3} />
          <div style={{ height: 3 }} />
          <Pill w="60%" bg="#aaa" h={3} />
        </div>
      </PhoneFrame>
    );
  }

  // ----- Layout 7: top banner over hero photo (Sunset Banner) -----
  if (layout === 'top-banner') {
    return (
      <PhoneFrame bg={preview.bg}>
        <div style={{ padding: '14px 8px 0', display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: preview.accent }} />
          <Pill w="35%" bg="#fff" />
        </div>
        <div style={{ margin: '8px', background: preview.accent, borderRadius: 6, padding: '6px', textAlign: 'center', color: '#fff' }}>
          <Pill w="50%" bg="#fff" />
          <div style={{ height: 3 }} />
          <Pill w="35%" bg="rgba(255,255,255,0.7)" h={3} />
        </div>
        <div style={{ margin: '0 8px', height: '38%', borderRadius: 6, overflow: 'hidden' }}>
          <PortraitBlock />
        </div>
        <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginTop: 6 }}>
          <Dot size={10} bg={preview.accent} />
          <Dot size={10} bg={preview.accent} />
          <Dot size={10} bg={preview.accent} />
        </div>
        <div style={{ margin: '8px', background: '#fff', borderRadius: 6, padding: 5 }}>
          <Pill w="45%" bg={preview.accent} h={3} />
        </div>
      </PhoneFrame>
    );
  }

  // ----- Layout 8: sky circular (Sky Circle) -----
  if (layout === 'sky-circle') {
    return (
      <PhoneFrame bg={preview.bg}>
        <div style={{ width: '100%', height: '32%' }}>
          <PortraitBlock tone="light" />
        </div>
        <div style={{ marginTop: -22, display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '28%', aspectRatio: '1/1', borderRadius: '50%', overflow: 'hidden', border: '2px solid #fff' }}>
            <PortraitBlock />
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 8, padding: '0 8px', color: '#fff' }}>
          <Pill w="55%" bg="#fff" h={5} />
          <div style={{ height: 3 }} />
          <Pill w="35%" bg="rgba(255,255,255,0.85)" h={3} />
          <div style={{ height: 3 }} />
          <Pill w="40%" bg="#fff" h={3} />
        </div>
        <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginTop: 8 }}>
          <Dot size={11} bg="#fff" />
          <Dot size={11} bg="#fff" />
          <Dot size={11} bg="#fff" />
        </div>
        <div style={{ margin: '8px', background: '#fff', borderRadius: 6, padding: 5 }}>
          <Pill w="45%" bg={preview.accent} h={3} />
        </div>
      </PhoneFrame>
    );
  }

  // ----- Layout 9: dark hero (Onyx Pro) -----
  if (layout === 'dark-hero') {
    return (
      <PhoneFrame bg={preview.bg}>
        <div style={{ width: '100%', height: '52%', position: 'relative' }}>
          <PortraitBlock tone="mono" />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 50%,rgba(0,0,0,0.85))' }} />
          <div style={{ position: 'absolute', bottom: 8, left: 8, right: 8, color: '#fff' }}>
            <Pill w="55%" bg="#fff" />
            <div style={{ height: 3 }} />
            <Pill w="35%" bg={preview.accentLight} h={3} />
          </div>
        </div>
        <div style={{ padding: '8px' }}>
          <Pill w="55%" bg={preview.accent} h={3} />
          <div style={{ height: 4 }} />
          <Pill w="80%" bg="#444" h={3} />
          <div style={{ height: 3 }} />
          <Pill w="65%" bg="#444" h={3} />
        </div>
        <div style={{ display: 'flex', gap: 4, padding: '0 8px' }}>
          <Dot size={9} bg={preview.accentLight} />
          <Dot size={9} bg={preview.accentLight} />
          <Dot size={9} bg={preview.accentLight} />
        </div>
      </PhoneFrame>
    );
  }

  // ----- Layout 10: torn paper (Mocha Torn) -----
  if (layout === 'torn-paper') {
    return (
      <PhoneFrame bg="#fdf6ec">
        <div style={{ width: '100%', height: '40%', position: 'relative' }}>
          <PortraitBlock />
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: -2,
              height: 10,
              background: '#fdf6ec',
              clipPath: 'polygon(0 100%, 5% 30%, 10% 70%, 15% 20%, 22% 60%, 30% 30%, 38% 70%, 46% 25%, 54% 65%, 62% 35%, 70% 70%, 78% 25%, 86% 65%, 92% 30%, 100% 70%, 100% 100%)',
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, padding: '6px 8px 0' }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', overflow: 'hidden', border: '2px solid #fff', marginTop: -16 }}>
            <PortraitBlock tone="mono" />
          </div>
          <div style={{ flex: 1 }}>
            <Pill w="55%" bg="#2a1a10" h={4} />
            <div style={{ height: 3 }} />
            <Pill w="35%" bg="#8a7060" h={3} />
            <div style={{ height: 3 }} />
            <Pill w="40%" bg="#2a1a10" h={3} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, padding: '6px 8px 0' }}>
          <Dot size={11} bg={preview.accent} />
          <Dot size={11} bg={preview.accent} />
          <Dot size={11} bg={preview.accent} />
        </div>
        <div style={{ margin: '8px', background: preview.accent, borderRadius: 999, padding: 5, color: '#fff', textAlign: 'center' }}>
          <Pill w="45%" bg="#fff" h={3} />
        </div>
      </PhoneFrame>
    );
  }

  // Fallback simple variant
  return (
    <PhoneFrame bg={preview.bg}>
      <div style={{ width: '100%', height: '50%' }}>
        <PortraitBlock />
      </div>
      <div style={{ padding: 8 }}>
        <Pill w="60%" bg={preview.text} />
      </div>
    </PhoneFrame>
  );
}

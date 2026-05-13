"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { cardTemplates, type CardTemplate } from '@/data/cardTemplates';
import TemplateThumb from './TemplateThumb';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';

const SELECTED_TEMPLATE_KEY = 'selectedTemplate';

const selectedKeyForCard = (cardId?: string | null) =>
  cardId ? `${SELECTED_TEMPLATE_KEY}:${cardId}` : `${SELECTED_TEMPLATE_KEY}:draft`;

type Props = {
  cardId?: string | null;
  onApply?: (content: Record<string, unknown>) => void;
  onDesignApply?: (design: Record<string, unknown>) => void;
  className?: string;
};

export default function TemplatePicker({ cardId, onApply, onDesignApply, className }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset selection when the component mounts; do not auto-select from stored value.
    setSelectedId(null);
    // Clear any persisted selection for this card to avoid stale state.
    try {
      localStorage.removeItem(selectedKeyForCard(cardId));
    } catch {}
  }, []);


  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Initial check after layout
    const timer = setTimeout(updateScrollState, 50);
    el.addEventListener('scroll', updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      clearTimeout(timer);
      el.removeEventListener('scroll', updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState]);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  };

  const applyTemplate = (t: CardTemplate) => {
    setSelectedId(t.id);

    try {
      localStorage.setItem(selectedKeyForCard(cardId), t.id);
    } catch {
      // ignore
    }

    if (onDesignApply) onDesignApply(t.defaultDesign as unknown as Record<string, unknown>);
    if (onApply) onApply(t.defaultContent as unknown as Record<string, unknown>);

    try {
      window.dispatchEvent(new CustomEvent('template:applied', { detail: { templateId: t.id, cardId: cardId ?? null } }));
    } catch {
      // ignore non-browser
    }
  };

  return (
    <div className={className} style={{ position: 'relative' }}>
      {/* Left fade + arrow */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 12, // match scroll container bottom padding
          width: 56,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingLeft: 4,
          pointerEvents: canScrollLeft ? 'auto' : 'none',
          // Fade only appears once scrolled; button always visible
          background: canScrollLeft
            ? 'linear-gradient(to right, #0D0D0D 40%, transparent)'
            : 'transparent',
          transition: 'background 0.25s ease',
          borderRadius: '14px 0 0 14px',
        }}
      >
        <button
          type="button"
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            border: '1px solid rgba(73,182,24,0.3)',
            background: 'rgba(13,13,13,0.85)',
            color: '#49B618',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: canScrollLeft ? 'pointer' : 'default',
            opacity: canScrollLeft ? 1 : 0.35,
            transition: 'opacity 0.2s ease, transform 0.15s ease, box-shadow 0.15s ease',
            boxShadow: canScrollLeft ? '0 2px 8px rgba(0,0,0,0.5)' : 'none',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => { if (canScrollLeft) e.currentTarget.style.transform = 'scale(1.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <ChevronLeft size={15} strokeWidth={2.5} />
        </button>
      </div>

      {/* Right fade + arrow */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 12,
          width: 56,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: 4,
          pointerEvents: canScrollRight ? 'auto' : 'none',
          background: canScrollRight
            ? 'linear-gradient(to left, #0D0D0D 40%, transparent)'
            : 'transparent',
          transition: 'background 0.25s ease',
          borderRadius: '0 14px 14px 0',
        }}
      >
        <button
          type="button"
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            border: '1px solid rgba(73,182,24,0.3)',
            background: 'rgba(13,13,13,0.85)',
            color: '#49B618',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: canScrollRight ? 'pointer' : 'default',
            opacity: canScrollRight ? 1 : 0.35,
            transition: 'opacity 0.2s ease, transform 0.15s ease, box-shadow 0.15s ease',
            boxShadow: canScrollRight ? '0 2px 8px rgba(0,0,0,0.5)' : 'none',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => { if (canScrollRight) e.currentTarget.style.transform = 'scale(1.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <ChevronRight size={15} strokeWidth={2.5} />
        </button>
      </div>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: 12,
          padding: '4px 4px 12px',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {cardTemplates.map((t) => {
          const isSelected = selectedId === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => applyTemplate(t)}
              aria-pressed={isSelected}
              aria-label={`Apply ${t.name} template`}
              style={{
                position: 'relative',
                flexShrink: 0,
                width: 150,
                scrollSnapAlign: 'start',
                background: '#0D0D0D',
                border: isSelected ? '2px solid #49B618' : '1px solid rgba(73,182,24,0.2)',
                borderRadius: 14,
                padding: 8,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
                boxShadow: isSelected ? '0 0 0 3px rgba(73,182,24,0.18)' : 'none',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <TemplateThumb template={t} />
              <div style={{ marginTop: 8, padding: '0 2px' }}>
                <div style={{ color: '#f0f0f0', fontWeight: 600, fontSize: 13, lineHeight: 1.2 }}>
                  {t.name}
                </div>
                <div style={{ color: '#7a9a7a', fontSize: 11, marginTop: 2, lineHeight: 1.3, minHeight: 28 }}>
                  {t.description}
                </div>
              </div>
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg,#008001,#49B618)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(73,182,24,0.4)',
                  }}
                >
                  <Check size={13} color="#fff" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
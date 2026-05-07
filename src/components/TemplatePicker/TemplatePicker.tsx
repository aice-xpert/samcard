"use client";

import React, { useEffect, useState } from 'react';
import { cardTemplates, type CardTemplate } from '@/data/cardTemplates';
import TemplateThumb from './TemplateThumb';
import { Check } from 'lucide-react';

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

  useEffect(() => {
    try {
      const stored = localStorage.getItem(selectedKeyForCard(cardId));
      if (stored) setSelectedId(stored);
    } catch {
      // ignore
    }
  }, [cardId]);

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
    <div className={className}>
      <div
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: 12,
          padding: '4px 4px 12px',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          msOverflowStyle: 'none',
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

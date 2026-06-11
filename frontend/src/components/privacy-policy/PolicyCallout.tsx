"use client";
import { type ReactNode } from 'react';
import { useTheme } from "@/contexts/ThemeContext";

type PolicyCalloutProps = {
  variant?: 'accent' | 'subtle';
  children: ReactNode;
};

export function PolicyCallout({ variant = 'subtle', children }: PolicyCalloutProps) {
  const { isDark } = useTheme();

  const style =
    variant === 'accent'
      ? {
          background: 'rgba(0, 180, 0, 0.08)',
          border: '1px solid rgba(0, 180, 0, 0.3)',
        }
      : {
          background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
          border: '1px solid rgba(0, 180, 0, 0.2)',
        };

  return (
    <div className="p-5 rounded-xl" style={style}>
      <div className="text-muted-foreground">{children}</div>
    </div>
  );
}
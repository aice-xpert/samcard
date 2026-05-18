"use client";
import { Gavel } from 'lucide-react';
import { useTheme } from "@/contexts/ThemeContext";

export function ToSHero() {
  const { isDark } = useTheme();

  return (
   <section
      id="hero"
      className={`pt-32 pb-20 overflow-hidden ${
        isDark
          ? "bg-gradient-to-b from-theme-devil-green/60 via-theme-devil-green/40 to-black"
          : "bg-gradient-to-b from-theme-devil-green/60 via-theme-devil-green/40 to-background"
      }`}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'theme-digital-green',
        }}
      />
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'theme-digital-green',
          }}
        >
          <Gavel className="w-8 h-8 text-theme-kelly-green" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-foreground">
          Terms of Service
        </h1>
        <p className="text-xl max-w-2xl mx-auto text-muted-foreground">
          Please read our Terms of Service carefully. By using SamCard, you agree to be bound by these terms.
        </p>
        <p className="text-sm mt-4 text-muted-foreground">
          Last Updated: March 9, 2026
        </p>
      </div>
    </section>
  );
}
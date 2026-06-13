"use client";

import { useTheme } from "@/contexts/ThemeContext";

export default function BlogPostNewsletter() {
  const { isDark } = useTheme();

  return (
    <section className={`py-16 text-center px-6 ${
      isDark
        ? "bg-gradient-to-b from-black to-theme-devil-green/20"
        : "bg-gradient-to-b from-background to-theme-devil-green/10"
    }`}>
      <div className="max-w-xl mx-auto space-y-4">
        <h3 className="text-2xl font-bold text-foreground">Stay ahead of the curve</h3>
        <p className="text-muted-foreground">
          Weekly insights on AI, blockchain, quantum computing, and modern networking.
        </p>
        <div className="flex gap-3 justify-center mt-6">
          <input
            placeholder="Your email address"
            className={`px-4 py-2.5 rounded-xl border outline-none text-sm w-64 focus:border-accent ${
              isDark
                ? "bg-white/10 border-white/20 text-white placeholder-gray-500"
                : "bg-input-background border-input text-foreground placeholder-muted-foreground"
            }`}
          />
          <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-theme-digital-green text-white font-semibold hover:opacity-90 transition">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}

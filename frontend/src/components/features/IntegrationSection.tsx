"use client";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";

export default function IntegrationSection() {
  const { isDark } = useTheme();
  return (
    <section className={`py-20 text-center ${
      isDark ? "bg-black" : "bg-gradient-to-b from-white via-[#f0f8f0] to-[#e8f3e8]"
    }`}>
      <div className="max-w-4xl mx-auto px-6 border border-theme-devil-green rounded-3xl p-12">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          All Features Work Together Perfectly
        </h2>
        <p className="text-muted-foreground mb-8">
          Our integrated platform ensures every feature works in harmony.
        </p>

        <div className="flex justify-center gap-4">
          <a
            href="#"
            className="px-8 py-4 bg-theme-devil-green text-white rounded-xl inline-block"
          >
            Start Free Trial
          </a>
          <Link
            href="/pricing"
            className={`px-8 py-4 border rounded-xl inline-block ${
              isDark
                ? "border-white/20 text-white"
                : "border-gray-300 text-foreground"
            }`}
          >
            View Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
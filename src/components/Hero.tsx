"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export function Hero() {
  const { isDark } = useTheme();

  return (
    <section
      id="hero"
      className={`pt-32 pb-20 overflow-hidden ${
        isDark
          ? "bg-gradient-to-b from-theme-devil-green via-black to-black"
          : "bg-gradient-to-b from-theme-devil-green/35 via-theme-kelly-green/10 to-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Your Business Card,
                <span className="block text-accent">Reimagined</span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed">
                Create stunning digital business cards with custom QR codes.
                Share your contact info instantly, track engagement, and make
                lasting impressions — all from your smartphone.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="group px-8 py-4 bg-gradient-to-r from-primary to-theme-strong-green text-white rounded-xl
                           hover:shadow-2xl hover:shadow-theme-digital-green/30 hover:scale-105
                           transition-all flex items-center justify-center gap-2"
              >
                Get Started Free
                <ArrowRight
                  className="group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </Link>

              <Link
                href="/dashboard"
                className={`px-8 py-4 backdrop-blur-sm border-2 rounded-xl transition-all text-center ${
                  isDark
                    ? "bg-white/10 text-white border-white/30 hover:border-accent hover:bg-white/20"
                    : "bg-black/5 text-foreground border-gray-300 hover:border-accent hover:bg-black/10"
                }`}
              >
                View Dashboard Demo
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-6">
              <div>
                <div className="text-3xl font-bold text-foreground">50K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">1M+</div>
                <div className="text-sm text-muted-foreground">Cards Shared</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>

          
<div className="relative">
  <Image
    src="/images/hero-image.png"
    alt="Digital business cards"
    width={800}
    height={600}
    sizes="(max-width: 1024px) 100vw, 50vw"
    className="w-full h-auto opacity-95"
    priority
  />

  {/* Glow effects */}
  <div className={`absolute -top-8 -right-8 w-64 h-64 rounded-full blur-3xl -z-10 ${
    isDark
      ? "bg-gradient-to-br from-theme-kelly-green/30 to-theme-digital-green/30"
      : "bg-gradient-to-br from-theme-kelly-green/45 to-theme-digital-green/30"
  }`} />
  <div className={`absolute -bottom-8 -left-8 w-48 h-48 rounded-full blur-3xl -z-10 ${
    isDark
      ? "bg-gradient-to-br from-theme-devil-green/50 to-theme-digital-green/20"
      : "bg-gradient-to-br from-theme-devil-green/25 to-theme-digital-green/10"
  }`} />
</div>
        </div>
      </div>
    </section>
  );
}

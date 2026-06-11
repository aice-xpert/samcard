"use client";
import { useTheme } from "@/contexts/ThemeContext";

export default function HeroSection() {
  const { isDark } = useTheme();
  return (
    <section className={`pt-38 pb-20 bg-gradient-to-b overflow-hidden ${
      isDark
        ? "from-theme-devil-green via-black to-black"
        : "from-theme-devil-green via-white to-[#f0f8f0]"
    }`}>
      <div className="max-w-5xl mx-auto px-4 text-center">

        <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
          Everything You Need to Network{" "}
          <span className="text-accent">
            Smarter & Faster
          </span>
        </h1>

        <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Discover powerful features designed to help professionals and businesses 
          create, share, and manage digital business cards effortlessly.
        </p>

      </div>
    </section>
  );
}
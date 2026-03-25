"use client";

import { BookOpen } from "lucide-react";

export default function BlogHero() {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-b from-theme-devil-green via-black to-black text-center">
      <div className="max-w-6xl mx-auto px-6 space-y-6">

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-theme-digital-green/20 border border-theme-digital-green/30 rounded-full text-theme-kelly-green text-sm">
          <BookOpen size={16} />
          Insights for Modern Professionals
        </div>

        <h1 className="text-5xl lg:text-7xl font-bold text-white">
          Digital{" "}
          <span className="bg-gradient-to-r from-accent to-theme-digital-green bg-clip-text text-transparent">
            Networking Insights
          </span>
        </h1>

        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Discover strategies, trends, and insights that help professionals
          network smarter in the digital world.
        </p>

      </div>
    </section>
  );
}
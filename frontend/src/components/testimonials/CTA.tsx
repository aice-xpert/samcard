"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Star } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export function CTA() {
  const { isDark } = useTheme();

  return (
    <section className={`py-28 bg-gradient-to-b ${isDark ? "from-black via-theme-devil-green/50 to-black" : "from-background via-theme-devil-green/20 to-background"} px-4`}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={`relative ${isDark ? "bg-white/5 backdrop-blur-2xl border border-white/10" : "bg-white border-gray-200 shadow-sm"} rounded-3xl p-14 overflow-hidden`}
        >
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-gradient-to-br from-theme-digital-green/30 to-theme-kelly-green/30 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-gradient-to-br from-theme-devil-green/50 to-theme-digital-green/20 rounded-full blur-3xl -z-10" />

          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={24}
                className="text-accent fill-accent"
              />
            ))}
          </div>

          <h2 className={`text-3xl lg:text-4xl font-bold mb-4 ${isDark ? "text-white" : "text-foreground"}`}>
            Join 50,000+ professionals who love SamCard
          </h2>

          <p className="text-muted-foreground mb-10 text-lg">
            Start your free 14-day trial today. No credit card required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="group px-8 py-4 bg-gradient-to-r from-primary to-theme-strong-green text-white rounded-xl
                         hover:shadow-2xl hover:shadow-theme-digital-green/30 hover:scale-105
                         transition-all flex items-center justify-center gap-2"
            >
              Get Started Free
            </Link>

            <Link
              href="/features"
              className={`px-8 py-4 rounded-xl transition-all text-center ${isDark ? "bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:border-accent hover:bg-white/20" : "bg-gray-100 text-foreground border-2 border-gray-200 hover:border-accent hover:bg-gray-200"}`}
            >
              See All Features
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

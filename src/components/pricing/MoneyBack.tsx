"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export function MoneyBack() {
  const { isDark } = useTheme();
  return (
    <section className={`py-20 ${isDark ? "bg-gradient-to-b from-black to-[#031103]" : "bg-background"}`}>
      <div className="max-w-7xl mx-auto px-4">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-accent/10 to-transparent
                     rounded-3xl p-12
                     border border-accent/20
                     text-center
                     max-w-4xl mx-auto
                     backdrop-blur-sm"
        >
          {/* Icon */}
          <div className="text-6xl mb-6">🛡️</div>

          {/* Heading */}
          <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            30-Day Money-Back Guarantee
          </h3>

          {/* Description */}
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            Try SamCard risk-free. If you are not completely satisfied within
            30 days, we will refund you in full — no questions asked.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4">

            <div className={`flex items-center gap-3 px-6 py-3 rounded-xl border ${
              isDark
                ? "bg-white/5 border-white/10"
                : "bg-white border-gray-200 shadow-sm"
            }`}>
              <Check className="text-accent" size={20} />
              <span className="text-muted-foreground">
                No credit card required
              </span>
            </div>

            <div className={`flex items-center gap-3 px-6 py-3 rounded-xl border ${
              isDark
                ? "bg-white/5 border-white/10"
                : "bg-white border-gray-200 shadow-sm"
            }`}>
              <Check className="text-accent" size={20} />
              <span className="text-muted-foreground">
                Cancel anytime
              </span>
            </div>

            <div className={`flex items-center gap-3 px-6 py-3 rounded-xl border ${
              isDark
                ? "bg-white/5 border-white/10"
                : "bg-white border-gray-200 shadow-sm"
            }`}>
              <Check className="text-accent" size={20} />
              <span className="text-muted-foreground">
                Full refund guarantee
              </span>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
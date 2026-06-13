"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export function Hero() {
  const { isDark } = useTheme();

  return (
    <section className={`pt-32 pb-20 bg-gradient-to-b from-theme-devil-green ${isDark ? "via-black to-black" : "via-background to-background"} overflow-hidden`}>
      <div className="max-w-5xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? "bg-white/10 border border-white/20" : "bg-white border-gray-200 shadow-sm"} text-accent text-sm mx-auto`}>
            <Star size={14} className="fill-accent text-accent" />
            <span>4.9/5 from 50,000+ professionals</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
            Real stories from{" "}
            <span className="text-accent">real professionals</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Thousands of professionals trust SamCard to grow their networks,
            close more deals, and make lasting impressions.
          </p>

          <div className="flex items-center justify-center gap-1 pt-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={28}
                className="text-accent fill-accent"
              />
            ))}
            <span className="ml-3 text-muted-foreground text-lg">
              Rated 4.9 out of 5
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

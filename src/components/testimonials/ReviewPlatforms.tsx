"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const platforms = [
  { platform: "G2", score: "4.9", reviews: "1,240 reviews" },
  { platform: "Capterra", score: "4.8", reviews: "980 reviews" },
  { platform: "Product Hunt", score: "#1", reviews: "Top Product" },
  { platform: "Trustpilot", score: "Excellent", reviews: "2,100 reviews" },
];

export function ReviewPlatforms() {
  return (
    <section className="py-20 bg-gradient-to-b from-black via-theme-devil-green/10 to-black px-4">
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-gray-500 text-sm mb-12 uppercase tracking-widest">
          Highly rated across all platforms
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {platforms.map((p, i) => (
            <motion.div
              key={p.platform}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center hover:border-accent/40 transition-all"
            >
              <div className="text-2xl font-bold text-accent mb-1">
                {p.score}
              </div>

              <div className="text-white font-medium text-sm">
                {p.platform}
              </div>

              <div className="text-gray-500 text-xs mt-1">
                {p.reviews}
              </div>

              <div className="flex justify-center gap-0.5 mt-3">
                {[...Array(5)].map((_, idx) => (
                  <Star
                    key={idx}
                    size={12}
                    className="text-accent fill-accent"
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
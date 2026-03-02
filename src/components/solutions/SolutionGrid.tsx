"use client";

import { motion } from "motion/react";
import { SolutionCard } from "./SolutionCard";
import { SOLUTION_CATEGORIES } from "@/constant";

export default function SolutionsGrid() {
  return (
    <section id="solutions" className="relative py-24 bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-theme-digital-green/20 to-black opacity-50" />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-1/2 bg-theme-devil-green/10 blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our Solutions
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            From business cards to payments, discover the perfect QR code solution for your needs
          </p>
        </motion.div>

        <div className="space-y-16">
          {SOLUTION_CATEGORIES.map((cat, i) => (
            <div key={i}>
              <h3 className="text-2xl font-bold text-white mb-8 border-l-4 border-theme-digital-green pl-4">
                {cat.category}
              </h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cat.solutions.map((sol, idx) => (
                  <SolutionCard key={idx} {...sol} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
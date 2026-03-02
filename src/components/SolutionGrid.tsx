"use client";

import { motion } from "motion/react";
import { SolutionCard } from "./SolutionCard";
import { SOLUTION_CATEGORIES } from "@/constant";

export default function SolutionsGrid() {
  return (
    <section id="solutions" className="relative py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-black to-[#141938]" />

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
          <p className="text-lg text-white-700 max-w-2xl mx-auto">
            From business cards to payments, discover the perfect QR code solution for your needs
          </p>
        </motion.div>

        <div className="space-y-16">
          {SOLUTION_CATEGORIES.map((cat, i) => (
            <div key={i}>
              <h3 className="text-2xl font-bold text-white mb-8">
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
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { EXTENDED_TESTIMONIALS } from "@/constant";

export default function TestimonialGrid() {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    ...new Set(EXTENDED_TESTIMONIALS.map(t => t.category)),
  ];

  const filtered =
    activeCategory === "All"
      ? EXTENDED_TESTIMONIALS
      : EXTENDED_TESTIMONIALS.filter(
          t => t.category === activeCategory
        );

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            What Professionals Are Saying
          </h2>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm border transition-all ${
                  activeCategory === cat
                    ? "bg-theme-kelly-green text-white border-theme-kelly-green"
                    : "bg-white/5 text-gray-400 border-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-7 hover:border-theme-kelly-green transition"
              >
                <div className="flex justify-between mb-4">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={14} className="text-theme-kelly-green fill-theme-kelly-green" />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full">
                    {testimonial.category}
                  </span>
                </div>

                <Quote size={20} className="text-theme-kelly-green mb-3" />

                <p className="text-gray-300 text-sm mb-6">
                  "{testimonial.text}"
                </p>

                <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                  <img
                    src={testimonial.avatar}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {testimonial.role} · {testimonial.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
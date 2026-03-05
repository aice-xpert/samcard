"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Michael Chen",
    role: "Entrepreneur",
    company: "StartupHub",
    rating: 5,
    text: "As a startup founder, first impressions matter. DigiCard helps me look professional and tech-savvy.",
    category: "Startup",
  },
  {
    name: "Emily Rodriguez",
    role: "Sales Manager",
    company: "GlobalSales Co.",
    rating: 5,
    text: "The custom QR codes are a game-changer. Our entire sales team uses DigiCard now.",
    category: "Sales",
  },
  {
    name: "James Wilson",
    role: "CEO",
    company: "Innovation Labs",
    rating: 5,
    text: "DigiCard helped us eliminate printing costs while improving our brand image.",
    category: "Enterprise",
  },
];

export function FeaturedTestimonial() {
  const [index, setIndex] = useState(0);

  const rotate = (dir: number) => {
    setIndex((prev) => (prev + dir + testimonials.length) % testimonials.length);
  };

  const current = testimonials[index];

  return (
    <section className="py-24 bg-gradient-to-b from-black via-theme-devil-green/20 to-black px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Featured Reviews</h2>
          <p className="text-gray-400 mt-2">
            Hear directly from our power users
          </p>
        </div>

        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 overflow-hidden">

          <div className="absolute top-6 right-6 opacity-10">
            <Quote size={120} className="text-accent" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex gap-1 mb-6">
                {[...Array(current.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className="text-accent fill-accent"
                  />
                ))}
                <span className="ml-3 text-sm text-accent bg-accent/10 px-3 py-1 rounded-full">
                  {current.category}
                </span>
              </div>

              <blockquote className="text-xl text-gray-200 italic mb-8 leading-relaxed">
                &ldquo;{current.text}&rdquo;
              </blockquote>

              <div>
                <div className="font-semibold text-lg">
                  {current.name}
                </div>
                <div className="text-gray-400 text-sm">
                  {current.role} · {current.company}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex gap-3 mt-10 justify-end">
            <button
              onClick={() => rotate(-1)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={() => rotate(1)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
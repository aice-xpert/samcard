"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface ProcessTimelineProps {
  points: string[];
}

export default function ProcessTimeline({ points }: ProcessTimelineProps) {
  if (points.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="my-12 rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
    >
      <div className="p-6 md:p-8">
        <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-theme-devil-green/10 flex items-center justify-center">
            <Check className="text-theme-devil-green" size={18} />
          </span>
          Quick Overview
        </h3>

        <div className="space-y-6">
          {points.map((point, idx) => (
            <motion.div
              key={point}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              className="flex items-center gap-4"
            >
              <span className="w-3 h-3 bg-theme-devil-green rounded-full flex-shrink-0 mt-0.5" />
              <p className="text-gray-300 text-sm leading-relaxed">{point}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
"use client";

import { motion } from "framer-motion";

interface KeyTakeawaysProps {
  points: string[];
}

export default function KeyTakeaways({ points }: KeyTakeawaysProps) {
  if (points.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="mt-6 flex flex-wrap items-center gap-2"
    >
    
      {points.slice(0, 8).map((point, idx) => (
        <motion.span
          key={idx}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 + idx * 0.05 }}
          className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 
                     text-gray-400 text-xs hover:text-white hover:border-accent/50 
                     transition-all cursor-pointer"
        >
          {point}
        </motion.span>
      ))}
    </motion.div>
  );
}
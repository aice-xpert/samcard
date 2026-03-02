"use client";

import { motion } from "motion/react";
import { ArrowRight, Icon, LucideIcon } from "lucide-react";
import { useState } from "react";

interface Props {
  icon: LucideIcon;
  title: String;
  description: String;
}

export function SolutionCard({ icon: Icon, title, description }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative rounded-2xl p-6 cursor-pointer group"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#1e2565]/60 to-[#141938]/80 border border-[#4FD1C5]/10" />

      <div className="relative">
        <motion.div
          animate={{ rotate: hovered ? 5 : 0, scale: hovered ? 1.1 : 1 }}
          className="w-14 h-14 rounded-xl bg-[#4FD1C5]/20 flex items-center justify-center mb-4"
        >
          <Icon className="w-7 h-7 text-[#4FD1C5]" />
        </motion.div>

        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#4FD1C5]">
          {title}
        </h3>

        <p className="text-sm text-gray-300 mb-4">{description}</p>

        <motion.div
          animate={{ x: hovered ? 5 : 0 }}
          className="flex items-center text-[#4FD1C5] text-sm"
        >
          Learn More <ArrowRight className="w-4 h-4 ml-1" />
        </motion.div>
      </div>
    </motion.div>
  );
}

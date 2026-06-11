"use client";

import { motion } from "motion/react";
import { ArrowRight, LucideIcon } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function SolutionCard({ icon: Icon, title, description }: Props) {
  const { isDark } = useTheme();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative rounded-2xl p-6 cursor-pointer group"
    >
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br rounded-xl ${
        isDark
          ? "bg-white/5 backdrop-blur-sm border border-white/10"
          : "bg-white border border-gray-200 shadow-sm"
      }`} />

      <div className="relative">
        <motion.div
          animate={{ rotate: hovered ? 5 : 0, scale: hovered ? 1.1 : 1 }}
          className="w-14 h-14 rounded-xl bg-theme-digital-green/10 group-hover:bg-theme-digital-green/30 flex items-center justify-center mb-4"
        >
          <Icon className="w-7 h-7 text-theme-kelly-green" />
        </motion.div>

        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-[#49b618]">
          {title}
        </h3>

        <p className="text-sm text-muted-foreground mb-4 group-hover:text-foreground">{description}</p>

        <motion.div
          animate={{ x: hovered ? 5 : 0 }}
          className="flex items-center text-theme-kelly-green text-sm"
        >
          Learn More <ArrowRight className="w-4 h-4 ml-1" />
        </motion.div>
      </div>
    </motion.div>
  );
}

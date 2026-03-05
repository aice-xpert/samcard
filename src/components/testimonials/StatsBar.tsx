"use client";

import { motion } from "framer-motion";
import { Users, Award, Globe, Star } from "lucide-react";

const stats = [
  { value: "4.9/5", label: "Average Rating", icon: Star },
  { value: "50K+", label: "Active Users", icon: Users },
  { value: "1M+", label: "Cards Created", icon: Award },
  { value: "150+", label: "Countries", icon: Globe },
];

export function StatsBar() {
  return (
    <section className="py-14 bg-neutral-950 border-y border-white/10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="text-center space-y-3"
          >
            <stat.icon
              size={28}
              className="mx-auto text-theme-digital-green"
            />
            <div className="text-3xl font-bold text-white">
              {stat.value}
            </div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
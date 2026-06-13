"use client";

import { motion } from "framer-motion";
import { CASE_STUDIES } from "@/constant";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";

export default function CaseStudies() {
  const { isDark } = useTheme();

  return (
    <section className={`py-24 ${isDark ? "bg-black text-white" : "bg-background text-foreground"}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold">Case Studies</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See how teams are using SamCard to increase conversions,
            reduce costs, and modernize their networking.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {CASE_STUDIES.map((cs, i) => (
            <motion.div
              key={cs.company}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className={`group ${isDark ? "bg-neutral-900 border border-white/10 hover:border-white/20" : "bg-white border-gray-200 shadow-sm hover:border-gray-300"} rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300`}
            >
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-12 h-12 rounded-xl ${isDark ? "bg-neutral-800 text-white" : "bg-gray-100 text-foreground"} flex items-center justify-center font-semibold text-sm`}>
                  {cs.logo}
                </div>
                <div className="text-lg font-semibold">
                  {cs.company}
                </div>
              </div>

              <div className="mb-6">
                <div className="text-5xl font-bold text-theme-digital-green">
                  {cs.metric}
                </div>
                <div className="text-muted-foreground text-sm mt-2">
                  {cs.metricLabel}
                </div>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                {cs.description}
              </p>

              <Link
                href={`/case-studies/${cs.company
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-accent group-hover:gap-3 transition-all"
              >
                Read full story
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

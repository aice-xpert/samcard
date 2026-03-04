"use client";

import { motion } from "framer-motion";
import { CASE_STUDIES } from "@/constant";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CaseStudies() {
  return (
    <section className="py-24 bg-black text-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-bold">Case Studies</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            See how teams are using DigiCard to increase conversions,
            reduce costs, and modernize their networking.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {CASE_STUDIES.map((cs, i) => (
            <motion.div
              key={cs.company}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="group bg-neutral-900 border border-white/10 rounded-2xl p-8 hover:border-white/20 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Company */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center font-semibold text-sm text-white">
                  {cs.logo}
                </div>
                <div className="text-lg font-semibold">
                  {cs.company}
                </div>
              </div>

              {/* Metric */}
              <div className="mb-6">
                <div className="text-5xl font-bold text-theme-digital-green">
                  {cs.metric}
                </div>
                <div className="text-gray-400 text-sm mt-2">
                  {cs.metricLabel}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                {cs.description}
              </p>

              {/* CTA */}
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
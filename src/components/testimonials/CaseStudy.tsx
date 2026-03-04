"use client";

import { motion } from "framer-motion";
import { CASE_STUDIES } from "@/constant";
import { ArrowRight } from "lucide-react";

export default function CaseStudies() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/[0.02] border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-14">
          Case Studies
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {CASE_STUDIES.map((cs, i) => (
            <motion.div
              key={cs.company}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all group relative"
            >
              <div className={`h-2 bg-gradient-to-r ${cs.color}`} />

              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cs.color} flex items-center justify-center font-bold text-white text-sm`}
                  >
                    {cs.logo}
                  </div>
                  <div className="font-semibold text-white">{cs.company}</div>
                </div>

                <div className="mb-4">
                  <span
                    className={`text-5xl font-bold bg-gradient-to-r ${cs.color} bg-clip-text text-transparent`}
                  >
                    {cs.metric}
                  </span>
                  <div className="text-gray-400 text-sm mt-1">{cs.metricLabel}</div>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed">{cs.description}</p>

                <button className="mt-6 flex items-center gap-2 text-sm text-[#4FD1C5] opacity-0 group-hover:opacity-100 transition-opacity">
                  Read full story <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
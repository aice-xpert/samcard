"use client";

import { motion } from "framer-motion";
export const milestones = [
  {
    year: "2024",
    event: "SamCard Founded",
    description:
      "SamCard started with a simple idea — make networking faster and smarter using digital business cards.",
  },
  {
    year: "2025",
    event: "10K+ Professionals Joined",
    description:
      "Thousands of professionals started using SamCard to share their digital identity instantly.",
  },
  {
    year: "2026",
    event: "Global Expansion",
    description:
      "SamCard users expanded across multiple countries, creating a growing digital networking community.",
  },
  {
    year: "Future",
    event: "Next Generation Networking",
    description:
      "We continue building innovative tools that redefine how professionals connect worldwide.",
  },
];
export function TimelineSection() {
  return (
    <section className="py-24 bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Our Journey
          </h2>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Key milestones in the growth of SamCard
          </p>
        </motion.div>

        {/* Timeline */}

        <div className="relative">

          {/* Line */}

          <div className="absolute left-1/2 -translate-x-1/2 w-[2px] h-full bg-white/10" />

          <div className="space-y-16">

            {milestones.map((milestone, index) => {

              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={`flex items-center gap-10 ${
                    isLeft ? "flex-row" : "flex-row-reverse"
                  }`}
                >

                  {/* Card */}

                  <div
                    className={`flex-1 ${
                      isLeft ? "text-right" : "text-left"
                    }`}
                  >

                    <div className="inline-block p-6 bg-white/5 border border-white/10 rounded-xl max-w-md">

                      <div className="text-theme-devil-green font-semibold mb-2">
                        {milestone.year}
                      </div>

                      <h4 className="text-xl font-bold text-white mb-2">
                        {milestone.event}
                      </h4>

                      <p className="text-gray-400 text-sm leading-relaxed">
                        {milestone.description}
                      </p>

                    </div>

                  </div>

                  {/* Dot */}

                  <div className="relative z-10 flex items-center justify-center">
                    <div className="w-4 h-4 bg-theme-devil-green rounded-full border-4 border-black" />
                  </div>

                  {/* Spacer */}

                  <div className="flex-1" />

                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
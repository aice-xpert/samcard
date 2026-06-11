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
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Our Journey
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Key milestones in the growth of SamCard
          </p>
        </motion.div>

        <div className="relative">

          <div className="absolute top-0 bottom-0 left-[7px] w-[2px] bg-border md:left-1/2 md:-translate-x-px" />

          <div className="space-y-12 md:space-y-16">
            {milestones.map((milestone, index) => {
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="relative flex items-start md:block"
                >

                  <div
                    className="
                      relative flex-shrink-0 mt-5
                      md:absolute md:left-1/2 md:top-1/2
                      md:-translate-x-1/2 md:-translate-y-1/2
                    "
                  >
                    <div className="w-4 h-4 bg-theme-devil-green rounded-full border-4 border-background z-10 shadow-[0_0_12px_rgba(34,197,94,0.7)]" />
                  </div>

                  <div
                    className={`
                      ml-6 flex-1
                      md:ml-0 md:w-1/2 md:flex-none
                      ${isLeft
                        ? "md:pr-12 md:text-right"
                        : "md:pl-12 md:ml-auto md:text-left"
                      }
                    `}
                  >
                    <div className="p-5 sm:p-6 bg-muted border border-border rounded-xl">
                      <div className="text-theme-devil-green font-semibold mb-1">
                        {milestone.year}
                      </div>
                      <h4 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                        {milestone.event}
                      </h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
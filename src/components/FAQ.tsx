"use client";

import { FAQ_ITEMS } from "@/constant";
import { motion } from "motion/react";
import { AccordionItem } from "../components/FAQAccordion";

const VIEWPORT = { once: true };

export default function FAQ() {
  return (
    <section
      id="faq"
      className="py-24 bg-gradient-to-b from-black via-[#020f02] to-[#031103]"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-white">
            Everything you need to know about DigiCard
          </p>
        </motion.div>

        {/* Questions */}
        <div className="flex flex-col gap-3">
          {FAQ_ITEMS.map((item, index) => (
            <motion.div
                key={item.question} 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              >
              <AccordionItem item={item} />
            </motion.div>
          ))}
        </div>

        {/* Contact Support */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 text-center p-8 bg-gradient-to-br from-[#008001]/30 to-transparent rounded-2xl border border-[#009200]"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Still have questions
          </h3>
          <p className="text-white mb-6">
            Our support team is here to help you get the most out of DigiCard.
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-[#49B618] to-[#006312] text-white rounded-xl hover:shadow-xl hover:shadow-[#009200]/30 hover:scale-105 transition-all">
            Contact Support
          </button>
        </motion.div>
      </div>
    </section>
  );
}

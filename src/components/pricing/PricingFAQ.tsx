"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, HelpCircle } from "lucide-react";

export function PricingFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    {
      question: "Can I change my plan later?",
      answer:
        "Yes! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately, and we'll prorate any charges.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, Mastercard, Amex) and PayPal. Enterprise customers can also pay via invoice.",
    },
    {
      question: "Is there a free trial?",
      answer:
        "Yes! Our Premium plan comes with a 14-day free trial. No credit card required. You can cancel anytime during the trial without being charged.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, contact us within 30 days for a full refund.",
    },
    {
      question: "What happens to my data if I cancel?",
      answer:
        "Your data remains accessible for 30 days after cancellation. You can export all your data at any time. After 30 days, accounts are permanently deleted.",
    },
    {
      question: "Can I get a discount for annual billing?",
      answer:
        "Yes! Annual billing gives you 2 months free (equivalent to ~17% savings). Enterprise customers can also negotiate custom pricing.",
    },
  ];

  return (
    <section className="py-24 bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-300">
            Everything you need to know about our pricing
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 backdrop-blur-sm 
                         border border-white/10 
                         rounded-2xl overflow-hidden
                         hover:border-accent/60 
                         transition-all duration-300"
            >
              <button
                onClick={() => setOpen(open === index ? null : index)}
                className="w-full p-6 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-4">
                  
                  {/* Icon */}
                  <div className="w-10 h-10 
                                  bg-theme-digital-green/10 
                                  rounded-lg 
                                  flex items-center justify-center 
                                  flex-shrink-0">
                    <HelpCircle
                      className="text-accent"
                      size={20}
                    />
                  </div>

                  {/* Question */}
                  <span className="text-lg font-semibold text-white">
                    {faq.question}
                  </span>
                </div>

                {/* Arrow */}
                <motion.div
                  animate={{ rotate: open === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowRight
                    className="text-gray-400 rotate-90"
                    size={20}
                  />
                </motion.div>
              </button>

              {/* Answer Animation */}
              <AnimatePresence>
                {open === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6"
                  >
                    <p className="text-gray-300 leading-relaxed pl-14">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
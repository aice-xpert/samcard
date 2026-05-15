"use client";
import { FAQ_ITEMS } from "@/constant";
import { AccordionItem } from "../components/FAQAccordion";
import { useTheme } from "@/contexts/ThemeContext";

export default function FAQ() {
  const { isDark } = useTheme();

  return (
    <section
      id="faq"
      className={`py-24 ${
        isDark
          ? "bg-gradient-to-b from-black via-[#020f02] to-[#031103]"
          : "bg-gradient-to-b from-white via-[#f0f8f0] to-[#e8f3e8]"
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-foreground">
            Everything you need to know about SamCard
          </p>
        </div>

        {/* Questions */}
        <div className="flex flex-col gap-3">
          {FAQ_ITEMS.map((item) => (
            <div
                key={item.question} 
              >
              <AccordionItem item={item} />
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className={`mt-16 text-center p-8 rounded-2xl border ${
          isDark
            ? "bg-gradient-to-br from-[#008001]/30 to-transparent border-[#009200]"
            : "bg-gradient-to-br from-[#008001]/30 to-transparent border-[#009200]"
        }`}>
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Still have questions
          </h3>
          <p className="text-foreground mb-6">
            Our support team is here to help you get the most out of SamCard.
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-[#49B618] to-[#006312] text-white text-lg font-bold rounded-xl hover:shadow-xl hover:shadow-[#009200]/30 hover:scale-105 transition-all">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
}

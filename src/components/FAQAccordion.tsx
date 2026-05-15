"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQItem } from "@/constant";
import { useTheme } from "@/contexts/ThemeContext";

interface AccordionItemProps {
  item: FAQItem;
}

export function AccordionItem({ item }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark } = useTheme();

  return (
    <div
      onClick={() => setIsOpen((prev) => !prev)}
      className={`rounded-xl border cursor-pointer transition-colors duration-200
        ${
          isOpen
            ? "border-[#49B618]/30 bg-[#009200]/5"
            : isDark
              ? "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
              : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
        }`}
    >
      {/* Question Row */}
      <div className="flex items-center justify-between px-6 py-5 select-none">
        <span className="text-foreground font-medium text-base pr-4">
          {item.question}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-[#49B618] transition-transform duration-300 ${
            isOpen ? "rotate-180 text-accent" : ""
          }`}
        />
      </div>

      {/* Answer */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="px-6 pb-5 text-muted-foreground text-sm leading-relaxed">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

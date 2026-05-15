"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export function PricingComparison() {
  const { isDark } = useTheme();
  const comparisonFeatures = [
    {
      category: "Cards & Templates",
      features: [
        {
          name: "Number of Digital Cards",
          free: "1",
          premium: "Unlimited",
          enterprise: "Unlimited",
        },
        {
          name: "Template Library",
          free: "Basic",
          premium: "Premium",
          enterprise: "Premium + Custom",
        },
        {
          name: "Custom Branding",
          free: false,
          premium: true,
          enterprise: true,
        },
        {
          name: "Remove SamCard Logo",
          free: false,
          premium: true,
          enterprise: true,
        },
      ],
    },
    {
      category: "Sharing & Distribution",
      features: [
        {
          name: "Monthly Shares",
          free: "100",
          premium: "Unlimited",
          enterprise: "Unlimited",
        },
        {
          name: "QR Code Generation",
          free: true,
          premium: true,
          enterprise: true,
        },
        {
          name: "Custom QR Design",
          free: false,
          premium: true,
          enterprise: true,
        },
        {
          name: "NFC Card Support",
          free: false,
          premium: true,
          enterprise: true,
        },
      ],
    },
    {
      category: "Analytics & Insights",
      features: [
        { name: "Basic Analytics", free: true, premium: true, enterprise: true },
        { name: "Advanced Analytics", free: false, premium: true, enterprise: true },
        { name: "Custom Reports", free: false, premium: false, enterprise: true },
        { name: "API Access", free: false, premium: false, enterprise: true },
      ],
    },
    {
      category: "Support & Services",
      features: [
        {
          name: "Support Type",
          free: "Email",
          premium: "Priority",
          enterprise: "Dedicated",
        },
        {
          name: "Response Time",
          free: "48 hours",
          premium: "4 hours",
          enterprise: "1 hour",
        },
        { name: "Account Manager", free: false, premium: false, enterprise: true },
        { name: "Custom Training", free: false, premium: false, enterprise: true },
      ],
    },
  ];

  const renderValue = (value: boolean | string) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="text-accent mx-auto" size={20} />
      ) : (
        <X className="text-muted-foreground mx-auto" size={20} />
      );
    }

    return <span className="text-muted-foreground">{value}</span>;
  };

  return (
    <section className={`py-24 bg-gradient-to-b ${isDark ? "from-black via-theme-devil-green/50 to-black" : "from-background via-theme-devil-green/5 to-background"}`}>
      <div className="max-w-7xl mx-auto px-4">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Detailed Feature Comparison
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Compare all features across our plans to find the perfect fit
          </p>
        </motion.div>

        {/* Table */}
        <div className={`rounded-3xl border overflow-hidden ${
          isDark
            ? "bg-white/5 backdrop-blur-sm border-white/10"
            : "bg-white border-gray-200 shadow-sm"
        }`}>

          {/* Header */}
          <div className={`grid grid-cols-4 gap-4 p-6 border-b ${
            isDark
              ? "bg-white/5 border-white/10"
              : "bg-gray-50 border-gray-200"
          }`}>
            <div className="text-muted-foreground font-semibold">Features</div>
            <div className="text-center text-foreground font-bold">Free</div>
            <div className="text-center text-foreground font-bold">Premium</div>
            <div className="text-center text-foreground font-bold">Enterprise</div>
          </div>

          {/* Body */}
          {comparisonFeatures.map((section, sectionIndex) => (
            <div key={sectionIndex}>

              {/* Category Title */}
              <div className={`px-6 py-4 ${isDark ? "bg-white/5" : "bg-gray-50"}`}>
                <h3 className="text-lg font-bold text-foreground">
                  {section.category}
                </h3>
              </div>

              {/* Features */}
              {section.features.map((feature, featureIndex) => (
                <div
                  key={featureIndex}
                  className={`grid grid-cols-4 gap-4 p-6 border-b transition-colors ${
                    isDark
                      ? "border-white/5 hover:bg-white/5"
                      : "border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  <div className="text-muted-foreground">{feature.name}</div>

                  <div className="text-center">
                    {renderValue(feature.free)}
                  </div>

                  <div className="text-center">
                    {renderValue(feature.premium)}
                  </div>

                  <div className="text-center">
                    {renderValue(feature.enterprise)}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Check,
  X,
  Sparkles,
  Crown,
  Building2,
  ArrowRight,
  Star,
} from "lucide-react";

export function PricingCards() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly"
  );

  const pricingPlans = [
    {
      name: "Free",
      icon: Sparkles,
      price: "$0",
      description: "Perfect for getting started",
      features: [
        { name: "1 Digital Business Card", included: true },
        { name: "Basic Templates", included: true },
        { name: "QR Code Generation", included: true },
        { name: "Up to 100 shares/month", included: true },
        { name: "Basic Analytics", included: true },
        { name: "Email Support", included: true },
        { name: "Custom Branding", included: false },
        { name: "Advanced Analytics", included: false },
        { name: "Priority Support", included: false },
        { name: "NFC Support", included: false },
      ],
      buttonText: "Get Started",
      popular: false,
      gradient: "from-gray-600 to-gray-700",
    },
    {
      name: "Premium",
      icon: Crown,
      price: "$19",
      description: "For professionals and growing businesses",
      features: [
        { name: "Unlimited Digital Cards", included: true },
        { name: "All Premium Templates", included: true },
        { name: "Custom Branding", included: true },
        { name: "Unlimited Shares", included: true },
        { name: "Advanced Analytics", included: true },
        { name: "Priority Support", included: true },
        { name: "Custom QR Designs", included: true },
        { name: "NFC Support", included: true },
        { name: "All Integrations", included: true },
        { name: "Remove DigiCard Branding", included: true },
      ],
      buttonText: "Start Free Trial",
      popular: true,
      gradient: "from-accent to-theme-digital-green",
      savings: "Save $48/year with annual billing",
    },
    {
      name: "Enterprise",
      icon: Building2,
      price: "Custom",
      description: "For large teams and organizations",
      features: [
        { name: "Everything in Premium", included: true },
        { name: "Unlimited Team Members", included: true },
        { name: "Custom Integrations", included: true },
        { name: "API Access", included: true },
        { name: "Dedicated Account Manager", included: true },
        { name: "White-Label Solution", included: true },
        { name: "Advanced Security", included: true },
        { name: "SSO & SAML", included: true },
        { name: "Custom Training", included: true },
        { name: "SLA Guarantee", included: true },
      ],
      buttonText: "Contact Sales",
      popular: false,
      gradient: "from-theme-devil-green to-black",
    },
  ];

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4">

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-16">
          {/* Monthly */}
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
              billingCycle === "monthly"
                ? "bg-accent text-black shadow-lg shadow-accent/40"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            Monthly
          </button>

          {/* Annual */}
          <button
            onClick={() => setBillingCycle("annual")}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 relative ${
              billingCycle === "annual"
                ? "bg-accent text-black shadow-lg shadow-accent/40"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            Annual

            <span
              className="absolute -top-2 -right-3
                         bg-gradient-to-r from-green-500 to-emerald-500
                         text-white text-xs px-2 py-0.5 rounded-full"
            >
              Save 20%
            </span>
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => {
            const numericPrice =
              plan.price !== "Custom"
                ? parseInt(plan.price.replace("$", ""))
                : null;

            const finalPrice =
              billingCycle === "annual" &&
              numericPrice &&
              numericPrice !== 0
                ? `$${(numericPrice * 0.8).toFixed(0)}`
                : plan.price;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-3xl border-2 p-8 backdrop-blur-sm transition-all
                  ${
                    plan.popular
                      ? "border-accent bg-theme-devil-green/10 scale-105 shadow-2xl shadow-accent/20"
                      : "border-white/10 bg-white/5 hover:border-accent/50"
                  }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-accent to-theme-digital-green text-black px-6 py-2 rounded-bl-2xl text-sm font-semibold flex items-center gap-1">
                    <Star size={14} fill="currentColor" />
                    Most Popular
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${plan.gradient}
                  rounded-xl flex items-center justify-center mb-6`}
                >
                  <plan.icon className="text-white" size={28} />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>

                <p className="text-gray-400 text-sm mb-6">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="pt-4 pb-6 border-b border-white/10">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-white">
                      {finalPrice}
                    </span>

                    {plan.price !== "Custom" && (
                      <span className="text-gray-400">
                        /{billingCycle === "monthly" ? "month" : "year"}
                      </span>
                    )}
                  </div>

                  {plan.savings && billingCycle === "annual" && (
                    <p className="text-theme-digital-green text-sm mt-2">
                      💰 {plan.savings}
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 my-8">
                  {plan.features.map((feature) => (
                    <li
                      key={feature.name}
                      className={`flex items-center gap-3 text-sm ${
                        feature.included
                          ? "text-gray-300"
                          : "text-gray-500"
                      }`}
                    >
                      {feature.included ? (
                        <Check size={18} className="text-accent" />
                      ) : (
                        <X size={18} className="text-gray-600" />
                      )}
                      {feature.name}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/signup"
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all
                    ${
                      plan.popular
                        ? "bg-gradient-to-r from-accent to-theme-digital-green text-black hover:shadow-xl hover:shadow-accent/30"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                >
                  {plan.buttonText}
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
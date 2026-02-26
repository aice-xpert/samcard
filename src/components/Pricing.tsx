"use client";
import { motion } from "motion/react";
import { Check, Sparkles, Crown, Building2 } from "lucide-react";

const pricingPlans = [
  {
    name: "Free",
    icon: Sparkles,
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "1 Digital Business Card",
      "Basic Templates",
      "QR Code Generation",
      "Up to 100 shares/month",
      "Basic Analytics",
      "Email Support",
    ],
    buttonText: "Get Started",
    popular: false,
    gradient: "from-gray-600 to-gray-700",
  },
  {
    name: "Premium",
    icon: Crown,
    price: "$19",
    period: "per month",
    description: "For professionals and growing businesses",
    features: [
      "Unlimited Digital Cards",
      "All Premium Templates",
      "Custom Branding",
      "Unlimited Shares",
      "Advanced Analytics",
      "Priority Support",
      "Custom QR Designs",
      "NFC Support",
      "All Integrations",
      "Remove DigiCard Branding",
    ],
    buttonText: "Start Free Trial",
    popular: true,
    gradient: "from-theme-digital-green to-theme-devil-green",
  },
  {
    name: "Enterprise",
    icon: Building2,
    price: "Custom",
    period: "contact us",
    description: "For large teams and organizations",
    features: [
      "Everything in Premium",
      "Unlimited Team Members",
      "Custom Integrations",
      "API Access",
      "Dedicated Account Manager",
      "White-Label Solution",
      "Advanced Security",
      "SSO & SAML",
      "Custom Training",
      "SLA Guarantee",
    ],
    buttonText: "Contact Sales",
    popular: false,
    gradient: "from-surface to-theme-blackout",
  },
];

const VIEWPORT = { once: true };

export function Pricing() {
  return (
    <section
      id="pricing"
      className="py-24 bg-gradient-to-b from-background via-[#020f02] to-[#031203]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. All plans include a 14-day free trial.
          </p>
        </motion.div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative bg-white/5 backdrop-blur-sm rounded-3xl border-2 overflow-hidden transition-all
                ${plan.popular
                  ? "border-theme-digital-green scale-105 z-10 shadow-2xl shadow-theme-digital-green/20 hover:border-theme-digital-green"
                  : "border-white/10 hover:border-theme-digital-green/50"
                }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-theme-digital-green to-theme-devil-green
                                text-white px-6 py-2 rounded-bl-2xl text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="p-8">
                {/* Icon & Header */}
                <div className="mb-6">
                  <div className={`w-14 h-14 bg-gradient-to-br ${plan.gradient} rounded-xl flex items-center justify-center mb-4`}>
                    <plan.icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="pt-4 pb-6 border-b border-white/10">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 py-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="text-accent flex-shrink-0 mt-0.5" size={20} />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className={`w-full py-4 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-theme-digital-green to-theme-devil-green text-white hover:shadow-xl hover:shadow-theme-digital-green/20 hover:scale-105"
                      : "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-theme-digital-green/50"
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Money-back Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          className="text-center mt-16 p-8 bg-gradient-to-br from-theme-digital-green/10 to-transparent
                     rounded-2xl max-w-3xl mx-auto border border-theme-digital-green/20"
        >
          <div className="text-4xl mb-4">🛡️</div>
          <h3 className="text-2xl font-bold text-white mb-2">
            30-Day Money-Back Guarantee
          </h3>
          <p className="text-gray-400">
            Try DigiCard risk-free. If you are not completely satisfied within 30 days,
            we will refund you in full—no questions asked.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
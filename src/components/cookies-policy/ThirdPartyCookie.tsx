"use client";

import { SettingsIcon } from "lucide-react";

const thirdPartyServices = [
  {
    title: "Google Analytics",
    desc: "Web analytics service that tracks and reports website traffic.",
  },
  {
    title: "Google Ads",
    desc: "Advertising platform for retargeting and conversion tracking.",
  },
  {
    title: "Facebook Pixel",
    desc: "Analytics and advertising tool for tracking conversions and building audiences.",
  },
  {
    title: "LinkedIn Insight Tag",
    desc: "Tracking pixel for LinkedIn advertising and analytics.",
  },
  {
    title: "Hotjar",
    desc: "Behavior analytics tool for heatmaps and session recordings.",
  },
  {
    title: "Stripe",
    desc: "Payment processing service (sets cookies for fraud prevention).",
  },
];

export default function ThirdPartyCookies() {
  return (
    <section className="w-full bg-black pt-20">
      <div className="max-w-4xl mx-auto px-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-theme-kelly-green/10 border border-theme-kelly-green/20">
            <SettingsIcon className="text-theme-kelly-green" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            Third-Party Cookies and Services
          </h2>
        </div>

        <p className="text-gray-300">
          In addition to our own cookies, we use various third-party services
          that may set cookies on our website:
        </p>

        <div className="space-y-4 text-gray-300">
          {thirdPartyServices.map((service) => (
            <div
              key={service.title}
              className="p-4 bg-white/5 border border-white/10 rounded-lg"
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-gray-300">
                {service.desc}{" "}
                <a
                  href="/privacy-policy"
                  className="text-theme-devil-green hover:text-theme-kelly-green"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          ))}
        </div>

        <p className="text-gray-300 mt-4">
          These third-party services have their own privacy policies and cookie
          policies. We encourage you to review them to understand how they
          collect and use your information.
        </p>
      </div>
    </section>
  );
}

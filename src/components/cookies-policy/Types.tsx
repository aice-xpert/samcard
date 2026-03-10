"use client";
import { CheckCircle, Settings, BarChart, Globe } from "lucide-react";
import CookieCard from "./CookieCard";

export function TypesOfCookies() {
  const cookies = [
    {
      icon: CheckCircle,
      title: "1. Essential Cookies (Strictly Necessary)",
      description:
        "These cookies are essential for the website to function properly. They enable core functionality such as security, authentication, and accessibility.",
      purpose: [
        "User authentication and session management",
        "Security features and fraud prevention",
        "Load balancing and performance optimization",
        "Remembering your cookie consent preferences",
      ],
      extras: [
        { label: "Examples", value: "session_id, auth_token, csrf_token" },
        { label: "Expiration", value: "Session or up to 1 year" },
      ],
      canDisable: false,
    },
    {
      icon: Settings,
      title: "2. Functional Cookies (Preference)",
      description:
        "These cookies enable enhanced functionality and personalization, remembering your preferences to provide a more tailored experience.",
      purpose: [
        "Remembering your language and region preferences",
        "Storing your display settings (dark mode, font size)",
        "Remembering recently viewed cards or templates",
        "Customizing content based on your preferences",
      ],
      extras: [
        { label: "Examples", value: "language_preference, theme_mode, user_settings" },
        { label: "Expiration", value: "Up to 1 year" },
      ],
      canDisable: true,
    },
    {
      icon: BarChart,
      title: "3. Analytics Cookies (Performance)",
      description:
        "These cookies help us understand how visitors interact with our website by collecting information anonymously, helping us improve our services.",
      purpose: [
        "Analyzing website traffic and usage patterns",
        "Measuring the effectiveness of our features",
        "Understanding user behavior and interactions",
        "Identifying technical issues and errors",
        "A/B testing and feature experimentation",
      ],
      extras: [
        { label: "Third-party services", value: "Google Analytics, Mixpanel, Hotjar" },
        { label: "Examples", value: "_ga, _gid, analytics_session" },
        { label: "Expiration", value: "Up to 2 years" },
      ],
      canDisable: true,
    },
    {
      icon: Globe,
      title: "4. Marketing Cookies (Targeting/Advertising)",
      description:
        "These cookies deliver relevant advertisements and help us measure the effectiveness of advertising campaigns.",
      purpose: [
        "Displaying personalized advertisements",
        "Tracking ad campaign performance",
        "Retargeting visitors who didn't complete actions",
        "Building audience profiles for targeted marketing",
        "Limiting the number of times you see an ad",
      ],
      extras: [
        { label: "Third-party services", value: "Google Ads, Facebook Pixel, LinkedIn Insight Tag" },
        { label: "Examples", value: "_fbp, ads_preferences, conversion_tracking" },
        { label: "Expiration", value: "Up to 2 years" },
      ],
      canDisable: true,
    },
  ];

  return (
   <section className="pt-12 pb-24 bg-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        <div id="types-of-cookies" className="space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-white">
            Types of Cookies We Use
          </h2>

          <p className="text-gray-400 text-lg leading-relaxed max-w-3xl">
            We use different types of cookies to ensure our platform works
            properly, improves performance, and provides a personalized
            experience.
          </p>

          <div className="space-y-6 pt-4">
            {cookies.map((cookie, i) => (
              <CookieCard key={cookie.title} index={i} {...cookie} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
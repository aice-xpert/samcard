import { Eye } from "lucide-react";
import { bodyTextClass, sectionTitleClass, subsectionTitleClass } from "./typography";

const cookieCategories = [
  {
    title: "Authentication & Security",
    items: [
      "Verify your identity and keep you logged in",
      "Protect against fraudulent logins and security threats",
      "Secure your account and prevent unauthorized access",
    ],
  },
  {
    title: "Functionality & Features",
    items: [
      "Remember your preferences and settings",
      "Enable interactive features like the card builder",
      "Store your draft cards and recent changes",
      "Provide personalized content and recommendations",
    ],
  },
  {
    title: "Analytics & Improvement",
    items: [
      "Understand how users interact with our platform",
      "Identify popular features and content",
      "Detect and fix technical issues",
      "Test new features and improvements",
      "Measure conversion rates and user engagement",
    ],
  },
  {
    title: "Marketing & Advertising",
    items: [
      "Show you relevant ads on other websites",
      "Measure the effectiveness of our marketing campaigns",
      "Prevent you from seeing the same ad too many times",
      "Understand which channels drive traffic to our site",
    ],
  },
];

export default function CookieUsage() {
  return (
    <section className="w-full bg-black pt-20">
      <div className="max-w-4xl mx-auto px-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-theme-kelly-green/10 border border-theme-kelly-green/20">
            <Eye className="text-theme-kelly-green" />
          </div>
          <h2 className={sectionTitleClass}>
            How We Use Cookies
          </h2>
        </div>

        <p className={bodyTextClass}>
          We use cookies for the following specific purposes:
        </p>

        <div className={`space-y-6 ${bodyTextClass}`}>
          {cookieCategories.map((category) => (
            <div key={category.title}>
              <h3 className={`${subsectionTitleClass} mb-2`}>{category.title}</h3>
              <ul className="list-disc list-inside space-y-2">
                {category.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
"use client";

import { Settings } from "lucide-react";

const cookieSections = [
  {
    title: "1. Cookie Consent Banner",
    desc: `When you first visit our website, you'll see a cookie consent banner. You can choose to accept all cookies, reject non-essential cookies, or customize your preferences.`,
  },
  {
    title: "2. Cookie Preference Center",
    desc: `You can change your cookie preferences at any time by clicking the "Cookie Settings" link in our website footer or by visiting your account settings.`,
    button: {
      label: "Manage Cookie Preferences",
      className:
        "mt-3 px-6 py-2 bg-theme-kelly-green/80 text-black font-semibold rounded-lg hover:bg-theme-devil-green",
    },
  },
  {
    title: "3. Browser Settings",
    desc: `Most web browsers allow you to control cookies through their settings. Here's how to manage cookies in popular browsers:`,
    list: [
      "Google Chrome: Settings → Privacy and security → Cookies and other site data",
      "Mozilla Firefox: Settings → Privacy & Security → Cookies and Site Data",
      "Safari: Preferences → Privacy → Cookies and website data",
      "Microsoft Edge: Settings → Cookies and site permissions → Manage and delete cookies",
    ],
  },
  {
    title: "4. Opt-Out of Third-Party Cookies",
    desc: `You can opt out of targeted advertising from third-party advertisers:`,
    list: [
      "Google Ads",
      "Facebook",
      "Network Advertising Initiative",
      "Digital Advertising Alliance",
    ],
  },
  {
    title: "5. Do Not Track (DNT)",
    desc: `Some browsers have a "Do Not Track" feature that signals to websites that you don't want your online activity tracked. Currently, there is no universal standard for DNT signals, but we respect your browser's DNT settings where technically feasible.`,
  },
];

export default function CookieManagement() {
  return (
    <section className="w-full bg-black pt-20">
      <div className="max-w-4xl mx-auto px-6 space-y-10">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-theme-devil-green/10 border border-theme-devil-green/20">
            <Settings className="text-theme-devil-green" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            How to Manage and Control Cookies
          </h2>
        </div>

        <div className="space-y-6 text-gray-300">
          <p>
            You have the right to accept or reject cookies. Here are several
            ways you can manage cookies:
          </p>

          {cookieSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xl font-semibold text-white mb-2">
                {section.title}
              </h3>
              <p className="mb-2">{section.desc}</p>

              {section.list && (
                <ul className="list-disc list-inside space-y-2 ml-4">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}

              {section.button && (
                <button className={section.button.className}>
                  {section.button.label}
                </button>
              )}
            </div>
          ))}

          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-yellow-400">
              <strong>Note:</strong> Blocking or deleting cookies may impact the
              functionality of our website. Some features may not work properly,
              and you may need to re-enter your preferences each time you visit.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

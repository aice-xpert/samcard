"use client";

import { Activity } from "lucide-react";

const otherTrackingSections = [
  {
    title: "Web Beacons (Pixels)",
    desc: "Small graphic images embedded in web pages or emails to track page views, email opens, and user actions. We use pixels for analytics and marketing purposes.",
  },
  {
    title: "Local Storage",
    desc: "HTML5 local storage allows us to store data locally in your browser. We use local storage to remember your preferences, cache data for faster loading, and provide offline functionality.",
  },
  {
    title: "Session Storage",
    desc: "Similar to local storage but data is cleared when you close your browser tab. We use session storage for temporary data during your browsing session.",
  },
  {
    title: "SDKs and APIs",
    desc: "We may use third-party software development kits (SDKs) and application programming interfaces (APIs) that collect information about your device and usage for analytics and functionality purposes.",
  },
];

export default function OtherTracking() {
  return (
    <section className="w-full bg-black pt-20">
      <div className="max-w-4xl mx-auto px-6 space-y-10">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20">
            <Activity className="text-theme-kelly-green" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            Other Tracking Technologies
          </h2>
        </div>

        <div className="space-y-6 text-gray-300">
          <p>In addition to cookies, we may use other tracking technologies:</p>
          {otherTrackingSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xl font-semibold text-white mb-2">
                {section.title}
              </h3>
              <p>{section.desc}</p>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Mobile Applications</h2>
          <div className="space-y-4 text-gray-300">
            <p>
              If you use our mobile applications, we may use mobile identifiers
              (such as device ID, advertising ID) and similar technologies for
              tracking and analytics purposes. You can control these through
              your device settings:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>iOS:</strong> Settings → Privacy → Advertising → Limit
                Ad Tracking
              </li>
              <li>
                <strong>Android:</strong> Settings → Google → Ads → Opt out of
                Ads Personalization
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">
            Updates to This Cookie Policy
          </h2>
          <div className="space-y-4 text-gray-300">
            <p>
              We may update this Cookie Policy from time to time to reflect
              changes in our practices, technologies, legal requirements, or for
              other operational reasons.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                Updating the "Last Updated" date at the top of this policy
              </li>
              <li>Displaying a prominent notice on our website</li>
              <li>Sending you an email notification (for major changes)</li>
            </ul>
            <p className="mt-4">
              We encourage you to review this Cookie Policy periodically to stay
              informed about how we use cookies.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

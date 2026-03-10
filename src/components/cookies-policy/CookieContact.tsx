"use client";

import { Shield } from "lucide-react";

export function CookieContact() {
  return (
    <section className="w-full bg-black pt-20">
      <div className="max-w-4xl mx-auto px-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20">
            <Shield className="text-theme-kelly-green" />
          </div>

          <h2 className="text-xl font-bold text-white">
            Contact Us About Cookies
          </h2>
        </div>

        <div className="space-y-4">
          <p className="text-gray-300 text-sm">
            If you have questions or concerns about our use of cookies or this
            Cookie Policy, please contact us:
          </p>

          <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
            <p className="text-sm">
              <span className="text-white font-semibold">Email: </span>
              <a
                href="mailto:support@samcard.com"
                className="text-theme-kelly-green hover:underline"
              >
                support@samcard.com
              </a>
            </p>

            <p className="text-sm">
              <span className="text-white font-semibold">
                Data Protection Officer:{" "}
              </span>
              <a
                href="mailto:dpo@samcard.com"
                className="text-theme-kelly-green hover:underline"
              >
                dpo@samcard.com
              </a>
            </p>

            <div className="text-sm">
              <span className="text-white font-semibold block mb-1">
                Mailing Address:
              </span>
              <div className="text-gray-400 leading-relaxed">
                SamCard Inc. <br />
                123 Business Street, Suite 100 <br />
                San Francisco, CA 94105 <br />
                United States
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

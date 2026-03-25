"use client";

import { Shield } from "lucide-react";
import { bodyTextClass, sectionTitleClass, mutedBodyTextClass } from "./typography";

export function CookieContact() {
  return (
    <section className="w-full bg-black pt-20">
      <div className="max-w-4xl mx-auto px-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20">
            <Shield className="text-theme-kelly-green" />
          </div>

          <h2 className={sectionTitleClass}>
            Contact Us About Cookies
          </h2>
        </div>

        <div className="space-y-4">
          <p className={bodyTextClass}>
            If you have questions or concerns about our use of cookies or this
            Cookie Policy, please contact us:
          </p>

          <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2">
            <p className={bodyTextClass}>
              <span className="text-white font-semibold">Email: </span>
              <a
                href="mailto:support@samcard.com"
                className="text-theme-kelly-green hover:underline"
              >
                support@samcard.com
              </a>
            </p>

            <p className={bodyTextClass}>
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

            <div className={bodyTextClass}>
              <span className="text-white font-semibold block mb-1">
                Mailing Address:
              </span>
              <div className={mutedBodyTextClass}>
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

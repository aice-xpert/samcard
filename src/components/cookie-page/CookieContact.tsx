import { Shield } from "lucide-react";

export default function CookieContact() {
  return (
    <div className="pt-20 max-w-4xl mx-auto px-6 space-y-6">

      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-theme-devil-green/10 flex items-center justify-center">
          <Shield className="text-theme-devil-green" />
        </div>

        <h2 className="text-2xl font-bold text-white">
          Contact Us About Cookies
        </h2>
      </div>

      <div className="space-y-6">

        <p className="text-gray-300">
          If you have questions or concerns about our use of cookies or this
          Cookie Policy, please contact us:
        </p>

        <div className="p-6 bg-white/5 border border-white/10 rounded-xl space-y-4">

          <p>
            <span className="text-white font-semibold">Email: </span>
            <a
              href="mailto:support@samcard.com"
              className="text-theme-kelly-green hover:underline"
            >
              support@samcard.com
            </a>
          </p>

          <p>
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

          <div>
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
  );
}
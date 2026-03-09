import { Scale, AlertCircle } from "lucide-react";

export default function TermsHero() {
  return (
    <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-theme-devil-green to-black/80">
      <div className="max-w-5xl mx-auto">

        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-theme-devil-green to-theme-kelly-green rounded-2xl flex items-center justify-center">
            <Scale className="text-white" size={40} />
          </div>

          <h1 className="text-white text-4xl md:text-6xl font-bold">
            Terms of Service Agreement
          </h1>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <p className="text-gray-400 text-lg">Effective Date: March 9, 2026</p>
          <p className="text-gray-400 text-lg">Version 1.0</p>
        </div>

        <div className="p-6 bg-gradient-to-b from-theme-devil-green/20 via-theme-digital-green/10 to-theme-devil-green/15 border border-theme-kelly-green rounded-xl">
          <div className="flex gap-4">
            <AlertCircle className="text-theme-kelly-green flex-shrink-0 mt-1" size={28} />

            <div className="space-y-2">
              <p className="text-white font-semibold text-lg">
                Important Legal Agreement
              </p>

              <p className="text-gray-300 leading-relaxed">
                This Terms of Service Agreement is a legally binding contract
                between you and SamCard Inc.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
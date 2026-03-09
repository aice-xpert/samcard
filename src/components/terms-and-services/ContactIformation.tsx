import { FileText } from "lucide-react";

export default function ContactInformation() {
  return (
    <div className="mt-16">
      <div className="p-10 bg-gradient-to-b from-theme-devil-green/20 via-theme-digital-green/10 to-theme-devil-green/15 border border-theme-kelly-green/50 rounded-2xl">
        <div className="flex items-start gap-6 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-theme-strong-green to-theme-kelly-green rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
            <FileText className="text-white" size={32} />
          </div>
          <div className="flex-1">
            <h2 className="text-white text-3xl font-bold mb-3">
              Contact Information
            </h2>
            <p className="text-gray-300 leading-relaxed">
              For questions regarding these Terms of Service or any legal matters, please contact our legal department:
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4 text-gray-400">
            <div>
              <p className="text-theme-kelly-green font-semibold mb-2">Legal Department</p>
              <p className="text-gray-400">SamCard Inc.</p>
              <p className="text-gray-400">123 Innovation Drive, Suite 500</p>
              <p className="text-gray-400">San Francisco, CA 94105</p>
              <p className="text-gray-400">United States</p>
            </div>
          </div>
          <div className="space-y-4 text-gray-400">
            <div>
              <p className="text-theme-kelly-green font-semibold mb-2">Contact Methods</p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-theme-strong-green rounded-full"></span>
                Legal Inquiries:
                <a href="mailto:legal@samcard.com" className="text-theme-kelly-green hover:text-theme-strong-green hover:underline transition-colors">
                  legal@digicard.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-theme-strong-green rounded-full"></span>
                General Support:
                <a href="mailto:support@samcard.com" className="text-theme-kelly-green hover:text-theme-strong-green hover:underline transition-colors">
                  support@digicard.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-theme-strong-green rounded-full"></span>
                DMCA Notices:
                <a href="mailto:dmca@samcard.com" className="text-theme-kelly-green hover:text-theme-strong-green hover:underline transition-colors">
                  dmca@digicard.com
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-theme-digital-green/30">
          <p className="text-gray-500 text-sm leading-relaxed">
            By using DigiCard, you acknowledge that you have read this Terms of Service Agreement, understand it, and agree to be bound by its terms and conditions.
          </p>
        </div>
      </div>
    </div>
  );
}
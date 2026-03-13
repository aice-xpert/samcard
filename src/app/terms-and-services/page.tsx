"use client";
import { ToSHero } from "@/components/terms-of-service/TOSHero";
import ToSContent from '@/components/terms-of-service/TOSContent';

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <ToSHero />
      <div className="grid grid-cols-[30%_1fr] gap-0">
        <aside className="sticky top-18 h-screen bg-black border-r border-theme-kellygreen p-6 overflow-y-auto">
          <nav className="space-y-1">
            <h3 className="text-sm font-semibold text-theme-kelly-green uppercase tracking-wider mb-6">
              Quick Links
            </h3>
            <SidebarLink href="definitions" label="Definitions" />
            <SidebarLink href="use-license" label="License & Use" />
            <SidebarLink href="user-accounts" label="Your Account" />
            <SidebarLink href="intellectual-property" label="IP Rights" />
            <SidebarLink href="content-conduct" label="Content & Conduct" />
            <SidebarLink href="fees-payment" label="Fees & Payment" />
            <SidebarLink href="liability" label="Liability" />
            <SidebarLink href="termination" label="Termination" />
            <SidebarLink href="disputes" label="Dispute Resolution" />
            <SidebarLink href="contact" label="Contact" />
          </nav>

          <div 
            className="mt-8 p-4 rounded-lg text-xs text-gray-400 bg-theme-devil-green/20 border border-theme-kelly-green"
          >
            <p className="font-semibold text-white mb-2">Last Updated</p>
            <p>March 9, 2026</p>
          </div>
        </aside>

        <section className="overflow-y-auto">
          <ToSContent />
        </section>
      </div>
    </main>
  );
}

function SidebarLink({ href, label }: { href: string; label: string }) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <button
      onClick={() => scrollToSection(href)}
      className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-theme-kelly-green hover:bg-theme-kelly-green/10 transition-all duration-200"
    >
      {label}
    </button>
  );
}
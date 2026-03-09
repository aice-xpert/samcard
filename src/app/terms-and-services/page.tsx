import ContactInformation from "@/components/terms-and-services/ContactIformation";
import TermsHero from "@/components/terms-and-services/Hero";
import TableOfContents from "@/components/terms-and-services/TableofContents";
import TermsSection from "@/components/terms-and-services/TermsSection";

import { sections } from "@/constant"; 

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-black">
      <TermsHero />

      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-16">

          <TableOfContents />

          {sections.map((section) => ( 
            <TermsSection key={section.id} section={section} />
          ))}

          <ContactInformation />

        </div>
      </section>
    </div>
  );
}
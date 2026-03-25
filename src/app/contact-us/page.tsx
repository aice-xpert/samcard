import { ContactHero } from "@/components/contact-us/Hero";
import { ContactMethods } from "@/components/contact-us/Methods";
import { ContactForm } from "@/components/contact-us/Form";
import { ContactSidebar } from "@/components/contact-us/SideBar";
import { ContactMap } from "@/components/contact-us/Map";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <ContactHero />

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <ContactMethods />

          <div className="grid lg:grid-cols-2 gap-12 auto-rows">
            <ContactForm />
            <ContactSidebar />
          </div>
        </div>
      </section>

      <ContactMap />
    </div>
  );
}
"use client";
import { Clock, Mail, Linkedin, Twitter, Instagram, Facebook } from "lucide-react";

function OfficeHours() {
  const hours = [
    { day: "Monday - Friday", time: "8:00 AM - 6:00 PM PST", border: true },
    { day: "Saturday", time: "10:00 AM - 4:00 PM PST", border: true },
    { day: "Sunday", time: "Closed", border: false },
  ];

  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-theme-kelly-green/30 transition-colors">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-theme-kelly-green/10 flex items-center justify-center flex-shrink-0 ring-1 ring-theme-kelly-green/20">
          <Clock className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-1 text-white">Office Hours</h3>
          <p className="text-gray-400 text-sm">Our team is available during the following hours</p>
        </div>
      </div>
      <div className="space-y-3 text-sm">
        {hours.map(({ day, time, border }) => (
          <div
            key={day}
            className={`flex justify-between py-2 ${border ? "border-b border-white/5" : ""}`}
          >
            <span className="text-gray-400">{day}</span>
            <span className="text-white">{time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SocialMedia() {
  const socials = [
    { icon: Linkedin, label: "LinkedIn" },
    { icon: Twitter, label: "Twitter" },
    { icon: Instagram, label: "Instagram" },
    { icon: Facebook, label: "Facebook" },
  ];

  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-theme-kelly-green/30 transition-colors">
      <h3 className="text-xl font-semibold mb-2 text-white">Connect With Us</h3>
      <p className="text-gray-400 text-sm mb-6">
        Follow us on social media for updates, tips, and news
      </p>
      <div className="flex gap-4">
        {socials.map(({ icon: Icon, label }) => (
          <a
            key={label}
            href="#"
            aria-label={label}
            className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-theme-kelly-green/20 hover:border-theme-kelly-green/50 hover:shadow-lg hover:shadow-theme-digital-green/20 transition-all"
          >
            <Icon size={20} className="text-gray-300 hover:text-accent transition-colors" />
          </a>
        ))}
      </div>
    </div>
  );
}

function EnterpriseContact() {
  return (
    <div className="p-6 bg-gradient-to-br from-theme-devil-green/30 to-theme-strong-green/10 border border-theme-kelly-green/30 rounded-xl">
      <h3 className="text-xl font-semibold mb-2 text-white">Enterprise Solutions</h3>
      <p className="text-gray-300 text-sm mb-4">
        Looking for custom solutions for your organization? Our enterprise team is ready to help.
      </p>
      <a
        href="mailto:enterprise@samcard.com"
        className="inline-flex items-center gap-2 text-accent hover:underline"
      >
        <Mail size={16} />
        enterprise@samcard.com
      </a>
    </div>
  );
}

export function ContactSidebar() {
  return (
    <div className="space-y-8">
      <OfficeHours />
      <SocialMedia />
      <EnterpriseContact />
    </div>
  );
}
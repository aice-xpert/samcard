"use client";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Headphones } from "lucide-react";

const methods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Our team will respond within 24 hours",
    action: <a href="mailto:hello@samcard.com" className="text-accent hover:underline">hello@samcard.com</a>,
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Mon-Fri from 8am to 6pm PST",
    action: <a href="tel:+1234567890" className="text-accent hover:underline">+1 (234) 567-890</a>,
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: null,
    action: (
      <p className="text-gray-400 text-sm">
        123 Business Street, Suite 100<br />
        San Francisco, CA 94105<br />
        United States
      </p>
    ),
  },
 
];

export function ContactMethods() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
      {methods.map(({ icon: Icon, title, description, action }, i) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-theme-kelly-green/50 hover:shadow-lg hover:shadow-theme-digital-green/10 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-theme-kelly-green/10 flex items-center justify-center mb-4 group-hover:bg-theme-kelly-green/20 transition-colors ring-1 ring-theme-kelly-green/20">
            <Icon className="w-6 h-6 text-accent" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
          {description && <p className="text-gray-400 text-sm mb-3">{description}</p>}
          {action}
        </motion.div>
      ))}
    </div>
  );
}
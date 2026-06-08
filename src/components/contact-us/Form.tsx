"use client";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface FormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  subject: string;
  message: string;
}

const INITIAL_FORM_DATA: FormData = {
  name: "",
  email: "",
  company: "",
  phone: "",
  subject: "general",
  message: "",
};

export function ContactForm() {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  // Preselect the subject when arriving via a "Contact Sales/Support" link (?topic=sales|support).
  useEffect(() => {
    const topic = new URLSearchParams(window.location.search).get("topic");
    if (topic === "sales" || topic === "support") {
      setFormData((prev) => ({ ...prev, subject: topic }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData(INITIAL_FORM_DATA);
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }, 1500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputClass = `w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:border-theme-kelly-green focus:ring-1 focus:ring-theme-kelly-green/30 ${
    isDark
      ? "bg-white/5 border-white/10 text-white placeholder-gray-600"
      : "bg-input-background border-input text-foreground placeholder-muted-foreground"
  }`;

  return (
    <div className="space-y-8 h-full p-6 rounded-xl shadow">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-4">Send Us a Message</h2>
        <p className="text-muted-foreground">
          Fill out the form below and our team will get back to you within 24 hours.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className={`block text-sm font-medium mb-2 ${
            isDark ? "text-gray-300" : "text-foreground"
          }`}>
            Full Name *
          </label>
          <input
            type="text" id="name" name="name" required
            value={formData.name} onChange={handleChange}
            className={inputClass} placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
            isDark ? "text-gray-300" : "text-foreground"
          }`}>
            Email Address *
          </label>
          <input
            type="email" id="email" name="email" required
            value={formData.email} onChange={handleChange}
            className={inputClass} placeholder="john@company.com"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="company" className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-foreground"
            }`}>
              Company Name
            </label>
            <input
              type="text" id="company" name="company"
              value={formData.company} onChange={handleChange}
              className={inputClass} placeholder="Your Company"
            />
          </div>
          <div>
            <label htmlFor="phone" className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-foreground"
            }`}>
              Phone Number
            </label>
            <input
              type="tel" id="phone" name="phone"
              value={formData.phone} onChange={handleChange}
              className={inputClass} placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className={`block text-sm font-medium mb-2 ${
            isDark ? "text-gray-300" : "text-foreground"
          }`}>
            Subject *
          </label>
          <select
            id="subject" name="subject" required
            value={formData.subject} onChange={handleChange}
            className={inputClass}
          >
            <option value="general" className={isDark ? "bg-black" : "bg-white"}>General Inquiry</option>
            <option value="sales" className={isDark ? "bg-black" : "bg-white"}>Sales &amp; Pricing</option>
            <option value="support" className={isDark ? "bg-black" : "bg-white"}>Technical Support</option>
            <option value="partnership" className={isDark ? "bg-black" : "bg-white"}>Partnership Opportunities</option>
            <option value="feedback" className={isDark ? "bg-black" : "bg-white"}>Feedback &amp; Suggestions</option>
            <option value="press" className={isDark ? "bg-black" : "bg-white"}>Press &amp; Media</option>
            <option value="other" className={isDark ? "bg-black" : "bg-white"}>Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className={`block text-sm font-medium mb-2 ${
            isDark ? "text-gray-300" : "text-foreground"
          }`}>
            Message *
          </label>
          <textarea
            id="message" name="message" required
            value={formData.message} onChange={handleChange}
            rows={6} className={`${inputClass} resize-none`}
            placeholder="Tell us how we can help you..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-8 py-4 bg-gradient-to-r from-primary to-theme-strong-green text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-theme-digital-green/30 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Send Message
            </>
          )}
        </button>

        {submitStatus === "success" && (
          <div className="p-4 bg-theme-kelly-green/10 border border-theme-kelly-green/30 rounded-lg text-accent">
            ✓ Thank you! Your message has been sent successfully. We&apos;ll get back to you soon.
          </div>
        )}
      </form>
    </div>
  );
}
"use client";
import { Send } from "lucide-react";
import { useState } from "react";

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
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

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

  const inputClass =
    "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-theme-kelly-green focus:ring-1 focus:ring-theme-kelly-green/30 transition-colors";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white mb-4">Send Us a Message</h2>
        <p className="text-gray-400">
          Fill out the form below and our team will get back to you within 24 hours.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
            Full Name *
          </label>
          <input
            type="text" id="name" name="name" required
            value={formData.name} onChange={handleChange}
            className={inputClass} placeholder="John Doe"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email Address *
          </label>
          <input
            type="email" id="email" name="email" required
            value={formData.email} onChange={handleChange}
            className={inputClass} placeholder="john@company.com"
          />
        </div>

        {/* Company & Phone */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
              Company Name
            </label>
            <input
              type="text" id="company" name="company"
              value={formData.company} onChange={handleChange}
              className={inputClass} placeholder="Your Company"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel" id="phone" name="phone"
              value={formData.phone} onChange={handleChange}
              className={inputClass} placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
            Subject *
          </label>
          <select
            id="subject" name="subject" required
            value={formData.subject} onChange={handleChange}
            className={inputClass}
          >
            <option value="general" className="bg-black">General Inquiry</option>
            <option value="sales" className="bg-black">Sales &amp; Pricing</option>
            <option value="support" className="bg-black">Technical Support</option>
            <option value="partnership" className="bg-black">Partnership Opportunities</option>
            <option value="feedback" className="bg-black">Feedback &amp; Suggestions</option>
            <option value="press" className="bg-black">Press &amp; Media</option>
            <option value="other" className="bg-black">Other</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
            Message *
          </label>
          <textarea
            id="message" name="message" required
            value={formData.message} onChange={handleChange}
            rows={6} className={`${inputClass} resize-none`}
            placeholder="Tell us how we can help you..."
          />
        </div>

        {/* Submit */}
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

        {/* Success */}
        {submitStatus === "success" && (
          <div className="p-4 bg-theme-kelly-green/10 border border-theme-kelly-green/30 rounded-lg text-accent">
            ✓ Thank you! Your message has been sent successfully. We&apos;ll get back to you soon.
          </div>
        )}
      </form>
    </div>
  );
}
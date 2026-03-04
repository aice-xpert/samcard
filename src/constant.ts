import { LucideIcon } from "lucide-react";
import {
  CreditCard,
  Package,
  FileText,
  FileCheck,
  Heart,
  Images,
  AlertCircle,
  Globe,
  Ticket,
  Calendar,
  Tag,
  Briefcase,
  MessageSquare,
  Share2,
  FormInput,
  Facebook,
  MapPin,
  User,
  Smartphone,
  ImageIcon,
  Link,
  DollarSign,
  UtensilsCrossed,
  Star,
  CalendarDays,
  Video,
  Link2,
} from "lucide-react";
export interface Solution {
  icon: LucideIcon;
  title: string;
  description: string;
}
export interface SolutionCategory {
  category: string;
  solutions: Solution[];
}

export const SOLUTION_CATEGORIES: SolutionCategory[] = [
  {
    category: "Business Solutions",
    solutions: [
      {
        icon: CreditCard,
        title: "Digital Business Cards",
        description:
          "Share contact info instantly with smart, interactive digital business cards.",
      },
      {
        icon: User,
        title: "vCard QR Code",
        description:
          "Create vCard QR codes that add contacts directly to address books.",
      },
      {
        icon: Briefcase,
        title: "Business Page QR Code",
        description:
          "Build custom landing pages for your business with comprehensive details.",
      },
      {
        icon: Tag,
        title: "Coupon QR Code",
        description:
          "Drive sales with trackable digital coupons and promotional offers.",
      },
      {
        icon: Share2,
        title: "Social Media QR Code",
        description:
          "Connect all your social profiles in one scannable code.",
      },
      {
        icon: Facebook,
        title: "Facebook QR Code",
        description:
          "Direct users to your Facebook page with a single scan.",
      },
      {
        icon: Star,
        title: "Google Review QR Code",
        description:
          "Collect reviews effortlessly by linking directly to your Google review page.",
      },
      {
        icon: Link2,
        title: "Dynamic URL QR Code",
        description:
          "Update destination URLs anytime without reprinting your QR code.",
      },
      {
        icon: Globe,
        title: "Multi-URL QR Code",
        description:
          "Route users to different URLs based on time, location, or device.",
      },
      {
        icon: DollarSign,
        title: "Payments QR Code",
        description:
          "Accept payments seamlessly with QR codes for PayPal, Venmo, and more.",
      },
    ],
  },

  {
    category: "Customer Engagement",
    solutions: [
      {
        icon: Ticket,
        title: "Event Ticket QR Code",
        description:
          "Streamline event check-ins with scannable digital tickets.",
      },
      {
        icon: Calendar,
        title: "Event Landing Page",
        description:
          "Create beautiful event pages with RSVP and registration forms.",
      },
      {
        icon: CalendarDays,
        title: "Google Calendar QR Code",
        description:
          "Add events to calendars instantly with pre-filled event details.",
      },
      {
        icon: Video,
        title: "Meeting QR Code",
        description:
          "Share Zoom, Teams, or Meet links for instant virtual meeting access.",
      },
      {
        icon: FileText,
        title: "Form QR Code",
        description:
          "Collect data seamlessly with custom forms linked to QR codes.",
      },
      {
        icon: MessageSquare,
        title: "Feedback QR Code",
        description:
          "Gather customer feedback and ratings to improve your services.",
      },
      {
        icon: FormInput,
        title: "Google Forms QR Code",
        description:
          "Link to Google Forms for surveys, registrations, and more.",
      },
      {
        icon: Smartphone,
        title: "App Download QR Code",
        description:
          "Drive app installs by directing to App Store or Google Play.",
      },
      {
        icon: MapPin,
        title: "Google Maps QR Code",
        description:
          "Share precise locations for easy navigation to your business or event.",
      },
    ],
  },

  {
    category: "Content & Media",
    solutions: [
      {
        icon: Package,
        title: "Product QR Code",
        description:
          "Enhance product packaging with detailed info, manuals, and support.",
      },
      {
        icon: FileCheck,
        title: "PDF to QR Code",
        description:
          "Share PDFs instantly—menus, catalogs, brochures, and more.",
      },
      {
        icon: Images,
        title: "PDF Gallery",
        description:
          "Create galleries of multiple PDFs for catalogs and portfolios.",
      },
      {
        icon: ImageIcon,
        title: "Image Gallery QR Code",
        description:
          "Showcase photo galleries for products, portfolios, or events.",
      },
      {
        icon: UtensilsCrossed,
        title: "Menu QR Code",
        description:
          "Contactless restaurant menus with real-time updates and pricing.",
      },
      {
        icon: Heart,
        title: "Pet ID Tag",
        description:
          "Keep pets safe with QR tags containing owner contact and medical info.",
      },
      {
        icon: AlertCircle,
        title: "Medical Alert QR Code",
        description:
          "Store critical medical information for emergencies and first responders.",
      },
      {
        icon: Link,
        title: "URL QR Code",
        description:
          "Convert any URL into a scannable QR code for easy sharing.",
      },
    ],
  },
];
export interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  text: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sarah Johnson",
    role: "Marketing Director",
    company: "TechCorp Inc.",
    avatar:
      "https://images.unsplash.com/photo-1610387694365-19fafcc86d86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    rating: 5,
    text: "DigiCard has completely transformed how we network at conferences. The analytics feature helps us track engagement and follow up with the right people at the right time.",
  },
  {
    name: "Michael Chen",
    role: "Entrepreneur",
    company: "StartupHub",
    avatar:
      "https://images.unsplash.com/photo-1561731885-e0591a34659c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    rating: 5,
    text: "As a startup founder, first impressions matter. DigiCard helps me look professional and tech-savvy. Plus, I never run out of cards anymore!",
  },
  {
    name: "Emily Rodriguez",
    role: "Sales Manager",
    company: "GlobalSales Co.",
    avatar:
      "https://images.unsplash.com/photo-1615843423179-bea071facf96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    rating: 5,
    text: "The custom QR codes are a game-changer. Our entire sales team uses DigiCard now, and we've seen a 40% increase in follow-up conversions.",
  },
  {
    name: "David Park",
    role: "Creative Director",
    company: "Design Studio",
    avatar:
      "https://images.unsplash.com/photo-1561731885-e0591a34659c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    rating: 5,
    text: "The templates are beautiful and highly customizable. I was able to create a card that perfectly matches my brand in minutes.",
  },
  {
    name: "Lisa Thompson",
    role: "Real Estate Agent",
    company: "Premium Properties",
    avatar:
      "https://images.unsplash.com/photo-1610387694365-19fafcc86d86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    rating: 5,
    text: "Being able to update my contact info in real-time is invaluable. When I changed offices, all my cards were instantly updated!",
  },
  {
    name: "James Wilson",
    role: "CEO",
    company: "Innovation Labs",
    avatar:
      "https://images.unsplash.com/photo-1561731885-e0591a34659c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    rating: 5,
    text: "DigiCard has helped our company save money on printing costs while being more environmentally friendly. It's a win-win!",
  },
];

export const TESTIMONIAL_STATS: Stat[] = [
  { value: "4.9/5", label: "Average Rating" },
  { value: "50K+", label: "Happy Users" },
  { value: "1M+", label: "Cards Created" },
  { value: "150+", label: "Countries" },
];

export const CTA_TRUST_BADGES = [
  "No credit card required",
  "14-day free trial",
  "Cancel anytime",
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "What is a digital business card?",
    answer:
      "A digital business card is an electronic version of a traditional business card that you can share instantly via a link, QR code, or NFC tap. It lives online and can be updated anytime without reprinting.",
  },
  {
    question: "Do recipients need to download an app to view my card?",
    answer:
      "No. Recipients can view your digital business card directly in any modern web browser — no app download required. It works on iOS, Android, and desktop seamlessly.",
  },
  {
    question: "Can I customize my digital business card?",
    answer:
      "Absolutely. You can customize your card with your brand colors, logo, profile photo, social links, contact details, and more. Changes go live instantly across all your shared links.",
  },
  {
    question: "How do the analytics work?",
    answer:
      "Our analytics dashboard shows you who viewed your card, when they viewed it, which links they clicked, and how they found you. This helps you follow up with leads more effectively and measure your networking ROI.",
  },
  {
    question: "Can I have multiple digital business cards?",
    answer:
      "Yes. You can create multiple cards for different roles, brands, or contexts — for example, one for consulting and one for your full-time job — all managed from a single account.",
  },
  {
    question: "What happens if I change my contact information?",
    answer:
      "Any updates you make are reflected instantly on your live card. Anyone who has your link will always see your latest information without you needing to reshare it.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. All data is encrypted in transit and at rest. We never sell your personal information to third parties, and you have full control over what information is visible on your card.",
  },
  {
    question: "Can I integrate DigiCard with my CRM?",
    answer:
      "Yes. DigiCard integrates with popular CRMs like HubSpot, Salesforce, and Pipedrive. Leads captured through your card can be synced automatically to your CRM of choice.",
  },
];

export interface FeaturedTestimonial extends Testimonial {
  industry: string;
  category: string;
  isFeatured?: boolean;
}

export const EXTENDED_TESTIMONIALS: FeaturedTestimonial[] = [
  {
    ...TESTIMONIALS[0],
    industry: "SaaS",
    category: "Marketing",
    isFeatured: true,
  },
  {
    ...TESTIMONIALS[1],
    industry: "Startup",
    category: "Entrepreneurship",
  },
  {
    ...TESTIMONIALS[2],
    industry: "Enterprise Sales",
    category: "Sales",
  },
  {
    ...TESTIMONIALS[3],
    industry: "Creative Agency",
    category: "Design",
  },
  {
    ...TESTIMONIALS[4],
    industry: "Real Estate",
    category: "Property",
  },
  {
    ...TESTIMONIALS[5],
    industry: "Technology",
    category: "Executive",
  },
];

/* =========================================================
   Case Studies Data
   ========================================================= */

export interface CaseStudy {
  company: string;
  logo: string;
  metric: string;
  metricLabel: string;
  description: string;
  color: string; // tailwind gradient classes
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    company: "TechCorp",
    logo: "TC",
    metric: "+85%",
    metricLabel: "Engagement Growth",
    description:
      "TechCorp improved networking efficiency and boosted engagement dramatically using DigiCard’s dynamic QR system.",
    color: "from-[#4FD1C5] to-teal-500",
  },
  {
    company: "StartupHub",
    logo: "SH",
    metric: "+60%",
    metricLabel: "Lead Conversion",
    description:
      "StartupHub increased lead-to-client conversions by implementing smart digital business cards at events.",
    color: "from-blue-500 to-purple-500",
  },
  {
    company: "GlobalSales Co.",
    logo: "GS",
    metric: "+40%",
    metricLabel: "Follow-ups Closed",
    description:
      "GlobalSales streamlined its sales pipeline and improved follow-up rates with analytics-powered QR tracking.",
    color: "from-pink-500 to-orange-500",
  },
];
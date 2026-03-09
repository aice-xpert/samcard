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
    text: "SamCard has completely transformed how we network at conferences. The analytics feature helps us track engagement and follow up with the right people at the right time.",
  },
  {
    name: "Michael Chen",
    role: "Entrepreneur",
    company: "StartupHub",
    avatar:
      "https://images.unsplash.com/photo-1561731885-e0591a34659c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    rating: 5,
    text: "As a startup founder, first impressions matter. SamCard helps me look professional and tech-savvy. Plus, I never run out of cards anymore!",
  },
  {
    name: "Emily Rodriguez",
    role: "Sales Manager",
    company: "GlobalSales Co.",
    avatar:
      "https://images.unsplash.com/photo-1615843423179-bea071facf96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    rating: 5,
    text: "The custom QR codes are a game-changer. Our entire sales team uses SamCard now, and we've seen a 40% increase in follow-up conversions.",
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
    text: "SamCard has helped our company save money on printing costs while being more environmentally friendly. It's a win-win!",
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
    question: "Can I integrate SamCard with my CRM?",
    answer:
      "Yes. SamCard integrates with popular CRMs like HubSpot, Salesforce, and Pipedrive. Leads captured through your card can be synced automatically to your CRM of choice.",
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
      "TechCorp improved networking efficiency and boosted engagement dramatically using SamCard’s dynamic QR system.",
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

import {
  QrCode,
  BarChart3,
  Layout,
  Shield,
  Users,
  Download,
  TrendingUp,
  Lock,
  Palette,
  Clock,
} from "lucide-react";

export const mainFeatures = [
  {
    icon: QrCode,
    title: "Custom QR Codes",
    description:
      "Generate beautiful, branded QR codes that link directly to your digital business card.",
    highlights: [
      "Unlimited QR code generation",
      "Custom colors and branding",
      "High-resolution downloads",
      "Analytics tracking",
    ],
  },
  {
    icon: Share2,
    title: "Contactless Sharing",
    description:
      "Share your card instantly via NFC, QR code, text, or email.",
    highlights: [
      "NFC tap-to-share support",
      "Direct link sharing",
      "Email signatures",
      "Social media integration",
    ],
  },
  {
    icon: Layout,
    title: "Professional Templates",
    description:
      "Choose from dozens of stunning templates designed by professionals.",
    highlights: [
      "50+ premium templates",
      "Drag-and-drop builder",
      "Mobile-responsive designs",
      "Custom CSS support",
    ],
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Track who views your card and gain insights.",
    highlights: [
      "Real-time view tracking",
      "Geographic insights",
      "Engagement metrics",
      "Export reports",
    ],
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-level encryption and security measures.",
    highlights: [
      "256-bit SSL encryption",
      "GDPR compliant",
      "Two-factor authentication",
      "Security audits",
    ],
  },
  {
    icon: Users,
    title: "Team Management",
    description:
      "Manage multiple team members and permissions.",
    highlights: [
      "Unlimited team members",
      "Role-based access",
      "Centralized billing",
      "Brand templates",
    ],
  },
];

export const additionalFeatures = [
  { icon: Globe, title: "Multi-Language Support", description: "Create cards in multiple languages." },
  { icon: Smartphone, title: "Mobile App", description: "Native iOS and Android apps." },
  { icon: FileText, title: "vCard Export", description: "Export contacts as vCard files." },
  { icon: Download, title: "Offline Access", description: "Access cards without internet." },
  { icon: TrendingUp, title: "Lead Generation", description: "Capture leads with forms." },
  { icon: Lock, title: "Privacy Controls", description: "Control who sees your info." },
  { icon: Palette, title: "Brand Customization", description: "Match brand colors and fonts." },
  { icon: Link2, title: "Link in Bio", description: "Custom landing page." },
  { icon: Clock, title: "Auto-Updates", description: "Update once, reflect everywhere." },
];

// constants.ts
export interface Article {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
}

export const categories = [
  "All",
  "Networking",
  "Strategy",
  "Tips & Tricks",
  "Case Studies",
  "Industry News",
];

export const tags = ["Networking", "Branding", "Technology", "Career"];

export const articles: Article[] = [
  {
    id: 1,
    title: "Mastering First Impressions in Digital Networking",
    excerpt: "Understand the psychology behind impactful digital cards.",
    category: "Networking",
    author: "John Chen",
    date: "Mar 3, 2026",
    readTime: "5 min",
  },
  {
    id: 2,
    title: "10 Networking Mistakes Professionals Make",
    excerpt: "Avoid the most common networking mistakes.",
    category: "Networking",
    author: "Emma Davis",
    date: "Feb 28, 2026",
    readTime: "7 min",
  },
  {
    id: 3,
    title: "Building a Powerful Professional Network",
    excerpt: "Strategies used by top entrepreneurs.",
    category: "Networking",
    author: "Ali Hassan",
    date: "Feb 21, 2026",
    readTime: "6 min",
  },
  {
    id: 10,
    title: "Networking Etiquette for Remote Professionals",
    excerpt: "Tips to maintain professionalism online.",
    category: "Networking",
    author: "Nina Roberts",
    date: "Mar 5, 2026",
    readTime: "5 min",
  },
  {
    id: 11,
    title: "How to Leverage LinkedIn Groups Effectively",
    excerpt: "Grow your network with active group participation.",
    category: "Networking",
    author: "Raj Patel",
    date: "Mar 2, 2026",
    readTime: "6 min",
  },
  {
    id: 12,
    title: "Networking for Introverts: Practical Tips",
    excerpt: "Make meaningful connections without being outgoing.",
    category: "Networking",
    author: "Sophia Turner",
    date: "Feb 26, 2026",
    readTime: "5 min",
  },

  {
    id: 4,
    title: "NFC vs QR: Which Technology Should You Use?",
    excerpt: "Compare pros and cons of NFC vs QR.",
    category: "Strategy",
    author: "Michael Park",
    date: "Feb 25, 2026",
    readTime: "6 min",
  },
  {
    id: 5,
    title: "Growth Strategies Using Digital Cards",
    excerpt: "How startups use digital networking.",
    category: "Strategy",
    author: "Samantha Lee",
    date: "Feb 22, 2026",
    readTime: "8 min",
  },
  {
    id: 6,
    title: "Scaling Your Professional Reach",
    excerpt: "How to grow influence with smart networking.",
    category: "Strategy",
    author: "Chris Walker",
    date: "Feb 15, 2026",
    readTime: "7 min",
  },
  {
    id: 13,
    title: "Strategic Partnerships for Career Growth",
    excerpt: "Form alliances that amplify your professional impact.",
    category: "Strategy",
    author: "Olivia Martinez",
    date: "Mar 4, 2026",
    readTime: "6 min",
  },
  {
    id: 14,
    title: "Using Analytics to Improve Networking Strategy",
    excerpt: "Track and optimize your outreach efforts.",
    category: "Strategy",
    author: "Ethan Brown",
    date: "Mar 1, 2026",
    readTime: "7 min",
  },
  {
    id: 15,
    title: "Digital Card Campaigns That Deliver Results",
    excerpt: "Case studies on high-performing networking campaigns.",
    category: "Strategy",
    author: "Mia Johnson",
    date: "Feb 23, 2026",
    readTime: "8 min",
  },
  {
    id: 7,
    title: "Perfect LinkedIn Profile for Networking",
    excerpt: "Tips to optimize your professional presence.",
    category: "Tips & Tricks",
    author: "Lisa Wong",
    date: "Feb 20, 2026",
    readTime: "6 min",
  },
  {
    id: 8,
    title: "Top 5 Digital Networking Hacks",
    excerpt: "Small tricks that produce big results.",
    category: "Tips & Tricks",
    author: "David Kim",
    date: "Feb 18, 2026",
    readTime: "4 min",
  },
  {
    id: 9,
    title: "Smart Follow-Up Strategies",
    excerpt: "How to turn a connection into an opportunity.",
    category: "Tips & Tricks",
    author: "Sarah Mitchell",
    date: "Feb 14, 2026",
    readTime: "5 min",
  },
  {
    id: 16,
    title: "Time-Saving Networking Hacks for Busy Professionals",
    excerpt: "Maximize impact with minimal effort.",
    category: "Tips & Tricks",
    author: "Kevin Lee",
    date: "Mar 6, 2026",
    readTime: "4 min",
  },
  {
    id: 17,
    title: "Follow-Up Email Templates That Work",
    excerpt: "Ready-to-use email strategies for new connections.",
    category: "Tips & Tricks",
    author: "Emma Chen",
    date: "Mar 3, 2026",
    readTime: "5 min",
  },
  {
    id: 18,
    title: "Quick Profile Updates to Stand Out Online",
    excerpt: "Optimize your social presence in minutes.",
    category: "Tips & Tricks",
    author: "Liam Scott",
    date: "Feb 28, 2026",
    readTime: "4 min",
  },
];

export const featuredArticle = articles[0];
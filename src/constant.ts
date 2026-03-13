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
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
}

export const categories = [
  "All",
  "Artificial Intelligence",
  "Blockchain",
  "Quantum Computing",
  "Networking"
];

export const tags = ["AI", "Blockchain"];

export const articles: Article[] = [
  {
    id: 1,
    slug: "how-to-keep-up-in-the-ai-age",
    title: "How to keep up in the AI age",
    excerpt: "The world is changing faster than ever with AI—here's what you can do to stay ahead.",
    category: "Artificial Intelligence",
    author: "John Chen",
    date: "Mar 3, 2026",
    readTime: "5 min",
  },
  {
    id: 2,
    slug: "quantum-computing-transforming-technology",
    title: "Quantum Computing: Transforming technology as we know it",
    excerpt: "Explore how quantum computing is redefining the way we see technology",
    category: "Quantum Computing",
    author: "Nina Roberts",
    date: "June 5, 2026",
    readTime: "8 min",
  },
  {
    id: 3,
    slug: "avoid-these-7-blockchain-startup-mistakes",
    title: "Avoid These 7 BlockChain Startup Mistakes Now",
    excerpt: "5 years after my startup's bankruptcy, here is the lesson i learnt",
    category: "Blockchain",
    author: "Alex Wu",
    date: "Aug 5, 2026",
    readTime: "5 min",
  },
  {
    id: 4,
    slug: "will-ai-really-replace-human-workers",
    title: "Will AI really replace human workers in the future",
    excerpt: "Tech CEOs are sounding the alarm as they hype AI as the ultimate job stealer.",
    category: "Artificial Intelligence",
    author: "Sam Jonas",
    date: "Feb 28, 2026",
    readTime: "2 min",
  },
  {
    id: 5,
    slug: "10-ways-ai-will-reshape-jobs",
    title: "10 Ways AI Will Reshape Jobs and the Future",
    excerpt: "Remember when work felt human? AI is changing that and your next move matters.",
    category: "Artificial Intelligence",
    author: "Emma Davis",
    date: "Sep 28, 2026",
    readTime: "7 min",
  },
  {
    id: 6,
    slug: "how-agentic-ai-transforms-dev-workflow",
    title: "How Agentic AI Transforms Your Dev Workflow Now",
    excerpt: "A year ago i started using agentic AI and there's no turning back now.",
    category: "Artificial Intelligence",
    author: "Ali Hassan",
    date: "Jan 21, 2026",
    readTime: "5 min",
  },
  {
    id: 7,
    slug: "how-to-build-profitable-apps-with-generative-ai",
    title: "How to Build Profitable Apps with Generative AI",
    excerpt: "I turned ideas into $100K last year here's how generative AI made it possible.",
    category: "Artificial Intelligence",
    author: "Hassan Ahmed",
    date: "Mar 5, 2026",
    readTime: "7 min",
  },
  {
    id: 8,
    slug: "launch-profitable-blockchain-product-90-days",
    title: "Launch A Profitable BlockChain Product In 90 Days",
    excerpt: "Yesterday, I made a promise to myself to make a profitable product in 3 months.",
    category: "Blockchain",
    author: "M.Ali",
    date: "Mar 15, 2026",
    readTime: "5 min",
  },
  {
    id: 9,
    slug: "why-blockchain-products-fail",
    title: "Why BlockChain Products Fail (and How to Win)",
    excerpt: "After watching many of my own products fail here's the hard truth I have uncovered.",
    category: "Blockchain",
    author: "Zulfiqar Ahmed",
    date: "July 2, 2026",
    readTime: "6 min",
  },
  {
    id: 10,
    slug: "secure-your-transactions-with-blockchain",
    title: "How To Secure Your Transactions With Blockchain",
    excerpt: "In 2025, blockchain hacks stole over $3.4 billion, security is no longer optional.",
    category: "Blockchain",
    author: "Sofia Renard",
    date: "May 23, 2026",
    readTime: "3 min",
  },
  {
    id: 11,
    slug: "can-quantum-computers-break-sha-256",
    title: "The Hidden Risk: Can Quantum Computers break SHA-256 Security?",
    excerpt: "SHA-256 keep our digital world safe but what would happen if quantum computers break it?",
    category: "Quantum Computing",
    author: "Sofia Renard",
    date: "Nov 11, 2026",
    readTime: "5 min",
  },
  {
    id: 12,
    slug: "accelerate-growth-with-quantum-computing",
    title: "Accelerate Growth with the Quantum computing",
    excerpt: "Quantum computing is revolutionizing the medical industry by accelerating drug discovery.",
    category: "Quantum Computing",
    author: "Asher Voss",
    date: "Nov 5, 2026",
    readTime: "7 min",
  },
  {
    id: 13,
    slug: "quantum-computing-roadmap-for-ceos",
    title: "Prepare Now: Quantum computing future Roadmap for CEOs",
    excerpt: "AI changed the game yesterday now quantum computing has came to rewrite tomorrow",
    category: "Quantum Computing",
    author: "Nina Voss",
    date: "Dec 5, 2026",
    readTime: "4 min",
  },
  {
    id: 14,
    slug: "10-networking-mistakes-professionals-make",
    title: "10 Networking Mistakes Professionals Make",
    excerpt: "I once asked a successful founder what truly got him where he is.",
    category: "Networking",
    author: "Maya Thornton",
    date: "Aug 25, 2026",
    readTime: "7 min",
  },
  {
    id: 15,
    slug: "networking-hacks-for-busy-executives",
    title: "Networking Hacks Every Busy Executive Needs Now",
    excerpt: "I once read that the best time to network is when you're busiest and it changed everything",
    category: "Networking",
    author: "Maya Roberts",
    date: "Mar 5, 2026",
    readTime: "5 min",
  },
  {
    id: 16,
    slug: "design-digital-business-cards-for-networking",
    title: "How to Design Digital Business Cards for Networking",
    excerpt: "After redesigning my digital business cards, I finally uncovered what was holding me back.",
    category: "Networking",
    author: "Damon Fairchild",
    date: "Aug 15, 2026",
    readTime: "3 min",
  },
  {
    id: 17,
    slug: "networking-101-leverage-nfc-technology",
    title: "Networking 101: How To Leverage NFC Technology In Networking",
    excerpt: "Looking to elevate your networking game? NFC cards can make it effortless.",
    category: "Networking",
    author: "Nina Damon",
    date: "Jan 15, 2026",
    readTime: "5 min",
  },
];

export const featuredArticle = articles[0];
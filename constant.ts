export interface FAQItem {
  question: string;
  answer: string;
}

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

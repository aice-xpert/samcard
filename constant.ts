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
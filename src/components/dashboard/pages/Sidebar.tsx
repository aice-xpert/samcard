"use client";

import {
  LayoutDashboard,
  Briefcase,
  CreditCard,
  BarChart3,
  ShoppingCart,
  Settings,
  LogOut,
  Star,
  TrendingUp,
  X,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/dashboard/ui/avatar';
import { Badge } from '@/components/dashboard/ui/badge';
import { signOut } from "firebase/auth";
import { auth } from '@/lib/firebase';
import { useRouter } from "next/navigation";

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  /** Optional: passed from parent to allow the sidebar to close itself on mobile */
  onClose?: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { id: 'create-card', label: 'Digital business card', icon: Briefcase },
  { id: 'my-cards', label: 'My Cards', icon: CreditCard, badge: '2' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: '+12%' },
  // { id: 'design', label: 'Design & Customization', icon: Palette, badge: null },
  // { id: 'nfc-qr', label: 'NFC & QR Management', icon: Smartphone, badge: null },
  { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: 'New' },
  { id: 'billing', label: 'Billing & Subscription', icon: CreditCard, badge: 'Pro' },
  { id: 'settings', label: 'Settings', icon: Settings, badge: null },
];

function LogoMark() {
  return (
    <div className="relative w-10 h-10 flex-shrink-0">
      <div className="absolute inset-0 rounded-xl bg-[#008001]/25 blur-md" />
      <div className="relative w-10 h-10 rounded-xl overflow-hidden">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="10" fill="#060e06" />
          <polygon points="20,4 33,11.5 33,26.5 20,34 7,26.5 7,11.5" fill="none" stroke="#008001" strokeWidth="2" opacity="0.5" />
          <polygon points="20,10 28,14.5 28,23.5 20,28 12,23.5 12,14.5" fill="#008001" />
          <polygon points="20,13 25.5,21 14.5,21" fill="#060e06" />
          <polygon points="20,22 24,27.5 16,27.5" fill="#49B618" opacity="0.9" />
          <circle cx="7" cy="11" r="1.5" fill="#49B618" opacity="0.6" />
          <circle cx="33" cy="11" r="1.5" fill="#49B618" opacity="0.6" />
          <circle cx="7" cy="27" r="1.5" fill="#49B618" opacity="0.3" />
          <circle cx="33" cy="27" r="1.5" fill="#49B618" opacity="0.3" />
        </svg>
      </div>
    </div>
  );
}

export function Sidebar({ activePage, onNavigate, onClose }: SidebarProps) {
  const router = useRouter();  // Hook must be called inside component

  const handleLogout = async () => {
    try {
      await signOut(auth);      
      router.push("/login");   
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <div className="h-screen w-60 flex flex-col bg-[#000000] border-r border-[#008001]/30 shadow-2xl">

      {/* ── Logo ── */}
      <div className="px-5 py-5 border-b border-[#008001]/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LogoMark />
          <div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-white font-black text-xl tracking-tight leading-none">Sam</span>
              <span
                className="font-black text-xl tracking-tight leading-none"
                style={{
                  background: 'linear-gradient(90deg, #49B618, #008001)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Card
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#49B618] animate-pulse" />
              <p className="text-[7px] text-[#A0A0A0] tracking-widest uppercase">Pro Dashboard</p>
            </div>
          </div>
        </div>

        {/* Close button — only visible on mobile when drawer is open */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-[#008001]/20 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto [&::-webkit-scrollbar-track]:bg-black [&::-webkit-scrollbar-thumb]:bg-[#008001] [&::-webkit-scrollbar]:w-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all relative group ${isActive
                ? 'bg-[#008001]/20 text-white'
                : 'text-[#A0A0A0] hover:text-white hover:bg-[#008001]/10'
                }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#49B618] rounded-r" />
              )}
              <Icon className="w-5 h-5 flex-shrink-0 relative z-10 ml-1" />
              <span className="text-sm relative z-10 flex-1 text-left font-medium">{item.label}</span>
              {item.badge && (
                <Badge className={`relative z-10 text-xs px-2 font-medium border-0 ${item.badge === 'New' ? 'bg-[#49B618] text-white' :
                  item.badge === 'Pro' ? 'bg-[#009200] text-white' :
                    item.badge.includes('%') ? 'bg-[#006312] text-white' :
                      'bg-[#008001] text-white'
                  }`}>
                  {item.badge}
                </Badge>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── User Profile ── */}
      <div className="p-4 border-t border-[#008001]/30 bg-[#1E1E1E]">
        <div className="relative mb-3">
          <svg className="w-full h-20" viewBox="0 0 200 80">
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#008001" />
                <stop offset="100%" stopColor="#49B618" />
              </linearGradient>
            </defs>
            <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
            <circle cx="40" cy="40" r="32" fill="none" stroke="url(#progressGradient)" strokeWidth="3"
              strokeDasharray="201" strokeDashoffset="20" strokeLinecap="round"
              transform="rotate(-90 40 40)" />
            <foreignObject x="14" y="14" width="52" height="52">
              <Avatar className="w-full h-full border-2 border-[#008001]/30">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </foreignObject>
            <text x="90" y="30" fill="white" fontSize="14" fontWeight="600">John Doe</text>
            <text x="90" y="48" fill="#A0A0A0" fontSize="11">john@company.com</text>
            <text x="90" y="64" fill="#49B618" fontSize="12" fontWeight="600">
              <tspan>90% Complete </tspan>
              <tspan fill="#009200">↑</tspan>
            </text>
          </svg>
        </div>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Badge className="bg-gradient-to-r from-[#008001] to-[#49B618] text-white border-0 flex items-center gap-1 text-xs">
            <Star className="w-3 h-3 fill-current" /> Pro Plan
          </Badge>
          <Badge className="bg-[#006312] text-white border-0 flex items-center gap-1 text-xs">
            <TrendingUp className="w-3 h-3" /> +12%
          </Badge>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-[#008001]/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>

    </div>
  );
}
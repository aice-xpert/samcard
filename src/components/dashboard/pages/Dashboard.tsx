"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/dashboard/ui/card';
import { Button } from '@/components/dashboard/ui/button';
import { Badge } from '@/components/dashboard/ui/badge';
import { Progress } from '@/components/dashboard/ui/progress';
import {
  TrendingUp, TrendingDown, Users, Eye, UserPlus, MousePointerClick,
  Smartphone, Target, Lightbulb, Award, Globe, MapPin, Clock, Activity,
  Zap, ArrowRight, CheckCircle2, Linkedin, Instagram, Mail,
  Phone, Star, Sparkles, Download, Share2,
} from 'lucide-react';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useUser } from '@/contexts/UserContext';

// ── Static data (unchanged) ───────────────────────────────────────
const statsData = [
  { title: 'Total NFC Taps',  value: '2,547', change: '+12.5%', trend: 'up', icon: Smartphone, gradient: 'from-[#008001] to-[#006312]' },
  { title: 'Unique Visitors', value: '1,892', change: '+8.2%',  trend: 'up', icon: Users,      gradient: 'from-[#009200] to-[#006312]' },
  { title: 'Profile Views',   value: '3,421', change: '+24.1%', trend: 'up', icon: Eye,        gradient: 'from-[#49B618] to-[#008001]' },
  { title: 'Saved Contacts',  value: '189',   change: '+5.3%',  trend: 'up', icon: UserPlus,   gradient: 'from-[#006312] to-[#008001]' },
];

const tapActivityData = [
  { date: 'Mon', taps: 120, views: 180, leads: 15 },
  { date: 'Tue', taps: 180, views: 240, leads: 22 },
  { date: 'Wed', taps: 150, views: 210, leads: 18 },
  { date: 'Thu', taps: 240, views: 320, leads: 28 },
  { date: 'Fri', taps: 200, views: 280, leads: 24 },
  { date: 'Sat', taps: 280, views: 380, leads: 32 },
  { date: 'Sun', taps: 320, views: 420, leads: 38 },
];

const deviceData = [
  { name: 'iOS',     value: 62, color: '#008001' },
  { name: 'Android', value: 35, color: '#49B618' },
  { name: 'Desktop', value: 3,  color: '#006312' },
];

const topLinksData = [
  { name: 'LinkedIn',  clicks: 847, percentage: 42, icon: Linkedin,  color: '#008001' },
  { name: 'Instagram', clicks: 623, percentage: 31, icon: Instagram, color: '#49B618' },
  { name: 'Website',   clicks: 412, percentage: 20, icon: Globe,     color: '#009200' },
  { name: 'Email',     clicks: 287, percentage: 14, icon: Mail,      color: '#006312' },
  { name: 'Phone',     clicks: 156, percentage: 8,  icon: Phone,     color: '#008001' },
];

const recentTaps = [
  { id: 1, name: 'Sarah Anderson',  location: 'New York, US',       time: '2 mins ago',  device: 'iPhone 15 Pro',      action: 'Saved Contact',    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', status: 'hot'    },
  { id: 2, name: 'Michael Chen',    location: 'San Francisco, US',  time: '5 mins ago',  device: 'Samsung Galaxy S24', action: 'Clicked LinkedIn', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', status: 'new'    },
  { id: 3, name: 'Emma Wilson',     location: 'London, UK',         time: '8 mins ago',  device: 'iPhone 14',          action: 'Viewed Profile',   avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', status: 'active' },
  { id: 4, name: 'James Rodriguez', location: 'Toronto, CA',        time: '12 mins ago', device: 'Pixel 8 Pro',        action: 'Downloaded vCard', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', status: 'hot'    },
  { id: 5, name: 'Sophia Kumar',    location: 'Mumbai, IN',         time: '18 mins ago', device: 'OnePlus 11',         action: 'Clicked Instagram',avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', status: 'active' },
  { id: 6, name: 'David Park',      location: 'Seoul, KR',          time: '25 mins ago', device: 'iPhone 13',          action: 'Visited Website',  avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop', status: 'new'    },
];

const geographicData = [
  { country: 'United States',  flag: '🇺🇸', visitors: 847, percentage: 42 },
  { country: 'United Kingdom', flag: '🇬🇧', visitors: 423, percentage: 21 },
  { country: 'Canada',         flag: '🇨🇦', visitors: 312, percentage: 16 },
  { country: 'India',          flag: '🇮🇳', visitors: 289, percentage: 14 },
  { country: 'Others',         flag: '🌍', visitors: 140, percentage: 7  },
];

const recommendations = [
  { icon: Instagram, title: 'Add Instagram Stories Link', desc: 'Profiles with stories get 35% more engagement', priority: 'high',   color: 'from-[#49B618] to-[#009200]' },
  { icon: Star,      title: 'Complete Your Portfolio',    desc: 'Showcase your work to increase credibility',   priority: 'medium', color: 'from-[#008001] to-[#006312]' },
  { icon: Sparkles,  title: 'Upgrade to Pro Plus',        desc: 'Get advanced analytics and AI insights',      priority: 'low',    color: 'from-[#009200] to-[#008001]' },
];

const performanceComparison = [
  { metric: 'Taps',        thisMonth: 2547, lastMonth: 2267, change: 12.3  },
  { metric: 'Visitors',    thisMonth: 1892, lastMonth: 1751, change: 8.1   },
  { metric: 'Leads',       thisMonth: 189,  lastMonth: 179,  change: 5.6   },
  { metric: 'Link Clicks', thisMonth: 2325, lastMonth: 2401, change: -3.2  },
];

const funnelSteps = [
  { label: 'NFC Tapped',    value: 2547, percentage: 100, icon: Smartphone,        color: '#008001', lightColor: 'rgba(0,128,1,0.15)',    drop: null },
  { label: 'Link Clicked',  value: 1203, percentage: 47,  icon: MousePointerClick, color: '#49B618', lightColor: 'rgba(73,182,24,0.15)',  drop: 53   },
  { label: 'Contact Saved', value: 512,  percentage: 20,  icon: Download,          color: '#7ed957', lightColor: 'rgba(126,217,87,0.15)', drop: 27   },
  { label: 'Card Shared',   value: 189,  percentage: 7,   icon: Share2,            color: '#a8f060', lightColor: 'rgba(168,240,96,0.15)', drop: 13   },
];

// ─────────────────────────────────────────────────────────────────
export function ComprehensiveDashboard() {
  const { profile } = useUser();
  const firstName = profile.name.split(" ")[0];

  return (
    <div className="space-y-4 sm:space-y-6">

      {/* ── Welcome Banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#000000] via-[#008001]/30 to-[#000000] p-5 sm:p-8 shadow-2xl border border-[#008001]/30">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwODAwMSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          {/* Left copy */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#49B618] animate-pulse" />
              <span className="text-[#A0A0A0] text-xs sm:text-sm font-medium">The Future of Business Cards</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">Welcome back, {firstName}!</h1>
            <p className="text-[#A0A0A0] mb-4 sm:mb-6 text-sm sm:text-lg">Your digital business card is performing great today</p>

            <div className="bg-[#000000]/50 backdrop-blur-xl rounded-xl p-4 sm:p-5 border border-[#008001]/30 max-w-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-semibold text-sm sm:text-base">Profile Completion</span>
                <span className="text-white font-bold text-base sm:text-lg">90%</span>
              </div>
              <div className="relative h-3 bg-[#1E1E1E] rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#008001] to-[#49B618] rounded-full transition-all duration-1000" style={{ width: '90%' }} />
              </div>
              <div className="flex items-center gap-2 mt-3 text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-[#49B618] flex-shrink-0" />
                <span className="text-[#A0A0A0]">Almost there! Add social links to reach 100%</span>
              </div>
            </div>
          </div>

          {/* Score cards — row on mobile, row on desktop */}
          <div className="flex gap-3 sm:gap-4 sm:flex-col md:flex-row">
            {[
              { icon: Award,    label: 'Engagement Score', value: '87',   badge: 'Excellent', badgeCls: 'bg-[#006312]/20 text-[#49B618] border-[#008001]/30', gradient: 'from-[#49B618] to-[#009200]' },
              { icon: Activity, label: 'This Week',         value: '+24%', badge: 'Growing',   badgeCls: 'bg-[#008001]/20 text-[#49B618] border-[#008001]/30', gradient: 'from-[#008001] to-[#006312]' },
            ].map(({ icon: Icon, label, value, badge, badgeCls, gradient }) => (
              <div key={label} className="bg-[#000000]/50 backdrop-blur-xl rounded-xl p-4 sm:p-6 border border-[#008001]/30 text-center flex-1 sm:min-w-32">
                <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center mx-auto mb-2 sm:mb-3`}>
                  <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                </div>
                <p className="text-[#A0A0A0] text-xs sm:text-sm mb-1">{label}</p>
                <p className="text-2xl sm:text-4xl font-bold text-white">{value}</p>
                <Badge className={`mt-1 sm:mt-2 ${badgeCls} text-xs`}>
                  <TrendingUp className="w-3 h-3 mr-1" />{badge}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats Cards — 2-col mobile, 4-col desktop ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          return (
            <Card key={index} className="relative overflow-hidden bg-[#000000] border-[#008001]/30 hover:shadow-lg hover:shadow-[#008001]/20 transition-all group">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />
              <CardContent className="p-4 sm:p-6 relative z-10">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <Badge className={`text-xs ${stat.trend === 'up' ? 'bg-[#006312]/20 text-[#49B618] border-[#008001]/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                    <TrendIcon className="w-3 h-3 mr-1" />{stat.change}
                  </Badge>
                </div>
                <h3 className="text-xl sm:text-3xl font-bold text-white">{stat.value}</h3>
                <p className="text-xs sm:text-sm text-[#A0A0A0] mt-0.5 sm:mt-1">{stat.title}</p>
                <div className="flex items-center gap-1 text-xs text-[#A0A0A0] mt-1 sm:mt-2">
                  <Clock className="w-3 h-3" /><span>Last 30 days</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── Chart + Funnel / Device + Locations ──
          Desktop: [chart+funnel col-2] [device+locations col-1]
          Mobile:  stacked single column                          */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

        {/* Left: chart + funnel */}
        <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-6">

          {/* Engagement chart */}
          <Card className="bg-[#000000] border-[#008001]/30">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#008001]/30 pb-4">
              <div>
                <CardTitle className="text-white text-base sm:text-lg">Engagement Analytics</CardTitle>
                <p className="text-xs sm:text-sm text-[#A0A0A0] mt-0.5">Track your performance over time</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="h-7 sm:h-8 px-2 sm:px-3 text-xs bg-gradient-to-r from-[#008001] to-[#49B618] hover:from-[#006312] hover:to-[#008001] text-white">30 Days</Button>
                <Button variant="outline" size="sm" className="h-7 sm:h-8 px-2 sm:px-3 text-xs border-[#008001]/30 text-[#A0A0A0] hover:text-white hover:bg-[#008001]/20">7 Days</Button>
                <Button variant="outline" size="sm" className="h-7 sm:h-8 px-2 sm:px-3 text-xs border-[#008001]/30 text-[#A0A0A0] hover:text-white hover:bg-[#008001]/20">90 Days</Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6">
              <div className="h-56 sm:h-80 min-w-0 min-h-[224px] sm:min-h-[320px]">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={1}>
                  <AreaChart data={tapActivityData}>
                    <defs>
                      <linearGradient id="colorTaps"  x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#008001" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#008001" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#49B618" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#49B618" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#006312" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#006312" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#008001" strokeOpacity={0.2} />
                    <XAxis dataKey="date" stroke="#A0A0A0" fontSize={11} />
                    <YAxis stroke="#A0A0A0" fontSize={11} width={30} />
                    <Tooltip contentStyle={{ background: '#000000', border: '1px solid #008001', borderRadius: '12px', color: '#FFFFFF', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Area type="monotone" dataKey="leads" stroke="#006312" strokeWidth={2} fill="url(#colorLeads)" />
                    <Area type="monotone" dataKey="taps"  stroke="#008001" strokeWidth={3} fill="url(#colorTaps)"  />
                    <Area type="monotone" dataKey="views" stroke="#49B618" strokeWidth={3} fill="url(#colorViews)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Conversion Funnel */}
          <Card className="bg-[#000000] border-[#008001]/30">
            <CardHeader className="border-b border-[#008001]/30 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[#49B618]" />
                    Conversion Funnel
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-[#A0A0A0] mt-0.5">How taps turn into real connections</p>
                </div>
                <Badge className="bg-[#008001]/20 text-[#49B618] border-[#008001]/30 text-xs">7.4% end-to-end</Badge>
              </div>
            </CardHeader>
            <CardContent className="py-4 sm:py-5">
              {/* On mobile: hide the side conversion summary box to save space */}
              <div className="flex gap-4 sm:gap-6 items-start">
                <div className="flex-1 space-y-3">
                  {funnelSteps.map((step, i) => {
                    const Icon = step.icon;
                    return (
                      <div key={i}>
                        {step.drop !== null && (
                          <div className="flex items-center gap-2 pl-3 mb-1 sm:mb-2">
                            <div className="w-px h-3 bg-[#008001]/25" />
                            <span className="text-xs text-red-400/80 font-medium">↓ {step.drop}% left here</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 sm:gap-3 rounded-xl px-2 py-2 hover:bg-[#008001]/5 transition-all border border-transparent hover:border-[#008001]/20">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: step.lightColor, border: `1px solid ${step.color}40` }}>
                            <Icon className="w-4 h-4" style={{ color: step.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs sm:text-sm font-semibold text-white truncate">{step.label}</span>
                              <div className="flex items-center gap-1 sm:gap-2 ml-2 flex-shrink-0">
                                <span className="text-xs sm:text-sm font-bold" style={{ color: step.color }}>{step.value.toLocaleString()}</span>
                                <span className="text-xs text-[#A0A0A0]">{step.percentage}%</span>
                              </div>
                            </div>
                            <div className="h-2 bg-[#1E1E1E] rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-700"
                                style={{ width: `${step.percentage}%`, background: `linear-gradient(90deg, ${step.color}aa, ${step.color})`, boxShadow: `0 0 6px ${step.color}55` }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Conversion summary — hidden on small mobile, shown sm+ */}
                <div className="hidden sm:flex flex-shrink-0 w-28 sm:w-32 flex-col items-center gap-3 self-center">
                  <div className="w-full p-3 sm:p-4 rounded-xl bg-gradient-to-br from-[#008001]/10 to-[#49B618]/5 border border-[#008001]/30 text-center">
                    <p className="text-xs text-[#A0A0A0] mb-1">Conversion</p>
                    <p className="text-2xl sm:text-3xl font-bold text-[#49B618]">7.4%</p>
                    <p className="text-xs text-[#A0A0A0] mt-1">tap → share</p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <TrendingUp className="w-3 h-3 text-[#49B618]" />
                      <span className="text-xs text-[#49B618] font-medium">+2.1%</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#A0A0A0] text-center leading-relaxed">
                    Best fix: add a profile photo for <span className="text-[#49B618]">+18% views</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: device + locations */}
        <div className="flex flex-col gap-4 sm:gap-6">

          {/* Device Distribution */}
          <Card className="bg-[#000000] border-[#008001]/30">
            <CardHeader className="border-b border-[#008001]/30">
              <CardTitle className="text-sm sm:text-base text-white">Device Distribution</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6">
              <div className="h-40 sm:h-48 min-w-0 min-h-[160px] sm:min-h-[192px]">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={1}>
                  <PieChart>
                    <Pie data={deviceData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                      {deviceData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#000000', border: '1px solid #008001', color: '#FFFFFF', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-3 sm:mt-4">
                {deviceData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-[#1E1E1E]">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-xs sm:text-sm text-[#A0A0A0]">{item.name}</span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-white">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Locations */}
          <Card className="bg-[#000000] border-[#008001]/30">
            <CardHeader className="border-b border-[#008001]/30">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-[#49B618]" />
                <CardTitle className="text-sm sm:text-base text-white">Top Locations</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-3 sm:pt-4">
              <div className="space-y-3">
                {geographicData.map((location, index) => (
                  <div key={index} className="space-y-1.5 sm:space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg sm:text-2xl">{location.flag}</span>
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-white leading-tight">{location.country}</p>
                          <p className="text-[10px] sm:text-xs text-[#A0A0A0]">{location.visitors} visitors</p>
                        </div>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-white">{location.percentage}%</span>
                    </div>
                    <div className="h-1.5 sm:h-2 bg-[#1E1E1E] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#008001] to-[#49B618] rounded-full transition-all duration-1000"
                        style={{ width: `${location.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Recent Card Taps — 1-col mobile, 2-col sm, 3-col lg ── */}
      <Card className="bg-[#000000] border-[#008001]/30">
        <CardHeader className="border-b border-[#008001]/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-[#49B618]" />
                Recent Card Taps
              </CardTitle>
              <p className="text-xs sm:text-sm text-[#A0A0A0] mt-1">Live interactions with your digital card</p>
            </div>
            <Button variant="outline" size="sm" className="border-[#008001]/30 text-[#A0A0A0] hover:text-white hover:bg-[#008001]/20 text-xs sm:text-sm h-8">
              View All <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {recentTaps.map((tap) => (
              <div key={tap.id} className="group relative overflow-hidden rounded-xl border border-[#008001]/30 bg-gradient-to-br from-black to-[#1E1E1E] p-3 sm:p-4 hover:shadow-lg hover:shadow-[#008001]/20 hover:border-[#49B618]/50 transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <div className="relative flex-shrink-0">
                    <Image
                      src={tap.avatar}
                      alt={tap.name}
                      width={48}
                      height={48}
                      unoptimized
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-2 ring-[#008001]/30 object-cover"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-black ${tap.status === 'hot' ? 'bg-[#49B618]' : tap.status === 'new' ? 'bg-[#009200]' : 'bg-[#006312]'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white text-sm truncate">{tap.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-[#A0A0A0]">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{tap.location}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <Smartphone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#A0A0A0] flex-shrink-0" />
                    <span className="text-[#A0A0A0] truncate">{tap.device}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <Badge className="bg-[#008001]/20 text-[#49B618] border-[#008001]/30 text-xs truncate max-w-[120px]">{tap.action}</Badge>
                    <div className="flex items-center gap-1 text-xs text-[#A0A0A0] flex-shrink-0">
                      <Clock className="w-3 h-3" />{tap.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Most Clicked Links + Smart Insights ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="lg:col-span-2 bg-[#000000] border-[#008001]/30">
          <CardHeader className="border-b border-[#008001]/30">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[#49B618]" />
              <CardTitle className="text-white text-base sm:text-lg">Most Clicked Links</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
            {topLinksData.map((link, i) => {
              const Icon = link.icon;
              return (
                <div key={i} className="flex items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${link.color}15` }}>
                      <Icon className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: link.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1 sm:mb-2">
                        <span className="text-xs sm:text-sm font-semibold text-white">{link.name}</span>
                        <span className="text-xs sm:text-sm text-[#A0A0A0] ml-2">{link.clicks} clicks</span>
                      </div>
                      <div className="h-1.5 sm:h-2 bg-[#1E1E1E] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${link.percentage}%`, background: `linear-gradient(90deg, ${link.color}, ${link.color}cc)` }} />
                      </div>
                    </div>
                  </div>
                  <span className="text-sm sm:text-lg font-bold text-white flex-shrink-0">{link.percentage}%</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="bg-[#000000] border-[#008001]/30">
          <CardHeader className="border-b border-[#008001]/30">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-[#49B618]" />
              <CardTitle className="text-sm sm:text-base text-white">Smart Insights</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-3 sm:pt-4 space-y-3">
            {recommendations.map((rec, i) => {
              const Icon = rec.icon;
              return (
                <div key={i} className="p-3 rounded-lg border border-[#008001]/30 bg-gradient-to-br from-black to-[#1E1E1E] hover:shadow-md hover:shadow-[#008001]/20 transition-all">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${rec.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-white text-xs sm:text-sm mb-1">{rec.title}</h4>
                      <p className="text-xs text-[#A0A0A0] leading-relaxed">{rec.desc}</p>
                      <Badge className={`mt-2 text-xs ${
                        rec.priority === 'high'   ? 'bg-[#49B618]/20 text-[#49B618] border-[#49B618]/30' :
                        rec.priority === 'medium' ? 'bg-[#009200]/20 text-[#009200] border-[#009200]/30' :
                        'bg-[#006312]/20 text-[#006312] border-[#006312]/30'
                      }`}>
                        {rec.priority === 'high' ? 'High Priority' : rec.priority === 'medium' ? 'Medium' : 'Suggested'}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* ── Month-over-Month — 2-col mobile, 4-col desktop ── */}
      <Card className="bg-[#000000] border-[#008001]/30">
        <CardHeader className="border-b border-[#008001]/30">
          <CardTitle className="text-white flex items-center gap-2 text-base sm:text-lg">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-[#49B618]" />
            Month-over-Month Performance
          </CardTitle>
          <p className="text-xs sm:text-sm text-[#A0A0A0]">Compare your growth metrics</p>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {performanceComparison.map((item, i) => (
              <div key={i} className="p-4 sm:p-6 rounded-xl border border-[#008001]/30 bg-gradient-to-br from-black to-[#1E1E1E] text-center">
                <p className="text-xs sm:text-sm text-[#A0A0A0] mb-2">{item.metric}</p>
                <div className="flex items-center justify-center gap-1 sm:gap-3 mb-2 sm:mb-3 flex-wrap">
                  <div>
                    <p className="text-[10px] sm:text-xs text-[#A0A0A0]">Last</p>
                    <p className="text-sm sm:text-lg font-semibold text-[#A0A0A0]">{item.lastMonth.toLocaleString()}</p>
                  </div>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-[#A0A0A0]" />
                  <div>
                    <p className="text-[10px] sm:text-xs text-[#A0A0A0]">Now</p>
                    <p className="text-lg sm:text-2xl font-bold text-white">{item.thisMonth.toLocaleString()}</p>
                  </div>
                </div>
                <Badge className={`text-xs ${item.change > 0 ? 'bg-[#006312]/20 text-[#49B618] border-[#008001]/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                  {item.change > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {item.change > 0 ? '+' : ''}{item.change}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Goals — stack on mobile, side-by-side on sm+ ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Card className="bg-gradient-to-br from-[#008001] to-[#006312] text-white border-0 shadow-xl">
          <CardContent className="p-5 sm:p-8">
            <div className="flex items-start justify-between mb-4 sm:mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                  <h3 className="text-lg sm:text-xl font-bold">Monthly Goal</h3>
                </div>
                <p className="text-white/80 text-xs sm:text-sm">2,000 Profile Taps</p>
              </div>
              <Badge className="bg-white/20 text-white border-white/30 text-xs">67% Complete</Badge>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span>Current Progress</span>
                <span className="font-bold text-base sm:text-lg">1,340 / 2,000</span>
              </div>
              <Progress value={67} className="h-2 sm:h-3 bg-white/20" />
              <div className="flex items-center gap-2 text-xs sm:text-sm text-white/80">
                <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span>You are on track to hit your goal!</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#49B618] to-[#009200] text-white border-0 shadow-xl">
          <CardContent className="p-5 sm:p-8">
            <div className="flex items-start justify-between mb-4 sm:mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                  <h3 className="text-lg sm:text-xl font-bold">Weekly Challenge</h3>
                </div>
                <p className="text-white/80 text-xs sm:text-sm">Get 50 New Saves</p>
              </div>
              <Badge className="bg-white/20 text-white border-white/30 text-xs">82% Complete</Badge>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span>Current Progress</span>
                <span className="font-bold text-base sm:text-lg">41 / 50</span>
              </div>
              <Progress value={82} className="h-2 sm:h-3 bg-white/20" />
              <div className="flex items-center gap-2 text-xs sm:text-sm text-white/80">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current flex-shrink-0" />
                <span>9 more to unlock bonus rewards!</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
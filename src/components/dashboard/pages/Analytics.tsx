"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/dashboard/ui/card';
import { Button } from '@/components/dashboard/ui/button';
import { Badge } from '@/components/dashboard/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/dashboard/ui/select';
import { Input } from '@/components/dashboard/ui/input';
import { Checkbox } from '@/components/dashboard/ui/checkbox';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  BarChart2, Download, Info, Grid3X3, Link2, Mail,
  Globe, Phone, MessageSquare, Star, MoreVertical
} from 'lucide-react';

// Data for the main performance chart
const performanceData = [
  { day: 'Mon', nfcTaps: 320, profileViews: 180, qrScans: 120 },
  { day: 'Tue', nfcTaps: 410, profileViews: 200, qrScans: 140 },
  { day: 'Wed', nfcTaps: 380, profileViews: 220, qrScans: 130 },
  { day: 'Thu', nfcTaps: 520, profileViews: 280, qrScans: 160 },
  { day: 'Fri', nfcTaps: 480, profileViews: 300, qrScans: 180 },
  { day: 'Sat', nfcTaps: 664, profileViews: 380, qrScans: 210 },
  { day: 'Sun', nfcTaps: 550, profileViews: 340, qrScans: 190 },
];

// Engagement breakdown data
const engagementData = [
  { title: 'LinkedIn Link', avgRate: '35.01%', prevRate: '51.18%', change: -16.17, color: '#008001', icon: Link2 },
  { title: 'Email Link', avgRate: '15.31%', prevRate: '11.18%', change: 4.13, color: '#49B618', icon: Mail },
  { title: 'Website Link', avgRate: '25.53%', prevRate: '16.11%', change: 9.42, color: '#009200', icon: Globe },
  { title: 'Phone Link', avgRate: '32.68%', prevRate: '28.18%', change: 4.50, color: '#006312', icon: Phone },
];

// Traffic sources for donut chart
const trafficSources = [
  { name: 'NFC Taps', value: 1147, percentage: 45, color: '#008001' },
  { name: 'QR Scans', value: 714, percentage: 28, color: '#49B618' },
  { name: 'Link Clicks', value: 382, percentage: 15, color: '#009200' },
  { name: 'Direct Views', value: 204, percentage: 8, color: '#006312' },
  { name: 'Search', value: 102, percentage: 4, color: '#004d00' },
];

// Recent leads data for table
const recentLeads = [
  { id: 1, name: 'Sarah Anderson', email: 'sarah.a@example.com', source: 'NFC', date: 'Feb 11, 2026', time: '3:42 PM', engagement: 5, avatar: 'SA' },
  { id: 2, name: 'Michael Chen', email: 'michael.c@example.com', source: 'QR', date: 'Feb 11, 2026', time: '2:15 PM', engagement: 4, avatar: 'MC' },
  { id: 3, name: 'Emma Wilson', email: 'emma.w@example.com', source: 'Link', date: 'Feb 11, 2026', time: '11:30 AM', engagement: 5, avatar: 'EW' },
  { id: 4, name: 'James Rodriguez', email: 'james.r@example.com', source: 'NFC', date: 'Feb 10, 2026', time: '5:20 PM', engagement: 3, avatar: 'JR' },
  { id: 5, name: 'Sophia Kumar', email: 'sophia.k@example.com', source: 'QR', date: 'Feb 10, 2026', time: '1:45 PM', engagement: 4, avatar: 'SK' },
  { id: 6, name: 'David Park', email: 'david.p@example.com', source: 'Link', date: 'Feb 10, 2026', time: '10:00 AM', engagement: 5, avatar: 'DP' },
];

const getSourceColor = (source: string) => {
  switch (source) {
    case 'NFC': return 'bg-[#008001]/20 text-[#49B618] border-[#008001]/30';
    case 'QR': return 'bg-[#49B618]/20 text-[#49B618] border-[#49B618]/30';
    case 'Link': return 'bg-[#009200]/20 text-[#009200] border-[#009200]/30';
    default: return 'bg-[#A0A0A0]/20 text-[#A0A0A0] border-[#A0A0A0]/30';
  }
};

const getSourceIcon = (source: string) => {
  switch (source) {
    case 'NFC': return '📱';
    case 'QR': return '⬜';
    case 'Link': return '🔗';
    default: return '•';
  }
};

export function Analytics() {
  const totalInteractions = 2547;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-sm text-[#A0A0A0] mt-1">Comprehensive insights into your digital card performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="7">
            <SelectTrigger className="w-40 h-10 border-[#008001]/30 bg-[#000000] text-white">
              <SelectValue placeholder="Last 7 days" />
            </SelectTrigger>
            <SelectContent className="bg-[#000000] border-[#008001]/30">
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-[#49B618] hover:bg-[#009200] text-white h-10">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Performance Report Card */}
      <Card className="shadow-sm border-[#008001]/30 bg-[#000000]">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#49B618]" />
              <CardTitle className="text-base font-semibold text-white">Performance Report</CardTitle>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#49B618]" />
                  <span className="text-xs text-[#A0A0A0]">NFC Taps</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#008001]" />
                  <span className="text-xs text-[#A0A0A0]">Profile Views</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Grid3X3 className="w-4 h-4 text-[#A0A0A0]" />
                <Info className="w-4 h-4 text-[#A0A0A0]" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Statistics Row */}
          <div className="grid grid-cols-3 gap-8 mb-8">
            <div className="text-center py-4">
              <p className="text-xs text-[#A0A0A0] mb-2">Total Taps</p>
              <p className="text-5xl font-bold text-white">2,547</p>
            </div>
            <div className="text-center py-4 border-x border-[#008001]/30">
              <p className="text-xs text-[#A0A0A0] mb-2">Profile Views</p>
              <p className="text-5xl font-bold text-white">3,421</p>
            </div>
            <div className="text-center py-4">
              <p className="text-xs text-[#A0A0A0] mb-2">Saved Contacts</p>
              <p className="text-5xl font-bold text-white">189</p>
            </div>
          </div>

          {/* Multi-line Chart */}
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorNFC" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#49B618" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#49B618" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#008001" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#008001" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" stroke="#008001" strokeOpacity={0.2} vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: '#A0A0A0', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#A0A0A0', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#000000',
                    border: '1px solid #008001',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,128,1,0.3)',
                    color: '#FFFFFF'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="nfcTaps"
                  stroke="#49B618"
                  strokeWidth={3}
                  fill="url(#colorNFC)"
                  name="NFC Taps"
                />
                <Area
                  type="monotone"
                  dataKey="profileViews"
                  stroke="#008001"
                  strokeWidth={3}
                  fill="url(#colorViews)"
                  name="Profile Views"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Second Row: Engagement Breakdown and Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement Breakdown - Takes 2/3 width */}
        <Card className="lg:col-span-2 shadow-sm border-[#008001]/30 bg-[#000000]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-white">Engagement Breakdown</CardTitle>
              <MoreVertical className="w-4 h-4 text-[#A0A0A0]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {engagementData.map((item, index) => {
                const Icon = item.icon;
                const isPositive = item.change > 0;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#1E1E1E] transition-colors"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${item.color}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: item.color }} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-medium text-white">{item.title}</h4>
                      <p className="text-xs text-[#A0A0A0]">Average click-through rate</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">{item.avgRate}</p>
                      <p className={`text-xs ${isPositive ? 'text-[#49B618]' : 'text-red-400'}`}>
                        VS {item.prevRate} (Prev)
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources Donut Chart - Takes 1/3 width */}
        <Card className="shadow-sm border-[#008001]/30 bg-[#000000]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-white">Traffic Sources</CardTitle>
              <MoreVertical className="w-4 h-4 text-[#A0A0A0]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={trafficSources}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {trafficSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-xs text-[#A0A0A0]">Total</p>
                  <p className="text-2xl font-bold text-white">{totalInteractions.toLocaleString()}</p>
                </div>
              </div>
              <div className="w-full space-y-2">
                {trafficSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                      <span className="text-sm font-medium text-white">{source.name}</span>
                    </div>
                    <span className="text-xs text-[#A0A0A0]">{source.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Leads Table */}
      <Card className="shadow-sm border-[#008001]/30 bg-[#000000]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-white">Recent Leads</CardTitle>
            <Input
              placeholder="Search anything here"
              className="w-64 h-9 border-[#008001]/30 bg-[#1E1E1E] text-white text-sm placeholder:text-[#A0A0A0]"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#008001]/30 bg-[#1E1E1E]">
                  <th className="text-left py-3 px-4">
                    <Checkbox className="border-[#008001]/30" />
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[#A0A0A0] uppercase">No</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[#A0A0A0] uppercase">Contact Name</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[#A0A0A0] uppercase">Source</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[#A0A0A0] uppercase">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[#A0A0A0] uppercase">Engagement</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-[#A0A0A0] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead, index) => (
                  <tr
                    key={lead.id}
                    className="border-b border-[#1E1E1E] hover:bg-[#1E1E1E] transition-colors"
                  >
                    <td className="py-4 px-4">
                      <Checkbox className="border-[#008001]/30" />
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-medium text-white">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#49B618] to-[#008001] flex items-center justify-center text-white text-xs font-semibold">
                          {lead.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{lead.name}</p>
                          <p className="text-xs text-[#A0A0A0]">{lead.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={`${getSourceColor(lead.source)} border text-xs font-medium`}>
                        {getSourceIcon(lead.source)} {lead.source}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm text-white">{lead.date}</p>
                        <p className="text-xs text-[#A0A0A0]">{lead.time}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < lead.engagement ? 'fill-[#49B618] text-[#49B618]' : 'text-[#1E1E1E]'}`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button className="w-8 h-8 rounded-full bg-[#49B618] hover:bg-[#009200] flex items-center justify-center transition-colors">
                          <MessageSquare className="w-4 h-4 text-white" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-[#008001] hover:bg-[#006312] flex items-center justify-center transition-colors">
                          <Mail className="w-4 h-4 text-white" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-[#009200] hover:bg-[#006312] flex items-center justify-center transition-colors">
                          <Phone className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                    page === 1
                      ? 'bg-[#008001] text-white'
                      : 'text-[#A0A0A0] hover:bg-[#1E1E1E]'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
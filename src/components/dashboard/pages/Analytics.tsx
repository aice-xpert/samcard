import { useState, useMemo } from "react";

// ── Types ─────────────────────────────────────────────────────────────
type Period = "7" | "30" | "90";

interface PerfPoint {
  day: string;
  nfcTaps: number;
  profileViews: number;
  qrScans: number;
}

interface Lead {
  id: number;
  name: string;
  email: string;
  source: "NFC" | "QR" | "Link";
  date: string;
  time: string;
  engagement: number;
  avatar: string;
}

interface ActionModal {
  lead: Lead;
  type: "message" | "email" | "call";
}
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  BarChart2, Download, Info, Grid3X3, Link2, Mail,
  Globe, Phone, MessageSquare, Star, MoreVertical,
  Search, ChevronLeft, ChevronRight, Check, X
} from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────
const ALL_PERFORMANCE: Record<Period, PerfPoint[]> = {
  7: [
    { day: "Mon", nfcTaps: 320, profileViews: 180, qrScans: 120 },
    { day: "Tue", nfcTaps: 410, profileViews: 200, qrScans: 140 },
    { day: "Wed", nfcTaps: 380, profileViews: 220, qrScans: 130 },
    { day: "Thu", nfcTaps: 520, profileViews: 280, qrScans: 160 },
    { day: "Fri", nfcTaps: 480, profileViews: 300, qrScans: 180 },
    { day: "Sat", nfcTaps: 664, profileViews: 380, qrScans: 210 },
    { day: "Sun", nfcTaps: 550, profileViews: 340, qrScans: 190 },
  ],
  30: [
    { day: "W1", nfcTaps: 1800, profileViews: 900, qrScans: 600 },
    { day: "W2", nfcTaps: 2100, profileViews: 1100, qrScans: 750 },
    { day: "W3", nfcTaps: 1950, profileViews: 980, qrScans: 680 },
    { day: "W4", nfcTaps: 2400, profileViews: 1300, qrScans: 820 },
  ],
  90: [
    { day: "Jan", nfcTaps: 7200, profileViews: 3800, qrScans: 2400 },
    { day: "Feb", nfcTaps: 8100, profileViews: 4200, qrScans: 2900 },
    { day: "Mar", nfcTaps: 9400, profileViews: 5100, qrScans: 3300 },
  ],
};

const STATS: Record<Period, { taps: string; views: string; saved: string }> = {
  7: { taps: "2,547", views: "3,421", saved: "189" },
  30: { taps: "9,210", views: "12,400", saved: "721" },
  90: { taps: "24,700", views: "37,800", saved: "2,104" },
};

const engagementData = [
  { title: "LinkedIn Link", avgRate: "35.01%", prevRate: "51.18%", change: -16.17, color: "#008001", icon: Link2 },
  { title: "Email Link", avgRate: "15.31%", prevRate: "11.18%", change: 4.13, color: "#49B618", icon: Mail },
  { title: "Website Link", avgRate: "25.53%", prevRate: "16.11%", change: 9.42, color: "#009200", icon: Globe },
  { title: "Phone Link", avgRate: "32.68%", prevRate: "28.18%", change: 4.50, color: "#006312", icon: Phone },
];

const trafficSources = [
  { name: "NFC Taps", value: 1147, percentage: 45, color: "#008001" },
  { name: "QR Scans", value: 714, percentage: 28, color: "#49B618" },
  { name: "Link Clicks", value: 382, percentage: 15, color: "#009200" },
  { name: "Direct Views", value: 204, percentage: 8, color: "#006312" },
  { name: "Search", value: 102, percentage: 4, color: "#004d00" },
];

const ALL_LEADS: Lead[] = [
  { id: 1, name: "Sarah Anderson", email: "sarah.a@example.com", source: "NFC", date: "Feb 11, 2026", time: "3:42 PM", engagement: 5, avatar: "SA" },
  { id: 2, name: "Michael Chen", email: "michael.c@example.com", source: "QR", date: "Feb 11, 2026", time: "2:15 PM", engagement: 4, avatar: "MC" },
  { id: 3, name: "Emma Wilson", email: "emma.w@example.com", source: "Link", date: "Feb 11, 2026", time: "11:30 AM", engagement: 5, avatar: "EW" },
  { id: 4, name: "James Rodriguez", email: "james.r@example.com", source: "NFC", date: "Feb 10, 2026", time: "5:20 PM", engagement: 3, avatar: "JR" },
  { id: 5, name: "Sophia Kumar", email: "sophia.k@example.com", source: "QR", date: "Feb 10, 2026", time: "1:45 PM", engagement: 4, avatar: "SK" },
  { id: 6, name: "David Park", email: "david.p@example.com", source: "Link", date: "Feb 10, 2026", time: "10:00 AM", engagement: 5, avatar: "DP" },
  { id: 7, name: "Priya Nair", email: "priya.n@example.com", source: "NFC", date: "Feb 09, 2026", time: "4:10 PM", engagement: 2, avatar: "PN" },
  { id: 8, name: "Lucas Martin", email: "lucas.m@example.com", source: "QR", date: "Feb 09, 2026", time: "9:00 AM", engagement: 3, avatar: "LM" },
  { id: 9, name: "Ava Thompson", email: "ava.t@example.com", source: "Link", date: "Feb 08, 2026", time: "6:45 PM", engagement: 5, avatar: "AT" },
  { id: 10, name: "Omar Hassan", email: "omar.h@example.com", source: "NFC", date: "Feb 08, 2026", time: "2:30 PM", engagement: 4, avatar: "OH" },
  { id: 11, name: "Isabella Lee", email: "isabella.l@example.com", source: "QR", date: "Feb 07, 2026", time: "12:15 PM", engagement: 3, avatar: "IL" },
  { id: 12, name: "Ethan Brooks", email: "ethan.b@example.com", source: "Link", date: "Feb 07, 2026", time: "8:00 AM", engagement: 4, avatar: "EB" },
];

const PAGE_SIZE = 6;

// ── Helpers ──────────────────────────────────────────────────────────
const srcColor = (s: Lead["source"]): string => ({
  NFC: "bg-[#008001]/20 text-[#49B618] border-[#008001]/30",
  QR: "bg-[#49B618]/20 text-[#49B618] border-[#49B618]/30",
  Link: "bg-[#009200]/20 text-[#009200] border-[#009200]/30",
}[s] || "bg-gray-500/20 text-gray-300 border-gray-500/30");

const srcIcon = (s: Lead["source"]): string => ({ NFC: "📱", QR: "⬜", Link: "🔗" }[s] || "•");

// ── Toast ─────────────────────────────────────────────────────────────
function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#1E1E1E] border border-[#49B618]/40 rounded-xl px-4 py-3 shadow-2xl animate-pulse">
      <Check className="w-4 h-4 text-[#49B618]" />
      <span className="text-sm text-white">{msg}</span>
      <button onClick={onClose}><X className="w-4 h-4 text-[#A0A0A0] hover:text-white" /></button>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────
export default function Analytics() {
  const [period, setPeriod] = useState<Period>("7");
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [selected, setSelected] = useState<number[]>([]);
  const [showLegend, setShowLegend] = useState<{ nfc: boolean; views: boolean }>({ nfc: true, views: true });
  const [toast, setToast] = useState<string | null>(null);
  const [actionModal, setActionModal] = useState<ActionModal | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  // ── Filtered + paginated leads ──
  const filtered = useMemo(() =>
    ALL_LEADS.filter(l =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      l.source.toLowerCase().includes(search.toLowerCase())
    ), [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleLeads = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const toggleSelect = (id: number) =>
    setSelected((prev: number[]) => prev.includes(id) ? prev.filter((x: number) => x !== id) : [...prev, id]);
  const toggleAll = () =>
    setSelected((prev: number[]) => prev.length === visibleLeads.length ? [] : visibleLeads.map((l: Lead) => l.id));

  // ── Export ──
  const handleExport = () => {
    const rows = [
      ["No", "Name", "Email", "Source", "Date", "Time", "Engagement"],
      ...ALL_LEADS.map((l, i) => [i + 1, l.name, l.email, l.source, l.date, l.time, l.engagement]),
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "analytics_leads.csv"; a.click();
    URL.revokeObjectURL(url);
    showToast("Exported leads as CSV");
  };

  // ── Chart data ──
  const perfData = ALL_PERFORMANCE[period];
  const stats = STATS[period];
  const totalInteractions = 2547;

  const chartLines = [
    { key: "nfcTaps", label: "NFC Taps", color: "#49B618", grad: "colorNFC", visible: showLegend.nfc },
    { key: "profileViews", label: "Profile Views", color: "#008001", grad: "colorViews", visible: showLegend.views },
  ];

  return (
    <div className="min-h-screen bg-[#000000] p-6 space-y-6 font-mono">
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}

      {/* Action Modal */}
      {actionModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70" onClick={() => setActionModal(null)}>
          <div className="bg-[#0a0a0a] border border-[#49B618]/30 rounded-2xl p-6 w-80 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">
                {actionModal.type === "message" ? "💬 Message" : actionModal.type === "email" ? "✉️ Email" : "📞 Call"} {actionModal.lead.name}
              </h3>
              <button onClick={() => setActionModal(null)}><X className="w-4 h-4 text-[#A0A0A0]" /></button>
            </div>
            <p className="text-sm text-[#A0A0A0] mb-4">{actionModal.lead.email}</p>
            {actionModal.type !== "call" ? (
              <>
                <textarea
                  className="w-full bg-[#1E1E1E] border border-[#008001]/30 text-white text-sm rounded-lg p-3 resize-none h-24 focus:outline-none focus:border-[#49B618]"
                  placeholder={`Write your ${actionModal.type === "email" ? "email" : "message"}…`}
                />
                <button
                  className="w-full mt-3 bg-[#49B618] hover:bg-[#009200] text-white py-2 rounded-lg text-sm font-medium transition-colors"
                  onClick={() => { setActionModal(null); showToast(`${actionModal.type === "email" ? "Email" : "Message"} sent to ${actionModal.lead.name}`); }}
                >
                  Send
                </button>
              </>
            ) : (
              <button
                className="w-full bg-[#49B618] hover:bg-[#009200] text-white py-2 rounded-lg text-sm font-medium transition-colors"
                onClick={() => { setActionModal(null); showToast(`Calling ${actionModal.lead.name}…`); }}
              >
                Start Call
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Analytics</h1>
          <p className="text-sm text-[#A0A0A0] mt-1">Comprehensive insights into your digital card performance</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={e => { setPeriod(e.target.value as Period); setPage(1); }}
            className="w-40 h-10 rounded-lg border border-[#008001]/30 bg-[#000000] text-white text-sm px-3 focus:outline-none focus:border-[#49B618] cursor-pointer"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 h-10 px-4 bg-[#49B618] hover:bg-[#009200] text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* ── Performance Card ── */}
      <div className="rounded-2xl border border-[#008001]/30 bg-[#000000] p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-[#49B618]" />
            <span className="text-base font-semibold text-white">Performance Report</span>
          </div>
          <div className="flex items-center gap-6">
            {/* Clickable legend */}
            {([
              { key: "nfc" as const, color: "#49B618", label: "NFC Taps" },
              { key: "views" as const, color: "#008001", label: "Profile Views" },
            ]).map(l => (
              <button
                key={l.key}
                onClick={() => setShowLegend((prev: { nfc: boolean; views: boolean }) => ({ ...prev, [l.key]: !prev[l.key as keyof typeof prev] }))}
                className={`flex items-center gap-2 transition-opacity ${showLegend[l.key] ? "opacity-100" : "opacity-30"}`}
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: l.color }} />
                <span className="text-xs text-[#A0A0A0]">{l.label}</span>
              </button>
            ))}
            <div className="flex items-center gap-2">
              <Grid3X3 className="w-4 h-4 text-[#A0A0A0]" />
              <button title="Click legend items to toggle data series">
                <Info className="w-4 h-4 text-[#A0A0A0] hover:text-[#49B618]" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mb-8">
          {[
            { label: "Total Taps", val: stats.taps },
            { label: "Profile Views", val: stats.views, border: true },
            { label: "Saved Contacts", val: stats.saved },
          ].map(s => (
            <div key={s.label} className={`text-center py-4 ${s.border ? "border-x border-[#008001]/30" : ""}`}>
              <p className="text-xs text-[#A0A0A0] mb-2">{s.label}</p>
              <p className="text-5xl font-bold text-white">{s.val}</p>
            </div>
          ))}
        </div>

        {/* Area Chart */}
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={perfData}>
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
              <XAxis dataKey="day" tick={{ fill: "#A0A0A0", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#A0A0A0", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#000000", border: "1px solid #008001", borderRadius: "8px", color: "#FFFFFF" }}
              />
              {chartLines.map(l => l.visible && (
                <Area key={l.key} type="monotone" dataKey={l.key} stroke={l.color} strokeWidth={3}
                  fill={`url(#${l.grad})`} name={l.label} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Engagement + Traffic ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement */}
        <div className="lg:col-span-2 rounded-2xl border border-[#008001]/30 bg-[#000000] p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-white">Engagement Breakdown</span>
            <MoreVertical className="w-4 h-4 text-[#A0A0A0]" />
          </div>
          <div className="space-y-2">
            {engagementData.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#1E1E1E] transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${item.color}20` }}>
                    <Icon className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-medium text-white">{item.title}</h4>
                    <p className="text-xs text-[#A0A0A0]">Average click-through rate</p>
                  </div>
                  {/* Mini bar */}
                  <div className="hidden group-hover:block w-24 h-1.5 bg-[#1E1E1E] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: item.avgRate, backgroundColor: item.color }} />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">{item.avgRate}</p>
                    <p className={`text-xs ${item.change > 0 ? "text-[#49B618]" : "text-red-400"}`}>
                      {item.change > 0 ? "▲" : "▼"} VS {item.prevRate} (Prev)
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="rounded-2xl border border-[#008001]/30 bg-[#000000] p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-white">Traffic Sources</span>
            <MoreVertical className="w-4 h-4 text-[#A0A0A0]" />
          </div>
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={trafficSources} cx="50%" cy="50%" innerRadius={60} outerRadius={80}
                    paddingAngle={3} dataKey="value">
                    {trafficSources.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#000000", border: "1px solid #008001", borderRadius: "8px", color: "#fff" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-xs text-[#A0A0A0]">Total</p>
                <p className="text-2xl font-bold text-white">{totalInteractions.toLocaleString()}</p>
              </div>
            </div>
            <div className="w-full space-y-2">
              {trafficSources.map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-sm text-white">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1 bg-[#1E1E1E] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${s.percentage}%`, backgroundColor: s.color }} />
                    </div>
                    <span className="text-xs text-[#A0A0A0] w-8 text-right">{s.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Leads ── */}
      <div className="rounded-2xl border border-[#008001]/30 bg-[#000000] p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-white">Recent Leads</span>
            {selected.length > 0 && (
              <span className="text-xs text-[#49B618] bg-[#49B618]/10 px-2 py-0.5 rounded-full">
                {selected.length} selected
              </span>
            )}
            {selected.length > 0 && (
              <button
                onClick={() => { showToast(`Deleted ${selected.length} lead(s)`); setSelected([]); }}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Delete selected
              </button>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0A0]" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search leads…"
              className="w-64 h-9 pl-9 pr-4 rounded-lg border border-[#008001]/30 bg-[#1E1E1E] text-white text-sm placeholder:text-[#A0A0A0] focus:outline-none focus:border-[#49B618]"
            />
            {search && (
              <button onClick={() => { setSearch(""); setPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-3.5 h-3.5 text-[#A0A0A0] hover:text-white" />
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[#A0A0A0]">
            <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p>No leads match &ldquo;<span className="text-white">{search}</span>&rdquo;</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#008001]/30 bg-[#1E1E1E]">
                    <th className="py-3 px-4">
                      <input type="checkbox"
                        checked={visibleLeads.length > 0 && visibleLeads.every(l => selected.includes(l.id))}
                        onChange={toggleAll}
                        className="accent-[#49B618] cursor-pointer"
                      />
                    </th>
                    {["No", "Contact Name", "Source", "Date", "Engagement", "Actions"].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleLeads.map((lead, idx) => (
                    <tr key={lead.id}
                      className={`border-b border-[#1E1E1E] hover:bg-[#1E1E1E] transition-colors ${selected.includes(lead.id) ? "bg-[#49B618]/5" : ""}`}>
                      <td className="py-4 px-4">
                        <input type="checkbox" checked={selected.includes(lead.id)}
                          onChange={() => toggleSelect(lead.id)}
                          className="accent-[#49B618] cursor-pointer" />
                      </td>
                      <td className="py-4 px-4 text-sm font-medium text-white">
                        {String((currentPage - 1) * PAGE_SIZE + idx + 1).padStart(2, "0")}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#49B618] to-[#008001] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                            {lead.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{lead.name}</p>
                            <p className="text-xs text-[#A0A0A0]">{lead.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium ${srcColor(lead.source)}`}>
                          {srcIcon(lead.source)} {lead.source}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-white">{lead.date}</p>
                        <p className="text-xs text-[#A0A0A0]">{lead.time}</p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < lead.engagement ? "fill-[#49B618] text-[#49B618]" : "text-[#2a2a2a]"}`} />
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setActionModal({ lead, type: "message" })}
                            className="w-8 h-8 rounded-full bg-[#49B618] hover:bg-[#009200] flex items-center justify-center transition-colors"
                            title="Message"
                          >
                            <MessageSquare className="w-4 h-4 text-white" />
                          </button>
                          <button
                            onClick={() => setActionModal({ lead, type: "email" })}
                            className="w-8 h-8 rounded-full bg-[#008001] hover:bg-[#006312] flex items-center justify-center transition-colors"
                            title="Email"
                          >
                            <Mail className="w-4 h-4 text-white" />
                          </button>
                          <button
                            onClick={() => setActionModal({ lead, type: "call" })}
                            className="w-8 h-8 rounded-full bg-[#009200] hover:bg-[#006312] flex items-center justify-center transition-colors"
                            title="Call"
                          >
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
            <div className="flex items-center justify-between mt-6">
              <p className="text-xs text-[#A0A0A0]">
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} leads
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p: number) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#A0A0A0] hover:bg-[#1E1E1E] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${p === currentPage ? "bg-[#008001] text-white" : "text-[#A0A0A0] hover:bg-[#1E1E1E]"
                      }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p: number) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#A0A0A0] hover:bg-[#1E1E1E] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
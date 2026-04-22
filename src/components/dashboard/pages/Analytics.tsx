"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  BarChart2, Download, Info, Mail,
  Globe, Phone, MessageSquare, Star, MoreVertical,
  Search, ChevronLeft, ChevronRight, Check, X,
  TrendingUp, TrendingDown, Smartphone, Users, Eye,
  MapPin, Target, Zap, Activity,
} from "lucide-react";
import {
  getAnalytics,
  getMonthOverMonthPerformance,
  getMonthlyGoal,
  getWeeklyChallenge,
  getLeads,
  AnalyticsData,
  MonthOverMonthPerformance,
  GoalProgressData,
  Lead,
} from "@/lib/api";

// ── Types ──────────────────────────────────────────────────────────────
type Period = "7" | "30" | "90";


// ── Helpers ────────────────────────────────────────────────────────────
const srcBadgeClass = (s: string): string =>
  ({
    NFC:    "bg-[#008001]/20 text-[#49B618] border-[#008001]/30",
    QR:     "bg-[#49B618]/20 text-[#49B618] border-[#49B618]/30",
    DIRECT: "bg-[#009200]/20 text-[#009200] border-[#009200]/30",
    LINK:   "bg-[#006312]/20 text-[#49B618] border-[#006312]/30",
  }[s?.toUpperCase()] ?? "bg-gray-500/20 text-gray-300 border-gray-500/30");

const srcIcon = (s: string): string =>
  ({ NFC: "📱", QR: "⬜", LINK: "🔗", DIRECT: "🌐" }[s?.toUpperCase()] ?? "•");

const countryFlag = (country: string): string => {
  const map: Record<string, string> = {
    "United States": "🇺🇸", "United Kingdom": "🇬🇧", "Canada": "🇨🇦",
    "India": "🇮🇳", "Australia": "🇦🇺", "Germany": "🇩🇪",
    "France": "🇫🇷", "Brazil": "🇧🇷", "Japan": "🇯🇵",
    "Pakistan": "🇵🇰", "UAE": "🇦🇪", "Saudi Arabia": "🇸🇦",
  };
  return map[country] ?? "🌍";
};

const deviceColorMap: Record<string, string> = {
  iOS: "#008001", Android: "#49B618", Desktop: "#006312", UNKNOWN: "#444",
};

const PIE_COLORS = ["#008001", "#49B618", "#009200", "#006312", "#004d00"];

const formatNumber = (n: number): string =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

const changeColor = (v: number) =>
  v > 0 ? "text-[#49B618]" : v < 0 ? "text-red-400" : "text-[#A0A0A0]";

const changeIcon = (v: number) =>
  v > 0 ? <TrendingUp className="w-3 h-3" /> : v < 0 ? <TrendingDown className="w-3 h-3" /> : null;

const PAGE_SIZE = 6;

// ── useInView ──────────────────────────────────────────────────────────
// Fires once when the sentinel element enters the viewport.
function useInView(rootMargin = "200px") {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);
  return [ref, inView] as const;
}

// ── Skeleton ───────────────────────────────────────────────────────────
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded bg-[#1E1E1E] ${className}`} />
  );
}

// ── Toast ──────────────────────────────────────────────────────────────
function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#1E1E1E] border border-[#49B618]/40 rounded-xl px-4 py-3 shadow-2xl">
      <Check className="w-4 h-4 text-[#49B618]" />
      <span className="text-sm text-white">{msg}</span>
      <button onClick={onClose}><X className="w-4 h-4 text-[#A0A0A0] hover:text-white" /></button>
    </div>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────
function StatCard({
  label, value, change, icon: Icon, loading,
}: {
  label: string; value: string; change?: number; icon: React.ElementType; loading: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#008001]/30 bg-[#000000] p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-[#008001]/20 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-[#49B618]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[#A0A0A0] mb-1">{label}</p>
        {loading ? (
          <Skeleton className="h-7 w-20" />
        ) : (
          <p className="text-2xl font-bold text-white">{value}</p>
        )}
      </div>
      {change !== undefined && !loading && (
        <div className={`flex items-center gap-1 text-xs font-medium ${changeColor(change)}`}>
          {changeIcon(change)}
          <span>{change > 0 ? "+" : ""}{change}%</span>
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────
interface AnalyticsProps {
  cardId?: string;
  cardTitle?: string;
}

export default function Analytics({ cardId, cardTitle }: AnalyticsProps = {}) {
  const [period, setPeriod] = useState<Period>("7");
  const [loading, setLoading] = useState(true);
  const [momLoading, setMomLoading] = useState(true);
  const [goalsLoading, setGoalsLoading] = useState(true);
  const [leadsLoading, setLeadsLoading] = useState(true);

  // API data
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [monthOverMonth, setMonthOverMonth] = useState<MonthOverMonthPerformance[]>([]);
  const [monthlyGoal, setMonthlyGoal] = useState<GoalProgressData | null>(null);
  const [weeklyChallenge, setWeeklyChallenge] = useState<GoalProgressData | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsTotal, setLeadsTotal] = useState(0);

  // Intersection sentinels — each fires once when it enters viewport
  const [momRef, momInView] = useInView("150px");
  const [goalsRef, goalsInView] = useInView("150px");
  const [leadsRef, leadsInView] = useInView("150px");

  // UI state
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [showLegend, setShowLegend] = useState({ taps: true, views: true, leads: true });
  const [toast, setToast] = useState<string | null>(null);
  const [leadsPage, setLeadsPage] = useState(1);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  // ── Phase 1: stat cards + chart + funnel + device + sources + locations + top links ──
  useEffect(() => {
    setLoading(true);
    getAnalytics(period, cardId)
      .catch(() => null)
      .then((a) => {
        setAnalytics(a);
        setLoading(false);
      });
  }, [period, cardId]);

  // ── Phase 2: Month-over-Month (deferred until row scrolls into view) ──
  useEffect(() => {
    if (!momInView) return;
    setMomLoading(true);
    getMonthOverMonthPerformance(cardId)
      .catch(() => [])
      .then((mom) => {
        setMonthOverMonth(mom);
        setMomLoading(false);
      });
  }, [momInView, cardId]);

  // ── Phase 3: Goals (deferred until row scrolls into view) ──
  useEffect(() => {
    if (!goalsInView) return;
    setGoalsLoading(true);
    Promise.all([
      getMonthlyGoal(cardId).catch(() => null),
      getWeeklyChallenge(cardId).catch(() => null),
    ]).then(([goal, challenge]) => {
      setMonthlyGoal(goal);
      setWeeklyChallenge(challenge);
      setGoalsLoading(false);
    });
  }, [goalsInView, cardId]);

  // ── Phase 4: Leads (deferred until section scrolls into view) ──
  useEffect(() => {
    if (!leadsInView) return;
    setLeadsLoading(true);
    getLeads(undefined, leadsPage, cardId)
      .then((res) => {
        setLeads(res.leads ?? []);
        setLeadsTotal(res.total ?? 0);
        setLeadsLoading(false);
      })
      .catch(() => setLeadsLoading(false));
  }, [leadsInView, leadsPage, cardId]);

  // ── Client-side lead search ──
  const filteredLeads = useMemo(
    () =>
      leads.filter(
        (l) =>
          l.name.toLowerCase().includes(search.toLowerCase()) ||
          (l.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
          l.source.toLowerCase().includes(search.toLowerCase()),
      ),
    [leads, search],
  );

  const totalLeadPages = Math.max(1, Math.ceil(leadsTotal / PAGE_SIZE));

  const toggleSelect = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const toggleAll = () =>
    setSelected((prev) =>
      prev.length === filteredLeads.length ? [] : filteredLeads.map((l) => l.id),
    );

  // ── Chart data from API ──
  const dailyChartData = useMemo(
    () =>
      (analytics?.daily ?? []).map((d) => ({
        day: d.date.slice(5), // "MM-DD"
        taps: d.taps,
        views: d.views,
        leads: d.leads,
      })),
    [analytics],
  );

  // ── Export leads CSV ──
  const handleExport = () => {
    const rows = [
      ["Name", "Email", "Phone", "Source", "Status", "Date"],
      ...leads.map((l) => [
        l.name,
        l.email ?? "",
        l.phone ?? "",
        l.source,
        l.status,
        new Date(l.createdAt).toLocaleDateString(),
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "analytics_leads.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported leads as CSV");
  };

  // ── Derived values ──
  const totalSources =
    analytics?.sources.reduce((s, x) => s + x.value, 0) || 0;
  const sourcePercentage = (value: number): number =>
    totalSources > 0 ? Math.round((value / totalSources) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#000000] p-6 space-y-6 font-mono">
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}


      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Analytics</h1>
          <p className="text-sm text-[#A0A0A0] mt-1">
            {cardTitle
              ? <>Showing analytics for <span className="text-[#49B618] font-medium">{cardTitle}</span></>
              : "Comprehensive insights into your digital card performance"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => {
              setPeriod(e.target.value as Period);
              setPage(1);
            }}
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

      {/* ── Top Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Taps"
          value={analytics ? formatNumber(analytics.totalTaps) : "0"}
          change={analytics?.thisWeekChange}
          icon={Smartphone}
          loading={loading}
        />
        <StatCard
          label="Profile Views"
          value={analytics ? formatNumber(analytics.totalViews) : "0"}
          icon={Eye}
          loading={loading}
        />
        <StatCard
          label="Total Leads"
          value={analytics ? formatNumber(analytics.totalLeads) : "0"}
          icon={Users}
          loading={loading}
        />
        <StatCard
          label="Engagement Score"
          value={analytics ? `${analytics.engagementScore}%` : "0%"}
          icon={Activity}
          loading={loading}
        />
      </div>

      {/* ── Performance Chart ── */}
      <div className="rounded-2xl border border-[#008001]/30 bg-[#000000] p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-[#49B618]" />
            <span className="text-base font-semibold text-white">Performance Report</span>
          </div>
          <div className="flex items-center gap-6">
            {(
              [
                { key: "taps" as const, color: "#49B618", label: "Taps" },
                { key: "views" as const, color: "#008001", label: "Views" },
                { key: "leads" as const, color: "#006312", label: "Leads" },
              ] as const
            ).map((l) => (
              <button
                key={l.key}
                onClick={() =>
                  setShowLegend((prev) => ({ ...prev, [l.key]: !prev[l.key] }))
                }
                className={`flex items-center gap-2 transition-opacity ${showLegend[l.key] ? "opacity-100" : "opacity-30"}`}
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: l.color }} />
                <span className="text-xs text-[#A0A0A0]">{l.label}</span>
              </button>
            ))}
            <button title="Click legend to toggle series">
              <Info className="w-4 h-4 text-[#A0A0A0] hover:text-[#49B618]" />
            </button>
          </div>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-3 gap-8 mb-8">
          {[
            { label: "Total Taps", val: analytics?.totalTaps ?? 0 },
            { label: "Profile Views", val: analytics?.totalViews ?? 0, border: true },
            { label: "Total Leads", val: analytics?.totalLeads ?? 0 },
          ].map((s) => (
            <div
              key={s.label}
              className={`text-center py-4 ${s.border ? "border-x border-[#008001]/30" : ""}`}
            >
              <p className="text-xs text-[#A0A0A0] mb-2">{s.label}</p>
              {loading ? (
                <Skeleton className="h-12 w-24 mx-auto" />
              ) : (
                <p className="text-5xl font-bold text-white">
                  {s.val.toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="h-72">
          {loading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <AreaChart data={dailyChartData}>
                <defs>
                  <linearGradient id="colorTaps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#49B618" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#49B618" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#008001" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#008001" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#006312" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#006312" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="0"
                  stroke="#008001"
                  strokeOpacity={0.2}
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "#A0A0A0", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#A0A0A0", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#000000",
                    border: "1px solid #008001",
                    borderRadius: "8px",
                    color: "#FFFFFF",
                  }}
                />
                {showLegend.taps && (
                  <Area
                    type="monotone"
                    dataKey="taps"
                    stroke="#49B618"
                    strokeWidth={3}
                    fill="url(#colorTaps)"
                    name="Taps"
                  />
                )}
                {showLegend.views && (
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#008001"
                    strokeWidth={3}
                    fill="url(#colorViews)"
                    name="Views"
                  />
                )}
                {showLegend.leads && (
                  <Area
                    type="monotone"
                    dataKey="leads"
                    stroke="#006312"
                    strokeWidth={2}
                    fill="url(#colorLeads)"
                    name="Leads"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Row 2: Conversion Funnel + Device Distribution + Traffic Sources ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversion Funnel */}
        <div className="rounded-2xl border border-[#008001]/30 bg-[#000000] p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-base font-semibold text-white">Conversion Funnel</span>
            <Zap className="w-4 h-4 text-[#49B618]" />
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {(analytics?.funnelSteps ?? []).map((step, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-white">{step.label}</span>
                    <span className="text-xs text-[#A0A0A0]">
                      {step.value.toLocaleString()} · {step.percentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-[#1E1E1E] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${step.percentage}%`,
                        backgroundColor: i === 0 ? "#49B618" : i === 1 ? "#008001" : i === 2 ? "#009200" : "#006312",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Device Distribution */}
        <div className="rounded-2xl border border-[#008001]/30 bg-[#000000] p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-base font-semibold text-white">Device Distribution</span>
            <Smartphone className="w-4 h-4 text-[#49B618]" />
          </div>
          {loading ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <>
              <div className="relative w-40 h-40 mx-auto mb-4">
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                  <PieChart>
                    <Pie
                      data={analytics?.deviceDistribution ?? []}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {(analytics?.deviceDistribution ?? []).map((entry, i) => (
                        <Cell
                          key={i}
                          fill={deviceColorMap[entry.name] ?? PIE_COLORS[i % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#000000",
                        border: "1px solid #008001",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                      formatter={(val) => [`${Number(val ?? 0)}%`, ""]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {(analytics?.deviceDistribution ?? []).map((d, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: deviceColorMap[d.name] ?? PIE_COLORS[i % PIE_COLORS.length] }}
                      />
                      <span className="text-sm text-white">{d.name}</span>
                    </div>
                    <span className="text-xs text-[#A0A0A0]">
                      {d.value}% · {d.count}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Traffic Sources */}
        <div className="rounded-2xl border border-[#008001]/30 bg-[#000000] p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-base font-semibold text-white">Traffic Sources</span>
            <MoreVertical className="w-4 h-4 text-[#A0A0A0]" />
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
            </div>
          ) : (
            <>
              <div className="text-center mb-4">
                <p className="text-3xl font-bold text-white">{totalSources.toLocaleString()}</p>
                <p className="text-xs text-[#A0A0A0]">Total Interactions</p>
              </div>
              <div className="space-y-3">
                {(analytics?.sources ?? []).map((s, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-white">{s.name}</span>
                      <span className="text-xs text-[#A0A0A0]">{sourcePercentage(s.value)}%</span>
                    </div>
                    <div className="h-1.5 bg-[#1E1E1E] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${sourcePercentage(s.value)}%`,
                          backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Row 3 sentinel: triggers MOM + Locations fetch on scroll ── */}
      <div ref={momRef} />

      {/* ── Row 3: Month-over-Month + Top Locations ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Month-over-Month */}
        <div className="rounded-2xl border border-[#008001]/30 bg-[#000000] p-6">
          <div className="flex items-center justify-between mb-5">
            <span className="text-base font-semibold text-white">Month-over-Month</span>
            <TrendingUp className="w-4 h-4 text-[#49B618]" />
          </div>
          {momLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={180} minWidth={1} minHeight={1}>
              <BarChart
                data={monthOverMonth}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" vertical={false} />
                <XAxis
                  dataKey="metric"
                  tick={{ fill: "#A0A0A0", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#A0A0A0", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#000000",
                    border: "1px solid #008001",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="lastMonth" fill="#1E1E1E" radius={[4, 4, 0, 0]} name="Last Month" />
                <Bar dataKey="thisMonth" fill="#49B618" radius={[4, 4, 0, 0]} name="This Month" />
              </BarChart>
            </ResponsiveContainer>
          )}
          {!momLoading && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              {monthOverMonth.map((m, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#1E1E1E]">
                  <div>
                    <p className="text-xs text-[#A0A0A0]">{m.metric}</p>
                    <p className="text-sm font-semibold text-white">{m.thisMonth.toLocaleString()}</p>
                  </div>
                  <span className={`text-xs font-medium flex items-center gap-0.5 ${changeColor(m.change)}`}>
                    {changeIcon(m.change)}
                    {m.change > 0 ? "+" : ""}{m.change}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Locations */}
        <div className="rounded-2xl border border-[#008001]/30 bg-[#000000] p-6">
          <div className="flex items-center justify-between mb-5">
            <span className="text-base font-semibold text-white">Top Locations</span>
            <MapPin className="w-4 h-4 text-[#49B618]" />
          </div>
          {momLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {(analytics?.topLocations ?? []).map((loc, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xl flex-shrink-0">{countryFlag(loc.country)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-white truncate">{loc.country}</span>
                      <span className="text-xs text-[#A0A0A0] ml-2 flex-shrink-0">
                        {loc.visitors.toLocaleString()} · {loc.percentage}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#1E1E1E] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${loc.percentage}%`,
                          backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Row 4 sentinel: triggers Goals fetch on scroll ── */}
      <div ref={goalsRef} />

      {/* ── Row 4: Goals + Top Links ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Goal */}
        <div className="rounded-2xl border border-[#008001]/30 bg-[#000000] p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-base font-semibold text-white">Monthly Goal</span>
            <Target className="w-4 h-4 text-[#49B618]" />
          </div>
          {goalsLoading || !monthlyGoal ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <>
              <p className="text-xs text-[#A0A0A0] mb-1">{monthlyGoal.metric}</p>
              <div className="flex items-end gap-2 mb-3">
                <p className="text-3xl font-bold text-white">
                  {monthlyGoal.current.toLocaleString()}
                </p>
                <p className="text-sm text-[#A0A0A0] pb-1">/ {monthlyGoal.target.toLocaleString()}</p>
              </div>
              <div className="h-3 bg-[#1E1E1E] rounded-full overflow-hidden mb-2">
                <div
                  className="h-full rounded-full bg-[#49B618] transition-all duration-1000"
                  style={{ width: `${monthlyGoal.percentage}%` }}
                />
              </div>
              <div className="flex justify-between">
                <p className="text-xs text-[#49B618]">{monthlyGoal.percentage}% complete</p>
                <p className="text-xs text-[#A0A0A0]">{monthlyGoal.statusText}</p>
              </div>
            </>
          )}
        </div>

        {/* Weekly Challenge */}
        <div className="rounded-2xl border border-[#008001]/30 bg-[#000000] p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-base font-semibold text-white">Weekly Challenge</span>
            <Zap className="w-4 h-4 text-[#49B618]" />
          </div>
          {goalsLoading || !weeklyChallenge ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <>
              <p className="text-xs text-[#A0A0A0] mb-1">{weeklyChallenge.metric}</p>
              <div className="flex items-end gap-2 mb-3">
                <p className="text-3xl font-bold text-white">
                  {weeklyChallenge.current}
                </p>
                <p className="text-sm text-[#A0A0A0] pb-1">/ {weeklyChallenge.target}</p>
              </div>
              <div className="h-3 bg-[#1E1E1E] rounded-full overflow-hidden mb-2">
                <div
                  className="h-full rounded-full bg-[#49B618] transition-all duration-1000"
                  style={{ width: `${weeklyChallenge.percentage}%` }}
                />
              </div>
              <div className="flex justify-between">
                <p className="text-xs text-[#49B618]">{weeklyChallenge.percentage}% complete</p>
                <p className="text-xs text-[#A0A0A0]">{weeklyChallenge.statusText}</p>
              </div>
            </>
          )}
        </div>

        {/* Top Links */}
        <div className="rounded-2xl border border-[#008001]/30 bg-[#000000] p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-base font-semibold text-white">Top Links</span>
            <Globe className="w-4 h-4 text-[#49B618]" />
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
            </div>
          ) : (analytics?.topLinks ?? []).length === 0 ? (
            <p className="text-sm text-[#A0A0A0] text-center py-8">No link clicks yet</p>
          ) : (
            <div className="space-y-3">
              {(analytics?.topLinks ?? []).map((link, i) => (
                <div key={link.id} className="flex items-center gap-3">
                  <span className="text-xs text-[#A0A0A0] w-4 flex-shrink-0">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-white truncate">{link.label}</span>
                      <span className="text-xs text-[#A0A0A0] ml-2 flex-shrink-0">
                        {link.clicks} · {link.percentage}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#1E1E1E] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#49B618]"
                        style={{ width: `${link.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Leads sentinel: triggers Leads fetch on scroll ── */}
      <div ref={leadsRef} />

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
                onClick={() => {
                  showToast(`Deleted ${selected.length} lead(s)`);
                  setSelected([]);
                }}
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
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search leads…"
              className="w-64 h-9 pl-9 pr-4 rounded-lg border border-[#008001]/30 bg-[#1E1E1E] text-white text-sm placeholder:text-[#A0A0A0] focus:outline-none focus:border-[#49B618]"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-3.5 h-3.5 text-[#A0A0A0] hover:text-white" />
              </button>
            )}
          </div>
        </div>

        {leadsLoading ? (
          <div className="space-y-3">
            {[...Array(PAGE_SIZE)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-16 text-[#A0A0A0]">
            <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p>
              {search
                ? <>No leads match &ldquo;<span className="text-white">{search}</span>&rdquo;</>
                : "No leads yet"}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#008001]/30 bg-[#1E1E1E]">
                    <th className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={
                          filteredLeads.length > 0 &&
                          filteredLeads.every((l) => selected.includes(l.id))
                        }
                        onChange={toggleAll}
                        className="accent-[#49B618] cursor-pointer"
                      />
                    </th>
                    {["No", "Contact", "Source", "Date", "Engagement", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="text-left py-3 px-4 text-xs font-medium text-[#A0A0A0] uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead, idx) => {
                    const initials = lead.name
                      .split(" ")
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase();
                    return (
                      <tr
                        key={lead.id}
                        className={`border-b border-[#1E1E1E] hover:bg-[#1E1E1E] transition-colors ${selected.includes(lead.id) ? "bg-[#49B618]/5" : ""}`}
                      >
                        <td className="py-4 px-4">
                          <input
                            type="checkbox"
                            checked={selected.includes(lead.id)}
                            onChange={() => toggleSelect(lead.id)}
                            className="accent-[#49B618] cursor-pointer"
                          />
                        </td>
                        <td className="py-4 px-4 text-sm font-medium text-white">
                          {String((leadsPage - 1) * PAGE_SIZE + idx + 1).padStart(2, "0")}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#49B618] to-[#008001] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                              {initials}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{lead.name}</p>
                              <p className="text-xs text-[#A0A0A0]">{lead.email ?? lead.phone ?? "—"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium ${srcBadgeClass(lead.source)}`}
                          >
                            {srcIcon(lead.source)} {lead.source}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-white">
                            {new Date(lead.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-xs text-[#A0A0A0]">
                            {new Date(lead.createdAt).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.round(lead.engagementScore / 20) ? "fill-[#49B618] text-[#49B618]" : "text-[#2a2a2a]"}`}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <a
                              href={lead.phone ? `sms:${lead.phone}` : undefined}
                              onClick={!lead.phone ? (e) => { e.preventDefault(); showToast("No phone number for this lead"); } : undefined}
                              className="w-8 h-8 rounded-full bg-[#49B618] hover:bg-[#009200] flex items-center justify-center transition-colors"
                              title="Message"
                            >
                              <MessageSquare className="w-4 h-4 text-white" />
                            </a>
                            <a
                              href={lead.email ? `mailto:${lead.email}` : undefined}
                              onClick={!lead.email ? (e) => { e.preventDefault(); showToast("No email for this lead"); } : undefined}
                              className="w-8 h-8 rounded-full bg-[#008001] hover:bg-[#006312] flex items-center justify-center transition-colors"
                              title="Email"
                            >
                              <Mail className="w-4 h-4 text-white" />
                            </a>
                            <a
                              href={lead.phone ? `tel:${lead.phone}` : undefined}
                              onClick={!lead.phone ? (e) => { e.preventDefault(); showToast("No phone number for this lead"); } : undefined}
                              className="w-8 h-8 rounded-full bg-[#009200] hover:bg-[#006312] flex items-center justify-center transition-colors"
                              title="Call"
                            >
                              <Phone className="w-4 h-4 text-white" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <p className="text-xs text-[#A0A0A0]">
                Page {leadsPage} of {totalLeadPages} · {leadsTotal} leads total
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setLeadsPage((p) => Math.max(1, p - 1))}
                  disabled={leadsPage === 1}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#A0A0A0] hover:bg-[#1E1E1E] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(totalLeadPages, 5) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setLeadsPage(p)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                      p === leadsPage
                        ? "bg-[#008001] text-white"
                        : "text-[#A0A0A0] hover:bg-[#1E1E1E]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setLeadsPage((p) => Math.min(totalLeadPages, p + 1))}
                  disabled={leadsPage === totalLeadPages}
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
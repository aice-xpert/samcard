"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supabase_1 = require("../config/supabase");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const getErrorMessage = (error) => error instanceof Error ? error.message : "Internal server error";
const ZERO_DEVICE_DISTRIBUTION = [
    { name: "iOS", value: 0, count: 0 },
    { name: "Android", value: 0, count: 0 },
    { name: "Desktop", value: 0, count: 0 },
];
const ZERO_FUNNEL_STEPS = [
    { label: "NFC Tapped", value: 0, percentage: 0 },
    { label: "Link Clicked", value: 0, percentage: 0 },
    { label: "Contact Saved", value: 0, percentage: 0 },
    { label: "Card Shared", value: 0, percentage: 0 },
];
const ZERO_TOP_LOCATIONS = [{ country: "No Data", visitors: 0, percentage: 0 }];
const ZERO_MONTH_OVER_MONTH = [
    { metric: "Taps", thisMonth: 0, lastMonth: 0, change: 0 },
    { metric: "Visitors", thisMonth: 0, lastMonth: 0, change: 0 },
    { metric: "Leads", thisMonth: 0, lastMonth: 0, change: 0 },
    { metric: "Link Clicks", thisMonth: 0, lastMonth: 0, change: 0 },
];
const ZERO_MONTHLY_GOAL = {
    name: "Monthly Goal",
    metric: "Profile Taps",
    current: 0,
    target: 2000,
    percentage: 0,
    statusText: "No progress yet",
};
const ZERO_WEEKLY_CHALLENGE = {
    name: "Weekly Challenge",
    metric: "New Saves",
    current: 0,
    target: 50,
    percentage: 0,
    statusText: "No progress yet",
};
const parsePeriod = (periodQuery) => {
    if (periodQuery === "30" || periodQuery === "90") {
        return periodQuery;
    }
    return "7";
};
const getDaysFromPeriod = (period) => {
    if (period === "30")
        return 30;
    if (period === "90")
        return 90;
    return 7;
};
async function buildAnalyticsPayload(uid, periodQuery) {
    const period = parsePeriod(periodQuery);
    const days = getDaysFromPeriod(period);
    const { data: profile } = await supabase_1.supabase
        .from("BusinessProfile")
        .select("id, name, title, company, tagline, profileImageUrl, primaryEmail, primaryPhone, website, address, city, country")
        .eq("userId", uid)
        .single();
    if (!profile) {
        const daily = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            daily.push({ date: date.toISOString().split("T")[0], taps: 0, views: 0, leads: 0 });
        }
        return {
            totalTaps: 0,
            totalViews: 0,
            totalLeads: 0,
            profileCompletion: 0,
            engagementScore: 0,
            thisWeekChange: 0,
            period,
            daily,
            sources: [],
            deviceDistribution: ZERO_DEVICE_DISTRIBUTION,
            funnelSteps: ZERO_FUNNEL_STEPS,
            topLocations: ZERO_TOP_LOCATIONS,
            topLinks: [],
        };
    }
    const { data: cards } = await supabase_1.supabase
        .from("Card")
        .select("id")
        .eq("businessProfileId", profile.id);
    const cardIds = cards?.map((c) => c.id) || [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const { data: interactions } = cardIds.length > 0
        ? await supabase_1.supabase
            .from("CardInteraction")
            .select("type, createdAt, deviceType, country")
            .in("cardId", cardIds)
            .gte("createdAt", startDate.toISOString())
        : { data: [] };
    const { data: leads } = await supabase_1.supabase
        .from("Lead")
        .select("createdAt")
        .eq("businessProfileId", profile.id)
        .gte("createdAt", startDate.toISOString());
    const dailyMap = {};
    for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const key = date.toISOString().split("T")[0];
        dailyMap[key] = { taps: 0, views: 0, leads: 0 };
    }
    interactions?.forEach(interaction => {
        const date = interaction.createdAt.split("T")[0];
        if (dailyMap[date]) {
            if (interaction.type === "tap" || interaction.type === "scan") {
                dailyMap[date].taps++;
            }
            if (interaction.type === "view") {
                dailyMap[date].views++;
            }
        }
    });
    leads?.forEach(lead => {
        const date = lead.createdAt.split("T")[0];
        if (dailyMap[date]) {
            dailyMap[date].leads++;
        }
    });
    const daily = Object.entries(dailyMap)
        .map(([date, stats]) => ({
        date,
        ...stats,
    }))
        .sort((a, b) => a.date.localeCompare(b.date));
    const totalTaps = interactions?.filter(i => i.type === "tap" || i.type === "scan").length || 0;
    const totalViews = interactions?.filter(i => i.type === "view").length || 0;
    const totalLeads = leads?.length || 0;
    const completionFields = [
        profile.name,
        profile.title,
        profile.company,
        profile.tagline,
        profile.profileImageUrl,
        profile.primaryEmail,
        profile.primaryPhone,
        profile.website,
        profile.address,
        profile.city,
        profile.country,
    ];
    const filledCompletionFields = completionFields.filter(Boolean).length;
    const profileCompletion = Math.min(100, Math.round((filledCompletionFields / completionFields.length) * 100));
    const weightedEngagement = totalTaps + Math.round(totalViews * 0.5) + totalLeads * 3;
    const engagementScore = Math.min(100, Math.round(Math.sqrt(weightedEngagement) * 3.2));
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);
    const prevWeekStart = new Date(now);
    prevWeekStart.setDate(now.getDate() - 14);
    const inCurrentWeek = (isoDate) => new Date(isoDate) >= weekStart;
    const inPreviousWeek = (isoDate) => {
        const date = new Date(isoDate);
        return date >= prevWeekStart && date < weekStart;
    };
    const currentWeekInteractions = interactions?.filter(item => inCurrentWeek(item.createdAt)).length || 0;
    const prevWeekInteractions = interactions?.filter(item => inPreviousWeek(item.createdAt)).length || 0;
    const currentWeekLeads = leads?.filter(item => inCurrentWeek(item.createdAt)).length || 0;
    const prevWeekLeads = leads?.filter(item => inPreviousWeek(item.createdAt)).length || 0;
    const currentWeekTotal = currentWeekInteractions + currentWeekLeads * 2;
    const prevWeekTotal = prevWeekInteractions + prevWeekLeads * 2;
    const thisWeekChange = prevWeekTotal === 0
        ? (currentWeekTotal > 0 ? 100 : 0)
        : Math.round(((currentWeekTotal - prevWeekTotal) / prevWeekTotal) * 100);
    const sources = [
        { name: "NFC", value: Math.floor(totalTaps * 0.4), percentage: 40 },
        { name: "QR", value: Math.floor(totalTaps * 0.3), percentage: 30 },
        { name: "Direct", value: Math.floor(totalTaps * 0.2), percentage: 20 },
        { name: "Other", value: Math.floor(totalTaps * 0.1), percentage: 10 },
    ];
    const deviceMap = {};
    interactions?.forEach(interaction => {
        const device = interaction.deviceType || "UNKNOWN";
        deviceMap[device] = (deviceMap[device] || 0) + 1;
    });
    const totalDeviceInteractions = Object.values(deviceMap).reduce((a, b) => a + b, 0);
    const deviceDistribution = Object.entries(deviceMap)
        .map(([name, value]) => ({
        name: name === "IOS" ? "iOS" : name === "ANDROID" ? "Android" : name === "DESKTOP" ? "Desktop" : name,
        value: totalDeviceInteractions > 0 ? Math.round((value / totalDeviceInteractions) * 100) : 0,
        count: value,
    }))
        .sort((a, b) => b.value - a.value);
    const tapCount = interactions?.filter(i => i.type === "tap" || i.type === "scan").length || 0;
    const { data: linkClicks } = cardIds.length > 0
        ? await supabase_1.supabase
            .from("CardInteraction")
            .select("type")
            .in("cardId", cardIds)
            .eq("type", "link_click")
            .gte("createdAt", startDate.toISOString())
        : { data: [] };
    const linkClickCount = linkClicks?.length || 0;
    const { data: saves } = cardIds.length > 0
        ? await supabase_1.supabase
            .from("CardInteraction")
            .select("type")
            .in("cardId", cardIds)
            .eq("type", "save")
            .gte("createdAt", startDate.toISOString())
        : { data: [] };
    const saveCount = saves?.length || 0;
    const { data: shares } = cardIds.length > 0
        ? await supabase_1.supabase
            .from("CardShare")
            .select("id")
            .in("cardId", cardIds)
            .gte("createdAt", startDate.toISOString())
        : { data: [] };
    const shareCount = shares?.length || 0;
    const funnelSteps = [
        { label: "NFC Tapped", value: tapCount, percentage: tapCount > 0 ? 100 : 0 },
        { label: "Link Clicked", value: linkClickCount, percentage: tapCount > 0 ? Math.round((linkClickCount / tapCount) * 100) : 0 },
        { label: "Contact Saved", value: saveCount, percentage: tapCount > 0 ? Math.round((saveCount / tapCount) * 100) : 0 },
        { label: "Card Shared", value: shareCount, percentage: tapCount > 0 ? Math.round((shareCount / tapCount) * 100) : 0 },
    ];
    const countryMap = {};
    interactions?.forEach(interaction => {
        if (interaction.country) {
            countryMap[interaction.country] = (countryMap[interaction.country] || 0) + 1;
        }
    });
    const totalLocationInteractions = Object.values(countryMap).reduce((a, b) => a + b, 0);
    const topLocations = Object.entries(countryMap)
        .map(([country, visitors]) => ({
        country,
        visitors,
        percentage: totalLocationInteractions > 0 ? Math.round((visitors / totalLocationInteractions) * 100) : 0,
    }))
        .sort((a, b) => b.visitors - a.visitors)
        .slice(0, 5);
    const { data: clickData } = cardIds.length > 0
        ? await supabase_1.supabase
            .from("CardInteraction")
            .select("linkLabel, linkId")
            .in("cardId", cardIds)
            .eq("type", "link_click")
            .gte("createdAt", startDate.toISOString())
        : { data: [] };
    const linkMap = {};
    clickData?.forEach(click => {
        const key = click.linkId || click.linkLabel || "unknown";
        if (!linkMap[key]) {
            linkMap[key] = { count: 0, label: click.linkLabel || "Unknown" };
        }
        linkMap[key].count++;
    });
    const totalClicks = Object.values(linkMap).reduce((a, b) => a + b.count, 0);
    const topLinks = Object.entries(linkMap)
        .map(([id, { count, label }]) => ({
        id,
        label,
        clicks: count,
        percentage: totalClicks > 0 ? Math.round((count / totalClicks) * 100) : 0,
    }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 5);
    return {
        totalTaps,
        totalViews,
        totalLeads,
        profileCompletion,
        engagementScore,
        thisWeekChange,
        period,
        daily,
        sources,
        deviceDistribution: deviceDistribution.length > 0 ? deviceDistribution : ZERO_DEVICE_DISTRIBUTION,
        funnelSteps,
        topLocations: topLocations.length > 0 ? topLocations : ZERO_TOP_LOCATIONS,
        topLinks,
    };
}
async function buildMonthOverMonthPerformance(uid) {
    const { data: profile } = await supabase_1.supabase
        .from("BusinessProfile")
        .select("id")
        .eq("userId", uid)
        .single();
    if (!profile) {
        return ZERO_MONTH_OVER_MONTH;
    }
    const { data: cards } = await supabase_1.supabase
        .from("Card")
        .select("id")
        .eq("businessProfileId", profile.id);
    const cardIds = cards?.map((c) => c.id) || [];
    if (cardIds.length === 0) {
        return ZERO_MONTH_OVER_MONTH;
    }
    const now = new Date();
    const monthStart = new Date(now);
    monthStart.setDate(now.getDate() - 30);
    const previousMonthStart = new Date(now);
    previousMonthStart.setDate(now.getDate() - 60);
    const { data: interactions } = await supabase_1.supabase
        .from("CardInteraction")
        .select("type, createdAt")
        .in("cardId", cardIds)
        .gte("createdAt", previousMonthStart.toISOString());
    const { data: leads } = await supabase_1.supabase
        .from("Lead")
        .select("createdAt")
        .eq("businessProfileId", profile.id)
        .gte("createdAt", previousMonthStart.toISOString());
    const inThisMonth = (isoDate) => new Date(isoDate) >= monthStart;
    const inLastMonth = (isoDate) => {
        const date = new Date(isoDate);
        return date >= previousMonthStart && date < monthStart;
    };
    const countInteractions = (predicate, windowPredicate) => interactions?.filter(item => predicate(item.type) && windowPredicate(item.createdAt)).length || 0;
    const thisMonthTaps = countInteractions(type => type === "tap" || type === "scan", inThisMonth);
    const lastMonthTaps = countInteractions(type => type === "tap" || type === "scan", inLastMonth);
    const thisMonthVisitors = countInteractions(type => type === "view", inThisMonth);
    const lastMonthVisitors = countInteractions(type => type === "view", inLastMonth);
    const thisMonthLinkClicks = countInteractions(type => type === "link_click", inThisMonth);
    const lastMonthLinkClicks = countInteractions(type => type === "link_click", inLastMonth);
    const thisMonthLeads = leads?.filter(item => inThisMonth(item.createdAt)).length || 0;
    const lastMonthLeads = leads?.filter(item => inLastMonth(item.createdAt)).length || 0;
    const withChange = (metric, thisMonth, lastMonth) => ({
        metric,
        thisMonth,
        lastMonth,
        change: lastMonth === 0 ? (thisMonth > 0 ? 100 : 0) : Number((((thisMonth - lastMonth) / lastMonth) * 100).toFixed(1)),
    });
    return [
        withChange("Taps", thisMonthTaps, lastMonthTaps),
        withChange("Visitors", thisMonthVisitors, lastMonthVisitors),
        withChange("Leads", thisMonthLeads, lastMonthLeads),
        withChange("Link Clicks", thisMonthLinkClicks, lastMonthLinkClicks),
    ];
}
async function buildMonthlyGoal(uid) {
    const target = 2000;
    const { data: profile } = await supabase_1.supabase
        .from("BusinessProfile")
        .select("id")
        .eq("userId", uid)
        .single();
    if (!profile) {
        return ZERO_MONTHLY_GOAL;
    }
    const { data: cards } = await supabase_1.supabase
        .from("Card")
        .select("id")
        .eq("businessProfileId", profile.id);
    const cardIds = cards?.map((c) => c.id) || [];
    if (cardIds.length === 0) {
        return ZERO_MONTHLY_GOAL;
    }
    const monthStart = new Date();
    monthStart.setDate(monthStart.getDate() - 30);
    const { data: interactions } = await supabase_1.supabase
        .from("CardInteraction")
        .select("type")
        .in("cardId", cardIds)
        .in("type", ["tap", "scan"])
        .gte("createdAt", monthStart.toISOString());
    const current = interactions?.length || 0;
    const percentage = Math.min(100, Math.round((current / target) * 100));
    return {
        name: "Monthly Goal",
        metric: "Profile Taps",
        current,
        target,
        percentage,
        statusText: current >= target
            ? "Goal reached!"
            : current >= Math.round(target * 0.6)
                ? "You are on track to hit your goal!"
                : "Keep going to reach your target",
    };
}
async function buildWeeklyChallenge(uid) {
    const target = 50;
    const { data: profile } = await supabase_1.supabase
        .from("BusinessProfile")
        .select("id")
        .eq("userId", uid)
        .single();
    if (!profile) {
        return ZERO_WEEKLY_CHALLENGE;
    }
    const { data: cards } = await supabase_1.supabase
        .from("Card")
        .select("id")
        .eq("businessProfileId", profile.id);
    const cardIds = cards?.map((c) => c.id) || [];
    if (cardIds.length === 0) {
        return ZERO_WEEKLY_CHALLENGE;
    }
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const { data: saves } = await supabase_1.supabase
        .from("CardInteraction")
        .select("id")
        .in("cardId", cardIds)
        .eq("type", "save")
        .gte("createdAt", weekStart.toISOString());
    const current = saves?.length || 0;
    const percentage = Math.min(100, Math.round((current / target) * 100));
    const remaining = Math.max(0, target - current);
    return {
        name: "Weekly Challenge",
        metric: "New Saves",
        current,
        target,
        percentage,
        statusText: remaining === 0
            ? "Challenge completed!"
            : `${remaining} more to unlock bonus rewards!`,
    };
}
router.get("/", auth_1.verifySession, async (req, res) => {
    try {
        const data = await buildAnalyticsPayload(req.user.uid, req.query.period);
        return res.json(data);
    }
    catch (error) {
        return res.status(500).json({ error: getErrorMessage(error) });
    }
});
router.get("/device-distribution", auth_1.verifySession, async (req, res) => {
    try {
        const data = await buildAnalyticsPayload(req.user.uid, req.query.period);
        return res.json(data.deviceDistribution.length > 0 ? data.deviceDistribution : ZERO_DEVICE_DISTRIBUTION);
    }
    catch (error) {
        return res.status(500).json({ error: getErrorMessage(error) });
    }
});
router.get("/conversion-funnel", auth_1.verifySession, async (req, res) => {
    try {
        const data = await buildAnalyticsPayload(req.user.uid, req.query.period);
        return res.json(data.funnelSteps.length > 0 ? data.funnelSteps : ZERO_FUNNEL_STEPS);
    }
    catch (error) {
        return res.status(500).json({ error: getErrorMessage(error) });
    }
});
router.get("/top-locations", auth_1.verifySession, async (req, res) => {
    try {
        const data = await buildAnalyticsPayload(req.user.uid, req.query.period);
        return res.json(data.topLocations.length > 0 ? data.topLocations : ZERO_TOP_LOCATIONS);
    }
    catch (error) {
        return res.status(500).json({ error: getErrorMessage(error) });
    }
});
router.get("/month-over-month", auth_1.verifySession, async (req, res) => {
    try {
        const data = await buildMonthOverMonthPerformance(req.user.uid);
        return res.json(data.length > 0 ? data : ZERO_MONTH_OVER_MONTH);
    }
    catch (error) {
        return res.status(500).json({ error: getErrorMessage(error) });
    }
});
router.get("/monthly-goal", auth_1.verifySession, async (req, res) => {
    try {
        const data = await buildMonthlyGoal(req.user.uid);
        return res.json(data);
    }
    catch (error) {
        return res.status(500).json({ error: getErrorMessage(error) });
    }
});
router.get("/weekly-challenge", auth_1.verifySession, async (req, res) => {
    try {
        const data = await buildWeeklyChallenge(req.user.uid);
        return res.json(data);
    }
    catch (error) {
        return res.status(500).json({ error: getErrorMessage(error) });
    }
});
exports.default = router;
//# sourceMappingURL=analytics.js.map
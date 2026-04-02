export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ||
  process.env.BACKEND_URL?.replace(/\/$/, "") ||
  "";

const jsonHeaders = {
  "Content-Type": "application/json",
};

function getSessionToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("sessionToken");
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const sessionToken = getSessionToken();
  const headers: HeadersInit = {
    ...jsonHeaders,
    ...(init?.headers || {}),
  };
  if (sessionToken) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${sessionToken}`;
  }
  
  const fullUrl = BACKEND_URL ? `${BACKEND_URL}${path}` : path;
  console.log('→ API call:', fullUrl);
  
  const response = await fetch(fullUrl, {
    credentials: "include",
    cache: "no-store",
    ...init,
    headers,
  });

  let payload: { error?: string } | null = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.error || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return payload as T;
}

// ─── User Profile ───────────────────────────────────────────────────
export interface ApiUser {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  avatar: string | null;
  timezone: string;
  language: string;
  theme: string;
  profilePublic: boolean;
  showEmail: boolean;
  showPhone: boolean;
  planTier: string;
  subscriptionStatus: string;
  subscriptionEndsAt: string | null;
  maxCards: number;
  maxTaps: number;
  maxStorageMb: number;
  maxLeads: number;
  totalCards: number;
  totalTaps: number;
  totalViews: number;
  totalLeads: number;
}

export interface UpdateUserPayload {
  name?: string;
  phone?: string;
  avatar?: string;
  timezone?: string;
  language?: string;
  theme?: string;
  compactMode?: boolean;
  profilePublic?: boolean;
  showEmail?: boolean;
  showPhone?: boolean;
  analyticsOptIn?: boolean;
}

export async function getUserProfile() {
  return apiRequest<ApiUser>("/api/user/profile", { method: "GET" });
}

export async function updateUserProfile(payload: UpdateUserPayload) {
  return apiRequest<ApiUser>("/api/user/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// ─── Business Profile ───────────────────────────────────────────────
export interface ApiBusinessProfile {
  id: string;
  userId: string;
  name: string;
  slug: string;
  title: string | null;
  company: string | null;
  tagline: string | null;
  profileImageUrl: string | null;
  coverImageUrl: string | null;
  brandLogoUrl: string | null;
  logoPosition: string;
  primaryEmail: string | null;
  primaryPhone: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  shareUrl: string | null;
  completionScore?: number;
}

export interface UpdateBusinessProfilePayload {
  name: string;
  title?: string;
  company?: string;
  tagline?: string;
  profileImageUrl?: string;
  coverImageUrl?: string;
  brandLogoUrl?: string;
  logoPosition?: string;
  primaryEmail?: string;
  primaryPhone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

export async function getBusinessProfile(): Promise<ApiBusinessProfile | null> {
  try {
    return await apiRequest<ApiBusinessProfile>("/api/user/business-profile", { method: "GET" });
  } catch (e) {
    if (e instanceof Error && e.message.includes("404")) return null;
    throw e;
  }
}

export async function updateBusinessProfile(payload: UpdateBusinessProfilePayload) {
  return apiRequest<ApiBusinessProfile>("/api/user/business-profile", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// ─── Plans ───────────────────────────────────────────────────────────
export interface ApiPlan {
  id: number;
  name: string;
  tier: string;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  maxCards: number;
  maxTaps: number;
  maxStorageMb: number;
  maxLeads: number;
  features: string[];
  description: string | null;
  popular: boolean;
  trialDays: number;
  isActive: boolean;
  displayOrder: number;
}

export async function getPlans() {
  return apiRequest<ApiPlan[]>("/api/plans", { method: "GET" });
}

// ─── Cards ───────────────────────────────────────────────────────────
export interface ApiCard {
  id: string;
  userId: string;
  businessProfileId: string;
  name: string;
  cardType: string;
  status: string;
  slug: string;
  shareUrl: string;
  thumbnailUrl: string | null;
  totalViews: number;
  totalTaps: number;
  totalSaves: number;
  completionScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCardPayload {
  name: string;
  cardType?: string;
  slug?: string;
  [key: string]: any; // Allow additional fields
}

export async function getCards() {
  return apiRequest<ApiCard[]>("/api/user/cards", { method: "GET" });
}

export async function createCard(payload: CreateCardPayload) {
  return apiRequest<ApiCard>("/api/user/cards", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateCard(id: string, payload: Partial<ApiCard>) {
  return apiRequest<ApiCard>(`/api/user/cards/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteCard(id: string) {
  return apiRequest<{ success: boolean }>(`/api/user/cards/${id}`, {
    method: "DELETE",
  });
}

export interface CardContentFormData {
  name: string;
  title: string;
  company: string;
  tagline: string;
  email: string;
  phone: string;
  website: string;
  location: string;
  industry: string;
  yearFounded: string;
  appointmentUrl: string;
  headingText: string;
  bodyText: string;
}

export interface CardContentSectionConfig {
  profile: boolean;
  headingText: boolean;
  contactUs: boolean;
  socialLinks: boolean;
  links: boolean;
  appointment: boolean;
  collectContacts: boolean;
  businessDetails: boolean;
}

export interface CardContentExtraSection {
  id: string;
  type: string;
  label: string;
  enabled: boolean;
  expanded: boolean;
  data: Record<string, unknown>;
}

export interface CardContentPayload {
  profileImage?: string;
  brandLogo?: string;
  logoPosition?: "top-left" | "top-right" | "below-photo" | "below-name";
  formData?: CardContentFormData;
  socialLinks?: { platform: string; url: string }[];
  connectFields?: { type: string; label: string; value: string }[];
  sections?: CardContentSectionConfig;
  customLinks?: { label: string; url: string }[];
  extraSections?: CardContentExtraSection[];
}

export interface CardContentResponse extends CardContentPayload {
  cardId: string;
  updatedAt?: string;
}

export interface CardQRConfigPayload {
  shapeId: string;
  dotShape: string;
  finderStyle: string;
  eyeBall: string;
  bodyScale: number;
  fg: string;
  bg: string;
  accentFg: string;
  accentBg: string;
  strokeEnabled: boolean;
  strokeColor: string;
  gradEnabled: boolean;
  gradStops: { offset: number; color: string }[];
  gradAngle: number;
  selectedLogo: string;
  customLogoUrl: string;
  logoBg: string;
  designLabel: string;
  shapeLabel: string;
  stickerId: string | null;
}

export async function getCardQRConfig(cardId: string) {
  return apiRequest<CardQRConfigPayload | null>(`/api/user/cards/${cardId}/qr`, {
    method: "GET",
  });
}

export async function updateCardQR(cardId: string, qrConfig: CardQRConfigPayload) {
  return apiRequest<CardQRConfigPayload>(`/api/user/cards/${cardId}/qr`, {
    method: "PUT",
    body: JSON.stringify(qrConfig),
  });
}

export interface CardDesignPayload {
  palette: string;
  accentColor: string;
  accentLight: string;
  bgColor: string;
  cardColor: string;
  textPrimary: string;
  textMuted: string;
  phoneBgPreset: string;
  phoneBgColor1: string;
  phoneBgColor2: string;
  phoneBgAngle: number;
  phoneBgType: 'solid' | 'gradient';
  font: string;
  bodyFontSize: number;
  nameFontSize: number;
  boldHeadings: boolean;
  cardRadius: number;
  shadowIntensity: 'none' | 'soft' | 'medium' | 'strong';
  glowEffect: boolean;
}

export interface CardDesignResponse extends CardDesignPayload {
  cardId?: string;
  updatedAt?: string;
}

export async function getCardContent(cardId: string) {
  return apiRequest<CardContentResponse | null>(`/api/user/cards/${cardId}/content`, {
    method: "GET",
  });
}

export async function updateCardContent(cardId: string, payload: CardContentPayload) {
  return apiRequest<CardContentResponse>(`/api/user/cards/${cardId}/content`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function getCardDesign(cardId: string) {
  return apiRequest<CardDesignResponse | null>(`/api/user/cards/${cardId}/design`, {
    method: "GET",
  });
}

export async function updateCardDesign(cardId: string, payload: Partial<CardDesignPayload>) {
  return apiRequest<CardDesignResponse>(`/api/user/cards/${cardId}/design`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// ─── Social Links ───────────────────────────────────────────────────
export interface SocialLink {
  id: string;
  platform: string;
  handle: string;
  url: string;
  label: string;
  displayOrder: number;
  enabled: boolean;
}

export async function getSocialLinks() {
  return apiRequest<SocialLink[]>("/api/user/social-links", { method: "GET" });
}

export async function updateSocialLinks(links: Partial<SocialLink>[]) {
  return apiRequest<SocialLink[]>("/api/user/social-links", {
    method: "PUT",
    body: JSON.stringify({ links }),
  });
}

// ─── Custom Links ───────────────────────────────────────────────────
export interface CustomLink {
  id: string;
  label: string;
  url: string;
  icon: string | null;
  color: string | null;
  displayOrder: number;
  enabled: boolean;
  totalClicks: number;
}

export async function getCustomLinks() {
  return apiRequest<CustomLink[]>("/api/user/custom-links", { method: "GET" });
}

export async function updateCustomLinks(links: Partial<CustomLink>[]) {
  return apiRequest<CustomLink[]>("/api/user/custom-links", {
    method: "PUT",
    body: JSON.stringify({ links }),
  });
}

// ─── Analytics ──────────────────────────────────────────────────────
export const ANALYTICS_API_ROUTES = {
  overview: "/api/user/analytics",
  deviceDistribution: "/api/user/analytics/device-distribution",
  conversionFunnel: "/api/user/analytics/conversion-funnel",
  topLocations: "/api/user/analytics/top-locations",
  monthOverMonth: "/api/user/analytics/month-over-month",
  monthlyGoal: "/api/user/analytics/monthly-goal",
  weeklyChallenge: "/api/user/analytics/weekly-challenge",
} as const;

export const ANALYTICS_FRONTEND_ROUTES = {
  dashboardAnalytics: "/dashboard?section=analytics",
} as const;

export interface AnalyticsData {
  totalTaps: number;
  totalViews: number;
  totalLeads: number;
  profileCompletion: number;
  engagementScore: number;
  thisWeekChange: number;
  period: string;
  daily: { date: string; taps: number; views: number; leads: number }[];
  sources: { name: string; value: number; percentage: number }[];
  deviceDistribution: { name: string; value: number; count: number }[];
  funnelSteps: { label: string; value: number; percentage: number }[];
  topLocations: { country: string; visitors: number; percentage: number }[];
  topLinks: { id: string; label: string; clicks: number; percentage: number }[];
}

export interface MonthOverMonthPerformance {
  metric: string;
  thisMonth: number;
  lastMonth: number;
  change: number;
}

export interface GoalProgressData {
  name: string;
  metric: string;
  current: number;
  target: number;
  percentage: number;
  statusText: string;
}

export async function getAnalytics(period: string = "7") {
  return apiRequest<AnalyticsData>(`${ANALYTICS_API_ROUTES.overview}?period=${period}`, { method: "GET" });
}

export async function getDeviceDistribution(period: string = "7") {
  return apiRequest<AnalyticsData["deviceDistribution"]>(
    `${ANALYTICS_API_ROUTES.deviceDistribution}?period=${period}`,
    { method: "GET" },
  );
}

export async function getConversionFunnel(period: string = "7") {
  return apiRequest<AnalyticsData["funnelSteps"]>(
    `${ANALYTICS_API_ROUTES.conversionFunnel}?period=${period}`,
    { method: "GET" },
  );
}

export async function getTopLocations(period: string = "7") {
  return apiRequest<AnalyticsData["topLocations"]>(
    `${ANALYTICS_API_ROUTES.topLocations}?period=${period}`,
    { method: "GET" },
  );
}

export async function getMonthOverMonthPerformance() {
  return apiRequest<MonthOverMonthPerformance[]>(
    ANALYTICS_API_ROUTES.monthOverMonth,
    { method: "GET" },
  );
}

export async function getMonthlyGoal() {
  return apiRequest<GoalProgressData>(
    ANALYTICS_API_ROUTES.monthlyGoal,
    { method: "GET" },
  );
}

export async function getWeeklyChallenge() {
  return apiRequest<GoalProgressData>(
    ANALYTICS_API_ROUTES.weeklyChallenge,
    { method: "GET" },
  );
}

// ─── Leads ───────────────────────────────────────────────────────────
export interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: string;
  source: string;
  isFavorite: boolean;
  engagementScore: number;
  createdAt: string;
}

export interface LeadsResponse {
  leads: Lead[];
  total: number;
  page: number;
  limit: number;
}

export async function getLeads(status?: string, page?: number) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (page) params.set("page", page.toString());
  return apiRequest<LeadsResponse>(`/api/user/leads?${params}`, { method: "GET" });
}

export async function updateLead(id: string, payload: { status?: string; notes?: string; isFavorite?: boolean }) {
  return apiRequest<Lead>(`/api/user/leads/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// ─── Orders ─────────────────────────────────────────────────────────
export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: any[];
  quantity: number;
  amount: number;
  status: string;
  tracking: string | null;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

export async function getOrders(status?: string, page?: number) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (page) params.set("page", page.toString());
  return apiRequest<OrdersResponse>(`/api/user/orders?${params}`, { method: "GET" });
}

// ─── Invoices ───────────────────────────────────────────────────────
export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  periodStart?: string;
  periodEnd?: string;
  amount: number;
  subtotal?: number;
  tax?: number;
  discount?: number;
  currency?: string;
  status: string;
  pdfUrl: string | null;
  billingName?: string;
}

export interface InvoicesResponse {
  invoices: Invoice[];
  total: number;
  page: number;
  limit: number;
}

export async function getInvoices(status?: string, page?: number) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (page) params.set("page", page.toString());
  return apiRequest<InvoicesResponse>(`/api/user/invoices?${params}`, { method: "GET" });
}

// ─── Notifications ────────────────────────────────────────────────────
export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  actionLabel?: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  total: number;
  page: number;
  limit: number;
}

export async function getNotifications(unreadOnly?: boolean, page?: number) {
  const params = new URLSearchParams();
  if (unreadOnly) params.set("unreadOnly", "true");
  if (page) params.set("page", page.toString());
  return apiRequest<NotificationsResponse>(`/api/user/notifications?${params}`, { method: "GET" });
}

export async function markNotificationRead(id: string) {
  return apiRequest<Notification>(`/api/user/notifications/${id}/read`, { method: "PUT" });
}

export async function markAllNotificationsRead() {
  return apiRequest<{ success: boolean }>("/api/user/notifications/read-all", { method: "PUT" });
}

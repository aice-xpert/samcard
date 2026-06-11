// =============================================================================
// SAMCARD - Complete TypeScript Types
// Comprehensive type definitions for all dashboard features
// =============================================================================

// =============================================================================
// ENUMS
// =============================================================================

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  GUEST = "GUEST",
}

export enum AccountProvider {
  GOOGLE = "GOOGLE",
  GITHUB = "GITHUB",
  EMAIL = "EMAIL",
  LINKEDIN = "LINKEDIN",
  APPLE = "APPLE",
  TWITTER = "TWITTER",
  FACEBOOK = "FACEBOOK",
}

export enum Theme {
  DARK = "DARK",
  LIGHT = "LIGHT",
  SYSTEM = "SYSTEM",
}

export enum CardStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DRAFT = "DRAFT",
  ARCHIVED = "ARCHIVED",
  SUSPENDED = "SUSPENDED",
}

export enum CardType {
  NFC = "NFC",
  QR = "QR",
  LINK = "LINK",
  HYBRID = "HYBRID",
}

export enum LogoPosition {
  TOP_LEFT = "TOP_LEFT",
  TOP_RIGHT = "TOP_RIGHT",
  BELOW_PHOTO = "BELOW_PHOTO",
  BELOW_NAME = "BELOW_NAME",
}

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
  PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED",
}

export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  PAST_DUE = "PAST_DUE",
  CANCELLED = "CANCELLED",
  SUSPENDED = "SUSPENDED",
  TRIALING = "TRIALING",
}

export enum PlanTier {
  FREE = "FREE",
  STARTER = "STARTER",
  PROFESSIONAL = "PROFESSIONAL",
  BUSINESS = "BUSINESS",
  ENTERPRISE = "ENTERPRISE",
}

export enum LeadSource {
  NFC = "NFC",
  QR = "QR",
  LINK_CLICK = "LINK_CLICK",
  DIRECT = "DIRECT",
  SEARCH = "SEARCH",
  REFERRAL = "REFERRAL",
  SOCIAL = "SOCIAL",
  ORGANIC = "ORGANIC",
}

export enum LeadStatus {
  NEW = "NEW",
  CONTACTED = "CONTACTED",
  QUALIFIED = "QUALIFIED",
  CONVERTED = "CONVERTED",
  LOST = "LOST",
  ARCHIVED = "ARCHIVED",
}

export enum NotificationType {
  LEAD = "LEAD",
  TAP = "TAP",
  SCAN = "SCAN",
  MESSAGE = "MESSAGE",
  SYSTEM = "SYSTEM",
  BILLING = "BILLING",
  PROMO = "PROMO",
  SECURITY = "SECURITY",
  CARD = "CARD",
  ANALYTICS = "ANALYTICS",
}

export enum DeviceType {
  IOS = "IOS",
  ANDROID = "ANDROID",
  WEB = "WEB",
  NFC_READER = "NFC_READER",
  QR_SCANNER = "QR_SCANNER",
  UNKNOWN = "UNKNOWN",

}

export enum AuditAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  EXPORT = "EXPORT",
  SHARE = "SHARE",
  VIEW = "VIEW",
}

export enum ExtraSectionType {
  BUTTON = "BUTTON",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  PDF = "PDF",
  IMAGE_TEXT = "IMAGE_TEXT",
  TEAM = "TEAM",
  CUSTOMER = "CUSTOMER",
  PRODUCTS = "PRODUCTS",
  SERVICES = "SERVICES",
  HOURS = "HOURS",
  GALLERY = "GALLERY",
  PORTFOLIO = "PORTFOLIO",
  TESTIMONIALS = "TESTIMONIALS",
  AMENITIES = "AMENITIES",
  EMBED = "EMBED",
  MAP = "MAP",
}

export enum QRShapeType {
  SQUARE = "SQUARE",
  ROUNDED = "ROUNDED",
  CIRCLE = "CIRCLE",
  HEXAGON = "HEXAGON",
  KITE = "KITE",
  STAR = "STAR",
  DIAMOND = "DIAMOND",
  BEVEL = "BEVEL",
  LETTER = "LETTER",
}

export enum QRDotShape {
  SQUARE = "SQUARE",
  ROUNDED_TAG = "ROUNDED_TAG",
  ROUNDED = "ROUNDED",
  DOT = "DOT",
  TINY_DOT = "TINY_DOT",
  DIAMOND = "DIAMOND",
  STAR = "STAR",
  CROSS = "CROSS",
  PLUS = "PLUS",
  HEXAGON = "HEXAGON",
  LEAF = "LEAF",
  BARS_H = "BARS_H",
  BARS_V = "BARS_V",
  MOSAIC = "MOSAIC",
  WAVE = "WAVE",
  DNA = "DNA",
  ARROW_R = "ARROW_R",
  ARROW_L = "ARROW_L",
  KITE = "KITE",
  ROUNDED_SQUARE = "ROUNDED_SQUARE",
}

export enum QREyeFrameStyle {
  SQUARE = "SQUARE",
  ROUNDED = "ROUNDED",
  CIRCLE = "CIRCLE",
  DOT_OUTLINE = "DOT_OUTLINE",
  ROUND_OUTER = "ROUND_OUTER",
  THICK = "THICK",
  DASHED = "DASHED",
  DOUBLE = "DOUBLE",
  OCTAGON = "OCTAGON",
  GAP = "GAP",
}

export enum QREyeBallStyle {
  CIRCLE = "CIRCLE",
  SQUARE = "SQUARE",
  ROUNDED = "ROUNDED",
  DIAMOND = "DIAMOND",
  HEXAGON = "HEXAGON",
  STAR = "STAR",
  SQUIRCLE = "SQUIRCLE",
  KITE = "KITE",
  LEAF = "LEAF",
  CROSS = "CROSS",
  RING = "RING",
  DOT_SQ = "DOT_SQ",
}

export enum WallpaperType {
  SOLID = "SOLID",
  GRADIENT = "GRADIENT",
  RADIAL = "RADIAL",
}

export enum ShadowIntensity {
  NONE = "NONE",
  SOFT = "SOFT",
  MEDIUM = "MEDIUM",
  STRONG = "STRONG",
}

export enum FontFamily {
  INTER = "INTER",
  SORA = "SORA",
  DM_SANS = "DM_SANS",
  POPPINS = "POPPINS",
  RALEEWAY = "RALEEWAY",
  PLAYFAIR_DISPLAY = "PLAYFAIR_DISPLAY",
  FIRA_CODE = "FIRA_CODE",
  SYSTEM = "SYSTEM",
}

export enum PaymentCardBrand {
  VISA = "VISA",
  MASTERCARD = "MASTERCARD",
  AMEX = "AMEX",
  DISCOVER = "DISCOVER",
  JCB = "JCB",
  UNIONPAY = "UNIONPAY",
}

// =============================================================================
// USER & AUTHENTICATION
// =============================================================================

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  passwordHash?: string;
  name?: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  timezone: string;
  language: string;
  theme: Theme;
  compactMode: boolean;
  subscriptionId?: string;
  planTier: PlanTier;
  subscriptionStatus: SubscriptionStatus;
  subscriptionEndsAt?: Date;
  maxCards: number;
  maxTaps: number;
  maxStorageMb: number;
  maxLeads: number;
  totalCards: number;
  totalTaps: number;
  totalViews: number;
  totalLeads: number;
  totalOrders: number;
  totalSpent: number;
  profilePublic: boolean;
  showEmail: boolean;
  showPhone: boolean;
  analyticsOptIn: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  emailVerifiedAt?: Date;
  deletedAt?: Date;
}

export interface Account {
  id: string;
  userId: string;
  provider: AccountProvider;
  providerAccountId: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  tokenType?: string;
  scope?: string;
  idToken?: string;
  sessionState?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  device?: string;
  deviceType: DeviceType;
  browser?: string;
  os?: string;
  ipAddress?: string;
  location?: string;
  isCurrent: boolean;
  userAgent?: string;
  expiresAt: Date;
  createdAt: Date;
  lastActiveAt: Date;
}

// =============================================================================
// BUSINESS PROFILE
// =============================================================================

export interface BusinessProfile {
  id: string;
  userId: string;
  name: string;
  slug: string;
  title?: string;
  company?: string;
  tagline?: string;
  profileImageUrl?: string;
  coverImageUrl?: string;
  brandLogoUrl?: string;
  logoPosition: LogoPosition;
  primaryEmail?: string;
  secondaryEmail?: string;
  primaryPhone?: string;
  secondaryPhone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  industry?: string;
  department?: string;
  jobLevel?: string;
  yearFounded?: number;
  companySize?: string;
  appointmentEnabled: boolean;
  appointmentUrl?: string;
  appointmentLabel?: string;
  collectContactsEnabled: boolean;
  collectNotesEnabled: boolean;
  contactFormLabel?: string;
  headingText?: string;
  headingBodyText?: string;
  contactUsHeading?: string;
  contactUsBodyText?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  shareUrl?: string;
  customCss?: string;
  customJs?: string;
  completionScore: number;
  engagementScore: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  deletedAt?: Date;
}

export interface SocialLink {
  id: string;
  businessProfileId: string;
  platform: string;
  handle: string;
  url?: string;
  label?: string;
  icon?: string;
  displayOrder: number;
  enabled: boolean;
  totalClicks: number;
  uniqueClicks: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomLink {
  id: string;
  businessProfileId: string;
  label: string;
  url: string;
  icon?: string;
  color?: string;
  displayOrder: number;
  enabled: boolean;
  clickTracking: boolean;
  totalClicks: number;
  uniqueClicks: number;
  lastClickedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExtraSection {
  id: string;
  businessProfileId: string;
  type: ExtraSectionType;
  label: string;
  displayOrder: number;
  enabled: boolean;
  expanded: boolean;
  data: ExtraSectionData;
  showOnCard: boolean;
  showOnPreview: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExtraSectionData {
  // Common
  title?: string;
  description?: string;
  content?: string;
  
  // Button
  buttonLabel?: string;
  buttonUrl?: string;
  buttonIcon?: string;
  
  // Video/Audio
  url?: string;
  thumbnailUrl?: string;
  autoplay?: boolean;
  
  // PDF
  pdfUrl?: string;
  pdfTitle?: string;
  
  // Image & Text
  imageUrl?: string;
  imageAlt?: string;
  
  // Team/Customers
  members?: TeamMember[];
  
  // Products/Services
  items?: ProductItem[];
  
  // Hours
  hours?: BusinessHours[];
  
  // Gallery
  images?: GalleryImage[];
  
  // Portfolio
  portfolioItems?: PortfolioItem[];
  
  // Testimonials
  testimonials?: Testimonial[];
  
  // Amenities
  amenities?: Amenity[];
  
  // Embed
  embedCode?: string;
  embedUrl?: string;
  
  // Map
  mapUrl?: string;
  coordinates?: { lat: number; lng: number };
}

export interface TeamMember {
  name: string;
  title: string;
  imageUrl?: string;
  bio?: string;
  socialLinks?: { platform: string; url: string }[];
}

export interface ProductItem {
  name: string;
  price?: string;
  description?: string;
  imageUrl?: string;
  buyLink?: string;
  sku?: string;
}

export interface BusinessHours {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
  breaks?: { start: string; end: string }[];
}

export interface GalleryImage {
  url: string;
  caption?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface PortfolioItem {
  id?: string;
  title: string;
  description?: string;
  imageUrl?: string;
  link?: string;
  tags?: string[];
  date?: string;
  client?: string;
}

export interface Testimonial {
  id?: string;
  name: string;
  role?: string;
  company?: string;
  avatar?: string;
  quote: string;
  rating?: number;
  date?: string;
}

export interface Amenity {
  icon?: string;
  label: string;
  description?: string;
}

// =============================================================================
// DIGITAL BUSINESS CARDS
// =============================================================================

export interface Card {
  id: string;
  userId: string;
  businessProfileId: string;
  name: string;
  cardType: CardType;
  status: CardStatus;
  slug: string;
  shareUrl: string;
  shortUrl?: string;
  headingText?: string;
  headingBodyText?: string;
  nfcUid?: string;
  nfcEnabled: boolean;
  nfcWriteCount: number;
  nfcLastWrittenAt?: Date;
  qrEnabled: boolean;
  qrConfig?: QRCustomConfig;
  qrMatrix?: string;
  qrScanCount: number;
  qrLastScannedAt?: Date;
  qrShape: QRShapeType;
  designId?: string;
  themeOverride?: ThemeOverride;
  showProfile: boolean;
  showHeading: boolean;
  showContact: boolean;
  showSocial: boolean;
  showLinks: boolean;
  showAppointment: boolean;
  showBusinessDetails: boolean;
  showExtraSections: boolean;
  backgroundColor: string;
  accentColor: string;
  accentLight: string;
  textColor: string;
  cardColor: string;
  cardRadius: number;
  fontFamily: FontFamily;
  nameFontSize: number;
  bodyFontSize: number;
  boldHeadings: boolean;
  phoneBgType: WallpaperType;
  phoneBgPreset?: string;
  phoneBgColor1: string;
  phoneBgColor2: string;
  phoneBgAngle: number;
  shadowIntensity: ShadowIntensity;
  glowEffect: boolean;
  thumbnailUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  totalViews: number;
  totalTaps: number;
  totalScans: number;
  totalSaves: number;
  totalShares: number;
  uniqueVisitors: number;
  linkClicks: number;
  thisWeekViews: number;
  thisWeekTaps: number;
  monthlyTapGoal?: number;
  monthlyViewGoal?: number;
  completionScore: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  lastSharedAt?: Date;
  deletedAt?: Date;
}

export interface CardDesign {
  id: string;
  userId?: string;
  name: string;
  description?: string;
  isPreset: boolean;
  isPublic: boolean;
  accentColor: string;
  accentLight: string;
  backgroundColor: string;
  cardColor: string;
  textPrimary: string;
  textMuted: string;
  fontFamily: FontFamily;
  nameFontSize: number;
  bodyFontSize: number;
  boldHeadings: boolean;
  cardRadius: number;
  shadowIntensity: ShadowIntensity;
  glowEffect: boolean;
  phoneBgType: WallpaperType;
  phoneBgPreset?: string;
  phoneBgColor1: string;
  phoneBgColor2: string;
  phoneBgAngle: number;
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ColorPalette {
  id: string;
  name: string;
  emoji?: string;
  accent: string;
  accentLight: string;
  bg: string;
  card: string;
  textPrimary: string;
  textMuted: string;
  wallpaper?: string;
  isPreset: boolean;
  displayOrder: number;
}

export interface WallpaperPreset {
  id: string;
  name: string;
  style: string;
  color1: string;
  color2?: string;
  angle?: number;
  thumb?: string;
  isPreset: boolean;
  displayOrder: number;
}

// =============================================================================
// THEME & QR CONFIGURATION
// =============================================================================

export interface ThemeOverride {
  green?: string;
  greenLight?: string;
  bg?: string;
  card?: string;
  cardBorder?: string;
  textPrimary?: string;
  textMuted?: string;
  divider?: string;
  muted?: string;
  fontFamily?: string;
  nameFontSize?: number;
  bodyFontSize?: number;
  boldHeadings?: boolean;
  cardRadius?: number;
  phoneBgStyle?: string;
  accentColor?: string;
  accentLight?: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface QRCustomConfig {
  shapeId: QRShapeType;
  dotShape: QRDotShape;
  finderStyle: QREyeFrameStyle;
  eyeBall: QREyeBallStyle;
  bodyScale: number;
  fg: string;
  bg: string;
  accentFgEnabled?: boolean;
  accentFg?: string;
  accentBgEnabled?: boolean;
  accentBg?: string;
  strokeEnabled: boolean;
  strokeColor: string;
  gradEnabled: boolean;
  gradStops: GradientStop[];
  gradAngle: number;
  selectedLogo: string | null;
  customLogoUrl: string | null;
  customLogoBase64?: string;
  logoBg?: string;
  selectedSticker?: QRStickerConfig | null;
  designLabel: string;
  shapeLabel: string;
  qrMatrix?: boolean[][];
  qrN?: number;
  decorateImageUrl?: string | null;
  decorateCompositeDataUrl?: string | null;
  decoratePosition?: { x: number; y: number; width: number; height: number };
}

export interface GradientStop {
  offset: number;
  color: string;
}

export interface QRStickerConfig {
  id?: string;
  name?: string;
  style?: string;
  color?: string;
  outline?: string;
  pos?: string;
  width?: number;
}

export interface QRTemplate {
  id: string;
  userId?: string;
  name: string;
  description?: string;
  isPreset: boolean;
  isPublic: boolean;
  shapeId: QRShapeType;
  dotShape: QRDotShape;
  bodyScale: number;
  eyeFrameStyle: QREyeFrameStyle;
  eyeBallStyle: QREyeBallStyle;
  fgColor: string;
  bgColor: string;
  accentFgEnabled: boolean;
  accentFg?: string;
  accentBgEnabled: boolean;
  accentBg?: string;
  strokeEnabled: boolean;
  strokeColor: string;
  gradEnabled: boolean;
  gradStops?: GradientStop[];
  gradAngle: number;
  logoId?: string;
  customLogoUrl?: string;
  stickerId?: string;
  stickerData?: QRStickerConfig;
  decorateImageUrl?: string;
  decoratePosition?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QRPresetLogo {
  id: string;
  name: string;
  category: string;
  icon: string;
  isPreset: boolean;
  displayOrder: number;
}

export interface QRSticker {
  id: string;
  name: string;
  category: string;
  style: string;
  defaultWidth: number;
  defaultPosition: string;
  defaultColor?: string;
  defaultOutline?: string;
  isPreset: boolean;
  displayOrder: number;
}

// =============================================================================
// CARD INTERACTIONS & ANALYTICS
// =============================================================================

export interface CardInteraction {
  id: string;
  cardId: string;
  type: InteractionType;
  visitorId?: string;
  fingerprint?: string;
  ipAddress?: string;
  userAgent?: string;
  deviceType: DeviceType;
  browser?: string;
  os?: string;
  city?: string;
  country?: string;
  countryCode?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  linkId?: string;
  linkLabel?: string;
  durationSeconds?: number;
  scrollDepth?: number;
  actionsPerformed?: string[];
  screenWidth?: number;
  screenHeight?: number;
  isMobile?: boolean;
  isTablet?: boolean;
  createdAt: Date;
}

export type InteractionType = 
  | "view" 
  | "tap" 
  | "scan" 
  | "save" 
  | "share" 
  | "link_click"
  | "contact_submit"
  | "appointment_click";

export interface CardShare {
  id: string;
  cardId: string;
  method: ShareMethod;
  recipientEmail?: string;
  recipientPhone?: string;
  recipientName?: string;
  sharedUrl: string;
  sharedByIp?: string;
  sharedByVisitorId?: string;
  wasOpened: boolean;
  openedAt?: Date;
  wasEngaged: boolean;
  engagedAt?: Date;
  wasConverted: boolean;
  convertedAt?: Date;
  createdAt: Date;
}

export type ShareMethod =
  | "email"
  | "sms"
  | "whatsapp"
  | "linkedin"
  | "twitter"
  | "facebook"
  | "copy_link"
  | "qr_download"
  | "airdrop"
  | "nfc";

export interface CardAnalytics {
  id: string;
  cardId: string;
  date: Date;
  hour?: number;
  views: number;
  uniqueViews: number;
  taps: number;
  uniqueTaps: number;
  scans: number;
  uniqueScans: number;
  saves: number;
  shares: number;
  linkClicks: number;
  nfcTraffic: number;
  qrTraffic: number;
  linkTraffic: number;
  directTraffic: number;
  searchTraffic: number;
  socialTraffic: number;
  referralTraffic: number;
  deviceBreakdown?: Record<string, number>;
  browserBreakdown?: Record<string, number>;
  osBreakdown?: Record<string, number>;
  countryBreakdown?: Record<string, number>;
  cityBreakdown?: Record<string, number>;
  avgDurationSeconds?: number;
  maxDurationSeconds?: number;
  avgScrollDepth?: number;
  totalSessions: number;
  leadsGenerated: number;
  conversionRate?: number;
  linkClickBreakdown?: Record<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  id: string;
  userId: string;
  todayTaps: number;
  todayViews: number;
  todayLeads: number;
  weekTaps: number;
  weekViews: number;
  weekLeads: number;
  monthTaps: number;
  monthViews: number;
  monthLeads: number;
  tapsTrend: number;
  viewsTrend: number;
  leadsTrend: number;
  conversionRate: number;
  topCardId?: string;
  topCardName?: string;
  topCardTaps: number;
  updatedAt: Date;
}

// =============================================================================
// LEADS & CONTACT MANAGEMENT
// =============================================================================

export interface Lead {
  id: string;
  userId: string;
  businessProfileId: string;
  cardId?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  avatar?: string;
  notes?: string;
  tags: string[];
  source: LeadSource;
  sourceDetail?: string;
  utmSource?: string;
  utmCampaign?: string;
  engagementScore: number;
  interestLevel: number;
  status: LeadStatus;
  isFavorite: boolean;
  isArchived: boolean;
  leadScore: number;
  marketingConsent: boolean;
  consentGivenAt?: Date;
  gdprConsent: boolean;
  estimatedValue?: number;
  lastContactedAt?: Date;
  lastEngagedAt?: Date;
  interactionCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeadInteraction {
  id: string;
  leadId: string;
  type: LeadInteractionType;
  subject?: string;
  body?: string;
  direction?: string;
  outcome?: string;
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  durationSeconds?: number;
  metadata?: Record<string, unknown>;
  attachments?: Attachment[];
  createdAt: Date;
}

export type LeadInteractionType =
  | "email_sent"
  | "email_opened"
  | "email_clicked"
  | "email_replied"
  | "call"
  | "call_answered"
  | "call_voicemail"
  | "call_no_answer"
  | "sms_sent"
  | "sms_replied"
  | "note"
  | "meeting_scheduled"
  | "meeting_completed"
  | "meeting_cancelled"
  | "task_completed"
  | "linkedin_message"
  | "linkedin_view"
  | "status_change";

export interface Attachment {
  name: string;
  url: string;
  type: string;
  size?: number;
}

export interface LeadTask {
  id: string;
  leadId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  startedAt?: Date;
  completedAt?: Date;
  reminderAt?: Date;
  reminderSent: boolean;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface LeadActivity {
  id: string;
  leadId: string;
  type: string;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  city?: string;
  country?: string;
  deviceType?: DeviceType;
  createdAt: Date;
}

// =============================================================================
// BILLING & SUBSCRIPTIONS
// =============================================================================

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  discount: number;
  discountCode?: string;
  shipping: number;
  total: number;
  currency: string;
  status: OrderStatus;
  shippingName?: string;
  shippingPhone?: string;
  shippingAddress?: Address;
  shippingMethod?: string;
  shippingCost?: number;
  trackingNumber?: string;
  trackingUrl?: string;
  carrier?: string;
  paymentMethodId?: string;
  paymentIntentId?: string;
  paidAt?: Date;
  fulfilledAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  customerNotes?: string;
  internalNotes?: string;
  refundAmount: number;
  refundReason?: string;
  refundedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id?: string;
  productId: string;
  sku?: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  total: number;
  options?: Record<string, unknown>;
  weight?: number;
  dimensions?: Dimensions;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  sku?: string;
  barcode?: string;
  inventory: number;
  trackInventory: boolean;
  lowStockThreshold: number;
  weight?: number;
  dimensions?: Dimensions;
  images?: ProductImage[];
  thumbnailUrl?: string;
  category?: string;
  tags: string[];
  status: string;
  isDigital: boolean;
  nfcChipType?: string;
  cardMaterial?: string;
  cardColors?: string[];
  requiresShipping: boolean;
  freeShipping: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductImage {
  url: string;
  alt?: string;
  position?: number;
}

export interface Invoice {
  id: string;
  userId: string;
  invoiceNumber: string;
  subscriptionId?: string;
  periodStart: Date;
  periodEnd: Date;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  discount: number;
  total: number;
  currency: string;
  status: PaymentStatus;
  paidAt?: Date;
  dueDate?: Date;
  stripeInvoiceId?: string;
  stripePaymentIntent?: string;
  stripeSubscriptionId?: string;
  stripeChargeId?: string;
  pdfUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  stripePaymentMethodId: string;
  brand: PaymentCardBrand;
  last4: string;
  expMonth: number;
  expYear: number;
  funding?: "credit" | "debit" | "prepaid";
  displayName?: string;
  isDefault: boolean;
  billingName?: string;
  billingAddress?: Address;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Plan {
  id: string;
  name: string;
  tier: PlanTier;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  maxCards: number;
  maxTaps: number;
  maxStorageMb: number;
  maxLeads: number;
  maxTeamMembers: number;
  features: string[];
  description?: string;
  popular: boolean;
  trialDays: number;
  isActive: boolean;
  displayOrder: number;
}

// =============================================================================
// GOALS & TARGETS
// =============================================================================

export interface Goal {
  id: string;
  userId: string;
  name: string;
  type: string;
  targetValue: number;
  currentValue: number;
  period: string;
  startDate: Date;
  endDate: Date;
  status: string;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// NOTIFICATIONS
// =============================================================================

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  readAt?: Date;
  actionUrl?: string;
  actionLabel?: string;
  emailSent: boolean;
  emailSentAt?: Date;
  pushSent: boolean;
  pushSentAt?: Date;
  priority: string;
  sourceId?: string;
  sourceType?: string;
  createdAt: Date;
}

// =============================================================================
// CONNECTED ACCOUNTS
// =============================================================================

export interface UserConnectedAccount {
  id: string;
  userId: string;
  platform: string;
  connected: boolean;
  connectedAt?: Date;
  accountId?: string;
  accountName?: string;
  accountUrl?: string;
  accountAvatar?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  scopes: string[];
  lastSyncedAt?: Date;
  syncStatus?: string;
  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// LINK TRACKING
// =============================================================================

export interface LinkClick {
  id: string;
  linkId?: string;
  customLinkId?: string;
  socialLinkId?: string;
  visitorId?: string;
  ipAddress?: string;
  userAgent?: string;
  deviceType: DeviceType;
  city?: string;
  country?: string;
  countryCode?: string;
  referrer?: string;
  utmSource?: string;
  cardId?: string;
  createdAt: Date;
}

// =============================================================================
// NFC CARDS
// =============================================================================

export interface NfcCard {
  id: string;
  cardId?: string;
  userId?: string;
  uid: string;
  chipType?: string;
  ndefCapacity?: number;
  physicalCardId?: string;
  cardMaterial?: string;
  cardColors?: string[];
  cardWeight?: number;
  assignedAt?: Date;
  isActivated: boolean;
  isLinked: boolean;
  isAssigned: boolean;
  activationCode?: string;
  writeCount: number;
  lastWrittenAt?: Date;
  lastTapAt?: Date;
  totalTaps: number;
  productId?: string;
  sku?: string;
  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// ANALYTICS EVENTS
// =============================================================================

export interface AnalyticsEvent {
  id: string;
  userId?: string;
  cardId?: string;
  eventName: string;
  eventCategory: string;
  properties?: Record<string, unknown>;
  sessionId?: string;
  pageUrl?: string;
  pageName?: string;
  pageTitle?: string;
  referrer?: string;
  deviceType: DeviceType;
  browser?: string;
  browserVersion?: string;
  os?: string;
  osVersion?: string;
  screenWidth?: number;
  screenHeight?: number;
  isMobile?: boolean;
  ipCountry?: string;
  ipCity?: string;
  ipRegion?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  createdAt: Date;
}

// =============================================================================
// AUDIT LOG
// =============================================================================

export interface AuditLog {
  id: string;
  userId?: string;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  description?: string;
  changes?: {
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
  };
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  deviceType?: DeviceType;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

// =============================================================================
// EMAIL & WEBHOOKS
// =============================================================================

export interface EmailTemplate {
  id: string;
  name: string;
  slug: string;
  subject: string;
  body: string;
  preheader?: string;
  type: string;
  trigger?: string;
  variables: string[];
  isActive: boolean;
  isSystem: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Webhook {
  id: string;
  userId?: string;
  name: string;
  url: string;
  secret?: string;
  events: string[];
  headers?: Record<string, string>;
  isActive: boolean;
  maxRetries: number;
  retryCount: number;
  lastTriggeredAt?: Date;
  lastSuccessAt?: Date;
  lastError?: string;
  lastResponseCode?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: string;
  payload: Record<string, unknown>;
  responseCode?: number;
  responseBody?: string;
  error?: string;
  attempts: number;
  delivered: boolean;
  createdAt: Date;
}

// =============================================================================
// DASHBOARD SPECIFIC TYPES (from Dashboard.tsx)
// =============================================================================

export interface DashboardCard {
  id: string;
  title: string;
  status: CardStatus;
  gradient: string;
  views: number;
  taps: number;
  saves: number;
  trend: { value: number }[];
  completion: number;
}

export interface DashboardStats {
  totalTaps: number;
  tapsTrend: number;
  uniqueVisitors: number;
  visitorsTrend: number;
  profileViews: number;
  viewsTrend: number;
  savedContacts: number;
  savesTrend: number;
}

export interface ConversionFunnel {
  name: string;
  value: number;
  percentage: number;
  drop: number;
}

export interface DeviceDistribution {
  name: string;
  value: number;
  color: string;
}

export interface TopLocation {
  country: string;
  countryCode: string;
  visitors: number;
  percentage: number;
}

export interface RecentTap {
  id: string;
  name: string;
  location: string;
  device: DeviceType;
  action: string;
  time: string;
  status: "online" | "offline";
  avatar: string;
}

export interface MostClickedLink {
  name: string;
  clicks: number;
  percentage: number;
}

export interface SmartInsight {
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  actionLabel?: string;
}

export interface MonthlyPerformance {
  taps: number;
  visitors: number;
  leads: number;
  linkClicks: number;
  prevTaps: number;
  prevVisitors: number;
  prevLeads: number;
  prevLinkClicks: number;
}

export interface GoalProgress {
  name: string;
  current: number;
  target: number;
  percentage: number;
  label: string;
}

// =============================================================================
// SETTINGS SPECIFIC TYPES (from Settings.tsx)
// =============================================================================

export interface NotificationSettings {
  email: boolean;
  tapAlerts: boolean;
  weeklyReport: boolean;
  marketing: boolean;
  newLeads: boolean;
}

export interface ConnectedAccount {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  connectedAt?: Date;
  accountUrl?: string;
}

// =============================================================================
// ORDERS SPECIFIC TYPES (from Orders.tsx)
// =============================================================================

export interface OrderSummary {
  totalOrders: number;
  thisMonth: number;
  inTransit: number;
  totalSpent: number;
}

export interface MonthlyOrderData {
  month: string;
  orders: number;
  revenue: number;
}

// =============================================================================
// FORM INPUTS & VALIDATION
// =============================================================================

export interface CreateCardInput {
  name: string;
  businessProfileId?: string;
  cardType?: CardType;
  designId?: string;
  cloneFrom?: string;
}

export interface UpdateCardInput extends Partial<CreateCardInput> {
  id: string;
  status?: CardStatus;
  themeOverride?: Partial<ThemeOverride>;
  qrConfig?: Partial<QRCustomConfig>;
}

export interface CreateBusinessProfileInput {
  name: string;
  slug?: string;
  title?: string;
  company?: string;
  industry?: string;
}

export interface UpdateBusinessProfileInput extends Partial<CreateBusinessProfileInput> {
  id: string;
}

export interface LeadFilters {
  source?: LeadSource;
  status?: LeadStatus;
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
  cardId?: string;
}

export interface ExportLeadsInput {
  filters?: LeadFilters;
  format: "csv" | "xlsx" | "json";
  fields?: string[];
}

export interface AnalyticsFilters {
  dateFrom: Date;
  dateTo: Date;
  cardId?: string;
  granularity?: "hour" | "day" | "week" | "month";
  deviceType?: DeviceType;
  country?: string;
}

export interface CreateOrderInput {
  items: {
    productId: string;
    quantity: number;
    options?: Record<string, unknown>;
  }[];
  shippingAddress: Address;
  paymentMethodId?: string;
  discountCode?: string;
}

// =============================================================================
// API RESPONSES
// =============================================================================

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  field?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: Record<string, unknown>;
}

// =============================================================================
// UI STATE TYPES
// =============================================================================

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

export interface ModalState {
  isOpen: boolean;
  type?: string;
  data?: Record<string, unknown>;
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface SortOption {
  label: string;
  value: string;
  direction?: "asc" | "desc";
}

// =============================================================================
// LOCAL STORAGE TYPES
// =============================================================================

export interface LocalStorageBusinessProfile {
  profileImage: string;
  brandLogo: string;
  logoPosition: LogoPosition;
  formData: BusinessProfileFormData;
  socialLinks: SocialLinkFormData[];
  connectFields: ConnectFieldFormData[];
  sections: SectionVisibility;
  expanded: SectionExpanded;
  customLinks: CustomLinkFormData[];
  extraSections: ExtraSectionFormData[];
  themeOverride?: ThemeOverride;
  lastSaved?: string;
}

export interface BusinessProfileFormData {
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

export interface SocialLinkFormData {
  platform: number;
  value: string;
}

export interface ConnectFieldFormData {
  type: string;
  label: string;
  value: string;
}

export interface CustomLinkFormData {
  label: string;
  url: string;
}

export interface ExtraSectionFormData {
  id: string;
  type: ExtraSectionType;
  label: string;
  enabled: boolean;
  expanded: boolean;
  data: ExtraSectionData;
}

export interface SectionVisibility {
  profile: boolean;
  headingText: boolean;
  contactUs: boolean;
  socialLinks: boolean;
  links: boolean;
  appointment: boolean;
  collectContacts: boolean;
  businessDetails: boolean;
}

export interface SectionExpanded {
  profile: boolean;
  headingText: boolean;
  contactUs: boolean;
  socialLinks: boolean;
  links: boolean;
  appointment: boolean;
  collectContacts: boolean;
  businessDetails: boolean;
}

export interface LocalStorageDesign {
  accentColor: string;
  accentLight: string;
  bgColor: string;
  cardColor: string;
  textPrimary: string;
  textMuted: string;
  palette: string;
  phoneBgPreset: string;
  phoneBgColor1: string;
  phoneBgColor2: string;
  phoneBgAngle: number;
  phoneBgType: WallpaperType;
  font: FontFamily;
  bodyFontSize: number;
  nameFontSize: number;
  boldHeadings: boolean;
  cardRadius: number;
  shadowIntensity: ShadowIntensity;
  glowEffect: boolean;
  lastSaved?: string;
}

export interface LocalStorageQR {
  qrConfig: QRCustomConfig;
  targetUrl?: string;
  lastSaved?: string;
}

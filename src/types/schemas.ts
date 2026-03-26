// =============================================================================
// SAMCARD - Zod Validation Schemas
// Input validation for API endpoints and forms
// =============================================================================

import { z } from "zod";

// =============================================================================
// User & Auth Schemas
// =============================================================================

export const UserRoleSchema = z.enum(["ADMIN", "USER", "GUEST"]);
export const ThemeSchema = z.enum(["DARK", "LIGHT", "SYSTEM"]);

export const CreateUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required").max(100),
  phone: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  phone: z.string().optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
  theme: ThemeSchema.optional(),
  compactMode: z.boolean().optional(),
  profilePublic: z.boolean().optional(),
  showEmail: z.boolean().optional(),
  showPhone: z.boolean().optional(),
  analyticsOptIn: z.boolean().optional(),
});

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// =============================================================================
// Business Profile Schemas
// =============================================================================

export const LogoPositionSchema = z.enum(["TOP_LEFT", "TOP_RIGHT", "BELOW_PHOTO", "BELOW_NAME"]);

export const CreateBusinessProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1).max(50)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only")
    .optional(),
  title: z.string().max(100).optional(),
  company: z.string().max(200).optional(),
  tagline: z.string().max(200).optional(),
  industry: z.string().optional(),
  primaryEmail: z.string().email().optional().or(z.literal("")),
  primaryPhone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
});

export const UpdateBusinessProfileSchema = CreateBusinessProfileSchema.partial().extend({
  id: z.string().cuid("Invalid profile ID"),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/).optional(),
  appointmentEnabled: z.boolean().optional(),
  appointmentUrl: z.string().url().optional(),
  collectContactsEnabled: z.boolean().optional(),
});

export const SocialLinkSchema = z.object({
  platform: z.string().min(1),
  handle: z.string().min(1),
  url: z.string().url().optional(),
  label: z.string().optional(),
  displayOrder: z.number().int().min(0).optional(),
  enabled: z.boolean().optional(),
});

export const CustomLinkSchema = z.object({
  label: z.string().min(1, "Label is required").max(50),
  url: z.string().url("Invalid URL"),
  icon: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  displayOrder: z.number().int().min(0).optional(),
  enabled: z.boolean().optional(),
});

export const ExtraSectionTypeSchema = z.enum([
  "BUTTON", "VIDEO", "AUDIO", "PDF", "IMAGE_TEXT", "TEAM",
  "CUSTOMER", "PRODUCTS", "SERVICES", "HOURS", "GALLERY",
  "PORTFOLIO", "TESTIMONIALS", "AMENITIES", "EMBED", "MAP"
]);

export const ExtraSectionSchema = z.object({
  type: ExtraSectionTypeSchema,
  label: z.string().min(1).max(100),
  data: z.record(z.string(), z.unknown()),
  displayOrder: z.number().int().min(0).optional(),
  enabled: z.boolean().optional(),
  expanded: z.boolean().optional(),
  showOnCard: z.boolean().optional(),
  showOnPreview: z.boolean().optional(),
});

// =============================================================================
// Card Schemas
// =============================================================================

export const CardStatusSchema = z.enum(["ACTIVE", "INACTIVE", "DRAFT", "ARCHIVED", "SUSPENDED"]);
export const CardTypeSchema = z.enum(["NFC", "QR", "LINK", "HYBRID"]);
export const FontFamilySchema = z.enum(["INTER", "SORA", "DM_SANS", "POPPINS", "RALEEWAY", "PLAYFAIR_DISPLAY", "FIRA_CODE", "SYSTEM"]);
export const WallpaperTypeSchema = z.enum(["SOLID", "GRADIENT", "RADIAL"]);
export const ShadowIntensitySchema = z.enum(["NONE", "SOFT", "MEDIUM", "STRONG"]);

export const ThemeOverrideSchema = z.object({
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  accentLight: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  cardColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  textPrimary: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  textMuted: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  fontFamily: FontFamilySchema.optional(),
  nameFontSize: z.number().int().min(14).max(30).optional(),
  bodyFontSize: z.number().int().min(9).max(16).optional(),
  boldHeadings: z.boolean().optional(),
  cardRadius: z.number().int().min(0).max(32).optional(),
});

export const CreateCardSchema = z.object({
  name: z.string().min(1, "Card name is required").max(100),
  businessProfileId: z.string().cuid().optional(),
  cardType: CardTypeSchema.optional(),
  designId: z.string().cuid().optional(),
  cloneFrom: z.string().cuid().optional(),
});

export const UpdateCardSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1).max(100).optional(),
  status: CardStatusSchema.optional(),
  headingText: z.string().max(200).optional(),
  headingBodyText: z.string().max(500).optional(),
  themeOverride: ThemeOverrideSchema.optional(),
  showProfile: z.boolean().optional(),
  showHeading: z.boolean().optional(),
  showContact: z.boolean().optional(),
  showSocial: z.boolean().optional(),
  showLinks: z.boolean().optional(),
  showAppointment: z.boolean().optional(),
  showBusinessDetails: z.boolean().optional(),
  showExtraSections: z.boolean().optional(),
  monthlyTapGoal: z.number().int().min(1).optional(),
  monthlyViewGoal: z.number().int().min(1).optional(),
});

// =============================================================================
// QR Code Schemas
// =============================================================================

export const QRShapeTypeSchema = z.enum(["SQUARE", "ROUNDED", "CIRCLE", "HEXAGON", "KITE", "STAR", "DIAMOND", "BEVEL", "LETTER"]);
export const QRDotShapeSchema = z.enum(["SQUARE", "ROUNDED_TAG", "ROUNDED", "DOT", "TINY_DOT", "DIAMOND", "STAR", "CROSS", "PLUS", "HEXAGON", "LEAF", "BARS_H", "BARS_V", "MOSAIC", "WAVE", "DNA", "ARROW_R", "ARROW_L", "KITE", "ROUNDED_SQUARE"]);
export const QREyeFrameStyleSchema = z.enum(["SQUARE", "ROUNDED", "CIRCLE", "DOT_OUTLINE", "ROUND_OUTER", "THICK", "DASHED", "DOUBLE", "OCTAGON", "GAP"]);
export const QREyeBallStyleSchema = z.enum(["CIRCLE", "SQUARE", "ROUNDED", "DIAMOND", "HEXAGON", "STAR", "SQUIRCLE", "KITE", "LEAF", "CROSS", "RING", "DOT_SQ"]);

export const GradientStopSchema = z.object({
  offset: z.number().min(0).max(100),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export const QRCustomConfigSchema = z.object({
  shapeId: QRShapeTypeSchema,
  dotShape: QRDotShapeSchema,
  finderStyle: QREyeFrameStyleSchema,
  eyeBall: QREyeBallStyleSchema,
  bodyScale: z.number().min(0.6).max(1.1),
  fg: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  bg: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  accentFgEnabled: z.boolean().optional(),
  accentFg: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  accentBgEnabled: z.boolean().optional(),
  accentBg: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  strokeEnabled: z.boolean(),
  strokeColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  gradEnabled: z.boolean(),
  gradStops: z.array(GradientStopSchema).min(1).optional(),
  gradAngle: z.number().int().min(0).max(360),
  selectedLogo: z.string().nullable().optional(),
  customLogoUrl: z.string().url().nullable().optional(),
  selectedSticker: z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    style: z.string().optional(),
    color: z.string().optional(),
    outline: z.string().optional(),
    pos: z.string().optional(),
  }).nullable().optional(),
  designLabel: z.string(),
  shapeLabel: z.string(),
});

export const UpdateQRConfigSchema = z.object({
  cardId: z.string().cuid(),
  qrConfig: QRCustomConfigSchema,
});

// =============================================================================
// Lead Schemas
// =============================================================================

export const LeadSourceSchema = z.enum(["NFC", "QR", "LINK_CLICK", "DIRECT", "SEARCH", "REFERRAL", "SOCIAL", "ORGANIC"]);
export const LeadStatusSchema = z.enum(["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST", "ARCHIVED"]);

export const CreateLeadSchema = z.object({
  businessProfileId: z.string().cuid(),
  cardId: z.string().cuid().optional(),
  name: z.string().min(1, "Name is required").max(100),
  firstName: z.string().max(50).optional(),
  lastName: z.string().max(50).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().max(200).optional(),
  jobTitle: z.string().max(100).optional(),
  source: LeadSourceSchema,
  sourceDetail: z.string().optional(),
  tags: z.array(z.string()).optional(),
  marketingConsent: z.boolean().optional(),
});

export const UpdateLeadSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1).max(100).optional(),
  firstName: z.string().max(50).optional(),
  lastName: z.string().max(50).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().max(200).optional(),
  jobTitle: z.string().max(100).optional(),
  avatar: z.string().url().optional(),
  notes: z.string().max(5000).optional(),
  tags: z.array(z.string()).optional(),
  status: LeadStatusSchema.optional(),
  isFavorite: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  engagementScore: z.number().int().min(0).max(100).optional(),
  interestLevel: z.number().int().min(1).max(5).optional(),
});

export const LeadFiltersSchema = z.object({
  source: LeadSourceSchema.optional(),
  status: LeadStatusSchema.optional(),
  tags: z.array(z.string()).optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  search: z.string().optional(),
  cardId: z.string().cuid().optional(),
});

export const LeadTaskSchema = z.object({
  leadId: z.string().cuid(),
  title: z.string().min(1, "Task title is required").max(200),
  description: z.string().max(1000).optional(),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  dueDate: z.date().optional(),
  assignedTo: z.string().optional(),
});

export const LeadInteractionSchema = z.object({
  leadId: z.string().cuid(),
  type: z.string(),
  subject: z.string().max(200).optional(),
  body: z.string().max(10000).optional(),
  direction: z.enum(["inbound", "outbound"]).optional(),
  outcome: z.string().optional(),
  scheduledAt: z.date().optional(),
});

// =============================================================================
// Order & Billing Schemas
// =============================================================================

export const OrderStatusSchema = z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED", "PARTIALLY_REFUNDED"]);
export const PaymentStatusSchema = z.enum(["PENDING", "PAID", "FAILED", "REFUNDED", "PARTIALLY_REFUNDED"]);
export const PaymentCardBrandSchema = z.enum(["VISA", "MASTERCARD", "AMEX", "DISCOVER", "JCB", "UNIONPAY"]);

export const AddressSchema = z.object({
  line1: z.string().min(1, "Address is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(2).max(2),
});

export const OrderItemSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  options: z.record(z.string(), z.unknown()).optional(),
});

export const CreateOrderSchema = z.object({
  items: z.array(OrderItemSchema).min(1, "At least one item is required"),
  shippingAddress: AddressSchema,
  paymentMethodId: z.string().cuid().optional(),
  discountCode: z.string().optional(),
  customerNotes: z.string().max(1000).optional(),
});

export const PaymentMethodSchema = z.object({
  cardholderName: z.string().min(1, "Cardholder name is required"),
  cardNumber: z.string().regex(/^[0-9]{16}$/, "Invalid card number"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/[0-9]{2}$/, "Invalid expiry (MM/YY)"),
  cvc: z.string().regex(/^[0-9]{3,4}$/, "Invalid CVC"),
});

// =============================================================================
// Notification Schemas
// =============================================================================

export const NotificationTypeSchema = z.enum(["LEAD", "TAP", "SCAN", "MESSAGE", "SYSTEM", "BILLING", "PROMO", "SECURITY", "CARD", "ANALYTICS"]);

export const NotificationSettingsSchema = z.object({
  email: z.boolean(),
  tapAlerts: z.boolean(),
  weeklyReport: z.boolean(),
  marketing: z.boolean(),
  newLeads: z.boolean(),
});

// =============================================================================
// Analytics Schemas
// =============================================================================

export const DeviceTypeSchema = z.enum(["IOS", "ANDROID", "WEB", "NFC_READER", "QR_SCANNER", "UNKNOWN"]);

export const AnalyticsFiltersSchema = z.object({
  dateFrom: z.date(),
  dateTo: z.date(),
  cardId: z.string().cuid().optional(),
  granularity: z.enum(["hour", "day", "week", "month"]).optional(),
  deviceType: DeviceTypeSchema.optional(),
  country: z.string().optional(),
}).refine((data) => data.dateTo > data.dateFrom, {
  message: "End date must be after start date",
  path: ["dateTo"],
});

export const ExportLeadsSchema = z.object({
  filters: LeadFiltersSchema.optional(),
  format: z.enum(["csv", "xlsx", "json"]),
  fields: z.array(z.string()).optional(),
});

// =============================================================================
// Goal Schemas
// =============================================================================

export const CreateGoalSchema = z.object({
  name: z.string().min(1, "Goal name is required").max(100),
  type: z.string().min(1),
  targetValue: z.number().int().min(1, "Target must be at least 1"),
  period: z.enum(["weekly", "monthly", "quarterly", "yearly"]),
  endDate: z.date(),
});

// =============================================================================
// Webhook Schemas
// =============================================================================

export const CreateWebhookSchema = z.object({
  name: z.string().min(1, "Webhook name is required").max(100),
  url: z.string().url("Invalid webhook URL"),
  secret: z.string().min(16, "Secret must be at least 16 characters").optional(),
  events: z.array(z.string()).min(1, "At least one event is required"),
  headers: z.record(z.string(), z.string()).optional(),
  maxRetries: z.number().int().min(0).max(10).optional(),
});

// =============================================================================
// Connected Account Schemas
// =============================================================================

export const ConnectAccountSchema = z.object({
  platform: z.string().min(1),
  code: z.string().optional(),
  redirectUri: z.string().url().optional(),
});

// =============================================================================
// Session & Auth Schemas
// =============================================================================

export const SessionSchema = z.object({
  id: z.string().cuid(),
  device: z.string().optional(),
  deviceType: DeviceTypeSchema,
  ipAddress: z.string().optional(),
  location: z.string().optional(),
});

export const RevokeSessionSchema = z.object({
  sessionId: z.string().cuid(),
});

// =============================================================================
// Pagination & Response Schemas
// =============================================================================

export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

export const IdParamSchema = z.object({
  id: z.string().cuid("Invalid ID format"),
});

export const SlugParamSchema = z.object({
  slug: z.string().min(1).max(50),
});

// =============================================================================
// Type Exports
// =============================================================================

export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type ChangePassword = z.infer<typeof ChangePasswordSchema>;
export type Login = z.infer<typeof LoginSchema>;

export type CreateBusinessProfile = z.infer<typeof CreateBusinessProfileSchema>;
export type UpdateBusinessProfile = z.infer<typeof UpdateBusinessProfileSchema>;
export type SocialLink = z.infer<typeof SocialLinkSchema>;
export type CustomLink = z.infer<typeof CustomLinkSchema>;
export type ExtraSection = z.infer<typeof ExtraSectionSchema>;

export type CreateCard = z.infer<typeof CreateCardSchema>;
export type UpdateCard = z.infer<typeof UpdateCardSchema>;
export type ThemeOverride = z.infer<typeof ThemeOverrideSchema>;

export type QRCustomConfig = z.infer<typeof QRCustomConfigSchema>;
export type UpdateQRConfig = z.infer<typeof UpdateQRConfigSchema>;

export type CreateLead = z.infer<typeof CreateLeadSchema>;
export type UpdateLead = z.infer<typeof UpdateLeadSchema>;
export type LeadFilters = z.infer<typeof LeadFiltersSchema>;
export type LeadTask = z.infer<typeof LeadTaskSchema>;
export type LeadInteraction = z.infer<typeof LeadInteractionSchema>;

export type CreateOrder = z.infer<typeof CreateOrderSchema>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;

export type NotificationSettings = z.infer<typeof NotificationSettingsSchema>;

export type AnalyticsFilters = z.infer<typeof AnalyticsFiltersSchema>;
export type ExportLeads = z.infer<typeof ExportLeadsSchema>;

export type CreateGoal = z.infer<typeof CreateGoalSchema>;

export type CreateWebhook = z.infer<typeof CreateWebhookSchema>;

export type ConnectAccount = z.infer<typeof ConnectAccountSchema>;

export type Pagination = z.infer<typeof PaginationSchema>;

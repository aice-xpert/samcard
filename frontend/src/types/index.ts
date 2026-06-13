// =============================================================================
// SAMCARD - Type Exports
// =============================================================================

export * from "./database";

// Zod validation schemas (renamed to avoid conflicts with type names)
export {
  // User & Auth Schemas
  CreateUserSchema,
  UpdateUserSchema,
  ChangePasswordSchema,
  LoginSchema,
  
  // Business Profile Schemas
  CreateBusinessProfileSchema,
  UpdateBusinessProfileSchema,
  SocialLinkSchema,
  CustomLinkSchema,
  ExtraSectionSchema,
  
  // Card Schemas
  CreateCardSchema,
  UpdateCardSchema,
  ThemeOverrideSchema,
  
  // QR Schemas
  QRCustomConfigSchema,
  UpdateQRConfigSchema,
  
  // Lead Schemas
  CreateLeadSchema,
  UpdateLeadSchema,
  LeadFiltersSchema,
  LeadTaskSchema,
  LeadInteractionSchema,
  
  // Order & Billing Schemas
  CreateOrderSchema,
  PaymentMethodSchema,
  
  // Notification Schemas
  NotificationSettingsSchema,
  
  // Analytics Schemas
  AnalyticsFiltersSchema,
  ExportLeadsSchema,
  
  // Goal Schemas
  CreateGoalSchema,
  
  // Webhook Schemas
  CreateWebhookSchema,
  
  // Account Schemas
  ConnectAccountSchema,
  
  // Pagination & Params
  PaginationSchema,
  IdParamSchema,
  SlugParamSchema,
} from "./schemas";
export type {
  // User & Auth
  User,
  Account,
  Session,
  
  // Business Profile
  BusinessProfile,
  SocialLink,
  CustomLink,
  ExtraSection,
  ExtraSectionData,
  
  // Cards
  Card,
  CardDesign,
  ColorPalette,
  WallpaperPreset,
  ThemeOverride,
  QRCustomConfig,
  QRTemplate,
  QRPresetLogo,
  QRSticker,
  
  // Analytics
  CardInteraction,
  CardShare,
  CardAnalytics,
  DashboardStats,
  
  // Leads
  Lead,
  LeadInteraction,
  LeadTask,
  LeadActivity,
  
  // Billing
  Order,
  OrderItem,
  Product,
  Invoice,
  InvoiceItem,
  PaymentMethod,
  Plan,
  
  // Goals
  Goal,
  
  // Notifications
  Notification,
  
  // Connected Accounts
  UserConnectedAccount,
  
  // Link Tracking
  LinkClick,
  
  // NFC Cards
  NfcCard,
  
  // Analytics Events
  AnalyticsEvent,
  
  // Audit
  AuditLog,
  
  // Webhooks
  EmailTemplate,
  Webhook,
  WebhookDelivery,
} from "./database";

// Re-export enums
export {
  UserRole,
  AccountProvider,
  Theme,
  CardStatus,
  CardType,
  LogoPosition,
  OrderStatus,
  PaymentStatus,
  SubscriptionStatus,
  PlanTier,
  LeadSource,
  LeadStatus,
  NotificationType,
  DeviceType,
  AuditAction,
  ExtraSectionType,
  QRShapeType,
  QRDotShape,
  QREyeFrameStyle,
  QREyeBallStyle,
  WallpaperType,
  ShadowIntensity,
  FontFamily,
  PaymentCardBrand,
} from "./database";


```mermaid
erDiagram

  User {
    string id PK
    string email
    enum planTier
    enum role
    int maxCards
    int maxTaps
    int maxLeads
  }

  Account {
    string id PK
    string userId FK
    enum provider
    string providerAccountId
  }

  Session {
    string id PK
    string userId FK
    string token
    datetime expiresAt
  }

  BusinessProfile {
    string id PK
    string userId FK
    string slug
    string name
    string title
    string company
    bool collectContactsEnabled
  }

  SocialLink {
    string id PK
    string businessProfileId FK
    string platform
    string handle
    int totalClicks
  }

  CustomLink {
    string id PK
    string businessProfileId FK
    string label
    string url
    int totalClicks
  }

  ExtraSection {
    string id PK
    string businessProfileId FK
    enum type
    json data
    bool enabled
  }

  LinkClick {
    string id PK
    string socialLinkId FK
    string customLinkId FK
    string cardId
    enum deviceType
    string country
  }

  Card {
    string id PK
    string userId FK
    string businessProfileId FK
    string designId FK
    string slug
    enum cardType
    enum status
    string nfcUid
    json qrConfig
    int totalViews
    int totalTaps
  }

  CardDesign {
    string id PK
    string userId
    string name
    bool isPreset
    bool isPublic
    string accentColor
    enum fontFamily
  }

  ColorPalette {
    string id PK
    string name
    string accent
    bool isPreset
  }

  WallpaperPreset {
    string id PK
    string name
    string style
    bool isPreset
  }

  QRTemplate {
    string id PK
    string userId
    string name
    bool isPreset
    enum shapeId
  }

  QRPresetLogo {
    string id PK
    string name
    string category
  }

  QRSticker {
    string id PK
    string name
    string category
  }

  CardInteraction {
    string id PK
    string cardId FK
    string type
    string visitorId
    enum deviceType
    string country
    string utmSource
  }

  CardShare {
    string id PK
    string cardId FK
    string platform
    string visitorId
  }

  CardAnalytics {
    string id PK
    string cardId FK
    datetime date
    int views
    int uniqueViews
    int taps
    int scans
    int saves
    int shares
  }

  AnalyticsEvent {
    string id PK
    string userId
    string cardId
    string eventName
    string eventCategory
    json properties
  }

  DashboardStats {
    string id PK
    string userId FK
    int todayTaps
    int monthTaps
    float conversionRate
    string topCardId
  }

  NfcCard {
    string id PK
    string cardId
    string userId
    string uid
    string chipType
    bool isActivated
    int totalTaps
  }

  Lead {
    string id PK
    string userId FK
    string businessProfileId FK
    string cardId FK
    string email
    enum source
    enum status
    int engagementScore
    bool isArchived
  }

  LeadInteraction {
    string id PK
    string leadId FK
    string type
    string note
  }

  LeadTask {
    string id PK
    string leadId FK
    string title
    enum priority
    bool completed
    datetime dueAt
  }

  Order {
    string id PK
    string userId FK
    float total
    enum status
    json shippingAddress
  }

  Invoice {
    string id PK
    string userId FK
    float amount
    enum status
    datetime dueAt
  }

  PaymentMethod {
    string id PK
    string userId FK
    string last4
    enum brand
    bool isDefault
  }

  Goal {
    string id PK
    string userId FK
    string cardId
    string type
    int targetValue
    int currentValue
  }

  Notification {
    string id PK
    string userId FK
    enum type
    string title
    bool read
  }

  UserConnectedAccount {
    string id PK
    string userId FK
    string platform
    bool connected
  }

  AuditLog {
    string id PK
    string userId FK
    enum action
    string entityType
    string entityId
    json changes
  }

  EmailTemplate {
    string id PK
    string name
    string type
    bool isSystem
  }

  Webhook {
    string id PK
    string userId
    string url
    bool isActive
  }

  WebhookDelivery {
    string id PK
    string webhookId FK
    string event
    bool delivered
    int attempts
  }

  User ||--o{ Account : "has"
  User ||--o{ Session : "has"
  User ||--o{ BusinessProfile : "owns"
  User ||--o{ Card : "creates"
  User ||--o{ Lead : "collects"
  User ||--o{ Order : "places"
  User ||--o{ Invoice : "receives"
  User ||--o{ Notification : "gets"
  User ||--o{ AuditLog : "generates"
  User ||--o{ Goal : "sets"
  User ||--o{ UserConnectedAccount : "links"
  User ||--o{ PaymentMethod : "stores"
  User ||--|| DashboardStats : "has"

  BusinessProfile ||--o{ SocialLink : "has"
  BusinessProfile ||--o{ CustomLink : "has"
  BusinessProfile ||--o{ ExtraSection : "has"
  BusinessProfile ||--o{ Card : "linked to"
  BusinessProfile ||--o{ Lead : "captures"

  SocialLink ||--o{ LinkClick : "tracked by"
  CustomLink ||--o{ LinkClick : "tracked by"

  Card ||--o| CardDesign : "uses"
  Card ||--o{ CardInteraction : "records"
  Card ||--o{ CardShare : "tracked by"
  Card ||--o{ CardAnalytics : "aggregated in"
  Card ||--o{ Lead : "generates"

  Lead ||--o{ LeadInteraction : "has"
  Lead ||--o{ LeadTask : "has"

  Webhook ||--o{ WebhookDelivery : "delivers via"
  ```
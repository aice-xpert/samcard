# SAMCARD Database Schema Documentation

## Overview

This schema covers the complete data model for a digital business card platform. It includes user management, business profiles, digital cards (NFC, QR, Link), leads/contacts, analytics, billing, and more.

## Entity Relationship Diagram

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │
       ├──────────────────────────────────────────────────────────────┐
       │                                                              │
       ▼                                                              ▼
┌─────────────────┐                                      ┌─────────────────────┐
│BusinessProfile  │◄─────────────────────────────────────│      Card           │
└────────┬────────┘                                      └──────────┬──────────┘
         │                                                        │
         ├─────────────────┐                                    │
         │                 │                                    │
         ▼                 ▼                                    ▼
┌────────────────┐ ┌────────────┐ ┌─────────────────────┐ ┌────────────────┐
│  SocialLink    │ │CustomLink  │ │  CardDesign         │ │    NfcCard     │
└────┬───────────┘ └────────────┘ └─────────────────────┘ └────────────────┘
     │                                                                  ▲
     ▼                                                                  │
┌────────────────┐                                                       │
│   LinkClick    │──────────────────────────────────────────────────────┘
└────────────────┘    (links to Card, SocialLink, or CustomLink)

┌────────────────────┐
│       Lead         │───────┬──────────────────────────────────────────┐
└─────────┬──────────┘       │                                          │
          │                  ▼                                          ▼
          ├─────────────────┐                 ┌──────────────────┐ ┌────────────┐
          │                 │                 │  LeadInteraction │ │  LeadTask  │
          ▼                 ▼                 └──────────────────┘ └────────────┘
┌──────────────────┐ ┌────────────┐
│  LeadActivity    │
└──────────────────┘

┌─────────────────────┐
│    CardInteraction  │
└──────────┬──────────┘
           │
           ▼
┌────────────────────┐
│   CardAnalytics    │
└────────────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────────────┐
│    Order    │────►│  OrderItem  │────►│      Product        │
└─────────────┘     └─────────────┘     └─────────────────────┘

┌─────────────┐
│   Invoice   │
└─────────────┘

┌─────────────────────┐     ┌─────────────────────┐
│      Plan           │     │   PaymentMethod     │
└─────────────────────┘     └─────────────────────┘

┌─────────────────────┐
│   DashboardStats    │ (one-to-one with User)
└─────────────────────┘
```

## Core Entities

### 1. User & Authentication

**User** is the central entity representing registered users.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Unique identifier (CUID) |
| `email` | String | User's email (unique) |
| `planTier` | Enum | Subscription tier (FREE, STARTER, etc.) |
| `maxCards` | Int | Card creation limit based on plan |
| `maxTaps` | Int | Monthly tap limit based on plan |

**Relationships:**
- One User → Many BusinessProfiles
- One User → Many Cards
- One User → Many Orders
- One User → Many Invoices
- One User → Many Leads
- One User → Many Sessions
- One User → Many Goals
- One User → Many Notifications
- One User → Many NfcCards
- One User → Many CardDesigns
- One User → Many QRTemplates
- One User → One DashboardStats (one-to-one)

### 2. Business Profile

**BusinessProfile** represents an individual's or company's professional profile.

| Field | Type | Description |
|-------|------|-------------|
| `slug` | String | URL-friendly identifier (unique) |
| `profileImageUrl` | String | Profile photo |
| `brandLogoUrl` | String | Company logo |
| `logoPosition` | Enum | Logo placement option |
| `collectContactsEnabled` | Boolean | Enable lead collection |

**Relationships:**
- One BusinessProfile → Many Cards
- One BusinessProfile → Many SocialLinks
- One BusinessProfile → Many CustomLinks
- One BusinessProfile → Many ExtraSections
- One BusinessProfile → Many Leads

### 3. Digital Business Cards

**Card** represents a digital business card with multiple sharing methods.

| Field | Type | Description |
|-------|------|-------------|
| `slug` | String | Public URL slug (unique) |
| `shareUrl` | String | Full share URL (unique) |
| `shortUrl` | String | Short URL (unique) |
| `cardType` | Enum | NFC, QR, LINK, or HYBRID |
| `businessProfileId` | String | Required FK to BusinessProfile |
| `nfcUid` | String | NFC chip UID (unique, if physical card) |
| `qrConfig` | JSON | QR code appearance settings |
| `themeOverride` | JSON | Custom theme colors/fonts |
| `totalLinkClicks` | Int | Aggregated link click count |

**Relationships:**
- One Card → One BusinessProfile (required, cascade delete)
- One Card → One CardDesign (optional)
- One Card → One NfcCard (optional, one-to-one)
- One Card → Many CardInteractions
- One Card → Many CardShares
- One Card → Many CardAnalytics
- One Card → Many LinkClicks

### 4. Card Design System

**CardDesign** stores reusable design templates.

| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Design template name |
| `userId` | String? | Creator (nullable for system presets) |
| `isPreset` | Boolean | Is a system preset |
| `isPublic` | Boolean | Available to all users |
| `accentColor` | String | Primary brand color |
| `fontFamily` | String | Typography choice |

**QRTemplate** stores QR code style presets.

| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Template name |
| `userId` | String? | Creator (nullable for system presets) |
| `shapeId` | Enum | QR shape (SQUARE, ROUNDED, CIRCLE, etc.) |
| `dotShape` | Enum | QR dot style |
| `fgColor` | String | Foreground color |
| `bgColor` | String | Background color |

**Relationships:**
- One User → Many CardDesigns
- One User → Many QRTemplates

### 5. Leads & Contact Management

**Lead** captures contacts collected from card interactions.

| Field | Type | Description |
|-------|------|-------------|
| `source` | Enum | How lead was acquired |
| `engagementScore` | Int | 1-5 rating |
| `status` | Enum | new, contacted, qualified, converted, lost |
| `tags` | String[] | Custom categorization |

**Relationships:**
- One Lead → Many LeadInteractions
- One Lead → Many LeadTasks

### 6. Analytics & Tracking

**CardAnalytics** stores aggregated daily statistics.

```sql
-- Daily aggregated metrics per card
model CardAnalytics {
  cardId         String
  date           DateTime  @db.Date
  hour           Int?      -- Optional hourly breakdown
  
  views          Int       -- Total views
  uniqueViews    Int       -- Unique visitors
  taps           Int       -- NFC taps
  scans          Int       -- QR scans
  saves          Int       -- Contact saves
  shares         Int       -- Share actions
  linkClicks     Int       -- Link clicks (daily aggregate)
  
  -- Traffic breakdown
  nfcTraffic     Int
  qrTraffic      Int
  directTraffic  Int
  searchTraffic  Int
  socialTraffic  Int
  referralTraffic Int
  
  @@unique([cardId, date, hour])
}
```

**Card** also stores aggregated totals:
- `totalLinkClicks` - Lifetime link clicks (separate from daily CardAnalytics)

**CardInteraction** stores individual events.

### 7. NFC Cards (Physical)

**NfcCard** links physical NFC-enabled cards to digital profiles.

| Field | Type | Description |
|-------|------|-------------|
| `uid` | String | NFC chip UID (unique) |
| `chipType` | String | NTAG213, NTAG215, NTAG216 |
| `physicalCardId` | String | SKU/Serial number |
| `totalTaps` | Int | Lifetime tap count |
| `lastTapAt` | DateTime | Most recent interaction |

## Schema Design Patterns

### 1. Soft Delete Pattern

For Lead and Card, use `isArchived` flag instead of hard delete:

```typescript
// Soft delete a lead
await prisma.lead.update({
  where: { id: leadId },
  data: { isArchived: true }
});
```

### 2. JSON Metadata Pattern

Use JSON fields for flexible, evolving data:

```typescript
// ExtraSection uses JSON for type-specific data
model ExtraSection {
  data Json // Can store video URLs, gallery images, hours, etc.
}
```

### 3. Audit Trail Pattern

Use AuditLog for compliance and debugging:

```typescript
// Log changes
await prisma.auditLog.create({
  data: {
    userId: currentUser.id,
    action: 'UPDATE',
    entityType: 'Card',
    entityId: card.id,
    changes: {
      before: oldValues,
      after: newValues
    }
  }
});
```

### 4. Rate Limiting Pattern

User model stores limits:

```typescript
model User {
  maxCards Int -- Based on plan
  maxTaps  Int -- Monthly limit
}
```

## Indexes

Comprehensive indexes for performance:

```prisma
// User lookups
@@index([email])
@@index([planTier])
@@index([subscriptionStatus])
@@index([role])

// Card sharing
@@index([slug])
@@index([nfcUid])
@@index([userId, status])
@@index([businessProfileId, status])

// Analytics queries
@@index([cardId, date, hour]) // CardAnalytics (composite unique)
@@index([cardId, visitorId, type, createdAt]) // CardInteraction

// Lead management
@@index([userId, status])
@@index([businessProfileId])
@@index([source])
@@index([email])
@@index([isFavorite])
@@index([isArchived])

// Link tracking
@@index([cardId])
@@index([socialLinkId])
@@index([customLinkId])
@@index([visitorId])

// Goals
@@index([startDate, endDate])

// Orders & Invoices
@@index([userId, status])
```

## Database Constraints

### Unique Constraints
- User.email
- Card.slug, shareUrl, shortUrl, nfcUid
- NfcCard.uid, cardId, physicalCardId
- DashboardStats.userId (one-to-one)
- SocialLink (businessProfileId, platform)
- Plan (name, tier)
- Product (slug, sku)
- Invoice.invoiceNumber
- Account (provider, providerAccountId)
- Session.token

### LinkClick Exclusive Relationship
LinkClick must have either socialLinkId OR customLinkId (not both, not neither). 
Enforce at application level or add DB constraint:

```sql
ALTER TABLE "LinkClick" ADD CONSTRAINT "link_click_exclusive" 
CHECK (NUM_NULLS("socialLinkId", "customLinkId") = 1);
```

## Security Considerations

1. **PII Handling**: Lead emails/phones are PII - ensure GDPR compliance
2. **Audit Logging**: Track all sensitive operations
3. **Session Management**: Implement proper session expiry
4. **Webhook Secrets**: Encrypt webhook secrets at rest

## Migration Strategy

When schema evolves:

1. Create migration: `npx prisma migrate dev`
2. Update TypeScript types if needed
3. Run backward compatibility checks
4. Deploy with feature flags

## Example Queries

### Get user's top performing card

```typescript
const topCard = await prisma.card.findFirst({
  where: { userId: currentUser.id },
  orderBy: { totalViews: 'desc' },
  include: {
    analytics: {
      where: {
        date: { gte: last30Days }
      }
    }
  }
});
```

### Get leads by source with stats

```typescript
const leadsBySource = await prisma.lead.groupBy({
  by: ['source'],
  where: {
    userId: currentUser.id,
    createdAt: { gte: last30Days }
  },
  _count: true,
  _avg: { engagementScore: true }
});
```

### Card analytics aggregation

```typescript
const stats = await prisma.cardAnalytics.aggregate({
  where: {
    cardId: cardId,
    date: { in: last7Days }
  },
  _sum: {
    views: true,
    taps: true,
    scans: true
  },
  _avg: {
    avgDurationSeconds: true
  }
});
```

## Future Extensions

The schema can be extended for:

1. **Multi-tenancy**: Add `organizationId` for team features
2. **White-labeling**: Add `brandConfig` for custom domains
3. **AI Features**: Add `aiSuggestions` JSON field for card optimization
4. **Marketplace**: Add `DesignPurchase` model for selling templates

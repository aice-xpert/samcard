# SAMCARD - Complete Database Schema Setup Guide

## Quick Start

```bash
# 1. Install dependencies (includes Prisma)
npm install

# 2. Copy environment variables
cp .env.example .env
# Edit .env with your database credentials

# 3. Generate Prisma Client
npm run db:generate

# 4. Push schema to database
npm run db:push

# 5. Seed with sample data
npm run db:seed

# Open Prisma Studio (optional)
npm run db:studio
```

## Schema Overview

### Core Entities

| Entity | Description |
|--------|-------------|
| **User** | Registered users with subscription plans |
| **BusinessProfile** | Professional profiles with contact info |
| **Card** | Digital business cards (NFC, QR, Link) |
| **CardDesign** | Reusable design templates |
| **Lead** | Contacts collected from card interactions |
| **Order** | Physical card orders |
| **Invoice** | Subscription/payment invoices |
| **NfcCard** | Physical NFC-enabled cards |
| **Notification** | User notifications |

### Supporting Entities

| Entity | Description |
|--------|-------------|
| **Account** | OAuth provider accounts |
| **Session** | User login sessions |
| **SocialLink** | Social media profile links |
| **CustomLink** | Custom links with click tracking |
| **ExtraSection** | Portfolio, hours, galleries |
| **CardInteraction** | Individual analytics events |
| **CardAnalytics** | Aggregated daily statistics |
| **CardShare** | Share tracking |
| **LinkClick** | Custom link click tracking |
| **LeadInteraction** | Lead activity history |
| **LeadTask** | Follow-up tasks |
| **PaymentMethod** | Stored payment methods |
| **AuditLog** | Security audit trail |
| **EmailTemplate** | Email templates |
| **Webhook** | Integration webhooks |

## Database Relationships

```
User (1) ─── (N) BusinessProfile
   │              │
   │              ├── (N) SocialLink
   │              ├── (N) CustomLink ─── (N) LinkClick
   │              └── (N) ExtraSection
   │
   ├── (N) Card ─── (1) CardDesign
   │         │
   │         ├── (N) CardInteraction
   │         ├── (N) CardAnalytics
   │         └── (N) CardShare
   │
   ├── (N) Lead ─── (N) LeadInteraction
   │         └── (N) LeadTask
   │
   ├── (N) Order
   ├── (N) Invoice
   ├── (N) PaymentMethod
   ├── (N) Notification
   └── (N) AuditLog

Card (1) ─── (1) BusinessProfile
  │
  └── (1) NfcCard
```

## Common Queries

### Get user with all related data
```typescript
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    businessProfiles: {
      include: {
        cards: true,
        leads: true,
        socialLinks: true,
        customLinks: true,
      }
    },
    invoices: true,
  }
});
```

### Get card with analytics
```typescript
const cardStats = await prisma.card.findUnique({
  where: { id: cardId },
  include: {
    analytics: {
      where: {
        date: { gte: thirtyDaysAgo }
      },
      orderBy: { date: 'desc' }
    },
    interactions: {
      take: 10,
      orderBy: { createdAt: 'desc' }
    }
  }
});
```

### Lead conversion funnel
```typescript
const funnel = await prisma.lead.groupBy({
  by: ['status'],
  where: {
    userId: currentUser.id,
    createdAt: { gte: thirtyDaysAgo }
  },
  _count: true,
  _avg: { engagementScore: true }
});
```

## TypeScript Types

All types are exported from `src/types/index.ts`:

```typescript
import { 
  User, 
  Card, 
  Lead, 
  BusinessProfile,
  type CreateCardInput,
  type UpdateLeadInput,
  type AnalyticsFilters 
} from '@/types';
```

## Migrations

```bash
# Create new migration
npm run db:migrate -- --name add_new_field

# Reset database (WARNING: deletes all data)
npm run db:reset

# Deploy migrations to production
npx prisma migrate deploy
```

## Performance Tips

1. **Use compound indexes** for common query patterns
2. **Prune old analytics** - archive data older than 90 days
3. **Use connection pooling** - set `connection_limit` in DATABASE_URL
4. **Enable query caching** - Redis for frequently accessed data

## Security

1. Never commit `.env` with real credentials
2. Use `DATABASE_URL` secrets in production
3. Enable SSL for production databases
4. Use Prisma's `select` to limit returned fields
5. Implement row-level security for multi-tenant data

## Next Steps

1. Set up authentication (NextAuth.js)
2. Create API routes for CRUD operations
3. Implement real-time updates (Pusher/Supabase)
4. Set up background jobs (for analytics aggregation)
5. Configure backups and monitoring

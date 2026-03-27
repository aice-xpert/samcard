# SAMCARD - Complete Database Schema Setup Guide

## Supabase PostgreSQL Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Enter project details:
   - Name: `samcard-db`
   - Database Password: (generate secure password, SAVE IT!)
   - Region: Choose closest to your users
4. Wait for project to provision (~2 minutes)

### Step 2: Get Connection Details

1. Go to **Settings** → **Database**
2. Find your connection string (URI format):
```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

Or use the individual connection parameters:
```
Host: aws-0-[REGION].pooler.supabase.com
Port: 6543
Database: postgres
User: postgres.[PROJECT_REF]
Password: [YOUR_PASSWORD]
```

### Step 3: Update Environment Variables

```bash
# Copy example env
cp .env.example .env

# Edit .env with your Supabase credentials
```

Your `.env` file should include:
```env
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@db.[PROJECT_REF].supabase.com:5432/postgres"
```

> **Important**: Use the Pooler connection for Prisma (`pgbouncer=true`) to avoid connection issues.

### Step 4: Generate Client & Push Schema

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Push schema to Supabase (creates tables)
npx prisma db push

# Or use migrations for production
npx prisma migrate dev --name init
```

### Step 5: Verify Setup

```bash
# Open Prisma Studio to verify tables
npx prisma studio

# Or connect via psql
psql "postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"
```

### Step 6: Enable Required Extensions (Optional)

Run in Supabase SQL Editor for full functionality:

```sql
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable full-text search (if needed)
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
```

## Key Database Constraints Implemented

### 1. Unique Constraints (Prevent Duplicates)

| Model | Constraint | Purpose |
|-------|------------|---------|
| User | `email` UNIQUE | One account per email |
| Card | `slug` UNIQUE | Unique card URLs |
| Card | `nfcUid` UNIQUE | One card per NFC chip |
| Card | `shareUrl` UNIQUE | Unique share links |
| SocialLink | `(businessProfileId, platform)` UNIQUE | One link per platform per profile |
| NfcCard | `uid` UNIQUE | One physical card per NFC chip |
| NfcCard | `cardId` UNIQUE | One digital card per NFC card |
| DashboardStats | `userId` UNIQUE | One stats record per user (1:1) |
| UserConnectedAccount | `(userId, platform)` UNIQUE | One connection per platform |

### 2. Foreign Key Relationships

```prisma
# Example: Card belongs to User (Cascade delete)
card → user (ON DELETE CASCADE)

# Example: SocialLink belongs to BusinessProfile (Cascade delete)
socialLink → businessProfile (ON DELETE CASCADE)

# Example: Card optional link to BusinessProfile (Set null)
card → businessProfile (ON DELETE SET NULL)
```

### 3. Exclusive Link Tracking (LinkClick)

```prisma
# LinkClick enforces EXCLUSIVE relationship:
# - Either socialLinkId OR customLinkId is set
# - Never both, never neither (enforced at app level)
socialLinkId String?  // Optional
customLinkId String?  // Optional
@@check(click_link_check, ...)
```

### 4. One-to-One Relationships

```prisma
# DashboardStats - One per User
DashboardStats {
  userId String @unique  // This makes it 1:1 with User
}
```

## Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with Supabase credentials

# 3. Generate Prisma Client
npm run db:generate

# 4. Push schema to database
npm run db:push

# 5. Seed with sample data (optional)
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
   ├── (N) DashboardStats (1:1)
   └── (N) AuditLog

Card (1) ─── (1) BusinessProfile (optional)
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

### Track link click (exclusive)
```typescript
// For social links
await prisma.linkClick.create({
  data: {
    cardId,
    socialLinkId,
    deviceType: 'IOS',
    country: 'US'
  }
});

// For custom links
await prisma.linkClick.create({
  data: {
    cardId,
    customLinkId,
    deviceType: 'ANDROID',
    country: 'UK'
  }
});
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

## Supabase-Specific Features

### Row Level Security (RLS)

To add RLS policies for multi-tenant security:

```sql
-- Enable RLS on a table
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- Create policy: users can only see their own cards
CREATE POLICY "Users can view own cards" ON cards
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy: users can only insert their own cards
CREATE POLICY "Users can insert own cards" ON cards
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Realtime Subscriptions

Enable realtime for live updates:

1. Go to Database → Replication in Supabase dashboard
2. Enable replication for tables you want to subscribe to
3. Use Supabase client for subscriptions:
```typescript
const supabase = createClient(url, key)
supabase.channel('db-changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, handleChange)
  .subscribe()
```

## Performance Tips

1. **Use compound indexes** for common query patterns
2. **Prune old analytics** - archive data older than 90 days
3. **Use connection pooling** - Supabase uses PgBouncer (enabled in URL)
4. **Enable query caching** - Supabase Cache for frequently accessed data
5. **Use the Pooler** - Always use `?pgbouncer=true` for Prisma connections

## Security

1. Never commit `.env` with real credentials
2. Use Supabase secrets in production
3. Enable SSL (automatic with Supabase)
4. Use Prisma's `select` to limit returned fields
5. Implement Row Level Security for multi-tenant data
6. Use `@db.Text` for long text fields to avoid length constraints

## Next Steps

1. Set up Supabase Auth (Authentication → Providers)
2. Create API routes for CRUD operations
3. Implement real-time updates (Supabase Realtime)
4. Set up background jobs (Supabase Edge Functions or pg_cron)
5. Configure backups (Supabase handles this automatically)
6. Set up monitoring (Supabase Dashboard → Reports)

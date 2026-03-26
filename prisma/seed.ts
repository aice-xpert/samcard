// =============================================================================
// SAMCARD - Database Seed Script
// Run with: npx prisma db seed
// =============================================================================

import { PrismaClient, PlanTier, CardStatus, CardType, LeadSource, DeviceType, LeadStatus, LogoPosition, WallpaperType, ShadowIntensity, FontFamily, NotificationType, OrderStatus, PaymentStatus, QRShapeType, QRDotShape, QREyeFrameStyle, QREyeBallStyle } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // =============================================================================
  // Create Color Palettes
  // =============================================================================
  const palettes = await Promise.all([
    prisma.colorPalette.create({
      data: {
        name: "Forest",
        emoji: "🌲",
        accent: "#008001",
        accentLight: "#49B618",
        bg: "#0a0f0a",
        card: "#0f1a0f",
        textPrimary: "#FFFFFF",
        textMuted: "#A0A0A0",
        wallpaper: "deep-space",
        isPreset: true,
        displayOrder: 1,
      },
    }),
    prisma.colorPalette.create({
      data: {
        name: "Ocean",
        emoji: "🌊",
        accent: "#0284c7",
        accentLight: "#38bdf8",
        bg: "#0c1a2e",
        card: "#0f2847",
        textPrimary: "#FFFFFF",
        textMuted: "#94a3b8",
        wallpaper: "ocean-depth",
        isPreset: true,
        displayOrder: 2,
      },
    }),
    prisma.colorPalette.create({
      data: {
        name: "Sunset",
        emoji: "🌅",
        accent: "#ea580c",
        accentLight: "#f97316",
        bg: "#1c0a00",
        card: "#2d1500",
        textPrimary: "#FFFFFF",
        textMuted: "#fbbf24",
        wallpaper: "sunset-dusk",
        isPreset: true,
        displayOrder: 3,
      },
    }),
    prisma.colorPalette.create({
      data: {
        name: "Violet",
        emoji: "💜",
        accent: "#7c3aed",
        accentLight: "#a78bfa",
        bg: "#0d0618",
        card: "#1a0f2e",
        textPrimary: "#FFFFFF",
        textMuted: "#c4b5fd",
        wallpaper: "midnight-purple",
        isPreset: true,
        displayOrder: 4,
      },
    }),
    prisma.colorPalette.create({
      data: {
        name: "Rose",
        emoji: "🌹",
        accent: "#db2777",
        accentLight: "#f472b6",
        bg: "#1a0011",
        card: "#2d001d",
        textPrimary: "#FFFFFF",
        textMuted: "#f9a8d4",
        wallpaper: "rose-gradient",
        isPreset: true,
        displayOrder: 5,
      },
    }),
    prisma.colorPalette.create({
      data: {
        name: "Mono",
        emoji: "⚫",
        accent: "#e5e5e5",
        accentLight: "#f5f5f5",
        bg: "#111111",
        card: "#1a1a1a",
        textPrimary: "#FFFFFF",
        textMuted: "#737373",
        wallpaper: "midnight-purple",
        isPreset: true,
        displayOrder: 6,
      },
    }),
  ]);
  console.log(`✅ Created ${palettes.length} color palettes`);

  // =============================================================================
  // Create Wallpaper Presets
  // =============================================================================
  const wallpapers = await Promise.all([
    prisma.wallpaperPreset.create({
      data: { name: "Deep Space", style: "radial-gradient", color1: "#000000", color2: "#0a0a0a", isPreset: true, displayOrder: 1 },
    }),
    prisma.wallpaperPreset.create({
      data: { name: "Aurora", style: "linear-gradient", color1: "#0f172a", color2: "#1e3a5f", angle: 135, isPreset: true, displayOrder: 2 },
    }),
    prisma.wallpaperPreset.create({
      data: { name: "Midnight Purple", style: "radial-gradient", color1: "#1a0a2e", color2: "#0d0618", isPreset: true, displayOrder: 3 },
    }),
    prisma.wallpaperPreset.create({
      data: { name: "Sunset Dusk", style: "linear-gradient", color1: "#1c0a00", color2: "#4a1a00", angle: 180, isPreset: true, displayOrder: 4 },
    }),
    prisma.wallpaperPreset.create({
      data: { name: "Ocean Depth", style: "linear-gradient", color1: "#0c1a2e", color2: "#0a2540", angle: 180, isPreset: true, displayOrder: 5 },
    }),
    prisma.wallpaperPreset.create({
      data: { name: "Volcanic", style: "radial-gradient", color1: "#1a0000", color2: "#330000", isPreset: true, displayOrder: 6 },
    }),
    prisma.wallpaperPreset.create({
      data: { name: "Arctic", style: "linear-gradient", color1: "#0a192f", color2: "#112240", angle: 135, isPreset: true, displayOrder: 7 },
    }),
  ]);
  console.log(`✅ Created ${wallpapers.length} wallpaper presets`);

  // =============================================================================
  // Create QR Stickers
  // =============================================================================
  const stickers = await Promise.all([
    prisma.qRSticker.create({ data: { name: "Circle Badge", category: "circle", style: "circle", defaultWidth: 50, defaultPosition: "bottom-right", isPreset: true, displayOrder: 1 } }),
    prisma.qRSticker.create({ data: { name: "Square Badge", category: "square", style: "square", defaultWidth: 50, defaultPosition: "bottom-right", isPreset: true, displayOrder: 2 } }),
    prisma.qRSticker.create({ data: { name: "Ribbon", category: "ribbon", style: "ribbon", defaultWidth: 60, defaultPosition: "bottom-right", isPreset: true, displayOrder: 3 } }),
    prisma.qRSticker.create({ data: { name: "Star", category: "holiday", style: "star", defaultWidth: 45, defaultPosition: "top-right", isPreset: true, displayOrder: 4 } }),
    prisma.qRSticker.create({ data: { name: "Premium Gold", category: "premium", style: "gold-circle", defaultWidth: 55, defaultPosition: "bottom-right", isPreset: true, displayOrder: 5 } }),
    prisma.qRSticker.create({ data: { name: "Verified Check", category: "circle", style: "verified", defaultWidth: 40, defaultPosition: "bottom-right", isPreset: true, displayOrder: 6 } }),
  ]);
  console.log(`✅ Created ${stickers.length} QR stickers`);

  // =============================================================================
  // Create Plans
  // =============================================================================
  const plans = await Promise.all([
    prisma.plan.create({
      data: {
        name: "Free",
        tier: PlanTier.FREE,
        priceMonthly: 0,
        priceYearly: 0,
        maxCards: 1,
        maxTaps: 500,
        maxStorageMb: 256,
        maxLeads: 50,
        maxTeamMembers: 1,
        features: ["1 Digital Card", "QR Code Only", "Basic Analytics", "Limited Customization", "SAMCARD Branding"],
        description: "Perfect for getting started",
        popular: false,
        trialDays: 0,
        isActive: true,
        displayOrder: 1,
      },
    }),
    prisma.plan.create({
      data: {
        name: "Starter",
        tier: PlanTier.STARTER,
        priceMonthly: 9,
        priceYearly: 90,
        maxCards: 3,
        maxTaps: 2000,
        maxStorageMb: 512,
        maxLeads: 200,
        maxTeamMembers: 1,
        features: ["3 Digital Cards", "NFC + QR Code", "Advanced Analytics", "Custom Branding", "Remove SAMCARD Branding", "Email Support"],
        description: "For professionals starting out",
        popular: false,
        trialDays: 14,
        isActive: true,
        displayOrder: 2,
      },
    }),
    prisma.plan.create({
      data: {
        name: "Professional",
        tier: PlanTier.PROFESSIONAL,
        priceMonthly: 19,
        priceYearly: 190,
        maxCards: 10,
        maxTaps: 10000,
        maxStorageMb: 2048,
        maxLeads: 1000,
        maxTeamMembers: 3,
        features: ["10 Digital Cards", "NFC + QR Code", "Advanced Analytics", "Custom Branding", "Lead Management CRM", "Priority Support", "Custom Domain", "API Access"],
        description: "For growing professionals",
        popular: true,
        trialDays: 14,
        isActive: true,
        displayOrder: 3,
      },
    }),
    prisma.plan.create({
      data: {
        name: "Business",
        tier: PlanTier.BUSINESS,
        priceMonthly: 49,
        priceYearly: 490,
        maxCards: 50,
        maxTaps: 50000,
        maxStorageMb: 10240,
        maxLeads: 5000,
        maxTeamMembers: 10,
        features: ["Unlimited Digital Cards", "NFC + QR Code", "Enterprise Analytics", "White Label", "Team Management", "Dedicated Support", "Custom Integrations", "SLA Guarantee", "Bulk NFC Writing"],
        description: "For teams and businesses",
        popular: false,
        trialDays: 14,
        isActive: true,
        displayOrder: 4,
      },
    }),
    prisma.plan.create({
      data: {
        name: "Enterprise",
        tier: PlanTier.ENTERPRISE,
        priceMonthly: 199,
        priceYearly: 1990,
        maxCards: -1, // Unlimited
        maxTaps: -1,
        maxStorageMb: -1,
        maxLeads: -1,
        maxTeamMembers: -1,
        features: ["Everything in Business", "Custom Development", "On-premise Deployment", "Advanced Security", "24/7 Phone Support", "Dedicated Account Manager", "Custom Contracts", "SLA 99.99%"],
        description: "For large organizations",
        popular: false,
        trialDays: 30,
        isActive: true,
        displayOrder: 5,
      },
    }),
  ]);
  console.log(`✅ Created ${plans.length} plans`);

  // =============================================================================
  // Create Users
  // =============================================================================
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "demo@samcard.app",
        name: "Sarah Anderson",
        phone: "+1-555-0100",
        role: "USER",
        planTier: PlanTier.PROFESSIONAL,
        subscriptionStatus: "ACTIVE",
        timezone: "America/New_York",
        language: "en",
        theme: "DARK",
        compactMode: false,
        maxCards: 10,
        maxTaps: 10000,
        maxStorageMb: 2048,
        maxLeads: 1000,
        totalCards: 2,
        totalTaps: 2547,
        totalViews: 8921,
        totalLeads: 89,
        totalOrders: 3,
        totalSpent: 67.98,
        profilePublic: true,
        showEmail: true,
        showPhone: true,
        analyticsOptIn: true,
      },
    }),
    prisma.user.create({
      data: {
        email: "saad@example.com",
        name: "Saad Ahmed",
        phone: "+1-555-0101",
        role: "ADMIN",
        planTier: PlanTier.ENTERPRISE,
        subscriptionStatus: "ACTIVE",
        timezone: "America/Los_Angeles",
        language: "en",
        theme: "DARK",
        maxCards: -1,
        maxTaps: -1,
        maxStorageMb: -1,
        maxLeads: -1,
        totalCards: 5,
        totalTaps: 12450,
        totalViews: 45678,
        totalLeads: 342,
        totalOrders: 12,
        totalSpent: 1299.00,
      },
    }),
  ]);
  console.log(`✅ Created ${users.length} users`);

  // =============================================================================
  // Create Business Profiles
  // =============================================================================
  const profiles = await Promise.all([
    prisma.businessProfile.create({
      data: {
        userId: users[0].id,
        name: "Sarah Anderson",
        slug: "sarah-anderson",
        title: "Senior Product Designer",
        company: "TechCorp Inc.",
        tagline: "Crafting delightful user experiences",
        industry: "Technology",
        yearFounded: 2018,
        companySize: "51-200",
        primaryEmail: "sarah@techcorp.com",
        primaryPhone: "+1-555-0200",
        website: "https://techcorp.com",
        address: "123 Market Street",
        city: "San Francisco",
        state: "California",
        country: "USA",
        postalCode: "94105",
        latitude: 37.7749,
        longitude: -122.4194,
        appointmentEnabled: true,
        appointmentUrl: "https://cal.com/sarah",
        appointmentLabel: "Book a Call",
        collectContactsEnabled: true,
        collectNotesEnabled: false,
        contactFormLabel: "Add to Contact",
        headingText: "Let's Connect!",
        headingBodyText: "Scan my card or tap to save my contact details.",
        completionScore: 85,
        engagementScore: 87,
        publishedAt: new Date("2024-01-15"),
      },
    }),
    prisma.businessProfile.create({
      data: {
        userId: users[1].id,
        name: "Saad Consulting",
        slug: "saad-consulting",
        title: "Business Consultant",
        company: "Saad Consulting LLC",
        tagline: "Transforming businesses through innovation",
        industry: "Consulting",
        primaryEmail: "hello@saadconsulting.com",
        primaryPhone: "+1-555-0300",
        website: "https://saadconsulting.com",
        city: "New York",
        state: "NY",
        collectContactsEnabled: true,
        completionScore: 70,
        engagementScore: 75,
      },
    }),
  ]);
  console.log(`✅ Created ${profiles.length} business profiles`);

  // =============================================================================
  // Create Social Links
  // =============================================================================
  await prisma.socialLink.createMany({
    data: [
      { businessProfileId: profiles[0].id, platform: "linkedin", handle: "sarahanderson", url: "https://linkedin.com/in/sarahanderson", displayOrder: 1 },
      { businessProfileId: profiles[0].id, platform: "twitter", handle: "@sarah_codes", url: "https://twitter.com/sarah_codes", displayOrder: 2 },
      { businessProfileId: profiles[0].id, platform: "github", handle: "sarahanderson", url: "https://github.com/sarahanderson", displayOrder: 3 },
      { businessProfileId: profiles[0].id, platform: "dribbble", handle: "sarahanderson", url: "https://dribbble.com/sarahanderson", displayOrder: 4 },
      { businessProfileId: profiles[0].id, platform: "instagram", handle: "@sarah.designs", url: "https://instagram.com/sarah.designs", displayOrder: 5 },
      { businessProfileId: profiles[1].id, platform: "linkedin", handle: "saadconsulting", url: "https://linkedin.com/in/saadconsulting", displayOrder: 1 },
      { businessProfileId: profiles[1].id, platform: "twitter", handle: "@saad_consults", url: "https://twitter.com/saad_consults", displayOrder: 2 },
    ],
  });
  console.log("✅ Created social links");

  // =============================================================================
  // Create Custom Links
  // =============================================================================
  await prisma.customLink.createMany({
    data: [
      { businessProfileId: profiles[0].id, label: "Portfolio", url: "https://sarahanderson.design", icon: "briefcase", displayOrder: 1, totalClicks: 156, uniqueClicks: 134 },
      { businessProfileId: profiles[0].id, label: "Resume", url: "https://sarahanderson.design/resume", icon: "file-text", displayOrder: 2, totalClicks: 89, uniqueClicks: 78 },
      { businessProfileId: profiles[0].id, label: "Book a Call", url: "https://cal.com/sarah", icon: "calendar", displayOrder: 3, totalClicks: 234, uniqueClicks: 198 },
      { businessProfileId: profiles[1].id, label: "Services", url: "https://saadconsulting.com/services", icon: "briefcase", displayOrder: 1, totalClicks: 89 },
      { businessProfileId: profiles[1].id, label: "Case Studies", url: "https://saadconsulting.com/work", icon: "folder", displayOrder: 2, totalClicks: 56 },
    ],
  });
  console.log("✅ Created custom links");

  // =============================================================================
  // Create Extra Sections
  // =============================================================================
  await prisma.extraSection.createMany({
    data: [
      {
        businessProfileId: profiles[0].id,
        type: "PORTFOLIO",
        label: "Featured Work",
        displayOrder: 1,
        enabled: true,
        expanded: true,
        data: {
          items: [
            { title: "Mobile Banking App", description: "Redesigned mobile banking experience", imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3", link: "https://example.com/project1" },
            { title: "E-commerce Platform", description: "Full-stack e-commerce solution", imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d", link: "https://example.com/project2" },
          ],
        },
      },
      {
        businessProfileId: profiles[0].id,
        type: "HOURS",
        label: "Business Hours",
        displayOrder: 2,
        enabled: true,
        expanded: false,
        data: {
          hours: [
            { day: "Monday", open: "09:00", close: "18:00" },
            { day: "Tuesday", open: "09:00", close: "18:00" },
            { day: "Wednesday", open: "09:00", close: "18:00" },
            { day: "Thursday", open: "09:00", close: "18:00" },
            { day: "Friday", open: "09:00", close: "17:00" },
            { day: "Saturday", closed: true },
            { day: "Sunday", closed: true },
          ],
        },
      },
      {
        businessProfileId: profiles[0].id,
        type: "VIDEO",
        label: "Introduction Video",
        displayOrder: 3,
        enabled: true,
        expanded: false,
        data: {
          url: "https://youtube.com/watch?v=example",
          thumbnailUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f",
          autoplay: false,
        },
      },
    ],
  });
  console.log("✅ Created extra sections");

  // =============================================================================
  // Create Card Designs
  // =============================================================================
  const designs = await Promise.all([
    prisma.cardDesign.create({
      data: {
        name: "Midnight Green",
        description: "Professional dark theme with green accents",
        isPreset: true,
        isPublic: true,
        accentColor: "#008001",
        accentLight: "#49B618",
        backgroundColor: "#000000",
        cardColor: "#0a0a0a",
        textPrimary: "#FFFFFF",
        textMuted: "#A0A0A0",
        fontFamily: "INTER",
        nameFontSize: 24,
        bodyFontSize: 14,
        boldHeadings: false,
        cardRadius: 16,
        shadowIntensity: "MEDIUM",
        glowEffect: true,
        phoneBgType: "GRADIENT",
        phoneBgPreset: "deep-space",
        phoneBgColor1: "#000000",
        phoneBgColor2: "#0a0a0a",
        phoneBgAngle: 180,
      },
    }),
    prisma.cardDesign.create({
      data: {
        name: "Ocean Blue",
        description: "Clean blue theme for corporate profiles",
        isPreset: true,
        isPublic: true,
        accentColor: "#0284c7",
        accentLight: "#38bdf8",
        backgroundColor: "#0c1a2e",
        cardColor: "#0f2847",
        textPrimary: "#FFFFFF",
        textMuted: "#94a3b8",
        fontFamily: "SORA",
        nameFontSize: 24,
        bodyFontSize: 14,
        boldHeadings: true,
        cardRadius: 12,
        shadowIntensity: "SOFT",
        glowEffect: false,
        phoneBgType: "GRADIENT",
        phoneBgPreset: "ocean-depth",
        phoneBgColor1: "#0c1a2e",
        phoneBgColor2: "#0a2540",
        phoneBgAngle: 180,
      },
    }),
  ]);
  console.log(`✅ Created ${designs.length} card designs`);

  // =============================================================================
  // Create Cards
  // =============================================================================
  const cards = await Promise.all([
    prisma.card.create({
      data: {
        userId: users[0].id,
        businessProfileId: profiles[0].id,
        name: "Main Card - Sarah",
        cardType: CardType.HYBRID,
        status: CardStatus.ACTIVE,
        slug: "sarah-anderson-card",
        shareUrl: "https://samcard.app/c/sarah-anderson-card",
        shortUrl: "https://samcard.app/s/sarah",
        nfcEnabled: true,
        nfcUid: "04:A2:B3:C4:D5:E6:F7",
        nfcWriteCount: 1,
        qrEnabled: true,
        qrShape: QRShapeType.ROUNDED,
        qrConfig: {
          shapeId: "ROUNDED",
          dotShape: "ROUNDED",
          finderStyle: "ROUNDED",
          eyeBall: "CIRCLE",
          bodyScale: 0.8,
          fg: "#FFFFFF",
          bg: "#000000",
          gradEnabled: false,
          gradStops: [],
          gradAngle: 180,
          selectedLogo: null,
          customLogoUrl: null,
          designLabel: "QR Style",
          shapeLabel: "Rounded",
        },
        designId: designs[0].id,
        backgroundColor: "#000000",
        accentColor: "#008001",
        accentLight: "#49B618",
        textColor: "#FFFFFF",
        cardColor: "#0a0a0a",
        cardRadius: 16,
        fontFamily: FontFamily.INTER,
        nameFontSize: 24,
        bodyFontSize: 14,
        boldHeadings: false,
        phoneBgType: WallpaperType.GRADIENT,
        phoneBgPreset: "deep-space",
        phoneBgColor1: "#000000",
        phoneBgColor2: "#0a0a0a",
        phoneBgAngle: 180,
        shadowIntensity: ShadowIntensity.MEDIUM,
        glowEffect: true,
        showProfile: true,
        showHeading: true,
        showContact: true,
        showSocial: true,
        showLinks: true,
        showAppointment: true,
        showBusinessDetails: true,
        showExtraSections: true,
        totalViews: 3421,
        totalTaps: 892,
        totalScans: 1247,
        totalSaves: 456,
        totalShares: 89,
        uniqueVisitors: 2156,
        linkClicks: 479,
        thisWeekViews: 234,
        thisWeekTaps: 67,
        monthlyTapGoal: 2000,
        monthlyViewGoal: 5000,
        completionScore: 95,
        publishedAt: new Date("2024-01-15"),
        lastSharedAt: new Date("2024-02-20"),
      },
    }),
    prisma.card.create({
      data: {
        userId: users[0].id,
        businessProfileId: profiles[0].id,
        name: "Portfolio Card",
        cardType: CardType.QR,
        status: CardStatus.ACTIVE,
        slug: "sarah-portfolio",
        shareUrl: "https://samcard.app/c/sarah-portfolio",
        qrEnabled: true,
        qrShape: QRShapeType.CIRCLE,
        designId: designs[1].id,
        backgroundColor: "#0c1a2e",
        accentColor: "#0284c7",
        accentLight: "#38bdf8",
        textColor: "#FFFFFF",
        cardColor: "#0f2847",
        cardRadius: 12,
        fontFamily: FontFamily.SORA,
        nameFontSize: 22,
        bodyFontSize: 14,
        boldHeadings: true,
        phoneBgType: WallpaperType.GRADIENT,
        phoneBgColor1: "#0c1a2e",
        phoneBgColor2: "#0a2540",
        phoneBgAngle: 180,
        shadowIntensity: ShadowIntensity.SOFT,
        glowEffect: false,
        showProfile: true,
        showHeading: true,
        showContact: true,
        showSocial: true,
        showLinks: true,
        showAppointment: false,
        showBusinessDetails: false,
        showExtraSections: true,
        totalViews: 1234,
        totalTaps: 0,
        totalScans: 892,
        totalSaves: 234,
        totalShares: 45,
        uniqueVisitors: 890,
        completionScore: 80,
        publishedAt: new Date("2024-02-01"),
      },
    }),
  ]);
  console.log(`✅ Created ${cards.length} cards`);

  // =============================================================================
  // Create Card Analytics (Daily aggregates)
  // =============================================================================
  const analytics = [];
  const now = new Date();
  for (const card of cards) {
    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      analytics.push({
        cardId: card.id,
        date: new Date(date.toISOString().split("T")[0]),
        views: Math.floor(Math.random() * 100) + 50,
        uniqueViews: Math.floor(Math.random() * 70) + 30,
        taps: Math.floor(Math.random() * 30) + 10,
        uniqueTaps: Math.floor(Math.random() * 20) + 5,
        scans: Math.floor(Math.random() * 50) + 20,
        uniqueScans: Math.floor(Math.random() * 35) + 15,
        saves: Math.floor(Math.random() * 15) + 5,
        shares: Math.floor(Math.random() * 5),
        linkClicks: Math.floor(Math.random() * 20) + 5,
        nfcTraffic: Math.floor(Math.random() * 20),
        qrTraffic: Math.floor(Math.random() * 40),
        directTraffic: Math.floor(Math.random() * 30),
        searchTraffic: Math.floor(Math.random() * 10),
        socialTraffic: Math.floor(Math.random() * 10),
        referralTraffic: Math.floor(Math.random() * 10),
        deviceBreakdown: { ios: 45, android: 40, web: 15 },
        browserBreakdown: { chrome: 55, safari: 35, firefox: 10 },
        countryBreakdown: { USA: 70, UK: 15, Canada: 10, Other: 5 },
        avgDurationSeconds: Math.random() * 60 + 30,
        maxDurationSeconds: Math.floor(Math.random() * 120 + 60),
        avgScrollDepth: Math.random() * 50 + 40,
        totalSessions: Math.floor(Math.random() * 80) + 40,
        leadsGenerated: Math.floor(Math.random() * 5),
      });
    }
  }
  await prisma.cardAnalytics.createMany({ data: analytics });
  console.log(`✅ Created ${analytics.length} daily analytics records`);

  // =============================================================================
  // Create Leads
  // =============================================================================
  const leads = await Promise.all([
    prisma.lead.create({
      data: {
        userId: users[0].id,
        businessProfileId: profiles[0].id,
        cardId: cards[0].id,
        name: "Michael Chen",
        firstName: "Michael",
        lastName: "Chen",
        email: "michael.chen@techcorp.com",
        phone: "+1-555-0400",
        company: "TechCorp Inc.",
        jobTitle: "Engineering Manager",
        source: LeadSource.QR,
        sourceDetail: "qr_scan",
        engagementScore: 95,
        interestLevel: 5,
        tags: ["enterprise", "potential-partner", "hot-lead"],
        status: LeadStatus.CONTACTED,
        leadScore: 85,
        marketingConsent: true,
        consentGivenAt: new Date("2024-02-11"),
        lastContactedAt: new Date("2024-02-12"),
        lastEngagedAt: new Date("2024-02-11T14:30:00"),
        interactionCount: 3,
      },
    }),
    prisma.lead.create({
      data: {
        userId: users[0].id,
        businessProfileId: profiles[0].id,
        cardId: cards[0].id,
        name: "Emma Wilson",
        firstName: "Emma",
        lastName: "Wilson",
        email: "emma.wilson@designstudio.com",
        company: "Design Studio",
        jobTitle: "Creative Director",
        source: LeadSource.NFC,
        sourceDetail: "nfc_tap",
        engagementScore: 88,
        interestLevel: 4,
        tags: ["design", "collaboration"],
        status: LeadStatus.QUALIFIED,
        marketingConsent: true,
        gdprConsent: true,
        lastEngagedAt: new Date("2024-02-10T11:45:00"),
        interactionCount: 2,
      },
    }),
    prisma.lead.create({
      data: {
        userId: users[0].id,
        businessProfileId: profiles[0].id,
        name: "James Rodriguez",
        firstName: "James",
        lastName: "Rodriguez",
        email: "j.rodriguez@startup.io",
        jobTitle: "Founder & CEO",
        company: "Startup.io",
        source: LeadSource.LINK_CLICK,
        sourceDetail: "portfolio_link",
        engagementScore: 65,
        interestLevel: 3,
        tags: ["startup", "networking"],
        status: LeadStatus.NEW,
        marketingConsent: false,
        interactionCount: 1,
      },
    }),
    prisma.lead.create({
      data: {
        userId: users[0].id,
        businessProfileId: profiles[0].id,
        name: "Sophia Kumar",
        firstName: "Sophia",
        lastName: "Kumar",
        email: "sophia.kumar@agency.com",
        company: "Digital Agency",
        jobTitle: "Head of Design",
        source: LeadSource.SOCIAL,
        sourceDetail: "linkedin_click",
        engagementScore: 78,
        interestLevel: 4,
        tags: ["agency", "potential-client"],
        status: LeadStatus.CONTACTED,
        marketingConsent: true,
        lastContactedAt: new Date("2024-02-09"),
        interactionCount: 2,
      },
    }),
    prisma.lead.create({
      data: {
        userId: users[0].id,
        businessProfileId: profiles[0].id,
        name: "David Park",
        email: "david.park@enterprise.com",
        company: "Enterprise Solutions",
        jobTitle: "VP of Product",
        source: LeadSource.DIRECT,
        engagementScore: 45,
        interestLevel: 2,
        tags: ["enterprise"],
        status: LeadStatus.NEW,
        marketingConsent: true,
      },
    }),
  ]);
  console.log(`✅ Created ${leads.length} leads`);

  // =============================================================================
  // Create Lead Interactions
  // =============================================================================
  await prisma.leadInteraction.createMany({
    data: [
      { leadId: leads[0].id, type: "email_sent", subject: "Thanks for connecting!", direction: "outbound", outcome: "replied", createdAt: new Date("2024-02-12T10:00:00") },
      { leadId: leads[0].id, type: "call", subject: "Discovery Call", direction: "outbound", outcome: "answered", durationSeconds: 1800, startedAt: new Date("2024-02-14T15:00:00"), completedAt: new Date("2024-02-14T15:30:00") },
      { leadId: leads[0].id, type: "email_opened", subject: "Follow-up", metadata: { emailId: "em_123" }, createdAt: new Date("2024-02-15T09:00:00") },
      { leadId: leads[1].id, type: "email_sent", subject: "Portfolio Review", direction: "outbound", outcome: "opened", createdAt: new Date("2024-02-11T09:00:00") },
      { leadId: leads[1].id, type: "meeting_scheduled", subject: "Project Discussion", direction: "outbound", scheduledAt: new Date("2024-02-15T14:00:00"), createdAt: new Date("2024-02-13T10:00:00") },
      { leadId: leads[1].id, type: "meeting_completed", subject: "Project Discussion", outcome: "completed", durationSeconds: 2700, startedAt: new Date("2024-02-15T14:00:00"), completedAt: new Date("2024-02-15T14:45:00") },
      { leadId: leads[2].id, type: "note", body: "Interested in design system project. Follow up next week.", createdAt: new Date("2024-02-10T16:00:00") },
      { leadId: leads[3].id, type: "linkedin_message", subject: "Introduction", direction: "outbound", outcome: "replied", createdAt: new Date("2024-02-08T11:00:00") },
    ],
  });
  console.log("✅ Created lead interactions");

  // =============================================================================
  // Create Lead Tasks
  // =============================================================================
  await prisma.leadTask.createMany({
    data: [
      { leadId: leads[0].id, title: "Send proposal", status: "completed", priority: "high", dueDate: new Date("2024-02-20"), completedAt: new Date("2024-02-19") },
      { leadId: leads[0].id, title: "Schedule demo", status: "pending", priority: "high", dueDate: new Date("2024-02-25") },
      { leadId: leads[1].id, title: "Prepare portfolio presentation", status: "in_progress", priority: "medium", dueDate: new Date("2024-02-22") },
      { leadId: leads[1].id, title: "Send case studies", status: "pending", priority: "medium", dueDate: new Date("2024-02-18") },
      { leadId: leads[2].id, title: "Initial call", status: "pending", priority: "medium", dueDate: new Date("2024-02-28") },
      { leadId: leads[3].id, title: "Send pricing", status: "pending", priority: "high", dueDate: new Date("2024-02-24") },
    ],
  });
  console.log("✅ Created lead tasks");

  // =============================================================================
  // Create NFC Cards
  // =============================================================================
  await prisma.nfcCard.createMany({
    data: [
      {
        cardId: cards[0].id,
        uid: "04:A2:B3:C4:D5:E6:F7",
        chipType: "NTAG216",
        ndefCapacity: 888,
        physicalCardId: "SC-2024-001",
        cardMaterial: "plastic",
        cardColors: ["black", "white"],
        cardWeight: 6.5,
        userId: users[0].id,
        assignedAt: new Date("2024-01-15"),
        isActivated: true,
        isLinked: true,
        isAssigned: true,
        activationCode: "ACT-123456",
        writeCount: 1,
        lastWrittenAt: new Date("2024-01-15"),
        totalTaps: 892,
        lastTapAt: new Date(),
        productId: "NFC-PLASTIC-STD",
        sku: "NFC-PLASTIC-BLK-001",
      },
      {
        uid: "04:B2:C3:D4:E5:F6:A7",
        chipType: "NTAG215",
        ndefCapacity: 504,
        physicalCardId: "SC-2024-002",
        cardMaterial: "plastic",
        cardColors: ["white"],
        cardWeight: 6.5,
        isActivated: false,
        isLinked: false,
        isAssigned: false,
        totalTaps: 0,
      },
      {
        cardId: cards[1].id,
        uid: "04:C3:D4:E5:F6:A7:B8",
        chipType: "NTAG216",
        ndefCapacity: 888,
        physicalCardId: "SC-2024-003",
        cardMaterial: "metal",
        cardColors: ["silver", "gold"],
        cardWeight: 28.0,
        userId: users[0].id,
        assignedAt: new Date("2024-02-01"),
        isActivated: true,
        isLinked: true,
        isAssigned: true,
        activationCode: "ACT-789012",
        writeCount: 1,
        lastWrittenAt: new Date("2024-02-01"),
        totalTaps: 234,
        lastTapAt: new Date(),
        productId: "NFC-METAL-PREMIUM",
        sku: "NFC-METAL-SLV-001",
      },
    ],
  });
  console.log("✅ Created NFC cards");

  // =============================================================================
  // Create Products
  // =============================================================================
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Standard NFC Business Card",
        slug: "standard-nfc-business-card",
        description: "Premium plastic NFC business card with full color printing",
        shortDescription: "Premium plastic NFC business card",
        price: 29.99,
        sku: "NFC-PLASTIC-STD",
        barcode: "123456789012",
        inventory: 500,
        lowStockThreshold: 50,
        weight: 6.5,
        dimensions: { length: 85.6, width: 54, height: 0.8 },
        thumbnailUrl: "https://example.com/images/standard-card.jpg",
        category: "NFC Cards",
        tags: ["nfc", "plastic", "standard"],
        status: "active",
        isDigital: false,
        nfcChipType: "NTAG216",
        cardMaterial: "plastic",
        cardColors: ["black", "white", "clear"],
        requiresShipping: true,
        freeShipping: false,
      },
    }),
    prisma.product.create({
      data: {
        name: "Metal NFC Business Card",
        slug: "metal-nfc-business-card",
        description: "Luxury stainless steel NFC business card",
        shortDescription: "Premium metal NFC business card",
        price: 79.99,
        compareAtPrice: 99.99,
        sku: "NFC-METAL-PREMIUM",
        barcode: "123456789013",
        inventory: 100,
        lowStockThreshold: 20,
        weight: 28.0,
        dimensions: { length: 85.6, width: 54, height: 0.5 },
        thumbnailUrl: "https://example.com/images/metal-card.jpg",
        category: "NFC Cards",
        tags: ["nfc", "metal", "premium", "luxury"],
        status: "active",
        isDigital: false,
        nfcChipType: "NTAG216",
        cardMaterial: "metal",
        cardColors: ["silver", "gold", "black"],
        requiresShipping: true,
        freeShipping: true,
      },
    }),
    prisma.product.create({
      data: {
        name: "Wood NFC Business Card",
        slug: "wood-nfc-business-card",
        description: "Eco-friendly bamboo NFC business card",
        shortDescription: "Sustainable bamboo NFC card",
        price: 39.99,
        sku: "NFC-WOOD-ECO",
        inventory: 200,
        weight: 4.0,
        dimensions: { length: 85.6, width: 54, height: 1.0 },
        category: "NFC Cards",
        tags: ["nfc", "wood", "eco-friendly", "sustainable"],
        status: "active",
        isDigital: false,
        nfcChipType: "NTAG215",
        cardMaterial: "wood",
        cardColors: ["natural", "dark"],
        requiresShipping: true,
        freeShipping: false,
      },
    }),
  ]);
  console.log(`✅ Created ${products.length} products`);

  // =============================================================================
  // Create Orders
  // =============================================================================
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        userId: users[0].id,
        orderNumber: "ORD-2024-001",
        items: [
          { productId: products[0].id, sku: "NFC-PLASTIC-BLK-001", name: "Standard NFC Card - Black", quantity: 5, unitPrice: 29.99, total: 149.95, options: { color: "black" } },
          { productId: products[0].id, sku: "NFC-PLASTIC-WHT-001", name: "Standard NFC Card - White", quantity: 3, unitPrice: 29.99, total: 89.97, options: { color: "white" } },
        ],
        subtotal: 239.92,
        tax: 21.59,
        taxRate: 0.09,
        discount: 0,
        shipping: 9.99,
        total: 271.50,
        currency: "USD",
        status: OrderStatus.DELIVERED,
        shippingName: "Sarah Anderson",
        shippingPhone: "+1-555-0100",
        shippingAddress: {
          line1: "123 Market Street",
          city: "San Francisco",
          state: "CA",
          postalCode: "94105",
          country: "USA",
        },
        shippingMethod: "Standard Shipping",
        shippingCost: 9.99,
        trackingNumber: "1Z999AA10123456784",
        trackingUrl: "https://ups.com/track/1Z999AA10123456784",
        carrier: "UPS",
        paidAt: new Date("2024-01-15"),
        shippedAt: new Date("2024-01-20"),
        deliveredAt: new Date("2024-01-23"),
      },
    }),
    prisma.order.create({
      data: {
        userId: users[0].id,
        orderNumber: "ORD-2024-002",
        items: [
          { productId: products[1].id, sku: "NFC-METAL-SLV-001", name: "Metal NFC Card - Silver", quantity: 2, unitPrice: 79.99, total: 159.98, options: { color: "silver" } },
        ],
        subtotal: 159.98,
        tax: 14.40,
        taxRate: 0.09,
        discount: -15.99,
        discountCode: "WELCOME10",
        shipping: 0,
        total: 158.39,
        currency: "USD",
        status: OrderStatus.PROCESSING,
        shippingName: "Sarah Anderson",
        shippingAddress: {
          line1: "123 Market Street",
          city: "San Francisco",
          state: "CA",
          postalCode: "94105",
          country: "USA",
        },
        paidAt: new Date("2024-02-10"),
      },
    }),
    prisma.order.create({
      data: {
        userId: users[1].id,
        orderNumber: "ORD-2024-003",
        items: [
          { productId: products[1].id, sku: "NFC-METAL-GLD-001", name: "Metal NFC Card - Gold", quantity: 10, unitPrice: 79.99, total: 799.90, options: { color: "gold" } },
        ],
        subtotal: 799.90,
        tax: 71.99,
        taxRate: 0.09,
        discount: 0,
        shipping: 14.99,
        total: 886.88,
        currency: "USD",
        status: OrderStatus.SHIPPED,
        shippingName: "Saad Ahmed",
        shippingAddress: {
          line1: "456 Business Ave",
          city: "New York",
          state: "NY",
          postalCode: "10001",
          country: "USA",
        },
        trackingNumber: "1Z999BB20987654321",
        carrier: "UPS",
        paidAt: new Date("2024-02-18"),
        shippedAt: new Date("2024-02-20"),
      },
    }),
  ]);
  console.log(`✅ Created ${orders.length} orders`);

  // =============================================================================
  // Create Invoices
  // =============================================================================
  await prisma.invoice.createMany({
    data: [
      {
        userId: users[0].id,
        invoiceNumber: "INV-2024-001",
        subscriptionId: "SUB-PRO-2024",
        periodStart: new Date("2024-02-01"),
        periodEnd: new Date("2024-03-01"),
        items: [
          { description: "Professional Plan - Monthly", quantity: 1, unitPrice: 19.00, total: 19.00 },
        ],
        subtotal: 19.00,
        tax: 1.71,
        taxRate: 0.09,
        discount: 0,
        total: 20.71,
        currency: "USD",
        status: PaymentStatus.PAID,
        paidAt: new Date("2024-02-01"),
        stripeInvoiceId: "in_1234567890",
        stripePaymentIntent: "pi_1234567890",
        stripeSubscriptionId: "sub_1234567890",
      },
      {
        userId: users[0].id,
        invoiceNumber: "INV-2024-002",
        subscriptionId: "SUB-PRO-2024",
        periodStart: new Date("2024-03-01"),
        periodEnd: new Date("2024-04-01"),
        items: [
          { description: "Professional Plan - Monthly", quantity: 1, unitPrice: 19.00, total: 19.00 },
        ],
        subtotal: 19.00,
        tax: 1.71,
        taxRate: 0.09,
        discount: 0,
        total: 20.71,
        currency: "USD",
        status: PaymentStatus.PENDING,
        dueDate: new Date("2024-03-01"),
        stripeInvoiceId: "in_1234567891",
        stripeSubscriptionId: "sub_1234567890",
      },
    ],
  });
  console.log("✅ Created invoices");

  // =============================================================================
  // Create Goals
  // =============================================================================
  await prisma.goal.createMany({
    data: [
      {
        userId: users[0].id,
        name: "Monthly Taps Goal",
        type: "monthly_taps",
        targetValue: 2000,
        currentValue: 1340,
        period: "monthly",
        startDate: new Date("2024-02-01"),
        endDate: new Date("2024-02-29"),
        status: "active",
        progress: 67.0,
      },
      {
        userId: users[0].id,
        name: "Weekly Saves Goal",
        type: "weekly_saves",
        targetValue: 50,
        currentValue: 41,
        period: "weekly",
        startDate: new Date("2024-02-19"),
        endDate: new Date("2024-02-25"),
        status: "active",
        progress: 82.0,
      },
      {
        userId: users[0].id,
        name: "Lead Conversion",
        type: "conversion_rate",
        targetValue: 10,
        currentValue: 7.4,
        period: "monthly",
        startDate: new Date("2024-02-01"),
        endDate: new Date("2024-02-29"),
        status: "active",
        progress: 74.0,
      },
    ],
  });
  console.log("✅ Created goals");

  // =============================================================================
  // Create Notifications
  // =============================================================================
  await prisma.notification.createMany({
    data: [
      {
        userId: users[0].id,
        type: NotificationType.LEAD,
        title: "New Lead",
        message: "Michael Chen viewed your card and saved your contact",
        data: { leadId: leads[0].id },
        priority: "normal",
      },
      {
        userId: users[0].id,
        type: NotificationType.TAP,
        title: "NFC Tap",
        message: "Someone tapped your NFC card in San Francisco, CA",
        data: { cardId: cards[0].id, location: "San Francisco, CA" },
        priority: "low",
        read: true,
        readAt: new Date(),
      },
      {
        userId: users[0].id,
        type: NotificationType.CARD,
        title: "New Card Created",
        message: "Your portfolio card is now live!",
        data: { cardId: cards[1].id },
        priority: "normal",
      },
      {
        userId: users[0].id,
        type: NotificationType.ANALYTICS,
        title: "Weekly Report Ready",
        message: "Your weekly performance report is ready to view",
        priority: "normal",
      },
      {
        userId: users[0].id,
        type: NotificationType.BILLING,
        title: "Subscription Renewed",
        message: "Your Professional plan has been renewed for $19.00",
        priority: "high",
      },
    ],
  });
  console.log("✅ Created notifications");

  // =============================================================================
  // Create Dashboard Stats
  // =============================================================================
  await prisma.dashboardStats.createMany({
    data: [
      {
        userId: users[0].id,
        todayTaps: 45,
        todayViews: 123,
        todayLeads: 3,
        weekTaps: 287,
        weekViews: 891,
        weekLeads: 12,
        monthTaps: 1340,
        monthViews: 3421,
        monthLeads: 45,
        tapsTrend: 12.5,
        viewsTrend: 24.1,
        leadsTrend: 8.2,
        conversionRate: 7.4,
        topCardId: cards[0].id,
        topCardName: cards[0].name,
        topCardTaps: 892,
      },
      {
        userId: users[1].id,
        todayTaps: 156,
        todayViews: 456,
        todayLeads: 8,
        weekTaps: 1023,
        weekViews: 3421,
        weekLeads: 45,
        monthTaps: 4234,
        monthViews: 12456,
        monthLeads: 189,
        tapsTrend: 18.3,
        viewsTrend: 15.7,
        leadsTrend: 22.1,
        conversionRate: 8.9,
        topCardId: cards[0].id,
        topCardName: "Main Card",
        topCardTaps: 2340,
      },
    ],
  });
  console.log("✅ Created dashboard stats");

  // =============================================================================
  // Create Audit Logs
  // =============================================================================
  await prisma.auditLog.createMany({
    data: [
      { userId: users[0].id, action: "CREATE", entityType: "Card", entityId: cards[0].id, description: "Created new digital business card", ipAddress: "192.168.1.1" },
      { userId: users[0].id, action: "UPDATE", entityType: "Card", entityId: cards[0].id, description: "Updated card theme", changes: { before: { accentColor: "#000000" }, after: { accentColor: "#008001" } } },
      { userId: users[0].id, action: "LOGIN", entityType: "Session", description: "User logged in", ipAddress: "192.168.1.1", deviceType: DeviceType.WEB },
      { userId: users[0].id, action: "SHARE", entityType: "Card", entityId: cards[0].id, description: "Shared card via WhatsApp", ipAddress: "192.168.1.1" },
      { userId: users[0].id, action: "CREATE", entityType: "Lead", entityId: leads[0].id, description: "New lead created from QR scan", ipAddress: "10.0.0.1" },
      { userId: users[0].id, action: "VIEW", entityType: "Card", entityId: cards[0].id, description: "Viewed card analytics", ipAddress: "192.168.1.1" },
    ],
  });
  console.log("✅ Created audit logs");

  // =============================================================================
  // Create Connected Accounts
  // =============================================================================
  await prisma.userConnectedAccount.createMany({
    data: [
      {
        userId: users[0].id,
        platform: "linkedin",
        connected: true,
        connectedAt: new Date("2024-01-10"),
        accountId: "li_123456",
        accountName: "Sarah Anderson",
        accountUrl: "https://linkedin.com/in/sarahanderson",
        accountAvatar: "https://example.com/avatar.jpg",
        scopes: ["profile", "email", "contacts"],
        lastSyncedAt: new Date("2024-02-20"),
        syncStatus: "success",
      },
      {
        userId: users[0].id,
        platform: "google",
        connected: true,
        connectedAt: new Date("2024-01-05"),
        accountId: "g_987654",
        accountName: "sarah@gmail.com",
        scopes: ["email", "profile"],
        lastSyncedAt: new Date("2024-02-19"),
        syncStatus: "success",
      },
      {
        userId: users[0].id,
        platform: "twitter",
        connected: false,
      },
    ],
  });
  console.log("✅ Created connected accounts");

  // =============================================================================
  // Create Sessions
  // =============================================================================
  await prisma.session.createMany({
    data: [
      {
        userId: users[0].id,
        token: "sess_demo_123456",
        device: "Chrome on MacOS",
        deviceType: DeviceType.WEB,
        browser: "Chrome",
        os: "MacOS",
        ipAddress: "192.168.1.1",
        location: "San Francisco, CA",
        isCurrent: true,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        lastActiveAt: new Date(),
      },
      {
        userId: users[0].id,
        token: "sess_demo_789012",
        device: "Safari on iPhone",
        deviceType: DeviceType.IOS,
        browser: "Safari",
        os: "iOS 17",
        ipAddress: "192.168.1.2",
        location: "San Francisco, CA",
        isCurrent: false,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        lastActiveAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    ],
  });
  console.log("✅ Created sessions");

  console.log("\n🎉 Database seeding completed successfully!");
  console.log("\nSample data created:");
  console.log(`  - ${users.length} users`);
  console.log(`  - ${profiles.length} business profiles`);
  console.log(`  - ${designs.length} card designs`);
  console.log(`  - ${cards.length} digital cards`);
  console.log(`  - ${analytics.length} analytics records`);
  console.log(`  - ${leads.length} leads`);
  console.log(`  - ${orders.length} orders`);
  console.log(`  - ${products.length} products`);
  console.log(`  - ${plans.length} plans`);
  console.log(`  - ${palettes.length} color palettes`);
  console.log(`  - ${wallpapers.length} wallpaper presets`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


-- CardDesign table - stores design settings for cards
CREATE TABLE IF NOT EXISTS "CardDesign" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "cardId" UUID NOT NULL REFERENCES "Card"(id) ON DELETE CASCADE,
  "palette" TEXT DEFAULT 'green',
  "accentColor" TEXT DEFAULT '#008001',
  "accentLight" TEXT DEFAULT '#49B618',
  "bgColor" TEXT DEFAULT '#0a0f0a',
  "cardColor" TEXT DEFAULT '#111a11',
  "textPrimary" TEXT DEFAULT '#f0f0f0',
  "textMuted" TEXT DEFAULT '#7a9a7a',
  "phoneBgPreset" TEXT DEFAULT 'aurora',
  "phoneBgColor1" TEXT DEFAULT '#0a0f0a',
  "phoneBgColor2" TEXT DEFAULT '#003322',
  "phoneBgAngle" INTEGER DEFAULT 135,
  "phoneBgType" TEXT DEFAULT 'gradient',
  "font" TEXT DEFAULT 'inter',
  "bodyFontSize" INTEGER DEFAULT 11,
  "nameFontSize" INTEGER DEFAULT 22,
  "boldHeadings" BOOLEAN DEFAULT true,
  "cardRadius" INTEGER DEFAULT 16,
  "shadowIntensity" TEXT DEFAULT 'soft',
  "glowEffect" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE("cardId")
);

-- CardContent table - stores content/sections for cards
CREATE TABLE IF NOT EXISTS "CardContent" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "cardId" UUID NOT NULL REFERENCES "Card"(id) ON DELETE CASCADE,
  "profileImage" TEXT DEFAULT '',
  "brandLogo" TEXT DEFAULT '',
  "logoPosition" TEXT DEFAULT 'top-right',
  "formData" JSONB DEFAULT '{}',
  "connectFields" JSONB DEFAULT '[]',
  "sections" JSONB DEFAULT '{"profile":true,"headingText":true,"contactUs":true,"socialLinks":true,"links":true,"appointment":false,"collectContacts":false,"businessDetails":true}',
  "customLinks" JSONB DEFAULT '[]',
  "extraSections" JSONB DEFAULT '[]',
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE("cardId")
);

-- CardQRConfig table - stores QR code configuration for cards
CREATE TABLE IF NOT EXISTS "CardQRConfig" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "cardId" UUID NOT NULL REFERENCES "Card"(id) ON DELETE CASCADE,
  "shapeId" TEXT DEFAULT 'square',
  "dotShape" TEXT DEFAULT 'square',
  "finderStyle" TEXT DEFAULT 'square',
  "eyeBall" TEXT DEFAULT 'square',
  "bodyScale" DECIMAL(3,2) DEFAULT 1.0,
  "fg" TEXT DEFAULT '#000000',
  "bg" TEXT DEFAULT '#ffffff',
  "accentFg" TEXT DEFAULT '#000000',
  "accentBg" TEXT DEFAULT '#ffffff',
  "strokeEnabled" BOOLEAN DEFAULT false,
  "strokeColor" TEXT DEFAULT '#000000',
  "gradEnabled" BOOLEAN DEFAULT false,
  "gradStops" JSONB DEFAULT '[]',
  "gradAngle" INTEGER DEFAULT 135,
  "selectedLogo" TEXT DEFAULT '',
  "customLogoUrl" TEXT DEFAULT '',
  "logoBg" TEXT DEFAULT '#ffffff',
  "designLabel" TEXT DEFAULT '',
  "shapeLabel" TEXT DEFAULT '',
  "stickerId" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE("cardId")
);

-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE "CardDesign" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CardContent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CardQRConfig" ENABLE ROW LEVEL SECURITY;

-- CardDesign policies
CREATE POLICY "Users can view their own card designs"
  ON "CardDesign" FOR SELECT
  USING ( EXISTS (
    SELECT 1 FROM "Card"
    WHERE "Card".id = "CardDesign".cardId
    AND "Card".userId = auth.uid()
  ));

CREATE POLICY "Users can insert their own card designs"
  ON "CardDesign" FOR INSERT
  WITH CHECK ( EXISTS (
    SELECT 1 FROM "Card"
    WHERE "Card".id = "CardDesign".cardId
    AND "Card".userId = auth.uid()
  ));

CREATE POLICY "Users can update their own card designs"
  ON "CardDesign" FOR UPDATE
  USING ( EXISTS (
    SELECT 1 FROM "Card"
    WHERE "Card".id = "CardDesign".cardId
    AND "Card".userId = auth.uid()
  ));

CREATE POLICY "Users can delete their own card designs"
  ON "CardDesign" FOR DELETE
  USING ( EXISTS (
    SELECT 1 FROM "Card"
    WHERE "Card".id = "CardDesign".cardId
    AND "Card".userId = auth.uid()
  ));

-- CardContent policies
CREATE POLICY "Users can view their own card content"
  ON "CardContent" FOR SELECT
  USING ( EXISTS (
    SELECT 1 FROM "Card"
    WHERE "Card".id = "CardContent".cardId
    AND "Card".userId = auth.uid()
  ));

CREATE POLICY "Users can insert their own card content"
  ON "CardContent" FOR INSERT
  WITH CHECK ( EXISTS (
    SELECT 1 FROM "Card"
    WHERE "Card".id = "CardContent".cardId
    AND "Card".userId = auth.uid()
  ));

CREATE POLICY "Users can update their own card content"
  ON "CardContent" FOR UPDATE
  USING ( EXISTS (
    SELECT 1 FROM "Card"
    WHERE "Card".id = "CardContent".cardId
    AND "Card".userId = auth.uid()
  ));

CREATE POLICY "Users can delete their own card content"
  ON "CardContent" FOR DELETE
  USING ( EXISTS (
    SELECT 1 FROM "Card"
    WHERE "Card".id = "CardContent".cardId
    AND "Card".userId = auth.uid()
  ));

-- CardQRConfig policies
CREATE POLICY "Users can view their own QR configs"
  ON "CardQRConfig" FOR SELECT
  USING ( EXISTS (
    SELECT 1 FROM "Card"
    WHERE "Card".id = "CardQRConfig".cardId
    AND "Card".userId = auth.uid()
  ));

CREATE POLICY "Users can insert their own QR configs"
  ON "CardQRConfig" FOR INSERT
  WITH CHECK ( EXISTS (
    SELECT 1 FROM "Card"
    WHERE "Card".id = "CardQRConfig".cardId
    AND "Card".userId = auth.uid()
  ));

CREATE POLICY "Users can update their own QR configs"
  ON "CardQRConfig" FOR UPDATE
  USING ( EXISTS (
    SELECT 1 FROM "Card"
    WHERE "Card".id = "CardQRConfig".cardId
    AND "Card".userId = auth.uid()
  ));

CREATE POLICY "Users can delete their own QR configs"
  ON "CardQRConfig" FOR DELETE
  USING ( EXISTS (
    SELECT 1 FROM "Card"
    WHERE "Card".id = "CardQRConfig".cardId
    AND "Card".userId = auth.uid()
  ));

-- Add heroLayout column to CardDesign so the public /[slug] page
-- can render the correct hero layout independently of the palette name.
ALTER TABLE "CardDesign"
  ADD COLUMN IF NOT EXISTS "heroLayout" TEXT DEFAULT 'default';

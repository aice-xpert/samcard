-- Add the missing decorateImageUrl column to CardQRConfig.
--
-- The backend (backend/routes/card-qr.ts) writes `decorateImageUrl` on every QR
-- save (PUT /api/user/cards/:id/qr), but the column was never created in
-- 001_digital_card_tables.sql. Postgres rejected every insert/update with
-- "column CardQRConfig.decorateImageUrl does not exist", the frontend swallowed
-- the error, and the table stayed empty for every card — so the public card
-- page (src/app/[slug]/page.tsx) always rendered the default uncustomized QR.

ALTER TABLE "CardQRConfig"
  ADD COLUMN IF NOT EXISTS "decorateImageUrl" TEXT DEFAULT '';

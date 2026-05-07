-- Add sectionOrder and unifiedOrder columns to CardContent table
ALTER TABLE "CardContent" ADD COLUMN "sectionOrder" text[] DEFAULT '{}';
ALTER TABLE "CardContent" ADD COLUMN "unifiedOrder" text[] DEFAULT '{}';
-- Add templateId column to CardDesign so the dashboard can tell which
-- template a card was built from independently of `palette`. Previously
-- `palette` doubled as the template id, so any color/palette edit (which
-- rewrites `palette` to a color key or 'custom') wiped the template
-- identity even though the template's heroLayout survived.
ALTER TABLE "CardDesign"
  ADD COLUMN IF NOT EXISTS "templateId" TEXT;

-- Backfill: existing cards whose palette still holds a template id keep it.
-- (Template ids are kebab-case like 'medical-teal'; color keys are single
-- words like 'green'/'custom'. Copying is safe — getTemplateById ignores
-- non-template values anyway.)
UPDATE "CardDesign"
  SET "templateId" = "palette"
  WHERE "templateId" IS NULL AND "palette" LIKE '%-%';

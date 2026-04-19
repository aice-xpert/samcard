-- Enforce per-user unique card names with normalization:
--   1) trim surrounding spaces
--   2) case-insensitive comparison

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "Card"
    GROUP BY "userId", lower(trim("name"))
    HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION 'Cannot apply card name unique index: duplicate normalized names exist per user. Resolve duplicates first.';
  END IF;
END
$$;

CREATE UNIQUE INDEX IF NOT EXISTS "card_userid_name_normalized_unique"
  ON "Card" ("userId", lower(trim("name")));

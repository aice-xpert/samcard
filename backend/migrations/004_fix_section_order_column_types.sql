-- Fix sectionOrder and unifiedOrder column types.
-- Migration 003 created these as text[] (PostgreSQL native array), but the
-- backend serialises / deserialises them as JSON arrays via the Supabase REST
-- API (PostgREST).  PostgREST maps jsonb ↔ JSON arrays transparently, but it
-- maps text[] to a PostgreSQL array literal ("{"a","b"}") which is NOT the
-- same wire format.  The mismatch caused every write to be silently discarded,
-- leaving the columns as the empty-array default "{}".
--
-- Converting to jsonb fixes the round-trip so that JS arrays are stored and
-- returned correctly.  Existing rows whose columns are already "{}" (empty
-- text array) convert cleanly to '[]'::jsonb.

ALTER TABLE "CardContent"
  ALTER COLUMN "sectionOrder" TYPE jsonb
    USING to_jsonb("sectionOrder"),
  ALTER COLUMN "unifiedOrder" TYPE jsonb
    USING to_jsonb("unifiedOrder");

-- Update defaults to match the new type
ALTER TABLE "CardContent"
  ALTER COLUMN "sectionOrder" SET DEFAULT '[]'::jsonb,
  ALTER COLUMN "unifiedOrder" SET DEFAULT '[]'::jsonb;

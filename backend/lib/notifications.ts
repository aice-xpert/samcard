import { randomUUID } from "node:crypto";
import { supabase } from "../config/supabase";

type NotificationType =
  | "CARD"
  | "LEAD"
  | "TAP"
  | "SCAN"
  | "ANALYTICS"
  | "BILLING"
  | "SYSTEM"
  | "SECURITY"
  | "PROMO"
  | "MESSAGE";

/**
 * BUG 45 – Dedup guard.
 * Tracks (userId:type:title:sourceId) → timestamp of last successful insert.
 * If the same combination is fired within DEDUP_TTL_MS, the insert is skipped.
 */
const DEDUP_TTL_MS = 30_000; // 30 seconds
const dedupCache = new Map<string, number>();

function makeDedupKey(
  userId: string,
  type: string,
  title: string,
  sourceId?: string
): string {
  return `${userId}:${type}:${title}:${sourceId ?? ""}`;
}

/** Purge stale entries so the Map doesn't grow unbounded in long-running servers. */
function purgeDedupCache(): void {
  const now = Date.now();
  for (const [key, ts] of dedupCache) {
    if (now - ts > DEDUP_TTL_MS) dedupCache.delete(key);
  }
}

export async function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  opts: {
    sourceId?: string;
    sourceType?: string;
    actionUrl?: string;
    actionLabel?: string;
    priority?: string;
  } = {}
) {
  // ── Dedup check ────────────────────────────────────────────────────
  const key = makeDedupKey(userId, type, title, opts.sourceId);
  const lastFired = dedupCache.get(key);
  const now = Date.now();

  if (lastFired && now - lastFired < DEDUP_TTL_MS) {
    // Same notification already fired within the cooldown window — skip.
    return;
  }

  dedupCache.set(key, now);
  // Occasionally prune stale entries (1-in-20 chance to avoid doing it every call)
  if (Math.random() < 0.05) purgeDedupCache();
  // ──────────────────────────────────────────────────────────────────

  try {
    const { error } = await supabase.from("Notification").insert({
      id: randomUUID(),
      userId,
      type,
      title,
      message,
      read: false,
      priority: opts.priority ?? "normal",
      sourceId: opts.sourceId ?? null,
      sourceType: opts.sourceType ?? null,
      actionUrl: opts.actionUrl ?? null,
      actionLabel: opts.actionLabel ?? null,
      emailSent: false,
      pushSent: false,
      createdAt: new Date().toISOString(),
    });
    if (error) {
      // Roll back the dedup entry so the next attempt isn't silently blocked
      dedupCache.delete(key);
      console.error("[createNotification] insert error:", error.message);
    }
  } catch (err) {
    dedupCache.delete(key);
    console.error("[createNotification] unexpected error:", err);
  }
}

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
      createdAt: new Date().toISOString(),
    });
    if (error) console.error("[createNotification] insert error:", error.message);
  } catch (err) {
    console.error("[createNotification] unexpected error:", err);
  }
}

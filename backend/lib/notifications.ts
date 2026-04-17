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
    await supabase.from("Notification").insert({
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
  } catch {
    // Notification creation is non-critical — never let it break the main flow
  }
}

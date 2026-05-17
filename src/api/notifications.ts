import type {
  Notification,
  NotificationRule,
  NotificationRuleCreateRequest,
  NotificationRuleUpdateRequest,
} from "@/types/api.types";
import { fetchAPI } from "./fetch-client";
import { TIMEOUTS } from "./constants";

export async function getNotifications(): Promise<Notification[]> {
  return fetchAPI<Notification[]>("/notifications/", { method: "GET", cache: "no-store" });
}

export async function getNotificationRules(): Promise<NotificationRule[]> {
  return fetchAPI<NotificationRule[]>("/notifications/rules", { method: "GET", cache: "no-store" }, TIMEOUTS.DEFAULT);
}

export async function sendEmailAlerts(): Promise<{ emails_sent: number }> {
  return fetchAPI<{ emails_sent: number }>(
    "/notifications/send-email-alerts",
    { method: "POST" },
    TIMEOUTS.AUTH,
  );
}

export async function createNotificationRule(payload: NotificationRuleCreateRequest): Promise<NotificationRule> {
  return fetchAPI<NotificationRule>(
    "/notifications/rules",
    { method: "POST", body: JSON.stringify(payload) },
    TIMEOUTS.AUTH,
  );
}

export async function updateNotificationRule(
  ruleId: number,
  payload: NotificationRuleUpdateRequest,
): Promise<NotificationRule> {
  return fetchAPI<NotificationRule>(
    `/notifications/rules/${ruleId}`,
    { method: "PATCH", body: JSON.stringify(payload) },
    TIMEOUTS.AUTH,
  );
}

export async function deleteNotificationRule(ruleId: number): Promise<void> {
  return fetchAPI<void>(`/notifications/rules/${ruleId}`, { method: "DELETE" }, TIMEOUTS.AUTH);
}

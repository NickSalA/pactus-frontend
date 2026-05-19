import type { Notification, NotificationRule } from '@/types/api.types';
import {
  ApiNotificationRuleCreateRequest,
  ApiNotificationRuleUpdateRequest,
} from '@/types/api';
import { apiGet, apiPost, apiPatch, apiDelete } from './axiosInstance';
import { TIMEOUTS } from './constants';

export async function getNotifications(): Promise<Notification[]> {
  return apiGet<Notification[]>('/notifications/', {
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function getNotificationRules(): Promise<NotificationRule[]> {
  return apiGet<NotificationRule[]>('/notifications/rules', {
    timeout: TIMEOUTS.DEFAULT,
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function sendEmailAlerts(): Promise<{ emails_sent: number }> {
  return apiPost<{ emails_sent: number }>(
    '/notifications/send-email-alerts',
    undefined,
    {
      timeout: TIMEOUTS.AUTH,
    },
  );
}

export async function createNotificationRule(
  payload: ApiNotificationRuleCreateRequest,
): Promise<NotificationRule> {
  return apiPost<NotificationRule>('/notifications/rules', payload, {
    timeout: TIMEOUTS.AUTH,
  });
}

export async function updateNotificationRule(
  ruleId: number,
  payload: ApiNotificationRuleUpdateRequest,
): Promise<NotificationRule> {
  return apiPatch<NotificationRule>(`/notifications/rules/${ruleId}`, payload, {
    timeout: TIMEOUTS.AUTH,
  });
}

export async function deleteNotificationRule(ruleId: number): Promise<void> {
  return apiDelete(`/notifications/rules/${ruleId}`, {
    timeout: TIMEOUTS.AUTH,
  });
}

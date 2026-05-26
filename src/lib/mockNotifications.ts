// Re-exports notification types and provides a label utility for days remaining.
export type { ApiNotificationResponse, ApiNotificationType } from '@/types/api';

/** Returns a short badge label based on days remaining until expiry. */
export function getDaysLabel(daysRemaining: number): string {
  if (daysRemaining <= 3) return '3D';
  if (daysRemaining <= 7) return '7D';
  return '15D';
}

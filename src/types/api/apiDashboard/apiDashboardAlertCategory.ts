import type { ApiDashboardAlertColor } from './apiDashboardAlertColor';
import type { ApiDashboardAlertItem } from './apiDashboardAlertItem';

export interface ApiDashboardAlertCategory {
  label: string;
  color: ApiDashboardAlertColor;
  due_to?: number | null;
  count: number;
  items: ApiDashboardAlertItem[];
}
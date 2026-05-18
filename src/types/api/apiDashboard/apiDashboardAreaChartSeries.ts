import type { ApiDashboardAreaChartPoint } from './apiDashboardAreaChartPoint';

export interface ApiDashboardAreaChartSeries {
  currency: string;
  name: string;
  data: ApiDashboardAreaChartPoint[];
}
import type { ApiDashboardAreaChartYAxis } from './apiDashboardAreaChartYAxis';
import type { ApiDashboardAreaChartSeries } from './apiDashboardAreaChartSeries';

export interface ApiDashboardAreaChartProps {
  title: string;
  subtitle: string;
  y_axis: ApiDashboardAreaChartYAxis;
  threshold_date: string;
  series: ApiDashboardAreaChartSeries[];
}
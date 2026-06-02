export interface ApiChartData {
  type: 'bar' | 'line' | 'pie';
  layout: 'vertical' | 'horizontal' | 'centric';
  title: string;
  config: {
    categoryKey: string;
    series: Array<{
      dataKey: string;
      name: string;
      color?: string;
    }>;
  };
  data: Record<string, string | number>[];
}
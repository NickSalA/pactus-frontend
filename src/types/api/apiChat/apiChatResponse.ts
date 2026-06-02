import type { ApiChartData } from './apiChartData';

export interface ApiChatResponse {
  response: string;
  thread_id: number;
  chart?: ApiChartData;
}
import type { ApiChartData } from '../apiChat/apiChartData';

export interface ApiConversationMessage {
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
  chart?: ApiChartData;
}

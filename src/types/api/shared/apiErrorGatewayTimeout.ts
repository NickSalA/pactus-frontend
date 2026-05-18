export interface ApiErrorGatewayTimeout {
  error: boolean;
  type: 'GatewayTimeoutError';
  message: string;
  request_id: string;
}
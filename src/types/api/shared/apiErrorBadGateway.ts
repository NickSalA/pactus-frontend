export interface ApiErrorBadGateway {
  error: boolean;
  type: 'BadGatewayError';
  message: string;
  request_id: string;
}
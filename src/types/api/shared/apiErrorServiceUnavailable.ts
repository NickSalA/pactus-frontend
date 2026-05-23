export interface ApiErrorServiceUnavailable {
  error: boolean;
  type: 'ServiceUnavailableError';
  message: string;
  request_id: string;
}
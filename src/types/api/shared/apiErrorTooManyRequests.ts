export interface ApiErrorTooManyRequests {
  error: boolean;
  type: 'TooManyRequestsError';
  message: string;
  request_id: string;
}
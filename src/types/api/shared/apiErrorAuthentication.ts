export interface ApiErrorAuthentication {
  error: boolean;
  type: 'AuthenticationError';
  message: string;
  request_id: string;
}
export interface ApiErrorForbidden {
  error: boolean;
  type: 'ForbiddenError';
  message: string;
  request_id: string;
}
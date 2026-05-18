export interface ApiErrorValidation {
  error: boolean;
  type: 'ValidationError';
  message: string;
  request_id: string;
  details?: string[];
}
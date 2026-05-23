export interface ApiErrorNotFound {
  error: boolean;
  type: 'NotFoundError';
  message: string;
  request_id: string;
}
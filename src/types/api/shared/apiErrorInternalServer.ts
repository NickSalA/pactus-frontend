export interface ApiErrorInternalServer {
  error: boolean;
  type: 'InternalServerError';
  message: string;
  request_id: string;
}
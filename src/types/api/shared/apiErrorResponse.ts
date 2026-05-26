export interface ApiErrorResponse {
  error: boolean;
  type: string;
  message: string;
  request_id: string;
}
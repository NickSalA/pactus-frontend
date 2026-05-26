export interface ApiErrorPayloadTooLarge {
  error: boolean;
  type: 'PayloadTooLargeError';
  message: string;
  request_id: string;
}
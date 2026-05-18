export interface ApiIntegrationTokenResponse {
  token: string;
  refresh_token: string | null;
  token_uri: string;
  client_id: string;
  client_secret: string;
  scopes: string[];
}
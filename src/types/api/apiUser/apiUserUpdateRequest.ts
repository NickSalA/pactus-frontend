import type { ApiUserRole } from '../shared';

export interface ApiUserUpdateRequest {
  role?: ApiUserRole | null;
}

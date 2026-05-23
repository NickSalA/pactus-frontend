import type { ApiUserRole } from '../shared';

export interface ApiOrganizationMemberCreateRequest {
  email: string;
  role: ApiUserRole;
}
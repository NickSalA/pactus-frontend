import type {
  OrganizationMember,
  OrganizationMemberCreateRequest,
  OrganizationMemberNotificationsUpdateRequest,
} from "@/types/api.types";
import { createCacheEntry, hasFreshCache, type CacheEntry } from "./cache";
import { TIMEOUTS } from "./constants";
import { apiGet, apiPost, apiPatch } from "./axiosInstance";
import { onApiSessionChange } from "./token-store";

let membersCache: CacheEntry<OrganizationMember[]> | null = null;
let membersInFlight: Promise<OrganizationMember[]> | null = null;

const MEMBERS_CACHE_TTL_MS = 60_000;

const resetOrganizationsApiState = () => {
  membersCache = null;
  membersInFlight = null;
};

onApiSessionChange(resetOrganizationsApiState);

const normalizeMember = (member: OrganizationMember): OrganizationMember => ({
  ...member,
  full_name: member.full_name ?? null,
  avatar_url: member.avatar_url ?? null,
  receives_notifications: member.receives_notifications ?? false,
  is_active: member.is_active ?? false,
});

export async function getOrganizationMembers(): Promise<OrganizationMember[]> {
  if (hasFreshCache(membersCache, MEMBERS_CACHE_TTL_MS)) {
    return membersCache.data;
  }

  if (membersInFlight) {
    return membersInFlight;
  }

  membersInFlight = apiGet<OrganizationMember[]>("/organizations/me/members", { timeout: TIMEOUTS.DEFAULT })
    .then((members) => {
      const normalizedMembers = members.map(normalizeMember);
      membersCache = createCacheEntry(normalizedMembers);
      return normalizedMembers;
    })
    .finally(() => {
      membersInFlight = null;
    });

  return membersInFlight;
}

export async function createOrganizationMember(
  payload: OrganizationMemberCreateRequest
): Promise<OrganizationMember> {
  const member = normalizeMember(
    await apiPost<OrganizationMember>("/organizations/me/members", payload, {
      timeout: TIMEOUTS.AUTH,
    })
  );

  resetOrganizationsApiState();
  return member;
}

export async function updateOrganizationMemberNotifications(
  memberId: number,
  payload: OrganizationMemberNotificationsUpdateRequest
): Promise<OrganizationMember> {
  const member = normalizeMember(
    await apiPatch<OrganizationMember>(`/organizations/me/members/${memberId}/notifications`, payload, {
      timeout: TIMEOUTS.AUTH,
    })
  );

  resetOrganizationsApiState();
  return member;
}
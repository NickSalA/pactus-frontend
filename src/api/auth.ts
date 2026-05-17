import type { LoginRequest, LoginResponse, User } from '@/types/api.types';
import { createCacheEntry, hasFreshCache, type CacheEntry } from './cache';
import { CURRENT_USER_CACHE_TTL_MS, TIMEOUTS } from './constants';
import { apiGet, apiPost } from './axiosInstance';
import { onApiSessionChange, setApiAccessToken } from './token-store';

let currentUserCache: CacheEntry<User> | null = null;
let currentUserInFlight: Promise<User> | null = null;

const resetAuthApiState = () => {
  currentUserCache = null;
  currentUserInFlight = null;
};

onApiSessionChange(resetAuthApiState);

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiPost<LoginResponse>('/login', data, {
    timeout: TIMEOUTS.AUTH,
  });

  if (response.access_token) {
    setApiAccessToken(response.access_token);
  }

  return response;
}

export function logout(): void {
  setApiAccessToken(null);
}

export async function getCurrentUser(): Promise<User> {
  if (hasFreshCache(currentUserCache, CURRENT_USER_CACHE_TTL_MS)) {
    return currentUserCache.data;
  }

  if (currentUserInFlight) {
    return currentUserInFlight;
  }

  currentUserInFlight = apiGet<User>('/user/me', { timeout: TIMEOUTS.DEFAULT })
    .then((user) => {
      currentUserCache = createCacheEntry(user);
      return user;
    })
    .finally(() => {
      currentUserInFlight = null;
    });

  return currentUserInFlight;
}

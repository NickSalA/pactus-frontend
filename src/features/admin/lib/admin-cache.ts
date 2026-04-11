import { createCacheEntry, hasFreshCache, type CacheEntry } from "@/lib/api/cache";
import { onApiSessionChange } from "@/lib/api/token-store";

export const ADMIN_CACHE_TTL_MS = 90_000;

type AdminCacheKey = "dashboard-summary" | "document-types" | "folders" | "services" | "templates";

const adminCache = new Map<AdminCacheKey, CacheEntry<unknown>>();

export const peekAdminCache = <T>(key: AdminCacheKey): T | null => {
  return (adminCache.get(key)?.data as T | undefined) ?? null;
};

export const readAdminCache = <T>(key: AdminCacheKey, ttlMs: number = ADMIN_CACHE_TTL_MS): T | null => {
  const cacheEntry = adminCache.get(key) as CacheEntry<T> | undefined;
  if (!cacheEntry || !hasFreshCache(cacheEntry, ttlMs)) {
    return null;
  }

  return cacheEntry.data;
};

export const writeAdminCache = <T>(key: AdminCacheKey, data: T): void => {
  adminCache.set(key, createCacheEntry(data));
};

export const clearAdminCache = (key?: AdminCacheKey): void => {
  if (key) {
    adminCache.delete(key);
    return;
  }

  adminCache.clear();
};

onApiSessionChange(() => {
  clearAdminCache();
});

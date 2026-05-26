import { useAuthStore } from '@/store';
import { ACCESS_TOKEN_STORAGE_KEY } from './constants';

let accessTokenMemory: string | null = null;

const listeners = new Set<() => void>();

const notifySessionChange = () => {
  listeners.forEach((listener) => listener());
};

const getStoredAccessToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
};

export const onApiSessionChange = (listener: () => void): (() => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

type SetApiAccessTokenOptions = {
  notify?: boolean;
};

export function setApiAccessToken(
  token: string | null,
  options: SetApiAccessTokenOptions = {},
): void {
  const { notify = true } = options;
  const normalizedToken = token || null;

  if (accessTokenMemory !== normalizedToken) {
    accessTokenMemory = normalizedToken;
    if (notify) {
      notifySessionChange();
    }
  }

  if (typeof window === 'undefined') {
    return;
  }

  if (normalizedToken) {
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, normalizedToken);
    return;
  }

  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}

export async function getAccessToken(): Promise<string | null> {
  const storeToken = useAuthStore.getState().accessToken;

  if (storeToken) {
    accessTokenMemory = storeToken;
    return storeToken;
  }

  if (accessTokenMemory) {
    return accessTokenMemory;
  }

  const storedToken = getStoredAccessToken();

  if (storedToken) {
    accessTokenMemory = storedToken;
  }

  return storedToken;
}

export function logout(): void {
  setApiAccessToken(null);
}

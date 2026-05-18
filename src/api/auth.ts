import type { LoginRequest, LoginResponse, User } from '@/types/api.types';
import { TIMEOUTS } from './constants';
import { apiGet, apiPost } from './axiosInstance';
import { setApiAccessToken } from './token-store';

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
  return apiGet<User>('/user/me', { timeout: TIMEOUTS.DEFAULT });
}

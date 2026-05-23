import type { User as BackendUser } from '@/types/ui.types';
import { apiGet } from './axiosInstance';
import { TIMEOUTS } from './constants';

export async function getCurrentUser(): Promise<BackendUser> {
  return apiGet<BackendUser>('/user/me', { timeout: TIMEOUTS.DEFAULT });
}
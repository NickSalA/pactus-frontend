import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';
import { getApiBaseUrl } from './constants';
import { getAccessToken } from './token-store';
import { useAuthStore } from '@/store';

const parseErrorMessage = (error: AxiosError): string => {
  if (error.response?.data && typeof error.response.data === 'object') {
    const data = error.response.data as { detail?: string; message?: string };
    return data.detail || data.message || `Error ${error.response.status}`;
  }
  return error.message || `Error ${error.response?.status ?? 'unknown'}`;
};

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAccessToken();
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.status === 204) return null;
    return response.data;
  },
  (error: AxiosError) => {
    if (error.response?.status === 403) {
      const { isAuthenticated, setSubscriptionActive } = useAuthStore.getState();
      if (isAuthenticated) {
        setSubscriptionActive(false);
      }
      return Promise.reject(error);
    }
    const message = parseErrorMessage(error);
    return Promise.reject(new Error(message));
  },
);

export const apiGet = async <T>(
  url: string,
  config?: Record<string, unknown>,
): Promise<T> => {
  const response = await axiosInstance.get<T>(url, config as any);
  return response as unknown as T;
};

export const apiPost = async <T>(
  url: string,
  data?: unknown,
  config?: Record<string, unknown>,
): Promise<T> => {
  const response = await axiosInstance.post<T>(url, data, config as any);
  return response as unknown as T;
};

export const apiPatch = async <T>(
  url: string,
  data?: unknown,
  config?: Record<string, unknown>,
): Promise<T> => {
  const response = await axiosInstance.patch<T>(url, data, config as any);
  return response as unknown as T;
};

export const apiDelete = async <T>(
  url: string,
  config?: Record<string, unknown>,
): Promise<T> => {
  const response = await axiosInstance.delete(url, config as any);
  return response as unknown as T;
};

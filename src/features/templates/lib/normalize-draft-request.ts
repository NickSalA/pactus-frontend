import { ApiTemplateGenerateRequest } from '@/types/api';

export const normalizeDraftRequest = (
  request: ApiTemplateGenerateRequest,
): ApiTemplateGenerateRequest => {
  return Object.fromEntries(
    Object.entries(request).filter(([, value]) => {
      if (value == null) {
        return false;
      }

      return typeof value !== 'string' || value.trim() !== '';
    }),
  ) as ApiTemplateGenerateRequest;
};

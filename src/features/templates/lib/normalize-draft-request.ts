import type { GenerateTemplateDraftRequest } from "@/types/api.types";

export const normalizeDraftRequest = (request: GenerateTemplateDraftRequest): GenerateTemplateDraftRequest => {
  return Object.fromEntries(
    Object.entries(request).filter(([, value]) => {
      if (value == null) {
        return false;
      }

      return typeof value !== "string" || value.trim() !== "";
    })
  ) as GenerateTemplateDraftRequest;
};
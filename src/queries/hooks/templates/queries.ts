import { useQuery } from "@tanstack/react-query";
import {
  getTemplates,
  getTemplateFormats,
  getTemplateById,
  type TemplateListFilters,
} from "@/api";
import type { ApiTemplateResponse } from "@/types/api";

const TEMPLATES_KEY = ["templates"] as const;
const TEMPLATE_FORMATS_KEY = ["templates", "formats"] as const;
const TEMPLATE_KEY = (id: number) => ["templates", id] as const;

export const useTemplates = (filters: TemplateListFilters = {}): ReturnType<typeof useQuery<readonly ApiTemplateResponse[]>> =>
  useQuery({
    queryKey: [...TEMPLATES_KEY, filters],
    queryFn: () => getTemplates(filters),
  });

export const useTemplateFormats = (documentType?: "LABOR" | "COMPANY") =>
  useQuery({
    queryKey: [...TEMPLATE_FORMATS_KEY, documentType],
    queryFn: () => getTemplateFormats(documentType),
  });

export const useTemplate = (templateId: number) =>
  useQuery({
    queryKey: TEMPLATE_KEY(templateId),
    queryFn: () => getTemplateById(templateId),
    enabled: templateId > 0,
  });

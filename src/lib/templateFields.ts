import type { ApiTemplateContent, ApiTemplateField } from "@/types/api";
import type { ApiTemplateFieldType } from "@/types/api/shared";

export const TEMPLATE_FIELD_TYPE_OPTIONS: ApiTemplateFieldType[] = ["text", "number", "date", "time", "boolean"];

export const TEMPLATE_FIELD_TYPE_LABELS: Record<ApiTemplateFieldType, string> = {
  text: "Texto",
  number: "Número",
  date: "Fecha",
  time: "Hora",
  boolean: "Sí / No",
};

export const extractTemplateFieldKeys = (bodyMd: string): string[] => {
  return [...new Set([...bodyMd.matchAll(/\{\{\s*(\w+)\s*\}\}/g)].map((match) => match[1]))];
};

export const formatTemplateFieldLabel = (key: string): string => {
  const normalized = key.replace(/_/g, " ").trim();

  if (!normalized) {
    return key;
  }

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

export const normalizeTemplateFieldType = (type: string | null | undefined): ApiTemplateFieldType => {
  return TEMPLATE_FIELD_TYPE_OPTIONS.includes(type as ApiTemplateFieldType) ? (type as ApiTemplateFieldType) : "text";
};

export const getTemplateFields = (content: Pick<ApiTemplateContent, "fields"> | null | undefined): ApiTemplateField[] => {
  return content?.fields ?? [];
};

export const getTemplateOperationalFields = (
  content: Pick<ApiTemplateContent, "operational_fields"> | null | undefined,
): ApiTemplateField[] => {
  return content?.operational_fields ?? [];
};

export const getAllTemplateFields = (
  content: Pick<ApiTemplateContent, "fields" | "operational_fields"> | null | undefined,
): ApiTemplateField[] => {
  return [...getTemplateFields(content), ...getTemplateOperationalFields(content)];
};

export const getTemplateFieldCount = (
  content: Pick<ApiTemplateContent, "fields" | "operational_fields"> | null | undefined,
): number => {
  return getAllTemplateFields(content).length;
};

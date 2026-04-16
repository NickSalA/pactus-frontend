import type { TemplateContent, TemplateField, TemplateFieldType } from "@/types/api.types";

export const TEMPLATE_FIELD_TYPE_OPTIONS: TemplateFieldType[] = ["text", "number", "date", "time", "boolean"];

export const TEMPLATE_FIELD_TYPE_LABELS: Record<TemplateFieldType, string> = {
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

export const normalizeTemplateFieldType = (type: string | null | undefined): TemplateFieldType => {
  return TEMPLATE_FIELD_TYPE_OPTIONS.includes(type as TemplateFieldType) ? (type as TemplateFieldType) : "text";
};

export const getTemplateFields = (content: Pick<TemplateContent, "fields"> | null | undefined): TemplateField[] => {
  return content?.fields ?? [];
};

export const getTemplateOperationalFields = (
  content: Pick<TemplateContent, "operational_fields"> | null | undefined,
): TemplateField[] => {
  return content?.operational_fields ?? [];
};

export const getAllTemplateFields = (
  content: Pick<TemplateContent, "fields" | "operational_fields"> | null | undefined,
): TemplateField[] => {
  return [...getTemplateFields(content), ...getTemplateOperationalFields(content)];
};

export const getTemplateFieldCount = (
  content: Pick<TemplateContent, "fields" | "operational_fields"> | null | undefined,
): number => {
  return getAllTemplateFields(content).length;
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  archiveTemplate,
  createTemplate,
  generateTemplateDraft,
  publishTemplate,
  updateTemplate,
} from "@/api";
import type {
  GenerateTemplateDraftRequest,
  Template,
  TemplateCreateRequest,
  TemplateUpdateRequest,
} from "@/types/api.types";

const TEMPLATES_KEY = ["templates"] as const;

const templateKeys = {
  all: TEMPLATES_KEY,
  list: (filters?: Record<string, unknown>) => [...TEMPLATES_KEY, "list", filters],
  detail: (id: number) => [...TEMPLATES_KEY, "detail", id] as const,
};

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TemplateCreateRequest) => createTemplate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEMPLATES_KEY });
    },
  });
};

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      templateId,
      payload,
    }: {
      templateId: number;
      payload: TemplateUpdateRequest;
    }) => updateTemplate(templateId, payload),
    onSuccess: (_data, { templateId }) => {
      queryClient.invalidateQueries({ queryKey: TEMPLATES_KEY });
      queryClient.invalidateQueries({ queryKey: templateKeys.detail(templateId) });
    },
  });
};

export const usePublishTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (templateId: number) => publishTemplate(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEMPLATES_KEY });
    },
  });
};

export const useArchiveTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (templateId: number) => archiveTemplate(templateId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEMPLATES_KEY });
    },
  });
};

export const useGenerateTemplateDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      request,
      file,
    }: {
      request: GenerateTemplateDraftRequest;
      file?: File | null;
    }) => generateTemplateDraft(request, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEMPLATES_KEY });
    },
  });
};
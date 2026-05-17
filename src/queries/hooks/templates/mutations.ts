import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
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

const updateTemplateInAllLists = (
  queryClient: QueryClient,
  updatedTemplate: Template,
  templateId: number
) => {
  const listQueries = queryClient.getQueryCache().getAll().filter((query) => {
    const key = query.queryKey;
    return (
      Array.isArray(key) &&
      key[0] === "templates" &&
      key.length > 1 &&
      key[1] !== "detail" &&
      Array.isArray(query.state.data)
    );
  });

  for (const query of listQueries) {
    queryClient.setQueryData(query.queryKey, (oldData: unknown) => {
      if (Array.isArray(oldData)) {
        return oldData.map((t: { id: number }) =>
          t.id === templateId ? updatedTemplate : t
        );
      }
      return oldData;
    });
  }
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
    onSuccess: (updatedTemplate, { templateId }) => {
      queryClient.setQueryData(templateKeys.detail(templateId), updatedTemplate);
      updateTemplateInAllLists(queryClient, updatedTemplate, templateId);
    },
  });
};

export const usePublishTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (templateId: number) => publishTemplate(templateId),
    onSuccess: (updatedTemplate, templateId) => {
      queryClient.setQueryData(templateKeys.detail(templateId), updatedTemplate);
      updateTemplateInAllLists(queryClient, updatedTemplate, templateId);
    },
  });
};

export const useArchiveTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (templateId: number) => archiveTemplate(templateId),
    onSuccess: (updatedTemplate, templateId) => {
      queryClient.setQueryData(templateKeys.detail(templateId), updatedTemplate);
      updateTemplateInAllLists(queryClient, updatedTemplate, templateId);
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
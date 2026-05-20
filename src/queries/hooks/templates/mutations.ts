import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import {
  archiveTemplate,
  createTemplate,
  generateContractFromTemplate,
  generateTemplateDraft,
  previewTemplate,
  publishTemplate,
  updateTemplate,
} from '@/api';
import type {
  ApiDocumentResponse,
  ApiTemplateGenerateRequest,
  ApiTemplatePreviewRequest,
  ApiTemplatePreviewResponse,
  ApiTemplateResponse,
  ApiTemplateCreateRequest,
  ApiTemplateUpdateRequest,
} from '@/types/api';
import type { TemplateGenerateContractRequest } from '@/api/templates';

const TEMPLATES_KEY = ['templates'] as const;
const CONTRACTS_KEY = ['contracts'] as const;

const templateKeys = {
  all: TEMPLATES_KEY,
  list: (filters?: Record<string, unknown>) => [
    ...TEMPLATES_KEY,
    'list',
    filters,
  ],
  detail: (id: number) => [...TEMPLATES_KEY, 'detail', id] as const,
};

const updateTemplateInAllLists = (
  queryClient: QueryClient,
  updatedTemplate: ApiTemplateResponse,
  templateId: number,
) => {
  const listQueries = queryClient
    .getQueryCache()
    .getAll()
    .filter((query) => {
      const key = query.queryKey;
      return (
        Array.isArray(key) &&
        key[0] === 'templates' &&
        key.length > 1 &&
        key[1] !== 'detail' &&
        Array.isArray(query.state.data)
      );
    });

  for (const query of listQueries) {
    queryClient.setQueryData(query.queryKey, (oldData: unknown) => {
      if (Array.isArray(oldData)) {
        return oldData.map((t: { id: number }) =>
          t.id === templateId ? updatedTemplate : t,
        );
      }
      return oldData;
    });
  }
};

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ApiTemplateCreateRequest) => createTemplate(payload),
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
      payload: ApiTemplateUpdateRequest;
    }) => updateTemplate(templateId, payload),
    onSuccess: (updatedTemplate, { templateId }) => {
      queryClient.setQueryData(
        templateKeys.detail(templateId),
        updatedTemplate,
      );
      updateTemplateInAllLists(queryClient, updatedTemplate, templateId);
    },
  });
};

export const usePublishTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (templateId: number) => publishTemplate(templateId),
    onSuccess: (updatedTemplate, templateId) => {
      queryClient.setQueryData(
        templateKeys.detail(templateId),
        updatedTemplate,
      );
      updateTemplateInAllLists(queryClient, updatedTemplate, templateId);
    },
  });
};

export const useArchiveTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (templateId: number) => archiveTemplate(templateId),
    onSuccess: (updatedTemplate, templateId) => {
      queryClient.setQueryData(
        templateKeys.detail(templateId),
        updatedTemplate,
      );
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
      request: ApiTemplateGenerateRequest;
      file?: File | null;
    }) =>
      generateTemplateDraft(request, file).then((result) => ({
        template: result.template,
        warnings: result.warnings,
        source: result.source as Record<string, unknown>,
        usage: result.usage
          ? {
              input_tokens: result.usage.input_tokens ?? 0,
              output_tokens: result.usage.output_tokens ?? 0,
              total_tokens: result.usage.total_tokens ?? 0,
            }
          : null,
      })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEMPLATES_KEY });
    },
  });
};

export const usePreviewTemplate = () => {
  return useMutation({
    mutationFn: (payload: ApiTemplatePreviewRequest) =>
      previewTemplate(payload),
  });
};

export const useGenerateContractFromTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      templateId,
      payload,
    }: {
      templateId: number;
      payload: TemplateGenerateContractRequest;
    }) => generateContractFromTemplate(templateId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONTRACTS_KEY });
    },
  });
};

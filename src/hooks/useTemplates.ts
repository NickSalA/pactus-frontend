'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useTemplates as useTemplatesQuery,
  useTemplateFormats,
} from '@/queries/hooks/templates/queries';
import {
  useCreateTemplate,
  useGenerateTemplateDraft,
  useUpdateTemplate,
  usePublishTemplate,
  useArchiveTemplate,
} from '@/queries/hooks/templates/mutations';
import {
  canAuthorTemplates,
  getTemplateAuthoringDocumentTypes,
} from '@/lib/permissions';
import { useAuthStore } from '@/store';
import type {
  ApiDocumentType,
  ApiTemplateResponse,
  ApiTemplateState,
  ApiTemplateCreateRequest,
  ApiTemplateUpdateRequest,
} from '@/types/api';

type StateFilterValue = 'ACTIVE' | 'ALL' | ApiTemplateState;
type DocumentTypeFilterValue = 'ALL' | ApiDocumentType;

export function useTemplates() {
  const queryClient = useQueryClient();
  const userRole = useAuthStore((state) => state.user?.role ?? null);
  const canManageTemplates = canAuthorTemplates(userRole);
  const allowedDocumentTypes = getTemplateAuthoringDocumentTypes(userRole);
  const supportsDocumentTypeSelection =
    (allowedDocumentTypes?.length ?? 0) !== 1;
  const defaultDocumentTypeFilter: DocumentTypeFilterValue =
    allowedDocumentTypes?.[0] ?? 'ALL';

  const {
    data: templatesData,
    isLoading: templatesLoading,
    error: templatesError,
  } = useTemplatesQuery();
  const { data: formatsData, isLoading: formatsLoading } = useTemplateFormats();

  const { mutateAsync: createTemplateMutation } = useCreateTemplate();
  const { mutateAsync: updateTemplateMutation } = useUpdateTemplate();
  const { mutateAsync: publishTemplateMutation } = usePublishTemplate();
  const { mutateAsync: archiveTemplateMutation } = useArchiveTemplate();
  const { mutateAsync: generateTemplateDraftMutation } =
    useGenerateTemplateDraft();

  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState<StateFilterValue>('ACTIVE');
  const [formatFilter, setFormatFilter] = useState<string>('ALL');
  const [documentTypeFilter, setDocumentTypeFilter] =
    useState<DocumentTypeFilterValue>(defaultDocumentTypeFilter);
  const [editingTemplate, setEditingTemplate] =
    useState<ApiTemplateResponse | null>(null);
  const [viewingTemplate, setViewingTemplate] =
    useState<ApiTemplateResponse | null>(null);
  const [viewingTemplateWarnings, setViewingTemplateWarnings] = useState<
    string[]
  >([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    if (allowedDocumentTypes && allowedDocumentTypes.length === 1) {
      setDocumentTypeFilter(allowedDocumentTypes[0]);
    }
  }, [allowedDocumentTypes]);

  const templates = templatesData ?? [];
  const formats = formatsData ?? [];
  const loading = templatesLoading || formatsLoading;
  const error = templatesError?.message ?? null;

  const filteredTemplates = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('es');

    return templates.filter((template) => {
      if (stateFilter === 'ACTIVE' && template.state === 'ARCHIVED') {
        return false;
      }

      if (
        stateFilter !== 'ACTIVE' &&
        stateFilter !== 'ALL' &&
        template.state !== stateFilter
      ) {
        return false;
      }

      if (
        documentTypeFilter !== 'ALL' &&
        template.document_type !== documentTypeFilter
      ) {
        return false;
      }

      if (formatFilter !== 'ALL' && template.format_code !== formatFilter) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const haystack =
        `${template.name} ${template.description ?? ''} ${template.format_label ?? ''} ${template.format_code ?? ''}`.toLocaleLowerCase(
          'es',
        );

      return haystack.includes(normalizedSearch);
    });
  }, [documentTypeFilter, formatFilter, search, stateFilter, templates]);

  const visibleFormats = useMemo(() => {
    return formats.filter(
      (format) =>
        documentTypeFilter === 'ALL' ||
        format.document_type === documentTypeFilter,
    );
  }, [documentTypeFilter, formats]);

  const stats = useMemo(
    () => ({
      draftCount: templates.filter((template) => template.state === 'DRAFT')
        .length,
      publishedCount: templates.filter(
        (template) => template.state === 'PUBLISHED',
      ).length,
      totalCount: templates.length,
    }),
    [templates],
  );

  const openCreateEditor = useCallback(() => {
    setEditingTemplate(null);
    setIsEditorOpen(true);
  }, []);

  const openEditEditor = useCallback((template: ApiTemplateResponse) => {
    setEditingTemplate(template);
    setIsEditorOpen(true);
  }, []);

  const closeEditor = useCallback(() => {
    if (saving) {
      return;
    }

    setEditingTemplate(null);
    setIsEditorOpen(false);
  }, [saving]);

  const openViewer = useCallback(
    (template: ApiTemplateResponse, warnings: string[] = []) => {
      setViewingTemplate(template);
      setViewingTemplateWarnings(warnings);
      setIsViewerOpen(true);
    },
    [],
  );

  const closeViewer = useCallback(() => {
    setViewingTemplate(null);
    setViewingTemplateWarnings([]);
    setIsViewerOpen(false);
  }, []);

  const saveTemplate = useCallback(
    async (payload: ApiTemplateCreateRequest | ApiTemplateUpdateRequest) => {
      try {
        setSaving(true);

        if (editingTemplate) {
          const updatedTemplate = await updateTemplateMutation({
            templateId: editingTemplate.id,
            payload: payload as ApiTemplateUpdateRequest,
          });
          setViewingTemplate(updatedTemplate);
        } else {
          const createdTemplate = await createTemplateMutation(
            payload as ApiTemplateCreateRequest,
          );
          setViewingTemplate(createdTemplate);
        }

        setIsEditorOpen(false);
        setEditingTemplate(null);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'No se pudo guardar la plantilla.';
        throw new Error(message);
      } finally {
        setSaving(false);
      }
    },
    [editingTemplate, createTemplateMutation, updateTemplateMutation],
  );

  const publishOneTemplate = useCallback(
    async (template: ApiTemplateResponse) => {
      try {
        setSaving(true);
        await publishTemplateMutation(template.id);
      } catch (err) {
        void err;
      } finally {
        setSaving(false);
      }
    },
    [publishTemplateMutation],
  );

  const archiveOneTemplate = useCallback(
    async (template: ApiTemplateResponse) => {
      try {
        setSaving(true);
        await archiveTemplateMutation(template.id);
      } catch (err) {
        void err;
      } finally {
        setSaving(false);
      }
    },
    [archiveTemplateMutation],
  );

  const upsertTemplate = useCallback((updated: ApiTemplateResponse) => {
    void updated;
  }, []);

  return {
    archiveOneTemplate,
    allowedDocumentTypes,
    canManageTemplates,
    closeEditor,
    closeViewer,
    documentTypeFilter,
    editingTemplate,
    error,
    filteredTemplates,
    formatFilter,
    formats,
    generateTemplateDraftMutation,
    isEditorOpen,
    isViewerOpen,
    loading,
    openCreateEditor,
    openEditEditor,
    openViewer,
    publishOneTemplate,
    reload: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
    saving,
    search,
    setDocumentTypeFilter,
    setFormatFilter,
    setSearch,
    setStateFilter,
    saveTemplate,
    stateFilter,
    stats,
    supportsDocumentTypeSelection,
    updateTemplateMutation,
    upsertTemplate,
    viewingTemplate,
    viewingTemplateWarnings,
    visibleFormats,
  };
}
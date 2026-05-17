"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  archiveTemplate,
  createTemplate,
  publishTemplate,
  updateTemplate,
} from "@/api";
import { useTemplates, useTemplateFormats } from "@/queries/hooks/templates/queries";
import { canAuthorTemplates, getTemplateAuthoringDocumentTypes } from "@/lib/permissions";
import { useAuthStore } from "@/store";
import type {
  DocumentType,
  Template,
  TemplateCreateRequest,
  TemplateFormatResponse,
  TemplateState,
  TemplateUpdateRequest,
} from "@/types/api.types";

type StateFilterValue = "ACTIVE" | "ALL" | TemplateState;
type DocumentTypeFilterValue = "ALL" | DocumentType;

export function useAdminTemplates() {
  const userRole = useAuthStore((state) => state.user?.role ?? null);
  const canManageTemplates = canAuthorTemplates(userRole);
  const allowedDocumentTypes = getTemplateAuthoringDocumentTypes(userRole);
  const supportsDocumentTypeSelection = (allowedDocumentTypes?.length ?? 0) !== 1;
  const defaultDocumentTypeFilter: DocumentTypeFilterValue = allowedDocumentTypes?.[0] ?? "ALL";

  const { data: templatesData, isLoading: templatesLoading, error: templatesError } = useTemplates();
  const { data: formatsData, isLoading: formatsLoading } = useTemplateFormats();

  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState<StateFilterValue>("ACTIVE");
  const [formatFilter, setFormatFilter] = useState<string>("ALL");
  const [documentTypeFilter, setDocumentTypeFilter] = useState<DocumentTypeFilterValue>(defaultDocumentTypeFilter);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [viewingTemplate, setViewingTemplate] = useState<Template | null>(null);
  const [viewingTemplateWarnings, setViewingTemplateWarnings] = useState<string[]>([]);
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
    const normalizedSearch = search.trim().toLocaleLowerCase("es");

    return templates.filter((template) => {
      if (stateFilter === "ACTIVE" && template.state === "ARCHIVED") {
        return false;
      }

      if (stateFilter !== "ACTIVE" && stateFilter !== "ALL" && template.state !== stateFilter) {
        return false;
      }

      if (documentTypeFilter !== "ALL" && template.document_type !== documentTypeFilter) {
        return false;
      }

      if (formatFilter !== "ALL" && template.format_code !== formatFilter) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const haystack = `${template.name} ${template.description ?? ""} ${template.format_label ?? ""} ${template.format_code ?? ""}`
        .toLocaleLowerCase("es");

      return haystack.includes(normalizedSearch);
    });
  }, [documentTypeFilter, formatFilter, search, stateFilter, templates]);

  const visibleFormats = useMemo(() => {
    return formats.filter((format) => documentTypeFilter === "ALL" || format.document_type === documentTypeFilter);
  }, [documentTypeFilter, formats]);

  const stats = useMemo(
    () => ({
      draftCount: templates.filter((template) => template.state === "DRAFT").length,
      publishedCount: templates.filter((template) => template.state === "PUBLISHED").length,
      totalCount: templates.length,
    }),
    [templates],
  );

  const openCreateEditor = useCallback(() => {
    setEditingTemplate(null);
    setIsEditorOpen(true);
  }, []);

  const openEditEditor = useCallback((template: Template) => {
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

  const openViewer = useCallback((template: Template, warnings: string[] = []) => {
    setViewingTemplate(template);
    setViewingTemplateWarnings(warnings);
    setIsViewerOpen(true);
  }, []);

  const closeViewer = useCallback(() => {
    setViewingTemplate(null);
    setViewingTemplateWarnings([]);
    setIsViewerOpen(false);
  }, []);

  const saveTemplate = useCallback(
    async (payload: TemplateCreateRequest | TemplateUpdateRequest) => {
      try {
        setSaving(true);

        if (editingTemplate) {
          const updatedTemplate = await updateTemplate(editingTemplate.id, payload as TemplateUpdateRequest);
          setViewingTemplate(updatedTemplate);
        } else {
          const createdTemplate = await createTemplate(payload as TemplateCreateRequest);
          setViewingTemplate(createdTemplate);
        }

        setIsEditorOpen(false);
        setEditingTemplate(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : "No se pudo guardar la plantilla.";
        throw new Error(message);
      } finally {
        setSaving(false);
      }
    },
    [editingTemplate],
  );

  const publishOneTemplate = useCallback(async (template: Template) => {
    try {
      setSaving(true);
      await publishTemplate(template.id);
    } catch (err) {
      // Error handled by mutation
      void err;
    } finally {
      setSaving(false);
    }
  }, []);

  const archiveOneTemplate = useCallback(async (template: Template) => {
    try {
      setSaving(true);
      await archiveTemplate(template.id);
    } catch (err) {
      // Error handled by mutation
      void err;
    } finally {
      setSaving(false);
    }
  }, []);

  const upsertTemplate = useCallback((updated: Template) => {
    // This method is no longer needed with TanStack Query's automatic cache updates
    // Kept for backward compatibility
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
    isEditorOpen,
    isViewerOpen,
    loading,
    openCreateEditor,
    openEditEditor,
    openViewer,
    publishOneTemplate,
    reload: () => {},
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
    upsertTemplate,
    viewingTemplate,
    viewingTemplateWarnings,
    visibleFormats,
  };
}
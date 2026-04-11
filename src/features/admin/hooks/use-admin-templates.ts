"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createTemplate, getTemplates, publishTemplate, updateTemplate } from "@/lib/api";
import { ADMIN_CACHE_TTL_MS, peekAdminCache, readAdminCache, writeAdminCache } from "@/features/admin/lib/admin-cache";
import { useAdminGuard } from "@/features/admin/hooks/use-admin-guard";
import type { Template, TemplateCreateRequest, TemplateUpdateRequest } from "@/types/api.types";

export function useAdminTemplates() {
  const access = useAdminGuard();
  const [templates, setTemplates] = useState<Template[]>(() => peekAdminCache<Template[]>("templates") ?? []);
  const [loading, setLoading] = useState(() => peekAdminCache<Template[]>("templates") === null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [viewingTemplate, setViewingTemplate] = useState<Template | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const loadTemplates = useCallback(async (options: { force?: boolean } = {}) => {
    if (!access.isAdmin) {
      setLoading(false);
      return;
    }

    const cachedTemplates = !options.force ? readAdminCache<Template[]>("templates", ADMIN_CACHE_TTL_MS) : null;
    if (cachedTemplates) {
      setTemplates(cachedTemplates);
      setLoading(false);
      return;
    }

    try {
      if (peekAdminCache<Template[]>("templates") === null) {
        setLoading(true);
      }
      setError(null);
      const nextTemplates = await getTemplates();
      setTemplates(nextTemplates);
      writeAdminCache("templates", nextTemplates);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar las plantillas.");
    } finally {
      setLoading(false);
    }
  }, [access.isAdmin]);

  useEffect(() => {
    void loadTemplates();
  }, [loadTemplates]);

  const filteredTemplates = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("es");
    if (!normalizedSearch) {
      return templates;
    }

    return templates.filter((template) => {
      const haystack = `${template.name} ${template.description ?? ""}`.toLocaleLowerCase("es");
      return haystack.includes(normalizedSearch);
    });
  }, [search, templates]);

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

  const openViewer = useCallback((template: Template) => {
    setViewingTemplate(template);
    setIsViewerOpen(true);
  }, []);

  const closeViewer = useCallback(() => {
    setViewingTemplate(null);
    setIsViewerOpen(false);
  }, []);

  const saveTemplate = useCallback(
    async (payload: TemplateCreateRequest | TemplateUpdateRequest) => {
      try {
        setSaving(true);
        setError(null);

        if (editingTemplate) {
          const updatedTemplate = await updateTemplate(editingTemplate.id, payload as TemplateUpdateRequest);
          setTemplates((previousTemplates) => {
            const nextTemplates = previousTemplates.map((template) => (template.id === updatedTemplate.id ? updatedTemplate : template));
            writeAdminCache("templates", nextTemplates);
            return nextTemplates;
          });
          setViewingTemplate(updatedTemplate);
        } else {
          const createdTemplate = await createTemplate(payload as TemplateCreateRequest);
          setTemplates((previousTemplates) => {
            const nextTemplates = [createdTemplate, ...previousTemplates];
            writeAdminCache("templates", nextTemplates);
            return nextTemplates;
          });
          setViewingTemplate(createdTemplate);
        }

        setIsEditorOpen(false);
        setEditingTemplate(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : "No se pudo guardar la plantilla.";
        setError(message);
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
      setError(null);
      const publishedTemplate = await publishTemplate(template.id);
      setTemplates((previousTemplates) => {
        const nextTemplates = previousTemplates.map((currentTemplate) =>
          currentTemplate.id === publishedTemplate.id ? publishedTemplate : currentTemplate,
        );
        writeAdminCache("templates", nextTemplates);
        return nextTemplates;
      });
      if (viewingTemplate?.id === publishedTemplate.id) {
        setViewingTemplate(publishedTemplate);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo publicar la plantilla.");
    } finally {
      setSaving(false);
    }
  }, [viewingTemplate]);

  const upsertTemplate = useCallback((updated: Template) => {
    setTemplates((prev) => {
      const exists = prev.some((t) => t.id === updated.id);
      const next = exists
        ? prev.map((t) => (t.id === updated.id ? updated : t))
        : [updated, ...prev];
      writeAdminCache("templates", next);
      return next;
    });
  }, []);

  return {
    ...access,
    closeEditor,
    closeViewer,
    editingTemplate,
    error,
    filteredTemplates,
    isEditorOpen,
    isViewerOpen,
    loading,
    openCreateEditor,
    openEditEditor,
    openViewer,
    publishOneTemplate,
    reload: () => loadTemplates({ force: true }),
    saving,
    search,
    setSearch,
    saveTemplate,
    upsertTemplate,
    stats,
    viewingTemplate,
  };
}

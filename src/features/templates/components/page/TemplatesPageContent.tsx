'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLoadingState } from '@/features/admin/components/shared/AdminLoadingState';
import { TemplatesSection } from '@/components/sections/TemplatesSection';
import { canAuthorTemplates } from '@/lib/permissions';
import { useAuthStore } from '@/store';
import { useTemplates } from '@/hooks/useTemplates';
import { useTablePagination } from '@/hooks/useTablePagination';
import type { ApiTemplateResponse } from '@/types/api';

export function TemplatesPageContent() {
  const router = useRouter();
  const section = useTemplates();
  const pagination = useTablePagination<ApiTemplateResponse>(section.filteredTemplates);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrating = useAuthStore((state) => state.isHydrating);
  const userRole = useAuthStore((state) => state.user?.role ?? null);
  const hasTemplateAuthoringAccess = canAuthorTemplates(userRole);

  useEffect(() => {
    if (!isHydrating && (!isAuthenticated || !hasTemplateAuthoringAccess)) {
      router.replace('/');
    }
  }, [hasTemplateAuthoringAccess, isAuthenticated, isHydrating, router]);

  if (
    section.loading ||
    isHydrating ||
    !isAuthenticated ||
    !hasTemplateAuthoringAccess
  ) {
    return <AdminLoadingState />;
  }

  return <TemplatesSection section={section} pagination={pagination} />;
}
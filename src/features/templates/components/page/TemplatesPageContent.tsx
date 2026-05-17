'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLoadingState } from '@/features/admin/components/shared/AdminLoadingState';
import { AdminTemplatesSection } from '@/features/admin/components/sections/AdminTemplatesSection';
import { canAuthorTemplates } from '@/lib/permissions';
import { useAuthStore } from '@/store';
import { useTemplates } from '@/queries/hooks/templates/queries';
import { isLabelContentAFunction } from 'recharts/types/component/Label';

export function TemplatesPageContent() {
  const router = useRouter();
  const { isLoading } = useTemplates();
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
    isLoading ||
    isHydrating ||
    !isAuthenticated ||
    !hasTemplateAuthoringAccess
  ) {
    return <AdminLoadingState />;
  }

  return <AdminTemplatesSection />;
}

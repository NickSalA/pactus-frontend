"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminLoadingState } from "@/features/admin/components/shared/AdminLoadingState";
import { AdminTemplatesSection } from "@/features/admin/components/sections/AdminTemplatesSection";
import { canAuthorTemplates } from "@/lib/permissions";
import { useAuthStore } from "@/store";

export function TemplatesPageContent() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrating = useAuthStore((state) => state.isHydrating);
  const userRole = useAuthStore((state) => state.user?.role ?? null);
  const hasTemplateAuthoringAccess = canAuthorTemplates(userRole);

  useEffect(() => {
    if (!isHydrating && (!isAuthenticated || !hasTemplateAuthoringAccess)) {
      router.replace("/dashboard");
    }
  }, [hasTemplateAuthoringAccess, isAuthenticated, isHydrating, router]);

  if (isHydrating || !isAuthenticated || !hasTemplateAuthoringAccess) {
    return <AdminLoadingState />;
  }

  return <AdminTemplatesSection />;
}

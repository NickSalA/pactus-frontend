'use client';

import { useMyOrganization } from '@/queries/hooks/organizations/queries';
import { isAdminOrganizationOnboardingComplete } from '@/features/admin/lib/admin-organization-onboarding.utils';
import { AdminOrganizationOnboardingModal } from '@/features/admin/components/modals/AdminOrganizationOnboardingModal';
import { canAccessAdminConsole } from '@/lib/permissions';
import { useAuthStore } from '@/store';

type AdminOrganizationOnboardingGateProps = {
  children: React.ReactNode;
};

export function AdminOrganizationOnboardingGate({
  children,
}: AdminOrganizationOnboardingGateProps) {
  const isHydrating = useAuthStore((state) => state.isHydrating);
  const userRole = useAuthStore((state) => state.user?.role ?? null);
  const isAdmin = canAccessAdminConsole(userRole);

  const {
    data: organization,
    error,
    isLoading,
    refetch,
  } = useMyOrganization({ enabled: !isHydrating && isAdmin });

  if (isHydrating) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  if (!isAdmin) {
    return <>{children}</>;
  }

  if (isLoading || !organization) {
    if (error) {
      return (
        <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
          <p className="max-w-md text-sm text-brand-red-500">
            No se pudo cargar la informacion de tu organizacion.
          </p>
          <button
            type="button"
            onClick={() => {
              void refetch();
            }}
            className="rounded-2xl bg-brand-primary px-5 py-2.5 text-sm font-medium text-brand-neutral-50 transition-colors hover:bg-brand-primary-dark focus:outline-none focus:ring-4 focus:ring-brand-blue-100"
          >
            Reintentar
          </button>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  const shouldShowOnboarding = !isAdminOrganizationOnboardingComplete(organization);

  if (shouldShowOnboarding) {
    return <AdminOrganizationOnboardingModal organization={organization} />;
  }

  return <>{children}</>;
}

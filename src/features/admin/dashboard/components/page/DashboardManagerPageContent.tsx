'use client';

import { DashboardAlertCenter } from '@/features/admin/dashboard/components/charts/DashboardAlertCenter';
import { DashboardAreaChart } from '@/features/admin/dashboard/components/charts/DashboardAreaChart';
import { DashboardRecentDocumentsTable } from '@/features/admin/dashboard/components/DashboardRecentDocumentsTable';
import { DashboardTopCompanies } from '@/features/admin/dashboard/components/charts/DashboardTopCompanies';
import { DashboardTopServices } from '@/features/admin/dashboard/components/charts/DashboardTopServices';
import { DashboardWelcome } from '@/features/admin/dashboard/components/DashboardWelcome';
import { toFirstName } from '@/lib/authUser';
import { useAuthStore } from '@/store';
import { useDashboardManagerPage } from '@/features/admin/dashboard/hooks/use-dashboard-manager-page';

const PlaceholderCell = ({ label }: { label: string }) => (
  <div className="flex flex-1 items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
    <span className="text-sm text-gray-400">{label}</span>
  </div>
);

export function DashboardManagerPageContent() {
  const { user } = useAuthStore();
  const {
    areaChart,
    alerts,
    recentContracts,
    topCompanies,
    topServices,
    isLoading,
    error,
  } = useDashboardManagerPage();
  const firstName = toFirstName(user?.name || 'Usuario');

  return (
    <div className="space-y-6">
      <DashboardWelcome firstName={firstName} />

      {error && (
        <section className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700 shadow-sm">
          No se pudieron cargar los datos del dashboard: {error.message}
        </section>
      )}

      <section
        className="grid gap-4 md:grid-cols-2"
        style={{ gridTemplateRows: '1fr 1fr' }}
      >
        <DashboardAreaChart
          data={areaChart!}
          isLoading={isLoading}
          documentType="COMPANY"
        />
        <DashboardTopCompanies
          data={topCompanies!}
          isLoading={isLoading}
          documentType="COMPANY"
        />
        <DashboardTopServices
          data={topServices!}
          isLoading={isLoading}
          documentType="COMPANY"
        />
        <DashboardAlertCenter alerts={alerts} isLoading={isLoading} />
      </section>
    </div>
  );
}

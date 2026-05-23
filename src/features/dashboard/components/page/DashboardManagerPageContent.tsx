'use client';

import { DashboardAlertCenter } from '@/features/dashboard/components/widgets/DashboardAlertCenter';
import { DashboardAreaChart } from '@/features/dashboard/components/widgets/DashboardAreaChart';
import { DashboardRecentDocumentsTable } from '@/features/dashboard/components/widgets/DashboardRecentDocumentsTable';
import { DashboardTopCompanies } from '@/features/dashboard/components/widgets/DashboardTopCompanies';
import { DashboardTopServices } from '@/features/dashboard/components/widgets/DashboardTopServices';
import { DashboardWelcome } from '@/features/dashboard/components/ui/DashboardWelcome';
import { toFirstName } from '@/lib/authUser';
import { useAuthStore } from '@/store';
import { useDashboardManagerPage } from '@/features/dashboard/hooks/useDashboardManagerPage';

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
    <div className="flex flex-col gap-6 h-full overflow-visible">
      <div className="flex-none overflow-visible">
        <DashboardWelcome firstName={firstName} />
      </div>

      {error && (
        <section className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700 shadow-sm">
          No se pudieron cargar los datos del dashboard: {error.message}
        </section>
      )}

      <section className="grid grid-rows-[1fr_1fr] grid-cols-[1fr_1fr] gap-4 flex-1 min-h-0 overflow-visible">
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

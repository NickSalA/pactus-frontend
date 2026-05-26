'use client';

import { DashboardAlertCenter } from '@/features/dashboard/components/widgets/DashboardAlertCenter';
import { DashboardAreaChart } from '@/features/dashboard/components/widgets/DashboardAreaChart';
import { DashboardRecentDocumentsTable } from '@/features/dashboard/components/widgets/DashboardRecentDocumentsTable';
import { DashboardWelcome } from '@/features/dashboard/components/ui/DashboardWelcome';
import { toFirstName } from '@/lib/authUser';
import { useAuthStore } from '@/store';
import { useDashboardHRPage } from '@/features/dashboard/hooks/useDashboardHRPage';

export function DashboardHRPageContent() {
  const { user } = useAuthStore();
  const { areaChart, alerts, recentContracts, isLoading, error } =
    useDashboardHRPage();
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

      <section className="grid grid-rows-[1fr_1fr] gap-4 grid-cols-[1fr_1fr] flex-1 min-h-0 overflow-visible">
        <div className="row-span-2">
          <DashboardAreaChart
            data={areaChart!}
            isLoading={isLoading}
            documentType="LABOR"
          />
        </div>
        <DashboardAlertCenter alerts={alerts} isLoading={isLoading} />
        <div className="col-start-2">
          <DashboardRecentDocumentsTable
            documents={recentContracts}
            isLoading={isLoading}
            currentPage={1}
            totalPages={1}
            totalRecords={recentContracts.length}
            startIndex={0}
            endIndex={recentContracts.length}
            onPageChange={() => {}}
          />
        </div>
      </section>
    </div>
  );
}

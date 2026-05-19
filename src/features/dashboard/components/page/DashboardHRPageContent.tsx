'use client';

import { DashboardAlertCenter } from '@/features/dashboard/components/charts/DashboardAlertCenter';
import { DashboardAreaChart } from '@/features/dashboard/components/charts/DashboardAreaChart';
import { DashboardRecentDocumentsTable } from '@/features/dashboard/components/DashboardRecentDocumentsTable';
import { DashboardWelcome } from '@/features/dashboard/components/DashboardWelcome';
import { toFirstName } from '@/lib/authUser';
import { useAuthStore } from '@/store';
import { useDashboardHRPage } from '@/features/dashboard/hooks/use-dashboard-hr-page';

export function DashboardHRPageContent() {
  const { user } = useAuthStore();
  const { areaChart, alerts, recentContracts, isLoading, error } =
    useDashboardHRPage();
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
          documentType="LABOR"
        />
        <DashboardAlertCenter alerts={alerts} isLoading={isLoading} />
        <div className="col-span-2">
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

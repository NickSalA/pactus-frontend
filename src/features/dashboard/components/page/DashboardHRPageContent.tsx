"use client";

import { DashboardAreaChart } from "@/features/dashboard/components/charts/DashboardAreaChart";
import { DashboardRecentDocumentsTable } from "@/features/dashboard/components/page/DashboardRecentDocumentsTable";
import { DashboardWelcome } from "@/features/dashboard/components/page/DashboardWelcome";
import { toFirstName } from "@/lib/authUser";
import { useAuthStore } from "@/store";
import { useDashboardHRPage } from "@/features/dashboard/hooks/use-dashboard-hr-page";

const PlaceholderCell = ({ label }: { label: string }) => (
  <div className="flex flex-1 items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
    <span className="text-sm text-gray-400">{label}</span>
  </div>
);

export function DashboardHRPageContent() {
  const { user } = useAuthStore();
  const { areaChart, recentContracts, isLoading, error } = useDashboardHRPage();
  const firstName = toFirstName(user?.name || "Usuario");

  return (
    <div className="space-y-6">
      <DashboardWelcome firstName={firstName} />

      {error && (
        <section className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700 shadow-sm">
          No se pudieron cargar los datos del dashboard: {error}
        </section>
      )}

      <section
        className="grid gap-4 md:grid-cols-2"
        style={{ gridTemplateRows: "1fr 1fr" }}
      >
        <DashboardAreaChart
          data={areaChart!}
          isLoading={isLoading}
          documentType="LABOR"
        />
        <PlaceholderCell label="Alertas (próximamente)" />
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
        <PlaceholderCell label="Alertas (próximamente)" />
      </section>
    </div>
  );
}
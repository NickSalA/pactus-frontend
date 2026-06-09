"use client";

import { ScrollText } from "lucide-react";
import { AdminSegmentedTabs } from "@/features/admin/components/shared/AdminSegmentedTabs";
import { useAdminAuditPage } from "@/features/admin/hooks/useAdminAuditPage";
import { PageHeader } from "@/components/ui/PageHeader";

const PLACEHOLDER_TABS = [
  { id: 'users' as const, label: 'Actividad de Usuarios' },
  { id: 'chatbot' as const, label: 'Actividad de Chatbot' },
];

function EmptyState() {
  return (
    <div className="flex h-full min-h-[40vh] items-center justify-center rounded-2xl border-2 border-dashed border-slate-200">
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <ScrollText className="h-12 w-12" />
        <p className="text-sm font-medium">No hay datos para mostrar</p>
      </div>
    </div>
  );
}

export function AdminAuditPageContent() {
  const page = useAdminAuditPage();

  if (page.shouldBlockContent) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  if (page.loading) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  if (page.error) {
    return (
      <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-base text-red-600">{page.error}</p>
        <button
          type="button"
          onClick={() => { void page.reload(); }}
          className="rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Auditoría"
        subtitle="Visualiza y controla los registros de actividad del sistema"
      />

      <AdminSegmentedTabs
        activeTab={page.activeTab}
        onChange={page.setActiveTab}
        tabs={PLACEHOLDER_TABS}
      />

      {page.activeTab === 'users' && <EmptyState />}
      {page.activeTab === 'chatbot' && <EmptyState />}
    </div>
  );
}

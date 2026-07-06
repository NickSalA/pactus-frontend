'use client';

import { AdminSegmentedTabs } from '@/features/admin/components/shared/AdminSegmentedTabs';
import { useAdminAuditPage } from '@/features/admin/hooks/useAdminAuditPage';
import { AdminAuditUsersTable } from '@/features/admin/components/tables/AdminAuditUsersTable';
import { AdminAuditChatbotTable } from '@/features/admin/components/tables/AdminAuditChatbotTable';
import { AdminAuditTemplatesTable } from '@/features/admin/components/tables/AdminAuditTemplatesTable';
import { AdminAuditContractsTable } from '@/features/admin/components/tables/AdminAuditContractsTable';
import { AdminAuditAITokenUsageTable } from '@/features/admin/components/tables/AdminAuditAITokenUsageTable';
import { PageHeader } from '@/components/ui/PageHeader';

const AUDIT_TABS = [
  { id: 'users' as const, label: 'Actividad de Usuarios' },
  { id: 'chatbot' as const, label: 'Actividad de Chatbot' },
  { id: 'contracts' as const, label: 'Contratos' },
  { id: 'templates' as const, label: 'Plantillas' },
  { id: 'ai-usage' as const, label: 'Consumo de IA' },
];

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
          onClick={() => {
            void page.reload();
          }}
          className="rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <PageHeader
        title="Auditoría"
        subtitle="Visualiza y controla los registros de actividad del sistema"
      />

      <AdminSegmentedTabs
        activeTab={page.activeTab}
        onChange={page.setActiveTab}
        tabs={AUDIT_TABS}
      />

      {page.activeTab === 'users' && (
        <AdminAuditUsersTable items={page.users} />
      )}
      {page.activeTab === 'chatbot' && (
        <AdminAuditChatbotTable items={page.chatbot} />
      )}
      {page.activeTab === 'contracts' && (
        <AdminAuditContractsTable items={page.contracts} />
      )}
      {page.activeTab === 'templates' && (
        <AdminAuditTemplatesTable items={page.templates} />
      )}
      {page.activeTab === 'ai-usage' && (
        <AdminAuditAITokenUsageTable items={page.aiUsage} />
      )}
    </div>
  );
}

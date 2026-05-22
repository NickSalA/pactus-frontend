'use client';

import { Plus, Users } from 'lucide-react';
import { AddMemberModal } from '@/features/admin/components/modals/AddMemberModal';
import { AdminMembersTable } from '@/features/admin/components/tables/AdminMembersTable';
import { useAdminMembers } from '@/features/admin/hooks/useAdminMembers';
import { PageHeader } from '@/components/ui/PageHeader';

export function AdminAccessPageContent() {
  const page = useAdminMembers();

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

  return (
    <div className="flex h-full flex-col gap-2">
      <PageHeader
        title="Gestión de Accesos"
        subtitle={`${page.stats.activeMembers} usuarios activos de ${page.stats.totalMembers}`}
      />

      {page.error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {page.error}
        </div>
      )}

      <AdminMembersTable
        isSaving={page.saving}
        members={page.members}
        onToggleNotifications={(memberId, receivesNotifications) =>
          page.updateMemberNotifications(memberId, receivesNotifications)
        }
        activeMembers={page.stats.activeMembers}
        totalMembers={page.stats.totalMembers}
        openAddModal={page.openAddModal}
      />

      <AddMemberModal
        isSubmitting={page.saving}
        onClose={page.closeAddModal}
        onSubmit={page.addMember}
        open={page.isAddModalOpen}
      />
    </div>
  );
}

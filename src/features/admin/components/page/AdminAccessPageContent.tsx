'use client';

import { AddMemberModal } from '@/features/admin/components/modals/AddMemberModal';
import { DeleteMemberModal } from '@/features/admin/components/modals/DeleteMemberModal';
import { EditMemberModal } from '@/features/admin/components/modals/EditMemberModal';
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

      <div className="flex-1 min-h-0">
      <AdminMembersTable
        activeMembers={page.stats.activeMembers}
        isSaving={page.saving}
        members={page.members}
        onDeleteMember={page.openDeleteModal}
        onEditMember={page.openEditModal}
        onToggleNotifications={(memberId, receivesNotifications) =>
          page.updateMemberNotifications(memberId, receivesNotifications)
        }
        openAddModal={page.openAddModal}
        totalMembers={page.stats.totalMembers}
      />
      </div>

      <AddMemberModal
        isSubmitting={page.saving}
        onClose={page.closeAddModal}
        onSubmit={page.addMember}
        open={page.isAddModalOpen}
      />

      <EditMemberModal
        isSubmitting={page.saving}
        member={page.editMemberToEdit}
        onClose={page.closeEditModal}
        onSubmit={page.updateMemberRole}
        open={page.isEditModalOpen}
      />

      <DeleteMemberModal
        isSubmitting={page.saving}
        member={page.deleteMemberToConfirm}
        onClose={page.closeDeleteModal}
        onConfirm={page.removeMember}
        open={page.isDeleteModalOpen}
      />
    </div>
  );
}

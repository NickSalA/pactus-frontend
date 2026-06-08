'use client';

import { useCallback, useMemo, useState } from 'react';
import { useMembers } from '@/queries/hooks/admin/queries';
import {
  useCreateMember,
  useDeleteMember,
  useUpdateMemberNotifications,
  useUpdateMemberRole,
} from '@/queries/hooks/admin/mutations';
import { useAdminGuard } from '@/features/admin/hooks/useAdminGuard';
import type { OrganizationMember } from '@/types/ui.types';
import type { ApiOrganizationMemberCreateRequest, ApiUserRole } from '@/types/api';

export function useAdminMembers() {
  const access = useAdminGuard();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editMember, setEditMember] = useState<OrganizationMember | null>(null);
  const [deleteMember, setDeleteMember] = useState<OrganizationMember | null>(null);

  const {
    data: members = [],
    isLoading: loading,
    error,
    refetch: reload,
  } = useMembers();

  const createMemberMutation = useCreateMember({
    onError: (err: Error) => {
      console.error('Error creating member:', err);
    },
  });

  const updateRoleMutation = useUpdateMemberRole({
    onError: (err: Error) => {
      console.error('Error updating member role:', err);
    },
  });

  const deleteMemberMutation = useDeleteMember({
    onError: (err: Error) => {
      console.error('Error deleting member:', err);
    },
  });

  const updateNotificationsMutation = useUpdateMemberNotifications({
    onError: (err: Error) => {
      console.error('Error updating member notifications:', err);
    },
  });

  const saving =
    createMemberMutation.isPending ||
    updateRoleMutation.isPending ||
    deleteMemberMutation.isPending ||
    updateNotificationsMutation.isPending;

  const openAddModal = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  const closeAddModal = useCallback(() => {
    if (saving) return;
    setIsAddModalOpen(false);
  }, [saving]);

  const openEditModal = useCallback((member: OrganizationMember) => {
    setEditMember(member);
  }, []);

  const closeEditModal = useCallback(() => {
    if (saving) return;
    setEditMember(null);
  }, [saving]);

  const openDeleteModal = useCallback((member: OrganizationMember) => {
    setDeleteMember(member);
  }, []);

  const closeDeleteModal = useCallback(() => {
    if (saving) return;
    setDeleteMember(null);
  }, [saving]);

  const addMember = useCallback(
    async (payload: ApiOrganizationMemberCreateRequest) => {
      await createMemberMutation.mutateAsync(payload);
      setIsAddModalOpen(false);
    },
    [createMemberMutation],
  );

  const updateMemberRole = useCallback(
    async (memberId: number, role: ApiUserRole) => {
      await updateRoleMutation.mutateAsync({ memberId, payload: { role } });
      setEditMember(null);
    },
    [updateRoleMutation],
  );

  const removeMember = useCallback(
    async (memberId: number) => {
      await deleteMemberMutation.mutateAsync(memberId);
      setDeleteMember(null);
    },
    [deleteMemberMutation],
  );

  const updateMemberNotifications = useCallback(
    async (memberId: number, receivesNotifications: boolean) => {
      await updateNotificationsMutation.mutateAsync({
        memberId,
        payload: { receives_notifications: receivesNotifications },
      });
    },
    [updateNotificationsMutation],
  );

  const stats = useMemo(
    () => ({
      activeMembers: members.filter((member) => member.is_active).length,
      totalMembers: members.length,
    }),
    [members],
  );

  return {
    ...access,
    addMember,
    closeAddModal,
    closeDeleteModal,
    closeEditModal,
    deleteMemberToConfirm: deleteMember,
    editMemberToEdit: editMember,
    error: error instanceof Error ? error.message : error ? String(error) : null,
    isAddModalOpen,
    isDeleteModalOpen: deleteMember !== null,
    isEditModalOpen: editMember !== null,
    loading,
    members,
    openAddModal,
    openDeleteModal,
    openEditModal,
    reload,
    removeMember,
    saving,
    stats,
    updateMemberNotifications,
    updateMemberRole,
  };
}

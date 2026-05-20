'use client';

import { useCallback, useMemo, useState } from 'react';
import { useOrganizationMembers } from '@/queries/hooks/organizations/queries';
import {
  useCreateOrganizationMember,
  useUpdateOrganizationMemberNotifications,
} from '@/queries/hooks/organizations/mutations';
import { useAdminGuard } from '@/features/admin/hooks/useAdminGuard';
import type { OrganizationMember } from '@/types/ui.types';
import { ApiOrganizationMemberCreateRequest } from '@/types/api';

export function useAdminMembers() {
  const access = useAdminGuard();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const {
    data: members = [],
    isLoading: loading,
    error,
    refetch: reload,
  } = useOrganizationMembers();

  const createMemberMutation = useCreateOrganizationMember({
    onError: (err: Error) => {
      console.error('Error creating member:', err);
    },
  });

  const updateNotificationsMutation =
    useUpdateOrganizationMemberNotifications({
      onError: (err: Error) => {
        console.error('Error updating member notifications:', err);
      },
    });

  const saving =
    createMemberMutation.isPending || updateNotificationsMutation.isPending;

  const openAddModal = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  const closeAddModal = useCallback(() => {
    if (saving) {
      return;
    }

    setIsAddModalOpen(false);
  }, [saving]);

  const addMember = useCallback(
    async (payload: ApiOrganizationMemberCreateRequest) => {
      await createMemberMutation.mutateAsync(payload);
      setIsAddModalOpen(false);
    },
    [createMemberMutation],
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
    error: error instanceof Error ? error.message : error ? String(error) : null,
    isAddModalOpen,
    loading,
    members,
    openAddModal,
    reload,
    saving,
    stats,
    updateMemberNotifications,
  };
}
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createOrganizationMember,
  getOrganizationMembers,
  updateOrganizationMemberNotifications,
} from "@/lib/api";
import { useAdminGuard } from "@/features/admin/hooks/use-admin-guard";
import type { OrganizationMember, OrganizationMemberCreateRequest } from "@/types/api.types";

const compareMembers = (left: OrganizationMember, right: OrganizationMember): number => {
  const leftLabel = (left.full_name ?? left.email).toLocaleLowerCase("es");
  const rightLabel = (right.full_name ?? right.email).toLocaleLowerCase("es");
  return leftLabel.localeCompare(rightLabel, "es");
};

export function useAdminMembers() {
  const access = useAdminGuard();
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const loadMembers = useCallback(async () => {
    if (!access.isAdmin) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const nextMembers = await getOrganizationMembers();
      setMembers(nextMembers.sort(compareMembers));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar la lista de usuarios.");
    } finally {
      setLoading(false);
    }
  }, [access.isAdmin]);

  useEffect(() => {
    void loadMembers();
  }, [loadMembers]);

  const openAddModal = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  const closeAddModal = useCallback(() => {
    if (saving) {
      return;
    }

    setIsAddModalOpen(false);
  }, [saving]);

  const addMember = useCallback(async (payload: OrganizationMemberCreateRequest) => {
    try {
      setSaving(true);
      setError(null);

      const createdMember = await createOrganizationMember(payload);
      setMembers((previousMembers) => [...previousMembers, createdMember].sort(compareMembers));
      setIsAddModalOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo agregar el usuario.";
      setError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  }, []);

  const updateMemberNotifications = useCallback(async (memberId: number, receivesNotifications: boolean) => {
    try {
      setSaving(true);
      setError(null);

      const updatedMember = await updateOrganizationMemberNotifications(memberId, {
        receives_notifications: receivesNotifications,
      });

      setMembers((previousMembers) =>
        previousMembers
          .map((member) => (member.id === updatedMember.id ? updatedMember : member))
          .sort(compareMembers),
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo actualizar la suscripcion de alertas.";
      setError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  }, []);

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
    error,
    isAddModalOpen,
    loading,
    members,
    openAddModal,
    reload: loadMembers,
    saving,
    stats,
    updateMemberNotifications,
  };
}

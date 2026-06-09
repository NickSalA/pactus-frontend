'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { AdminModalShell } from '@/features/admin/components/shared/AdminModalShell';
import type { OrganizationMember } from '@/types/ui.types';

const getMemberDisplayName = (member: OrganizationMember): string =>
  member.full_name?.trim() || member.email.split('@')[0] || 'Usuario';

type DeleteMemberModalProps = {
  isSubmitting: boolean;
  member: OrganizationMember | null;
  onClose: () => void;
  onConfirm: (memberId: number) => Promise<void>;
  open: boolean;
};

export function DeleteMemberModal({
  isSubmitting,
  member,
  onClose,
  onConfirm,
  open,
}: DeleteMemberModalProps) {
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!member) return;
    try {
      setError(null);
      await onConfirm(member.id);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo eliminar el usuario.',
      );
    }
  };

  return (
    <AdminModalShell
      description="Esta acción revocará el acceso del usuario a la organización."
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => void handleConfirm()}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/25 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Trash2 className="h-4 w-4" />
            {isSubmitting ? 'Eliminando...' : 'Eliminar Usuario'}
          </button>
        </div>
      }
      onClose={onClose}
      open={open}
      title="Eliminar Usuario"
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
          <p className="text-sm font-medium text-slate-800">
            {member ? getMemberDisplayName(member) : '—'}
          </p>
          <p className="mt-0.5 text-sm text-slate-500">{member?.email}</p>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se
          puede deshacer.
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>
    </AdminModalShell>
  );
}

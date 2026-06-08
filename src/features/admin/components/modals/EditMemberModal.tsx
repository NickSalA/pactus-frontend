'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { AdminModalShell } from '@/features/admin/components/shared/AdminModalShell';
import { Select } from '@/components/ui/Select';
import { getUserRoleLabel } from '@/lib/authUser';
import {
  editMemberSchema,
  type EditMemberValues,
} from '@/features/admin/lib/memberManagement.schema';
import type { ApiUserRole } from '@/types/api';
import type { OrganizationMember } from '@/types/ui.types';

const AVAILABLE_ROLES: ApiUserRole[] = ['WORKER', 'HR', 'MANAGER', 'ADMIN'];

type EditMemberModalProps = {
  isSubmitting: boolean;
  member: OrganizationMember | null;
  onClose: () => void;
  onSubmit: (memberId: number, role: ApiUserRole) => Promise<void>;
  open: boolean;
};

export function EditMemberModal({
  isSubmitting,
  member,
  onClose,
  onSubmit,
  open,
}: EditMemberModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<EditMemberValues>({
    resolver: zodResolver(editMemberSchema),
    defaultValues: { role: 'WORKER' },
  });

  useEffect(() => {
    if (open && member) {
      reset({ role: member.role as EditMemberValues['role'] });
    }
  }, [open, member, reset]);

  const onValidSubmit = async (values: EditMemberValues) => {
    if (!member) return;
    try {
      await onSubmit(member.id, values.role);
    } catch (err) {
      setError('root', {
        message:
          err instanceof Error
            ? err.message
            : 'No se pudo actualizar el usuario.',
      });
    }
  };

  return (
    <AdminModalShell
      description="Modifica el rol asignado dentro de la organización."
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
            onClick={() => void handleSubmit(onValidSubmit)()}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      }
      onClose={onClose}
      open={open}
      title="Editar Usuario"
    >
      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Correo electrónico
          </label>
          <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            {member?.email ?? '—'}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Rol asignado
          </label>
          <Select variant="lg" className="w-full" {...register('role')}>
            {AVAILABLE_ROLES.map((availableRole) => (
              <option key={availableRole} value={availableRole}>
                {getUserRoleLabel(availableRole)}
              </option>
            ))}
          </Select>
          {errors.role && (
            <p role="alert" className="mt-1.5 text-sm text-red-600">
              {errors.role.message}
            </p>
          )}
        </div>

        {errors.root && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errors.root.message}
          </div>
        )}
      </div>
    </AdminModalShell>
  );
}

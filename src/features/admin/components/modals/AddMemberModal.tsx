'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { AdminModalShell } from '@/features/admin/components/shared/AdminModalShell';
import { Select } from '@/components/ui/Select';
import { getUserRoleLabel } from '@/lib/authUser';
import {
  addMemberSchema,
  type AddMemberValues,
} from '@/features/admin/lib/memberManagement.schema';
import type { ApiOrganizationMemberCreateRequest, ApiUserRole } from '@/types/api';

const AVAILABLE_ROLES: ApiUserRole[] = ['WORKER', 'HR', 'MANAGER', 'ADMIN'];

type AddMemberModalProps = {
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: ApiOrganizationMemberCreateRequest) => Promise<void>;
  open: boolean;
};

export function AddMemberModal({
  isSubmitting,
  onClose,
  onSubmit,
  open,
}: AddMemberModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<AddMemberValues>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: { email: '', role: 'WORKER' },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onValidSubmit = async (values: AddMemberValues) => {
    try {
      await onSubmit({
        email: values.email.trim().toLowerCase(),
        role: values.role,
      });
      reset();
    } catch (err) {
      setError('root', {
        message:
          err instanceof Error ? err.message : 'No se pudo agregar el usuario.',
      });
    }
  };

  return (
    <AdminModalShell
      description="Crea un nuevo acceso dentro de la organización actual."
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
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
            <Plus className="h-4 w-4" />
            {isSubmitting ? 'Creando...' : 'Agregar Usuario'}
          </button>
        </div>
      }
      onClose={handleClose}
      open={open}
      title="Agregar Nuevo Usuario"
    >
      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Correo electrónico
          </label>
          <input
            type="email"
            placeholder="usuario@empresa.com"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            {...register('email')}
          />
          {errors.email && (
            <p role="alert" className="mt-1.5 text-sm text-red-600">
              {errors.email.message}
            </p>
          )}
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

'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { getUserRoleLabel } from '@/lib/authUser';
import { Select } from '@/components/ui/Select';
import { ApiOrganizationMemberCreateRequest, ApiUserRole } from '@/types/api';

type AddMemberModalProps = {
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (payload: ApiOrganizationMemberCreateRequest) => Promise<void>;
  open: boolean;
};

const AVAILABLE_ROLES: ApiUserRole[] = ['WORKER', 'HR', 'MANAGER', 'ADMIN'];

export function AddMemberModal({
  isSubmitting,
  onClose,
  onSubmit,
  open,
}: AddMemberModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<ApiUserRole>('WORKER');
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return null;
  }

  const handleSubmit = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError('Ingresa un correo válido para crear el usuario.');
      return;
    }

    try {
      setError(null);
      await onSubmit({ email: normalizedEmail, role });
      setEmail('');
      setRole('WORKER');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo agregar el usuario.',
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[28px] bg-white shadow-2xl shadow-slate-900/10">
        <div className="flex items-start justify-between border-b border-slate-200/80 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Gestión de Accesos
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              Agregar Nuevo Usuario
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Crea un nuevo acceso dentro de la organización actual.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="usuario@empresa.com"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Rol asignado
            </label>
            <Select
              variant="lg"
              className="w-full"
              value={role}
              onChange={(event) => setRole(event.target.value as ApiUserRole)}
            >
              {AVAILABLE_ROLES.map((availableRole) => (
                <option key={availableRole} value={availableRole}>
                  {getUserRoleLabel(availableRole)}
                </option>
              ))}
            </Select>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200/80 px-6 py-5">
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
            onClick={() => {
              void handleSubmit();
            }}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Plus className="h-4 w-4" />
            {isSubmitting ? 'Creando...' : 'Agregar Usuario'}
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { Plus, ShieldCheck, Users } from 'lucide-react';
import { AddMemberModal } from '@/features/admin/components/modals/AddMemberModal';
import { AdminMembersTable } from '@/features/admin/components/tables/AdminMembersTable';
import { useAdminMembers } from '@/features/admin/hooks/useAdminMembers';

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
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-200/70 bg-white px-8 py-7 shadow-sm shadow-slate-200/70">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Configuración de Seguridad
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                Gestión de Accesos
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Lista usuarios de la organización y agrega nuevos accesos al
                sistema
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={page.openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25"
          >
            <Plus className="h-4 w-4" />
            Agregar Usuario
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-5 shadow-sm shadow-slate-200/70">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Usuarios Activos
          </p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">
            {page.stats.activeMembers}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            de {page.stats.totalMembers} total
          </p>
        </article>
        <article className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-5 shadow-sm shadow-slate-200/70">
          <div className="flex items-center gap-3 text-blue-600">
            <Users className="h-5 w-5" />
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Gestión de Usuarios
            </p>
          </div>
          <p className="mt-3 text-base font-medium text-slate-900">
            Administra los accesos de tu organización
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Puedes listar usuarios y registrar nuevos miembros con el rol
            correspondiente.
          </p>
        </article>
      </section>

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

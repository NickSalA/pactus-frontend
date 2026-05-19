"use client";

import { Bell, Mail, ShieldCheck } from "lucide-react";
import { getUserRoleLabel } from "@/lib/authUser";
import { TablePagination } from "@/components/templates/TablePagination";
import { useTablePagination } from "@/hooks/useTablePagination";
import type { OrganizationMember } from "@/types/ui.types";

type AdminMembersTableProps = {
  isSaving: boolean;
  members: OrganizationMember[];
  onToggleNotifications: (memberId: number, receivesNotifications: boolean) => Promise<void>;
};

const buildUserInitials = (label: string): string => {
  return (
    label
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 2) || "U"
  );
};

const getMemberDisplayName = (member: OrganizationMember): string => {
  return member.full_name?.trim() || member.email.split("@")[0] || "Usuario";
};

export function AdminMembersTable({ isSaving, members, onToggleNotifications }: AdminMembersTableProps) {
  const pagination = useTablePagination(members);

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm shadow-slate-200/70">
      <div className="border-b border-slate-200/80 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Gestión de Personal</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Asignación de Personas</h2>
      </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200/80 text-left">
            <thead className="bg-slate-50/80">
              <tr className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Rol Asignado</th>
                <th className="px-6 py-4">Email para Alertas</th>
                <th className="px-6 py-4 text-center">Recibe Alertas</th>
                <th className="px-6 py-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 bg-white">
            {pagination.paginatedItems.map((member) => {
              const displayName = getMemberDisplayName(member);

              return (
                <tr key={member.id} className="text-sm text-slate-700">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                        {buildUserInitials(displayName)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{displayName}</p>
                        <p className="text-slate-500">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                      <ShieldCheck className="h-4 w-4" />
                      {getUserRoleLabel(member.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2 text-slate-600">
                      <Mail className="h-4 w-4 text-slate-400" />
                      {member.email}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={member.receives_notifications}
                      aria-label={`${member.receives_notifications ? "Desactivar" : "Activar"} alertas para ${displayName}`}
                      disabled={isSaving}
                      onClick={() => {
                        void onToggleNotifications(member.id, !member.receives_notifications);
                      }}
                      className={`inline-flex min-h-11 items-center gap-3 rounded-full border px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60 ${
                        member.receives_notifications
                          ? "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span
                        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                          member.receives_notifications ? "bg-emerald-500" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                            member.receives_notifications ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </span>
                      <Bell className={`h-3.5 w-3.5 ${member.receives_notifications ? "text-emerald-600" : "text-slate-400"}`} />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
                        member.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {member.is_active ? "Activo" : "Pendiente"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <TablePagination
        currentPage={pagination.currentPage}
        itemsPerPage={pagination.itemsPerPage}
        onItemsPerPageChange={pagination.changeItemsPerPage}
        onPageChange={pagination.changePage}
        startIndex={pagination.startIndex}
        totalCount={pagination.totalCount}
        totalPages={pagination.totalPages}
      />
    </div>
  );
}

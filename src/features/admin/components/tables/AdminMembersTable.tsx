import { Bell, Mail, ShieldCheck } from "lucide-react";
import { getUserRoleLabel } from "@/lib/authUser";
import type { OrganizationMember } from "@/types/api.types";

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
              <th className="px-6 py-4">Recibe Alertas</th>
              <th className="px-6 py-4">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80 bg-white">
            {members.map((member) => {
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
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => {
                        void onToggleNotifications(member.id, !member.receives_notifications);
                      }}
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                        member.receives_notifications
                          ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <Bell className="h-3.5 w-3.5" />
                      {member.receives_notifications ? "Suscrito" : "Silenciado"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
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

      <div className="border-t border-slate-200/80 px-6 py-4 text-sm text-slate-500">
        {members.length} persona{members.length === 1 ? "" : "s"} asignada{members.length === 1 ? "" : "s"}
      </div>
    </div>
  );
}

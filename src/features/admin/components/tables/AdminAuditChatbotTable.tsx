import type { ApiAuditChatbotActivityResponse } from '@/types/api';
import { AuditChatbotUserInfo } from '@/features/admin/components/ui/AuditChatbotUserInfo';
import { AdminAuditFormattedDate as FormattedDate } from '@/features/admin/components/ui/AdminAuditFormattedDate';
import { CHATBOT_ACTION_LABELS, CHATBOT_ACTION_COLORS } from '@/features/admin/lib/auditUtils';

type AdminAuditChatbotTableProps = {
  items: ApiAuditChatbotActivityResponse[];
};

export function AdminAuditChatbotTable({
  items,
}: AdminAuditChatbotTableProps) {
  return (
    <section className="flex flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm shadow-slate-200/70">
      <div className="border-b border-slate-200/80 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Auditoría de Chatbot
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Registro de Actividad
        </h2>
      </div>

      {items.length === 0 ? (
        <div className="flex min-h-[30vh] items-center justify-center px-6 py-12">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <p className="text-sm font-medium">No hay datos para mostrar</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0">
          <section className="flex flex-col rounded-2xl border border-slate-200/60 bg-white shadow-sm max-h-full">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200/80 text-left">
                <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  <tr>
                    <th className="px-6 py-4">Usuario</th>
                    <th className="px-6 py-4">Acción</th>
                    <th className="px-6 py-4">Conversación</th>
                    <th className="px-6 py-4">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80 bg-white text-sm text-slate-700">
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      className="text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <AuditChatbotUserInfo
                          actor_name={item.actor_name}
                          actor_role={item.actor_role}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${CHATBOT_ACTION_COLORS[item.action]}`}
                        >
                          {CHATBOT_ACTION_LABELS[item.action]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {item.conversation_title ?? '—'}
                      </td>
                      <td className="px-6 py-4">
                        <FormattedDate date={item.created_at} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

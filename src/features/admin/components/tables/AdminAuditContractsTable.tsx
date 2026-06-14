import type { ApiAuditContractActivityResponse } from '@/types/api';
import { AuditChatbotUserInfo } from '@/features/admin/components/ui/AuditChatbotUserInfo';
import { CONTRACT_ACTION_LABELS, CONTRACT_ACTION_COLORS } from '@/features/admin/lib/auditUtils';

type AdminAuditContractsTableProps = {
  items: ApiAuditContractActivityResponse[];
};

function FormattedDate({ date }: { date: string }) {
  const d = new Date(date);
  return (
    <span className="text-sm text-slate-500">
      {d.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}
    </span>
  );
}

export function AdminAuditContractsTable({ items }: AdminAuditContractsTableProps) {
  return (
    <section className="flex flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm shadow-slate-200/70">
      <div className="border-b border-slate-200/80 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Auditoría de Contratos
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
                    <th className="px-6 py-4">Documento</th>
                    <th className="px-6 py-4">Tipo de documento</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80 bg-white text-sm text-slate-700">
                  {items.map((item) => (
                    <tr key={item.id} className="text-sm text-slate-700 hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <AuditChatbotUserInfo
                          actor_name={item.actor_name}
                          actor_role={item.actor_role}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${CONTRACT_ACTION_COLORS[item.action]}`}
                        >
                          {CONTRACT_ACTION_LABELS[item.action]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {item.document_name ?? '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {item.document_type ?? '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {item.state ?? '—'}
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

import { ArrowUp, ArrowDown } from 'lucide-react';
import type { ApiAuditAITokenUsageResponse } from '@/types/api';
import { AdminAuditFormattedDate as FormattedDate } from '@/features/admin/components/ui/AdminAuditFormattedDate';
import { AI_TOKEN_SOURCE_LABELS, AI_TOKEN_SOURCE_COLORS, formatNumber, formatCost } from '@/features/admin/lib/auditUtils';

type AdminAuditAITokenUsageTableProps = {
  items: ApiAuditAITokenUsageResponse[];
};

function TokensCell({
  input_tokens,
  input_cost_usd,
  output_tokens,
  output_cost_usd,
  total_tokens,
  total_cost_usd,
}: {
  input_tokens: number | null;
  input_cost_usd: number | null;
  output_tokens: number | null;
  output_cost_usd: number | null;
  total_tokens: number | null;
  total_cost_usd: number | null;
}) {
  return (
    <div className="flex flex-col gap-1 text-xs">
      <span className="flex items-center gap-1.5 text-slate-600">
        <ArrowUp className="h-3 w-3 text-emerald-500" />
        <span className="font-medium text-slate-900">
          {formatNumber(input_tokens)}
        </span>
        <span className="text-slate-400">
          (${formatCost(input_cost_usd)})
        </span>
      </span>
      <span className="flex items-center gap-1.5 text-slate-600">
        <ArrowDown className="h-3 w-3 text-blue-500" />
        <span className="font-medium text-slate-900">
          {formatNumber(output_tokens)}
        </span>
        <span className="text-slate-400">
          (${formatCost(output_cost_usd)})
        </span>
      </span>
      <span className="flex items-center gap-1.5 text-slate-600">
        <span className="font-medium text-slate-900">
          {formatNumber(total_tokens)}
        </span>
        <span className="text-slate-400">
          (${formatCost(total_cost_usd)})
        </span>
      </span>
    </div>
  );
}

export function AdminAuditAITokenUsageTable({
  items,
}: AdminAuditAITokenUsageTableProps) {
  return (
    <section className="flex flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm shadow-slate-200/70">
      <div className="border-b border-slate-200/80 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Consumo de IA
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          Registro de Tokens
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
                    <th className="px-6 py-4">Origen</th>
                    <th className="px-6 py-4">Modelo</th>
                    <th className="px-6 py-4">Tokens</th>
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
                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                          #{item.actor_user_id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${AI_TOKEN_SOURCE_COLORS[item.source]}`}
                        >
                          {AI_TOKEN_SOURCE_LABELS[item.source]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {item.model_used ? (
                          <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                            {item.model_used}
                          </span>
                        ) : (
                          <span className="text-sm text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <TokensCell
                          input_tokens={item.input_tokens}
                          input_cost_usd={item.input_cost_usd}
                          output_tokens={item.output_tokens}
                          output_cost_usd={item.output_cost_usd}
                          total_tokens={item.total_tokens}
                          total_cost_usd={item.total_cost_usd}
                        />
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

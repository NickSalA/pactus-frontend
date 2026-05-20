import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';

type FieldSectionCardProps = {
  children: ReactNode;
  expanded: boolean;
  onToggle: () => void;
  saved: boolean;
  title: string;
};

export function FieldSectionCard({
  children,
  expanded,
  onToggle,
  saved,
  title,
}: FieldSectionCardProps) {
  return (
    <div
      className={`overflow-hidden rounded-3xl border shadow-sm transition-colors ${saved ? 'border-emerald-300 bg-emerald-50/40' : 'border-slate-200 bg-white'}`}
    >
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center justify-between gap-4 px-5 py-3 text-left transition ${saved ? 'hover:bg-emerald-50/60' : 'hover:bg-slate-50'}`}
      >
        <div>
          <p className="text-base font-semibold text-slate-900">{title}</p>
          {saved && (
            <p className="mt-0.5 text-xs text-slate-500">
              Sección guardada · puedes editarla si lo necesitas
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${saved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
          >
            {saved ? 'Guardada' : 'Pendiente'}
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {expanded && <div className="border-t border-slate-200">{children}</div>}
    </div>
  );
}
import { CheckCircle2 } from 'lucide-react';
import type { FieldSectionNavItem } from '../../types/FieldSectionNavItem';

type FieldSectionTimelineProps = {
  activeId: string | null;
  items: readonly FieldSectionNavItem[];
  onSelect: (id: string) => void;
};

export function FieldSectionTimeline({
  activeId,
  items,
  onSelect,
}: FieldSectionTimelineProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Áreas del contrato
      </p>
      <div className="mt-4 space-y-1">
        {items.map((item, index) => {
          const isActive = item.id === activeId;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`grid w-full grid-cols-[20px_minmax(0,1fr)] gap-3 rounded-2xl px-3 py-3 text-left transition ${
                isActive
                  ? 'bg-white shadow-sm ring-1 ring-blue-200'
                  : 'hover:bg-white/70'
              }`}
            >
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    item.saved
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : isActive
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-slate-300 bg-white text-slate-400'
                  }`}
                >
                  {item.saved ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-current" />
                  )}
                </span>
                {index < items.length - 1 && (
                  <span
                    className={`mt-1 h-8 w-px ${item.saved ? 'bg-emerald-300' : 'bg-slate-200'}`}
                  />
                )}
              </div>

              <div className="min-w-0 pt-0.5">
                <p
                  className={`text-sm font-semibold ${isActive ? 'text-slate-900' : 'text-slate-700'}`}
                >
                  {item.title}
                </p>
                <p
                  className={`mt-0.5 text-xs ${item.saved ? 'text-emerald-700' : 'text-slate-500'}`}
                >
                  {item.saved ? 'Completada' : 'Pendiente'}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
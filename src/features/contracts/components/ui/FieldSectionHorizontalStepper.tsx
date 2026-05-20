import { CheckCircle2 } from 'lucide-react';
import type { FieldSectionNavItem } from '../../types/FieldSectionNavItem';

type FieldSectionHorizontalStepperProps = {
  activeId: string | null;
  items: readonly FieldSectionNavItem[];
  onSelect: (id: string) => void;
};

export function FieldSectionHorizontalStepper({
  activeId,
  items,
  onSelect,
}: FieldSectionHorizontalStepperProps) {
  return (
    <div className="flex items-center gap-0.5 overflow-x-auto">
      {items.map((item, index) => {
        const isActive = item.id === activeId;

        return (
          <div key={item.id} className="flex shrink-0 items-center">
            <button
              type="button"
              onClick={() => onSelect(item.id)}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 transition ${
                isActive
                  ? 'bg-white shadow-sm ring-1 ring-blue-200'
                  : 'hover:bg-white/70'
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-bold ${
                  item.saved
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : isActive
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-slate-300 bg-white text-slate-400'
                }`}
              >
                {item.saved ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                )}
              </span>
              <span
                className={`whitespace-nowrap text-xs font-medium ${
                  isActive
                    ? 'text-slate-900'
                    : item.saved
                      ? 'text-emerald-700'
                      : 'text-slate-600'
                }`}
              >
                {item.title}
              </span>
            </button>
            {index < items.length - 1 && (
              <div
                className={`mx-0.5 h-px w-3 shrink-0 ${item.saved ? 'bg-emerald-300' : 'bg-slate-200'}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
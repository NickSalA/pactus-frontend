import { useRef, useState } from 'react';
import { CalendarDays, X } from 'lucide-react';
import type { DateRange } from '@/features/contracts/hooks/useContractsFilters';

type DateRangePickerProps = {
  value: DateRange;
  onChange: (range: DateRange) => void;
};

function formatDateDisplay(iso: string): string {
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [localRange, setLocalRange] = useState<DateRange>(value);
  const datePickerRef = useRef<HTMLDivElement>(null);

  const hasDateFilter = Boolean(value.start ?? value.end);

  const openDatePicker = () => {
    setLocalRange(value);
    setShowDatePicker(true);
  };

  const applyDateRange = () => {
    onChange(localRange);
    setShowDatePicker(false);
  };

  const clearDateRange = () => {
    const empty: DateRange = { end: null, start: null };
    setLocalRange(empty);
    onChange(empty);
    setShowDatePicker(false);
  };

  return (
    <div className="relative" ref={datePickerRef}>
      <button
        type="button"
        onClick={showDatePicker ? () => setShowDatePicker(false) : openDatePicker}
        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
          hasDateFilter
            ? 'border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100'
            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
        }`}
      >
        <CalendarDays className="h-4 w-4" />
        {hasDateFilter
          ? `${value.start ? formatDateDisplay(value.start) : '…'} — ${value.end ? formatDateDisplay(value.end) : '…'}`
          : 'Rango de fechas'}
      </button>

      {showDatePicker && (
        <div className="absolute left-0 top-full z-50 mt-2 w-85 rounded-xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-700">
              Filtrar por fecha de inicio
            </p>
            <button
              type="button"
              onClick={() => setShowDatePicker(false)}
              className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500">
                Desde
              </label>
              <input
                type="date"
                value={localRange.start ?? ''}
                max={localRange.end ?? undefined}
                onChange={(e) =>
                  setLocalRange((prev) => ({
                    ...prev,
                    start: e.target.value || null,
                  }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500">
                Hasta
              </label>
              <input
                type="date"
                value={localRange.end ?? ''}
                min={localRange.start ?? undefined}
                onChange={(e) =>
                  setLocalRange((prev) => ({
                    ...prev,
                    end: e.target.value || null,
                  }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={clearDateRange}
              className="rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100"
            >
              Limpiar
            </button>
            <button
              type="button"
              onClick={applyDateRange}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}

      {hasDateFilter && (
        <button
          type="button"
          onClick={() => onChange({ end: null, start: null })}
          className="flex items-center gap-1.5 rounded-full bg-blue-50 py-0.5 pl-2.5 pr-1.5 text-xs font-medium text-blue-700 ring-1 ring-blue-200/60 transition-colors hover:bg-blue-100"
        >
          Limpiar fechas
          <span className="rounded-full p-0.5 hover:bg-blue-200">
            <X className="h-3 w-3" />
          </span>
        </button>
      )}
    </div>
  );
}
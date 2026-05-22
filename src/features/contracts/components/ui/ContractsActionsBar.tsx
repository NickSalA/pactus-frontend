'use client';

import { type ReactNode, useRef, useState } from 'react';
import { CalendarDays, Plus, Search, X } from 'lucide-react';
import {
  FILTER_OPTIONS,
  type DocumentFilterValue,
} from '@/features/contracts/lib/contracts-utils';
import type {
  DateRange,
  SortOrder,
} from '@/features/contracts/hooks/useContractsFilters';
import { Select } from '@/components/ui/Select';
import type { DocumentFlatten } from '@/types/ui.types';

type ContractsActionsBarProps = {
  contracts: DocumentFlatten[];
  dateRange: DateRange;
  filter: DocumentFilterValue;
  importControl?: ReactNode;
  onCreateContract?: () => void;
  onDateRangeChange: (range: DateRange) => void;
  onFilterChange: (value: DocumentFilterValue) => void;
  onSearchChange: (value: string) => void;
  onSortOrderChange: (value: SortOrder) => void;
  search: string;
  sortOrder: SortOrder;
};

const FILTER_CHIP_STYLES: Record<
  string,
  { active: string; activeBadge: string; inactive: string; dot: string }
> = {
  all: {
    active: 'bg-blue-50 border border-blue-200 text-blue-700 ring-0',
    activeBadge: 'bg-blue-100 text-blue-600',
    inactive:
      'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-blue-300 hover:text-blue-700 hover:bg-blue-50/50',
    dot: 'bg-blue-400',
  },
  DRAFT: {
    active: 'bg-slate-100 border border-slate-300 text-slate-700 ring-0',
    activeBadge: 'bg-slate-200 text-slate-600',
    inactive:
      'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-slate-400 hover:text-slate-800 hover:bg-slate-50',
    dot: 'bg-slate-400',
  },
  PENDING_SIGNATURE: {
    active: 'bg-sky-50 border border-sky-200 text-sky-700 ring-0',
    activeBadge: 'bg-sky-100 text-sky-600',
    inactive:
      'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-blue-300 hover:text-blue-700 hover:bg-blue-50/50',
    dot: 'bg-sky-400',
  },
  ACTIVE: {
    active: 'bg-emerald-50 border border-emerald-200 text-emerald-700 ring-0',
    activeBadge: 'bg-emerald-100 text-emerald-600',
    inactive:
      'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-emerald-300 hover:text-emerald-700 hover:bg-emerald-50/50',
    dot: 'bg-emerald-400',
  },
  EXPIRING_SOON: {
    active: 'bg-amber-50 border border-amber-200 text-amber-700 ring-0',
    activeBadge: 'bg-amber-100 text-amber-600',
    inactive:
      'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-amber-300 hover:text-amber-700 hover:bg-amber-50/50',
    dot: 'bg-amber-400',
  },
  EXPIRED: {
    active: 'bg-red-50 border border-red-200 text-red-700 ring-0',
    activeBadge: 'bg-red-100 text-red-600',
    inactive:
      'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-red-300 hover:text-red-700 hover:bg-red-50/50',
    dot: 'bg-red-400',
  },
};

const DEFAULT_CHIP_STYLE = FILTER_CHIP_STYLES.all!;

function formatDateDisplay(iso: string): string {
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
}

export function ContractsActionsBar({
  contracts,
  dateRange,
  filter,
  importControl,
  onCreateContract,
  onDateRangeChange,
  onFilterChange,
  onSearchChange,
  onSortOrderChange,
  search,
  sortOrder,
}: ContractsActionsBarProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [localRange, setLocalRange] = useState<DateRange>(dateRange);
  const datePickerRef = useRef<HTMLDivElement>(null);

  const filterCounts = FILTER_OPTIONS.reduce<Record<string, number>>(
    (counts, option) => {
      counts[option.value] =
        option.value === 'all'
          ? contracts.length
          : contracts.filter((contract) => contract.state === option.value)
              .length;
      return counts;
    },
    {},
  );

  const hasDateFilter = Boolean(dateRange.start ?? dateRange.end);

  const openDatePicker = () => {
    setLocalRange(dateRange);
    setShowDatePicker(true);
  };

  const applyDateRange = () => {
    onDateRangeChange(localRange);
    setShowDatePicker(false);
  };

  const clearDateRange = () => {
    const empty: DateRange = { end: null, start: null };
    setLocalRange(empty);
    onDateRangeChange(empty);
    setShowDatePicker(false);
  };

  return (
    <div className="mb-4 flex-shrink-0 space-y-3">
      {/* Search + Actions row */}
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <label className="relative block w-full xl:max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            placeholder="Buscar por contrato o cliente..."
            className="w-full rounded-xl border border-slate-200/80 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-700 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-400 focus:ring-[3px] focus:ring-blue-500/10"
            onChange={(event) => onSearchChange(event.target.value)}
          />
          {search.trim().length > 0 && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </label>

        <div className="flex flex-wrap items-center gap-2">
          {importControl}
          {onCreateContract && (
            <button
              onClick={onCreateContract}
              className="flex min-h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25 active:translate-y-0"
            >
              <Plus className="h-4 w-4" />
              Nuevo Contrato
            </button>
          )}
        </div>
      </div>

      {/* Filter chips + sort/date row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* State filter chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none">
          {FILTER_OPTIONS.map((option) => {
            const isActive = option.value === filter;
            const chipStyle =
              FILTER_CHIP_STYLES[option.value] ?? DEFAULT_CHIP_STYLE;
            const count = filterCounts[option.value] ?? 0;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onFilterChange(option.value)}
                className={`group relative flex flex-shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive ? chipStyle.active : chipStyle.inactive
                }`}
              >
                {!isActive && option.value !== 'all' && (
                  <span
                    className={`h-2 w-2 flex-shrink-0 rounded-full ${chipStyle.dot}`}
                  />
                )}
                <span className="whitespace-nowrap">{option.label}</span>
                <span
                  className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums transition-colors ${
                    isActive
                      ? chipStyle.activeBadge
                      : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200/80'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <span className="hidden h-5 w-px bg-slate-200 xl:block" />

        {/* Sort order */}
        <Select
          variant="sm"
          value={sortOrder}
          onChange={(e) => onSortOrderChange(e.target.value as SortOrder)}
        >
          <option value="newest">Más reciente primero</option>
          <option value="oldest">Más antiguo primero</option>
        </Select>

        {/* Date range trigger */}
        <div className="relative" ref={datePickerRef}>
          <button
            type="button"
            onClick={
              showDatePicker ? () => setShowDatePicker(false) : openDatePicker
            }
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
              hasDateFilter
                ? 'border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <CalendarDays className="h-4 w-4" />
            {hasDateFilter
              ? `${dateRange.start ? formatDateDisplay(dateRange.start) : '…'} — ${dateRange.end ? formatDateDisplay(dateRange.end) : '…'}`
              : 'Rango de fechas'}
          </button>

          {showDatePicker && (
            <div className="absolute left-0 top-full z-50 mt-2 w-[340px] rounded-xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60">
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
        </div>

        {/* Clear date range chip */}
        {hasDateFilter && (
          <button
            type="button"
            onClick={() => onDateRangeChange({ end: null, start: null })}
            className="flex items-center gap-1.5 rounded-full bg-blue-50 py-0.5 pl-2.5 pr-1.5 text-xs font-medium text-blue-700 ring-1 ring-blue-200/60 transition-colors hover:bg-blue-100"
          >
            Limpiar fechas
            <span className="rounded-full p-0.5 hover:bg-blue-200">
              <X className="h-3 w-3" />
            </span>
          </button>
        )}
      </div>

      {/* Active search indicator */}
      {search.trim().length > 0 && (
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-xs text-slate-400">Buscando:</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 py-0.5 pl-2.5 pr-1.5 text-xs font-medium text-blue-700 ring-1 ring-blue-200/60">
            &ldquo;{search.trim()}&rdquo;
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="rounded-full p-0.5 transition-colors hover:bg-blue-100"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        </div>
      )}
    </div>
  );
}

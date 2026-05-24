'use client';

import { type ReactNode } from 'react';
import { Plus, Search } from 'lucide-react';
import { FILTER_OPTIONS } from '@/features/contracts/lib/contracts-utils';
import { CONTRACT_STATUS_COLORS } from '@/lib/contractStatusColors';
import type {
  DateRange,
  SortOrder,
} from '@/features/contracts/hooks/useContractsFilters';
import { Select } from '@/components/ui/Select';
import { TextField } from '@/components/ui/TextField';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { SearchIndicator } from '@/components/ui/SearchIndicator';
import { StateFilterChips } from '@/components/ui/StateFilterChips';
import type { DocumentFlatten } from '@/types/ui.types';
import type { DocumentFilterValue } from '@/features/contracts/lib/contracts-utils';

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

const STATUS_KEY_MAP: Record<
  DocumentFilterValue,
  keyof typeof CONTRACT_STATUS_COLORS
> = {
  all: 'ALL',
  DRAFT: 'DRAFT',
  PENDING_SIGNATURE: 'PENDING_SIGNATURE',
  ACTIVE: 'ACTIVE',
  EXPIRING_SOON: 'EXPIRING_SOON',
  EXPIRED: 'EXPIRED',
  TERMINATED: 'TERMINATED',
};

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

  const chips = FILTER_OPTIONS.map((option) => {
    const statusKey = STATUS_KEY_MAP[option.value];
    const colors = CONTRACT_STATUS_COLORS[statusKey];
    return {
      value: option.value,
      label: option.label,
      count: filterCounts[option.value] ?? 0,
      activeColor: colors.activeColor,
      inactiveColor: colors.inactiveColor,
      hasDot: colors.hasDot ?? false,
    };
  });

  return (
    <div className="mb-4 shrink-0 space-y-3">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <label className="w-full xl:max-w-md">
          <TextField
            icon={<Search className="h-4 w-4" />}
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange('')}
            clearable
            placeholder="Buscar por contrato o cliente..."
          />
        </label>

        <div className="flex flex-wrap items-center gap-2">
          {importControl}
          {onCreateContract && (
            <button
              onClick={onCreateContract}
              className="flex min-h-10 items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-2 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25 active:translate-y-0"
            >
              <Plus className="h-4 w-4" />
              Nuevo Contrato
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center relative">
        <StateFilterChips
          items={chips}
          value={filter}
          onChange={(v) => onFilterChange(v as DocumentFilterValue)}
        />

        <Select
          variant="sm"
          value={sortOrder}
          onChange={(e) => onSortOrderChange(e.target.value as SortOrder)}
        >
          <option value="newest">Más reciente primero</option>
          <option value="oldest">Más antiguo primero</option>
        </Select>

        <DateRangePicker value={dateRange} onChange={onDateRangeChange} />
      </div>

      {search.trim().length > 0 && (
        <SearchIndicator search={search} onClear={() => onSearchChange('')} />
      )}
    </div>
  );
}

"use client";

import { type ReactNode } from "react";
import { Plus, Search, X } from "lucide-react";
import { FILTER_OPTIONS, type DocumentFilterValue } from "@/features/contracts/lib/contracts-utils";
import type { Document } from "@/types/api.types";

type ContractsActionsBarProps = {
  contracts: Document[];
  filter: DocumentFilterValue;
  importControl?: ReactNode;
  onCreateContract?: () => void;
  onFilterChange: (value: DocumentFilterValue) => void;
  onSearchChange: (value: string) => void;
  search: string;
};

const FILTER_CHIP_STYLES: Record<string, { active: string; inactive: string; dot: string }> = {
  all: {
    active: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 ring-0",
    inactive: "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-blue-300 hover:text-blue-700 hover:bg-blue-50/50",
    dot: "bg-blue-500",
  },
  DRAFT: {
    active: "bg-slate-700 text-white shadow-md shadow-slate-500/20 ring-0",
    inactive: "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-slate-400 hover:text-slate-800 hover:bg-slate-50",
    dot: "bg-slate-400",
  },
  PENDING_SIGNATURE: {
    active: "bg-blue-600 text-white shadow-md shadow-blue-500/20 ring-0",
    inactive: "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-blue-300 hover:text-blue-700 hover:bg-blue-50/50",
    dot: "bg-blue-500",
  },
  ACTIVE: {
    active: "bg-emerald-600 text-white shadow-md shadow-emerald-500/20 ring-0",
    inactive: "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-emerald-300 hover:text-emerald-700 hover:bg-emerald-50/50",
    dot: "bg-emerald-500",
  },
  EXPIRING_SOON: {
    active: "bg-amber-500 text-white shadow-md shadow-amber-500/20 ring-0",
    inactive: "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-amber-300 hover:text-amber-700 hover:bg-amber-50/50",
    dot: "bg-amber-500",
  },
  EXPIRED: {
    active: "bg-red-600 text-white shadow-md shadow-red-500/20 ring-0",
    inactive: "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-red-300 hover:text-red-700 hover:bg-red-50/50",
    dot: "bg-red-500",
  },
  TERMINATED: {
    active: "bg-zinc-700 text-white shadow-md shadow-zinc-500/20 ring-0",
    inactive: "bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-zinc-400 hover:text-zinc-700 hover:bg-zinc-50",
    dot: "bg-zinc-400",
  },
};

const DEFAULT_CHIP_STYLE = FILTER_CHIP_STYLES.all;

export function ContractsActionsBar({
  contracts,
  filter,
  importControl,
  onCreateContract,
  onFilterChange,
  onSearchChange,
  search,
}: ContractsActionsBarProps) {
  const filterCounts = FILTER_OPTIONS.reduce<Record<string, number>>((counts, option) => {
    counts[option.value] =
      option.value === "all"
        ? contracts.length
        : contracts.filter((contract) => contract.state === option.value).length;

    return counts;
  }, {});

  return (
    <div className="mb-4 flex-shrink-0 space-y-3">
      {/* Search + Actions row */}
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <label className="relative block w-full xl:max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            placeholder="Buscar por contrato, cliente o archivo..."
            className="w-full rounded-xl border border-slate-200/80 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-700 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-400 focus:ring-[3px] focus:ring-blue-500/10"
            onChange={(event) => onSearchChange(event.target.value)}
          />
          {search.trim().length > 0 && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
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

      {/* Filter chips row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none">
        {FILTER_OPTIONS.map((option) => {
          const isActive = option.value === filter;
          const chipStyle = FILTER_CHIP_STYLES[option.value] ?? DEFAULT_CHIP_STYLE;
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
              {/* Color dot indicator */}
              {!isActive && option.value !== "all" && (
                <span className={`h-2 w-2 flex-shrink-0 rounded-full ${chipStyle.dot}`} />
              )}

              <span className="whitespace-nowrap">{option.label}</span>

              {/* Count badge */}
              <span
                className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums transition-colors ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-500 group-hover:bg-slate-200/80"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active context indicators */}
      {search.trim().length > 0 && (
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-xs text-slate-400">Buscando:</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 py-0.5 pl-2.5 pr-1.5 text-xs font-medium text-blue-700 ring-1 ring-blue-200/60">
            &ldquo;{search.trim()}&rdquo;
            <button
              type="button"
              onClick={() => onSearchChange("")}
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

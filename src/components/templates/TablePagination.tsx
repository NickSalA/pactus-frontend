import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { getVisiblePageNumbers } from "@/lib/utils";
import { TABLE_PAGINATION_PAGE_SIZE_OPTIONS } from "@/hooks/useTablePagination";

type TablePaginationProps = {
  currentPage: number;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  onPageChange: (page: number) => void;
  startIndex: number;
  totalCount: number;
  totalPages: number;
};

export function TablePagination({
  currentPage,
  itemsPerPage,
  onItemsPerPageChange,
  onPageChange,
  startIndex,
  totalCount,
  totalPages,
}: TablePaginationProps) {
  if (totalCount === 0) return null;

  const visiblePageNumbers = getVisiblePageNumbers(currentPage, totalPages);

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 bg-slate-50/50 px-4 py-3 sm:flex-row">
      <div className="flex items-center gap-4 text-sm text-slate-600">
        <span>
          Mostrando <span className="font-medium text-slate-800">{startIndex + 1}</span>
          {" – "}
          <span className="font-medium text-slate-800">{Math.min(startIndex + itemsPerPage, totalCount)}</span>{" "}de{" "}
          <span className="font-medium text-slate-800">{totalCount}</span>
        </span>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Filas:</span>
          <Select
            variant="mini"
            value={itemsPerPage}
            onChange={(event) => onItemsPerPageChange(Number(event.target.value))}
          >
            {TABLE_PAGINATION_PAGE_SIZE_OPTIONS.map((rows) => (
              <option key={rows} value={rows}>
                {rows}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="rounded-lg p-2 text-slate-500 transition-all hover:bg-slate-200/60 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          title="Primera página"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-lg p-2 text-slate-500 transition-all hover:bg-slate-200/60 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          title="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="mx-2 flex items-center gap-1">
          {visiblePageNumbers.map((page, index) => (
            <span key={page} className="flex items-center">
              {index > 0 && visiblePageNumbers[index - 1] !== page - 1 && (
                <span className="px-1 text-slate-400">…</span>
              )}
              <button
                type="button"
                onClick={() => onPageChange(page)}
                className={`h-9 min-w-[2.25rem] rounded-lg text-sm font-medium transition-all ${
                  currentPage === page
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                {page}
              </button>
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-lg p-2 text-slate-500 transition-all hover:bg-slate-200/60 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          title="Página siguiente"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="rounded-lg p-2 text-slate-500 transition-all hover:bg-slate-200/60 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          title="Última página"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
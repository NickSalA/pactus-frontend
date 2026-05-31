import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  LoaderCircle,
  Pencil,
  Trash2,
  X,
} from 'lucide-react';
import {
  getDocumentStateClasses,
  getDocumentStateLabel,
} from '@/lib/document.utils';
import { DocumentTypeBadge } from '@/components/ui/DocumentTypeBadge';
import { getVisiblePageNumbers } from '@/lib/utils';
import { Select } from '@/components/ui/Select';
import type {
  ContractImportFile,
  ContractImportFileStatus,
} from '@/store/contractImportStore';
import type { DocumentFlatten } from '@/types/ui.types';
import { ApiUserRole } from '@/types/api';

type ContractsTableProps = {
  canDelete: boolean;
  canEdit: boolean;
  contracts: DocumentFlatten[];
  currentPage: number;
  filteredCount: number;
  itemsPerPage: number;
  onDelete: (contract: DocumentFlatten) => void;
  onEdit: (contract: DocumentFlatten) => void;
  onItemsPerPageChange: (value: number) => void;
  onPageChange: (page: number) => void;
  onToggleSelect?: (id: number) => void;
  onView: (contract: DocumentFlatten) => void;
  selectedIds?: Set<number>;
  startIndex: number;
  temporaryImportFiles?: ContractImportFile[];
  totalPages: number;
  userRole?: ApiUserRole | null;
};

const TEMP_IMPORT_ROW_LABELS: Record<ContractImportFileStatus, string> = {
  PENDING: 'Importación en cola...',
  DATABASE: 'Guardando contrato...',
  KNOWLEDGE_BASE: 'Indexando conocimiento...',
  COMPLETED: 'Contrato importado',
  FAILED: 'Error al importar',
};

const TEMP_IMPORT_BADGE_LABELS: Record<ContractImportFileStatus, string> = {
  PENDING: 'En cola',
  DATABASE: 'Base de datos',
  KNOWLEDGE_BASE: 'Base de conocimientos',
  COMPLETED: 'Listo',
  FAILED: 'Error',
};

const TEMP_IMPORT_BADGE_CLASSES: Record<ContractImportFileStatus, string> = {
  PENDING: 'bg-brand-neutral-100 text-brand-neutral-600 ring-brand-neutral-200',
  DATABASE: 'bg-brand-yellow-500/10 text-brand-yellow-500 ring-brand-yellow-500/20',
  KNOWLEDGE_BASE: 'bg-brand-blue-100 text-brand-primary ring-brand-primary/20',
  COMPLETED: 'bg-brand-green-50 text-brand-green-600 ring-brand-green-500/20',
  FAILED: 'bg-brand-red-100 text-brand-red-500 ring-brand-red-500/20',
};

export function ContractsTable({
  canDelete,
  canEdit,
  contracts,
  currentPage,
  filteredCount,
  itemsPerPage,
  onDelete,
  onEdit,
  onItemsPerPageChange,
  onPageChange,
  onToggleSelect,
  onView,
  selectedIds,
  startIndex,
  temporaryImportFiles = [],
  totalPages,
  userRole,
}: ContractsTableProps) {
  const visiblePageNumbers = getVisiblePageNumbers(currentPage, totalPages);

  const showCheckboxes = canDelete && onToggleSelect !== undefined;
  const showServicesColumn = userRole === 'WORKER' || userRole === 'MANAGER';
  const clientColumnLabel = userRole === 'HR' ? 'Colaborador' : 'Cliente';
  const baseColumns = showServicesColumn ? 7 : 6;
  const totalColumns = showCheckboxes ? baseColumns + 1 : baseColumns;

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200/60 bg-white shadow-sm max-h-full">
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed text-sm">
          <colgroup>
            {showCheckboxes && <col className="w-10" />}
            {showServicesColumn ? (
              <>
                <col className="w-[30%]" />
                <col className="w-[15%]" />
                <col className="w-[13%]" />
                <col className="w-[10%]" />
                <col className="w-[10%]" />
                <col className="w-[10%]" />
                <col className="w-[8%]" />
              </>
            ) : (
              <>
                <col className="w-[35%]" />
                <col className="w-[18%]" />
                <col className="w-[15%]" />
                <col className="w-[12%]" />
                <col className="w-[12%]" />
                <col className="w-[8%]" />
              </>
            )}
          </colgroup>
          <thead>
            <tr className="border-b border-slate-200 bg-linear-to-r from-slate-50 to-slate-100/80">
              {showCheckboxes && <th className="w-10 px-4 py-4" />}
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                {clientColumnLabel}
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Tipo
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Inicio
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Vencimiento
              </th>
              {showServicesColumn && (
                <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Servicios
                </th>
              )}
              <th className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                Estado
              </th>
              <th className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {temporaryImportFiles.map((file) => {
              const badgeClass = TEMP_IMPORT_BADGE_CLASSES[file.status];

              return (
                <tr
                  key={`import-${file.id}`}
                  className="bg-brand-blue-50/60 transition-colors"
                >
                  {showCheckboxes && <td className="px-4 py-3" />}
                  <td className="px-4 py-3 text-slate-600">
                    <div className="min-w-0">
                      <p className="font-medium text-slate-700">
                        {TEMP_IMPORT_ROW_LABELS[file.status]}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {file.name}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {TEMP_IMPORT_BADGE_LABELS[file.status]}
                  </td>
                  <td className="px-4 py-3 text-slate-500">--</td>
                  <td className="px-4 py-3 text-slate-500">--</td>
                  {showServicesColumn && (
                    <td className="px-4 py-3 text-slate-500">--</td>
                  )}
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${badgeClass}`}
                    >
                      {TEMP_IMPORT_BADGE_LABELS[file.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center">
                      {file.status === 'COMPLETED' ? (
                        <CheckCircle2 className="h-4 w-4 text-brand-green-500" />
                      ) : file.status === 'FAILED' ? (
                        <X className="h-4 w-4 text-brand-red-500" />
                      ) : (
                        <LoaderCircle className="h-4 w-4 animate-spin text-brand-primary" />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {contracts.map((contract, index) => {
              const serviceCount = contract.service_items?.length ?? 0;

              return (
                <tr
                  key={contract.id}
                  className={`group transition-colors hover:bg-blue-50/50 ${
                    showCheckboxes && selectedIds?.has(contract.id)
                      ? 'bg-blue-50/60'
                      : index % 2 === 0
                        ? 'bg-white'
                        : 'bg-slate-50/30'
                  }`}
                >
                  {showCheckboxes && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds?.has(contract.id) ?? false}
                        onChange={() => onToggleSelect?.(contract.id)}
                        className={`h-4 w-4 cursor-pointer rounded border-slate-300 accent-blue-600 transition-opacity duration-150 ${
                          selectedIds?.has(contract.id)
                            ? 'opacity-100'
                            : 'opacity-0 group-hover:opacity-100'
                        }`}
                        aria-label={`Seleccionar ${contract.client}`}
                      />
                    </td>
                  )}
                  <td className="px-4 py-3 text-slate-600">
                    {contract.client}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    <DocumentTypeBadge type={contract.contract_type} />
                  </td>
                  <td className="px-4 py-3 tabular-nums text-slate-600">
                    {contract.start_date}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-slate-600">
                    {contract.end_date}
                  </td>
                  {showServicesColumn && (
                    <td className="px-4 py-3">
                      {serviceCount > 0 ? (
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                          {serviceCount} servicio{serviceCount === 1 ? '' : 's'}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  )}
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getDocumentStateClasses(contract.state)}`}
                    >
                      {getDocumentStateLabel(contract.state)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onView(contract)}
                        className="rounded-lg p-2 text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-600"
                        title="Vista previa"
                        aria-label={`Vista previa de ${contract.client}`}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {canEdit && (
                        <button
                          onClick={() => onEdit(contract)}
                          className="rounded-lg p-2 text-slate-400 transition-all hover:bg-amber-50 hover:text-amber-600"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => onDelete(contract)}
                          className="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-600"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {contracts.length === 0 && (
              <tr>
                <td colSpan={totalColumns} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                      <svg
                        className="h-7 w-7 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <p className="font-medium text-slate-500">
                      No se encontraron contratos
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Intenta ajustar los filtros de busqueda
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredCount > 0 && (
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 bg-slate-50/50 px-4 py-3 sm:flex-row">
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span>
              Mostrando{' '}
              <span className="font-medium text-slate-800">
                {startIndex + 1}
              </span>
              {' - '}
              <span className="font-medium text-slate-800">
                {Math.min(startIndex + itemsPerPage, filteredCount)}
              </span>{' '}
              de{' '}
              <span className="font-medium text-slate-800">
                {filteredCount}
              </span>
            </span>
            <div className="flex items-center gap-2">
              <label htmlFor="itemsPerPage" className="text-slate-500">
                Filas:
              </label>
              <Select
                variant="mini"
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={(event) =>
                  onItemsPerPageChange(Number(event.target.value))
                }
              >
                {[5, 9, 10, 15, 20].map((rows) => (
                  <option key={rows} value={rows}>
                    {rows}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className="rounded-lg p-2 text-slate-500 transition-all hover:bg-slate-200/60 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              title="Primera pagina"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-lg p-2 text-slate-500 transition-all hover:bg-slate-200/60 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              title="Pagina anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="mx-2 flex items-center gap-1">
              {visiblePageNumbers.map((page, index) => (
                <span key={page} className="flex items-center">
                  {index > 0 && visiblePageNumbers[index - 1] !== page - 1 && (
                    <span className="px-1 text-slate-400">...</span>
                  )}
                  <button
                    onClick={() => onPageChange(page)}
                    className={`h-9 min-w-9 rounded-lg text-sm font-medium transition-all ${
                      currentPage === page
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-200/60'
                    }`}
                  >
                    {page}
                  </button>
                </span>
              ))}
            </div>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-lg p-2 text-slate-500 transition-all hover:bg-slate-200/60 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              title="Pagina siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="rounded-lg p-2 text-slate-500 transition-all hover:bg-slate-200/60 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              title="Ultima pagina"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { TablePagination } from '@/components/templates/TablePagination';
import { formatDate } from '@/lib/utils';
import { getFolderVisibilityLabel } from '@/features/admin/lib/adminFormatters';
import type { DocumentFolder } from '@/types/ui.types';

type Folder = DocumentFolder;

type FoldersTableProps = {
  folders: Folder[];
  pagination: {
    paginatedItems: Folder[];
    currentPage: number;
    itemsPerPage: number;
    startIndex: number;
    totalCount: number;
    totalPages: number;
    changeItemsPerPage: (value: number) => void;
    changePage: (page: number) => void;
  };
};

export function FoldersTable({ folders, pagination }: FoldersTableProps) {
  return (
    <div className="flex-1 min-h-0">
      <section className="flex flex-col rounded-2xl border border-slate-200/60 bg-white shadow-sm max-h-full">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200/80 text-left">
            <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              <tr>
                <th className="px-6 py-4">Carpeta</th>
                <th className="px-6 py-4">Visible para</th>
                <th className="px-6 py-4">Creada por</th>
                <th className="px-6 py-4">Documentos</th>
                <th className="px-6 py-4">Creada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80 bg-white text-sm text-slate-700">
              {pagination.paginatedItems.map((folder) => (
                <tr key={folder.id}>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {folder.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">
                      {getFolderVisibilityLabel(folder.owner_role)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-900">
                        {folder.created_by_name || 'Sin nombre'}
                      </p>
                      <p className="text-slate-500">
                        {folder.created_by_email || 'Sin correo'}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-blue-600">
                    {folder.documents_count}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {formatDate(folder.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {folders.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-slate-500">
            Aún no existen carpetas registradas en la organización.
          </div>
        ) : (
          <TablePagination
            currentPage={pagination.currentPage}
            itemsPerPage={pagination.itemsPerPage}
            onItemsPerPageChange={pagination.changeItemsPerPage}
            onPageChange={pagination.changePage}
            startIndex={pagination.startIndex}
            totalCount={pagination.totalCount}
            totalPages={pagination.totalPages}
          />
        )}
      </section>
    </div>
  );
}
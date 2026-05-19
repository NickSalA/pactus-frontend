import Link from 'next/link';
import { ChevronLeft, ChevronRight, Ellipsis, FileText } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {
  getDashboardDocumentStateClasses,
  getDocumentStateLabel,
} from '@/lib/document.utils';
import type { RecentDashboardDocument } from '@/features/admin/dashboard/lib/dashboard-data';

type DashboardRecentDocumentsTableProps = {
  currentPage: number;
  documents: RecentDashboardDocument[];
  endIndex: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  startIndex: number;
  totalPages: number;
  totalRecords: number;
};

const LoadingSkeleton = () => (
  <div className="flex flex-1 flex-col px-6 py-4">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0"
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="h-10 w-10 rounded-lg bg-gray-200 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse" />
            <div className="h-3 w-1/2 rounded bg-gray-200 animate-pulse" />
          </div>
        </div>
        <div className="h-6 w-20 rounded-full bg-gray-200 animate-pulse" />
        <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
      </div>
    ))}
  </div>
);

export function DashboardRecentDocumentsTable({
  currentPage,
  documents,
  endIndex,
  isLoading,
  onPageChange,
  startIndex,
  totalPages,
  totalRecords,
}: DashboardRecentDocumentsTableProps) {
  if (isLoading) {
    return (
      <Card className="flex flex-col h-full rounded-2xl bg-white shadow-md">
        <CardHeader className="border-b border-slate-100 px-6 py-5">
          <CardTitle className="text-lg font-semibold text-slate-800">
            Contratos recientes
          </CardTitle>
          <CardDescription className="text-sm text-gray-medium">
            Ultimas actualizaciones registradas en tus contratos.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <LoadingSkeleton />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full rounded-2xl bg-white shadow-md">
      <CardHeader className="border-b border-slate-100 px-6 py-5">
        <CardTitle className="text-lg font-semibold text-slate-800">
          Contratos recientes
        </CardTitle>
        <CardDescription className="text-sm text-gray-medium">
          Ultimas actualizaciones registradas en tus contratos.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 overflow-x-auto p-0">
        <table className="min-w-full table-fixed">
          <colgroup>
            <col className="w-[52%]" />
            <col className="w-[18%]" />
            <col className="w-[20%]" />
            <col className="w-[10%]" />
          </colgroup>
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-gray-medium">
              <th className="px-6 py-4 font-medium">Nombre del documento</th>
              <th className="px-6 py-4 text-center font-medium">Estado</th>
              <th className="px-6 py-4 text-center font-medium">
                Ultima modificacion
              </th>
              <th className="px-6 py-4 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 && (
              <tr>
                <td className="px-6 py-6 text-sm text-gray-medium" colSpan={4}>
                  No hay documentos disponibles.
                </td>
              </tr>
            )}
            {documents.map((document) => (
              <tr
                key={document.id}
                className="border-t border-slate-100 hover:bg-slate-50/70"
              >
                <td className="px-6 py-4 align-middle">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 rounded-lg bg-blue-50 p-2 text-blue-600">
                      <FileText className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {document.name}
                      </p>
                      <p className="mt-1 truncate text-xs text-gray-medium">
                        {document.subtitle}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center align-middle">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getDashboardDocumentStateClasses(
                      document.status,
                    )}`}
                  >
                    {getDocumentStateLabel(document.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center align-middle text-sm text-gray-medium">
                  <span className="whitespace-nowrap">{document.modified}</span>
                </td>
                <td className="px-6 py-4 text-right align-middle">
                  <Link
                    href="/contracts"
                    className="inline-flex rounded-lg p-2 text-slate-500 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-700"
                  >
                    <Ellipsis className="h-5 w-5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>

      {!isLoading && totalRecords > 0 && (
        <CardFooter className="rounded-none bg-transparent p-0 border-t border-slate-100 px-6 py-3 flex items-center justify-between gap-4">
          <span className="text-sm text-slate-500">
            Mostrando{' '}
            <span className="font-medium text-slate-700">{startIndex + 1}</span>
            {' - '}
            <span className="font-medium text-slate-700">
              {Math.min(endIndex, totalRecords)}
            </span>{' '}
            de{' '}
            <span className="font-medium text-slate-700">{totalRecords}</span>
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-lg p-2 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`h-8 min-w-8 rounded-lg text-sm font-medium transition-all ${
                    currentPage === page
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-lg p-2 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

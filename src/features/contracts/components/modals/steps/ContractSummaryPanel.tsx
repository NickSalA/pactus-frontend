'use client';

import { FileText, LoaderCircle } from 'lucide-react';
import type { DocumentFlatten } from '@/types/ui.types';

type ContractSummaryPanelProps = {
  submitState: 'idle' | 'loading' | 'success' | 'error';
  generatedDocument: DocumentFlatten | null;
  previewUrl: string | null;
  flowError: string | null;
};

export function ContractSummaryPanel({
  submitState,
  generatedDocument,
  previewUrl,
  flowError,
}: ContractSummaryPanelProps) {
  return (
    <section className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm">
      <div className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-900">
            {submitState === 'success' ? 'Previsualización' : 'Resumen'}
          </p>
          {previewUrl && (
            <a
              href={previewUrl}
              rel="noreferrer"
              target="_blank"
              className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Abrir
            </a>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {submitState === 'success' && generatedDocument && previewUrl ? (
          <div className="h-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <iframe
              key={previewUrl}
              title={`Vista previa de ${generatedDocument.type} - ${generatedDocument.client}`}
              src={previewUrl}
              className="h-full min-h-0 w-full bg-white"
            />
          </div>
        ) : submitState === 'loading' ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-300 bg-white px-6 text-center">
            <LoaderCircle className="h-10 w-10 animate-spin text-blue-600" />
            <div>
              <p className="text-base font-medium text-slate-800">
                Generando el documento
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Preparando el PDF para su revisión...
              </p>
            </div>
          </div>
        ) : submitState === 'error' && flowError ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-red-200 bg-white px-6 text-center">
            <FileText className="h-10 w-10 text-red-400" />
            <div>
              <p className="text-base font-medium text-slate-800">
                Error al generar
              </p>
              <p className="mt-1 text-sm text-slate-500">{flowError}</p>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-300 bg-white px-6 text-center">
            <FileText className="h-10 w-10 text-slate-300" />
            <div>
              <p className="text-base font-medium text-slate-800">
                La previsualización aparecerá aquí
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Completa las secciones y usa el botón{' '}
                <span className="font-medium text-slate-700">
                  Generar contrato
                </span>{' '}
                para ver el PDF.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

'use client';

import { FileStack, Plus, RefreshCw } from 'lucide-react';

type TemplateHeaderProps = {
  onRefresh: () => void;
  onCreate: () => void;
};

export function TemplateHeader({ onRefresh, onCreate }: TemplateHeaderProps) {
  return (
    <section className="rounded-[32px] border border-slate-200/70 bg-white px-8 py-7 shadow-sm shadow-slate-200/70">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
            <FileStack className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
              Plantillas de contratos
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Crea, edita, previsualiza y publica plantillas.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              onRefresh();
            }}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </button>
          <button
            type="button"
            onClick={onCreate}
            className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/25"
          >
            <Plus className="h-4 w-4" />
            Nueva plantilla
          </button>
        </div>
      </div>
    </section>
  );
}

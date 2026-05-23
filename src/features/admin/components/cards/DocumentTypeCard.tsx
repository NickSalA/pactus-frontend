'use client';

import { BookType } from 'lucide-react';
import type { DocumentTypeCatalogItem } from '@/features/admin/hooks/useAdminDocumentTypes';

type DocumentTypeCardProps = {
  item: DocumentTypeCatalogItem;
};

export function DocumentTypeCard({ item }: DocumentTypeCardProps) {
  return (
    <article className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/70">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold text-slate-900">
            {item.label}
          </h3>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-500">
          <BookType className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-500">
        {item.description}
      </p>
      <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-3">
        <span className="text-sm font-medium text-slate-600">
          Contratos actuales
        </span>
        <span className="text-lg font-semibold text-blue-600">
          {item.count}
        </span>
      </div>
      <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
        Catálogo fijo del sistema
      </p>
    </article>
  );
}
'use client';

import { Plus, RefreshCw, Search } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { TextField } from '@/components/ui/TextField';
import { StateFilterChips } from '@/components/ui/StateFilterChips';
import { getDocumentTypeLabel } from '@/lib/document.utils';
import { TEMPLATE_STATUS_COLORS } from '@/lib/templateStatusColors';
import type { ApiTemplateResponse } from '@/types/api';
import type { ChipRenderData } from '@/components/ui/ChipRenderData';

type Template = ApiTemplateResponse;

type TemplatesFilterBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  documentTypeFilter: 'ALL' | Template['document_type'];
  onDocumentTypeChange: (value: 'ALL' | Template['document_type']) => void;
  formatFilter: string;
  onFormatChange: (value: string) => void;
  stateFilter: 'ACTIVE' | 'ALL' | Template['state'];
  onStateChange: (value: 'ACTIVE' | 'ALL' | Template['state']) => void;
  supportsDocumentTypeSelection: boolean;
  allowedDocumentTypes: readonly Template['document_type'][] | null;
  visibleFormats: { id: number; label: string; format_code: string }[];
  onRefresh: () => void;
  onCreate: () => void;
  stateFilterCounts?: {
    all: number;
    active: number;
    draft: number;
    published: number;
    archived: number;
  };
};

const STATE_KEY_MAP: Record<string, keyof typeof TEMPLATE_STATUS_COLORS> = {
  ALL: 'ALL',
  ACTIVE: 'ACTIVE',
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
};

export function TemplatesFilterBar({
  search,
  onSearchChange,
  documentTypeFilter,
  onDocumentTypeChange,
  formatFilter,
  onFormatChange,
  stateFilter,
  onStateChange,
  supportsDocumentTypeSelection,
  allowedDocumentTypes,
  visibleFormats,
  onCreate,
  onRefresh,
  stateFilterCounts,
}: TemplatesFilterBarProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-1 gap-4 justify-between">
        <TextField
          icon={<Search size={16} />}
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por nombre, descripción o formato..."
          className="w-92"
        />

        <div className="flex items-start gap-2">
          {supportsDocumentTypeSelection ? (
            <Select
              variant="lg"
              value={documentTypeFilter}
              onChange={(e) =>
                onDocumentTypeChange(
                  e.target.value as 'ALL' | Template['document_type'],
                )
              }
            >
              <option value="ALL">Todos los tipos</option>
              {(allowedDocumentTypes ?? ['LABOR', 'COMPANY']).map(
                (documentType) => (
                  <option key={documentType} value={documentType}>
                    {getDocumentTypeLabel(documentType)}
                  </option>
                ),
              )}
            </Select>
          ) : (
            <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
              {allowedDocumentTypes?.[0]
                ? getDocumentTypeLabel(allowedDocumentTypes[0])
                : 'Sin alcance'}
            </div>
          )}

          <Select
            variant="lg"
            value={formatFilter}
            onChange={(e) => onFormatChange(e.target.value)}
          >
            <option value="ALL">Todos los formatos</option>
            {visibleFormats.map((format) => (
              <option key={format.id} value={format.format_code}>
                {format.label}
              </option>
            ))}
          </Select>

          <button
            type="button"
            onClick={onRefresh}
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

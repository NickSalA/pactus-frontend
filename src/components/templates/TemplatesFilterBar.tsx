'use client';

import { Search } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { TextField } from '@/components/ui/TextField';
import { getDocumentTypeLabel } from '@/lib/document.utils';
import type { ApiTemplateResponse } from '@/types/api';

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
}: TemplatesFilterBarProps) {
  return (
    <section className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="grid flex-1 gap-4 xl:grid-cols-[minmax(0,1fr)_180px_220px_180px]">
        <TextField
          icon={<Search size={16} />}
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por nombre, descripción o formato..."
          className="max-w-120 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
        />

        {supportsDocumentTypeSelection ? (
          <Select
            variant="lg"
            className="w-full"
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
          className="w-full"
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

        <Select
          variant="lg"
          className="w-full"
          value={stateFilter}
          onChange={(e) =>
            onStateChange(
              e.target.value as 'ACTIVE' | 'ALL' | Template['state'],
            )
          }
        >
          <option value="ACTIVE">Activas</option>
          <option value="DRAFT">Borradores</option>
          <option value="PUBLISHED">Publicadas</option>
          <option value="ARCHIVED">Archivadas</option>
          <option value="ALL">Todas</option>
        </Select>
      </div>
    </section>
  );
}
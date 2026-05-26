'use client';

import { Pencil, Trash2 } from 'lucide-react';
import type { ApiServiceResponse } from '@/types/api';
import { formatDate } from '@/lib/utils';

type Service = ApiServiceResponse;

type ServiceRowProps = {
  service: Service;
  isSelected: boolean;
  canDelete: boolean;
  onToggleSelect: (id: number) => void;
  onToggleService: (service: Service) => void;
  onEditService: (service: Service) => void;
  onDeleteService: (serviceId: number) => void;
};

export function ServiceRow({
  service,
  isSelected,
  canDelete,
  onToggleSelect,
  onToggleService,
  onEditService,
  onDeleteService,
}: ServiceRowProps) {
  return (
    <tr className={`group ${isSelected ? 'bg-blue-50/50' : ''}`}>
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(service.id)}
          disabled={!canDelete}
          className={`h-4 w-4 cursor-pointer rounded border-slate-300 accent-blue-600 transition-opacity duration-150 disabled:cursor-not-allowed ${
            isSelected
              ? 'opacity-100'
              : 'opacity-0 group-hover:opacity-100 disabled:opacity-0'
          }`}
          aria-label={`Seleccionar ${service.name}`}
        />
      </td>
      <td className="px-6 py-4 font-medium text-slate-900">
        {service.name}
      </td>
      <td className="px-6 py-4">
        <button
          type="button"
          onClick={() => {
            void onToggleService(service);
          }}
          className={`inline-flex min-w-28 items-center gap-2 rounded-full px-3 py-1 text-sm font-medium transition-colors ${service.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}
        >
          <span
            className={`h-5 w-9 rounded-full ${service.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`}
          >
            <span
              className={`mt-0.5 block h-4 w-4 rounded-full bg-white transition-transform ${service.is_active ? 'translate-x-4' : 'translate-x-0.5'}`}
            />
          </span>
          {service.is_active ? 'Activo' : 'Inactivo'}
        </button>
      </td>
      <td className="px-6 py-4 text-blue-600">
        {service.documents_count}
      </td>
      <td className="px-6 py-4 text-slate-500">
        {formatDate(service.created_at)}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onEditService(service)}
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
            title="Editar servicio"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  '¿Eliminar este servicio del catálogo?',
                )
              ) {
                void onDeleteService(service.id);
              }
            }}
            disabled={!canDelete}
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
            title="Eliminar servicio"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
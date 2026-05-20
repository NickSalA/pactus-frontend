'use client';

import { LoaderCircle, Plus, Trash2 } from 'lucide-react';
import { Select } from '@/components/ui/Select';
import { LabeledField } from '@/features/contracts/components/ui/LabeledField';
import { StepHeading } from '@/features/contracts/components/ui/StepHeading';
import { CURRENCY_OPTIONS } from '@/lib/document.utils';
import type { ApiCurrencyType, ApiServiceResponse } from '@/types/api';
import type { ServiceItemDraft } from '@/features/contracts/hooks/use-contract-generation';

type ServicesStepProps = {
  currentWizardStep: number;
  wizardSteps: readonly string[];
  flowError: string | null;
  servicesState: 'idle' | 'loading' | 'success' | 'error';
  servicesError: string | null;
  serviceItems: readonly ServiceItemDraft[];
  services: readonly ApiServiceResponse[];
  serviceNameById: ReadonlyMap<string, string>;
  onAddServiceItem: () => void;
  onRemoveServiceItem: (key: string) => void;
  onServiceItemChange: (
    key: string,
    field: keyof Omit<ServiceItemDraft, 'key'>,
    value: string,
  ) => void;
};

export function ServicesStep({
  currentWizardStep,
  wizardSteps,
  flowError,
  servicesState,
  servicesError,
  serviceItems,
  services,
  serviceNameById,
  onAddServiceItem,
  onRemoveServiceItem,
  onServiceItemChange,
}: ServicesStepProps) {
  return (
    <div className="mx-auto flex h-full w-full max-w-5xl flex-col overflow-y-auto pr-1">
      <StepHeading
        currentStep={currentWizardStep}
        description="Selecciona los servicios que formarán parte de este contrato. Puedes continuar sin agregar servicios."
        title="Servicios del contrato"
        totalSteps={wizardSteps.length}
      />

      {flowError && (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {flowError}
        </div>
      )}

      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Servicios seleccionados
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Cada servicio puede incluir descripción, valor y rango de fechas.
            </p>
          </div>

          <button
            type="button"
            onClick={onAddServiceItem}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Plus className="h-4 w-4" />
            Agregar servicio
          </button>
        </div>

        {servicesState === 'loading' && (
          <div className="mt-5 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <LoaderCircle className="h-4 w-4 animate-spin" />
            Cargando catálogo de servicios...
          </div>
        )}

        {servicesError && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {servicesError}
          </div>
        )}

        {serviceItems.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            Aún no has agregado servicios. Puedes continuar y añadirlos más
            adelante si lo necesitas.
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {serviceItems.map((item, index) => (
              <div
                key={item.key}
                className="rounded-2xl border border-slate-200 p-4"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Servicio {index + 1}
                    </p>
                    <p className="text-xs text-slate-500">
                      {serviceNameById.get(item.service_id) ??
                        'Completa la información del servicio'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveServiceItem(item.key)}
                    className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Quitar
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <LabeledField label="Servicio" required>
                    <Select
                      variant="md"
                      className="w-full"
                      value={item.service_id}
                      onChange={(event) =>
                        onServiceItemChange(
                          item.key,
                          'service_id',
                          event.target.value,
                        )
                      }
                    >
                      <option value="">Selecciona un servicio</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                    </Select>
                  </LabeledField>

                  <LabeledField label="Moneda" required>
                    <Select
                      variant="md"
                      className="w-full"
                      value={item.currency}
                      onChange={(event) =>
                        onServiceItemChange(
                          item.key,
                          'currency',
                          event.target.value,
                        )
                      }
                    >
                      <option value="">Selecciona moneda</option>
                      {CURRENCY_OPTIONS.map((currency) => (
                        <option key={currency} value={currency}>
                          {currency}
                        </option>
                      ))}
                    </Select>
                  </LabeledField>

                  <LabeledField label="Descripción">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(event) =>
                        onServiceItemChange(
                          item.key,
                          'description',
                          event.target.value,
                        )
                      }
                      placeholder="Detalle opcional"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    />
                  </LabeledField>

                  <LabeledField label="Valor" required>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.value}
                      onChange={(event) =>
                        onServiceItemChange(item.key, 'value', event.target.value)
                      }
                      placeholder="0.00"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    />
                  </LabeledField>

                  <LabeledField label="Fecha de inicio" required>
                    <input
                      type="date"
                      value={item.start_date}
                      onChange={(event) =>
                        onServiceItemChange(
                          item.key,
                          'start_date',
                          event.target.value,
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    />
                  </LabeledField>

                  <LabeledField label="Fecha de fin" required>
                    <input
                      type="date"
                      value={item.end_date}
                      onChange={(event) =>
                        onServiceItemChange(item.key, 'end_date', event.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                    />
                  </LabeledField>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
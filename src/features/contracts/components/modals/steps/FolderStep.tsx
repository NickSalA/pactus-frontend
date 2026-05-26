'use client';

import { Select } from '@/components/ui/Select';
import { LabeledField } from '@/features/contracts/components/ui/LabeledField';
import { StepHeading } from '@/features/contracts/components/ui/StepHeading';
import type { ContractFolder } from '@/features/contracts/lib/contractsUtils';

type FolderStepProps = {
  currentWizardStep: number;
  wizardSteps: readonly string[];
  flowError: string | null;
  availableFolders: readonly ContractFolder[];
  folderId: number | null;
  selectedFolderName: string | null;
  onFolderChange: (folderId: string) => void;
};

export function FolderStep({
  currentWizardStep,
  wizardSteps,
  flowError,
  availableFolders,
  folderId,
  selectedFolderName,
  onFolderChange,
}: FolderStepProps) {
  return (
    <div className="mx-auto flex h-full w-full max-w-5xl flex-col overflow-y-auto pr-1">
      <StepHeading
        currentStep={currentWizardStep}
        description="Elige la carpeta donde quieres guardar el contrato generado."
        title="Carpeta destino"
        totalSteps={wizardSteps.length}
      />

      {flowError && (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {flowError}
        </div>
      )}

      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-slate-900">
            Ubicación del contrato
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Si no eliges una carpeta, el contrato quedará disponible en la vista
            general.
          </p>
        </div>

        {availableFolders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            Aún no hay carpetas disponibles. El contrato se guardará sin carpeta.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
            <LabeledField label="Carpeta destino">
              <Select
                variant="md"
                className="w-full"
                value={folderId ?? ''}
                onChange={(event) => onFolderChange(event.target.value)}
              >
                <option value="">Sin carpeta</option>
                {availableFolders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </Select>
            </LabeledField>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                Selección actual
              </p>
              <p className="mt-2 text-base font-semibold text-slate-900">
                {selectedFolderName ?? 'Sin carpeta'}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Puedes cambiar esta ubicación más adelante si lo necesitas.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
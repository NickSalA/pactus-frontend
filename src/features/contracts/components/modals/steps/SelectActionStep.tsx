import type { WizardAction } from '@/features/contracts/hooks/useContractGeneration';
import { StepHeading } from '@/features/contracts/components/ui/StepHeading';
import { SelectionCard } from '@/features/contracts/components/ui/SelectionCard';
import { Upload, FilePlus } from 'lucide-react';

type SelectActionStepProps = {
  currentWizardStep: number;
  wizardSteps: readonly string[];
  flowError: string | null;
  selectedAction: WizardAction;
  onSelectAction: (action: WizardAction) => void;
};

export function SelectActionStep({
  currentWizardStep,
  wizardSteps,
  flowError,
  selectedAction,
  onSelectAction,
}: SelectActionStepProps) {
  return (
    <div className="mx-auto flex h-full w-full max-w-5xl flex-col">
      <StepHeading
        currentStep={currentWizardStep}
        description="Elige si quieres subir un contrato existente o generar uno desde una plantilla publicada."
        title="¿Cómo quieres agregar el contrato?"
        totalSteps={wizardSteps.length}
      />

      {flowError && (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {flowError}
        </div>
      )}

      <div className="mt-6 grid flex-1 auto-rows-fr gap-4 md:grid-cols-2">
        <SelectionCard
          description="Carga un PDF ya firmado o en proceso para organizarlo dentro de tus contratos."
          icon={<Upload className="h-7 w-7 text-blue-600" />}
          onClick={() => onSelectAction('upload')}
          selected={selectedAction === 'upload'}
          title="Subir contrato existente"
        />
        <SelectionCard
          description="Elige una plantilla y completa los datos del contrato paso a paso."
          icon={<FilePlus className="h-7 w-7 text-blue-600" />}
          onClick={() => onSelectAction('generate')}
          selected={selectedAction === 'generate'}
          title="Generar con plantilla"
        />
      </div>
    </div>
  );
}
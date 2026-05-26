import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

type AdminOrganizationOnboardingActionsProps = {
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting: boolean;
  onBack: () => void;
  onNext: () => void;
};

export function AdminOrganizationOnboardingActions({
  isFirstStep,
  isLastStep,
  isSubmitting,
  onBack,
  onNext,
}: AdminOrganizationOnboardingActionsProps) {
  return (
    <div className="flex items-center justify-between gap-3 pt-1">
      {isFirstStep ? (
        <span aria-hidden="true" />
      ) : (
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="text-label-main-bold inline-flex min-h-11 items-center gap-2 rounded-xl border border-brand-neutral-300 bg-brand-neutral-50 px-4 text-brand-neutral-600 shadow-sm transition-colors hover:bg-brand-neutral-100 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-4 focus:ring-brand-blue-100"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver
        </button>
      )}

      <button
        type="button"
        onClick={onNext}
        disabled={isSubmitting}
        className="text-label-main-bold inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-primary px-5 text-brand-neutral-50 shadow-lg transition-colors hover:bg-brand-primary-dark disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none focus:ring-4 focus:ring-brand-blue-100"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : null}
        {isLastStep ? 'Continuar' : 'Siguiente'}
        {!isSubmitting ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : null}
      </button>
    </div>
  );
}

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ADMIN_ORGANIZATION_ONBOARDING_STEPS } from '@/features/admin/lib/admin-organization-onboarding.constants';
import type { AdminOrganizationOnboardingStepId } from '@/features/admin/types/admin-organization-onboarding.types';

type AdminOrganizationOnboardingProgressProps = {
  currentStep: AdminOrganizationOnboardingStepId;
  isStepCompleted: (stepId: AdminOrganizationOnboardingStepId) => boolean;
};

export function AdminOrganizationOnboardingProgress({
  currentStep,
  isStepCompleted,
}: AdminOrganizationOnboardingProgressProps) {
  return (
    <nav aria-label="Progreso de configuracion de organizacion" className="w-full">
      <ol className="flex min-w-max items-center justify-start gap-2 overflow-x-auto px-1 py-1 md:min-w-0 md:justify-center">
        {ADMIN_ORGANIZATION_ONBOARDING_STEPS.map((step, index) => {
          const completed = isStepCompleted(step.id);
          const active = currentStep === step.id;

          return (
            <li key={step.id} className="flex shrink-0 items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors',
                    completed &&
                      'border-brand-green-500 bg-brand-green-500 text-brand-neutral-50',
                    active &&
                      !completed &&
                      'border-brand-primary bg-brand-primary text-brand-neutral-50',
                    !active &&
                      !completed &&
                      'border-brand-neutral-300 bg-brand-neutral-50 text-brand-neutral-400',
                  )}
                  aria-hidden="true"
                >
                  {completed ? <Check className="h-3.5 w-3.5" /> : step.id}
                </span>
                <span
                  className={cn(
                    'text-label-main-regular whitespace-nowrap',
                    active ? 'text-brand-neutral-900' : 'text-brand-neutral-400',
                    completed && 'text-brand-neutral-700',
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < ADMIN_ORGANIZATION_ONBOARDING_STEPS.length - 1 ? (
                <span
                  className={cn(
                    'h-px w-4 rounded-full',
                    completed ? 'bg-brand-green-500' : 'bg-brand-neutral-300',
                  )}
                  aria-hidden="true"
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

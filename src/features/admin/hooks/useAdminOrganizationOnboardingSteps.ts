'use client';

import { startTransition, useCallback, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import {
  ADMIN_ORGANIZATION_ONBOARDING_LAST_STEP,
  ADMIN_ORGANIZATION_ONBOARDING_STEPS,
} from '@/features/admin/lib/adminOrganizationOnboardingConstants';
import type {
  AdminOrganizationOnboardingStepId,
  AdminOrganizationOnboardingValues,
} from '@/features/admin/types/adminOrganizationOnboardingTypes';

type UseAdminOrganizationOnboardingStepsProps = {
  form: UseFormReturn<AdminOrganizationOnboardingValues>;
  onComplete: () => Promise<void> | void;
};

export function useAdminOrganizationOnboardingSteps({
  form,
  onComplete,
}: UseAdminOrganizationOnboardingStepsProps) {
  const [currentStep, setCurrentStep] =
    useState<AdminOrganizationOnboardingStepId>(1);

  const currentStepConfig = ADMIN_ORGANIZATION_ONBOARDING_STEPS[currentStep - 1];
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === ADMIN_ORGANIZATION_ONBOARDING_LAST_STEP;

  const goBack = useCallback(() => {
    startTransition(() => {
      setCurrentStep((previousStep) =>
        Math.max(previousStep - 1, 1) as AdminOrganizationOnboardingStepId,
      );
    });
  }, []);

  const goNext = useCallback(async () => {
    const stepConfig = ADMIN_ORGANIZATION_ONBOARDING_STEPS[currentStep - 1];
    const isCurrentStepValid = await form.trigger(stepConfig.fields, {
      shouldFocus: true,
    });

    if (!isCurrentStepValid) {
      return false;
    }

    if (currentStep === ADMIN_ORGANIZATION_ONBOARDING_LAST_STEP) {
      const isFormValid = await form.trigger(undefined, { shouldFocus: true });
      if (!isFormValid) {
        return false;
      }

      await onComplete();
      return true;
    }

    startTransition(() => {
      setCurrentStep((previousStep) =>
        Math.min(
          previousStep + 1,
          ADMIN_ORGANIZATION_ONBOARDING_LAST_STEP,
        ) as AdminOrganizationOnboardingStepId,
      );
    });

    return true;
  }, [currentStep, form, onComplete]);

  const isStepCompleted = useCallback(
    (stepId: AdminOrganizationOnboardingStepId) => stepId < currentStep,
    [currentStep],
  );

  return {
    currentStep,
    currentStepConfig,
    goBack,
    goNext,
    isFirstStep,
    isLastStep,
    isStepCompleted,
  };
}

'use client';

import { useCallback, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Handshake } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { AdminOrganizationOnboardingActions } from '@/features/admin/components/modals/AdminOrganizationOnboardingActions';
import { AdminOrganizationOnboardingProgress } from '@/features/admin/components/modals/AdminOrganizationOnboardingProgress';
import { AdminOrganizationBusinessTypeStep } from '@/features/admin/components/modals/steps/AdminOrganizationBusinessTypeStep';
import { AdminOrganizationGeneralDataStep } from '@/features/admin/components/modals/steps/AdminOrganizationGeneralDataStep';
import { AdminOrganizationLegalDataStep } from '@/features/admin/components/modals/steps/AdminOrganizationLegalDataStep';
import { useAdminOrganizationOnboardingForm } from '@/features/admin/hooks/useAdminOrganizationOnboardingForm';
import { useAdminOrganizationOnboardingSteps } from '@/features/admin/hooks/useAdminOrganizationOnboardingSteps';
import { buildAdminOrganizationOnboardingPayload } from '@/features/admin/lib/adminOrganizationOnboardingPayload';
import type { AdminOrganizationOnboardingStepId } from '@/features/admin/types/adminOrganizationOnboardingTypes';
import { useUpdateMyOrganization } from '@/queries/hooks/organizations/mutations';
import type { ApiOrganizationResponse } from '@/types/api';

type AdminOrganizationOnboardingModalProps = {
  organization: ApiOrganizationResponse;
};

function renderStep(step: AdminOrganizationOnboardingStepId) {
  if (step === 1) {
    return <AdminOrganizationGeneralDataStep />;
  }

  if (step === 2) {
    return <AdminOrganizationBusinessTypeStep />;
  }

  return <AdminOrganizationLegalDataStep />;
}

export function AdminOrganizationOnboardingModal({
  organization,
}: AdminOrganizationOnboardingModalProps) {
  const router = useRouter();
  const form = useAdminOrganizationOnboardingForm(organization);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const updateOrganizationMutation = useUpdateMyOrganization();

  const handleComplete = useCallback(async () => {
    try {
      setSubmitError(null);
      await updateOrganizationMutation.mutateAsync(
        buildAdminOrganizationOnboardingPayload(form.getValues()),
      );
      router.replace('/admin/dashboard');
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'No se pudo guardar la organizacion.',
      );
    }
  }, [form, router, updateOrganizationMutation]);

  const steps = useAdminOrganizationOnboardingSteps({
    form,
    onComplete: handleComplete,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-blue-50 px-4 py-6">
      <FormProvider {...form}>
        <form
          noValidate
          aria-labelledby="admin-organization-onboarding-title"
          onSubmit={(event) => {
            event.preventDefault();
            if (!updateOrganizationMutation.isPending) {
              void steps.goNext();
            }
          }}
          className="w-full max-w-2xl"
        >
          <Card className="gap-0 overflow-visible rounded-3xl border-brand-blue-100 bg-brand-neutral-50 py-0 shadow-xl">
            <header className="px-5 pt-5 sm:px-6 sm:pt-6">
              <div className="mb-2 flex items-center gap-2 text-brand-primary">
                <Handshake className="h-7 w-7 fill-brand-primary/10" aria-hidden="true" />
                <span className="text-display-large-logo leading-none">Pactus</span>
              </div>
              <h1
                id="admin-organization-onboarding-title"
                className="text-body-main-bold text-brand-neutral-900"
              >
                Configurando tu organizacion
              </h1>
              <p className="text-label-main-regular mt-2 text-brand-neutral-500">
                Completa estos datos una sola vez para activar tu panel de administrador.
              </p>
            </header>

            <CardContent className="space-y-5 p-5 sm:p-6">
              <AdminOrganizationOnboardingProgress
                currentStep={steps.currentStep}
                isStepCompleted={steps.isStepCompleted}
              />

              <div className="min-h-44">{renderStep(steps.currentStep)}</div>

              {submitError ? (
                <p
                  role="alert"
                  className="text-label-main-bold rounded-xl border border-brand-red-500 bg-brand-red-100 px-3 py-2 text-brand-red-500"
                >
                  {submitError}
                </p>
              ) : null}

              <AdminOrganizationOnboardingActions
                isFirstStep={steps.isFirstStep}
                isLastStep={steps.isLastStep}
                isSubmitting={updateOrganizationMutation.isPending}
                onBack={steps.goBack}
                onNext={() => {
                  void steps.goNext();
                }}
              />
            </CardContent>
          </Card>
        </form>
      </FormProvider>
    </div>
  );
}

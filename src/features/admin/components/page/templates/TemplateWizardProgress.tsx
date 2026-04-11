import { Check } from "lucide-react";

type TemplateWizardProgressProps = {
  currentStep: number;
  maxStepReached?: number;
  onStepClick?: (step: number) => void;
  steps: string[];
};

export function TemplateWizardProgress({
  currentStep,
  maxStepReached,
  onStepClick,
  steps,
}: TemplateWizardProgressProps) {
  const reachableStep = maxStepReached ?? steps.length;

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center justify-center gap-y-3">
        {steps.map((label, index) => {
          const step = index + 1;
          const isPast = currentStep > step;
          const isCurrent = currentStep === step;
          const isClickable = Boolean(onStepClick) && step <= reachableStep;

          return (
            <div key={label} className="flex min-w-0 items-center">
              <button
                type="button"
                onClick={() => {
                  if (isClickable) {
                    onStepClick?.(step);
                  }
                }}
                disabled={!isClickable}
                className="flex min-w-0 items-center bg-transparent disabled:cursor-default"
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300 ${
                    isPast
                      ? "border-green-500 bg-green-500 text-white"
                      : isCurrent
                        ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/30"
                        : "border-slate-300 bg-white text-slate-400"
                  } ${isClickable ? "cursor-pointer" : ""}`}
                >
                  {isPast ? <Check className="h-3.5 w-3.5" /> : step}
                </div>
                <span
                  className={`ml-2 shrink-0 text-xs font-medium transition-colors duration-300 ${
                    currentStep >= step ? "text-slate-700" : "text-slate-400"
                  }`}
                >
                  {label}
                </span>
              </button>

              {index < steps.length - 1 && (
                <div
                  className={`mx-4 h-px flex-1 transition-colors duration-500 ${
                    currentStep > step ? "bg-green-400" : "bg-slate-200"
                  }`}
                  style={{ minWidth: "2rem" }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

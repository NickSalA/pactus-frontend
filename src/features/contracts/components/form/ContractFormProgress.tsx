import { Check } from "lucide-react";

type ContractFormProgressProps = {
  currentStep: number;
  steps?: readonly string[];
};

const DEFAULT_STEPS = ["Datos generales", "Servicios", "Documento"] as const;

export function ContractFormProgress({ currentStep, steps = DEFAULT_STEPS }: ContractFormProgressProps) {
  return (
    <div className="mb-2">
      <div className="flex flex-wrap items-center justify-center gap-y-2">
        {steps.map((label, index) => {
          const step = index + 1;

          return (
            <div key={step} className="flex min-w-0 items-center">
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-bold transition-all duration-300 ${
                  currentStep > step
                    ? "border-green-500 bg-green-500 text-white"
                    : currentStep === step
                      ? "border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                      : "border-slate-300 bg-white text-slate-400"
                }`}
              >
                {currentStep > step ? <Check className="h-3 w-3" /> : step}
              </div>
              <span
                className={`ml-1.5 shrink-0 text-[11px] font-medium transition-colors duration-300 ${
                  currentStep >= step ? "text-slate-700" : "text-slate-400"
                }`}
              >
                {label}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`mx-2 h-px flex-1 transition-colors duration-500 ${
                    currentStep > step ? "bg-green-400" : "bg-slate-200"
                  }`}
                  style={{ minWidth: "1rem" }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

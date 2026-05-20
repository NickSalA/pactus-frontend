type StepHeadingProps = {
  currentStep: number;
  description: string;
  title: string;
  totalSteps: number;
};

export function StepHeading({
  currentStep,
  description,
  title,
  totalSteps,
}: StepHeadingProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Paso {currentStep} de {totalSteps}
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}
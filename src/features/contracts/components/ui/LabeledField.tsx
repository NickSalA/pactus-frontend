import type { ReactNode } from 'react';

type LabeledFieldProps = {
  children: ReactNode;
  label: string;
  required?: boolean;
};

export function LabeledField({ children, label, required }: LabeledFieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-slate-600">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}
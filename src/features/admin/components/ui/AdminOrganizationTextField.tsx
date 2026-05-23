import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { AdminOrganizationFieldError } from '@/features/admin/components/ui/AdminOrganizationFieldError';

type AdminOrganizationTextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
  helperText?: string;
};

export function AdminOrganizationTextField({
  className,
  error,
  helperText,
  id,
  label,
  required,
  ...inputProps
}: AdminOrganizationTextFieldProps) {
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;
  const describedBy = error ? errorId : helperText ? helperId : undefined;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-label-main-bold text-brand-neutral-700">
        {label}
        {required ? <span className="ml-0.5 text-brand-red-500">*</span> : null}
      </label>
      <input
        id={id}
        aria-describedby={describedBy}
        aria-invalid={Boolean(error)}
        required={required}
        className={cn(
          'text-body-small-regular min-h-11 w-full rounded-xl border border-brand-neutral-300 bg-brand-neutral-50 px-3.5 py-2.5 text-brand-neutral-900 outline-none transition-colors placeholder:text-brand-neutral-400 hover:border-brand-neutral-400 focus:border-brand-primary focus:ring-4 focus:ring-brand-blue-100 disabled:cursor-not-allowed disabled:bg-brand-neutral-100 disabled:text-brand-neutral-400',
          error && 'border-brand-red-500 focus:border-brand-red-500 focus:ring-brand-red-100',
        )}
        {...inputProps}
      />
      <AdminOrganizationFieldError id={errorId} message={error} />
      {helperText && !error ? (
        <p id={helperId} className="text-label-main-regular text-brand-neutral-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react';
import { X } from 'lucide-react';

type TextFieldProps = {
  variant?: 'sm' | 'md' | 'lg';
  type?: 'text' | 'number' | 'date' | 'time' | 'email' | 'password' | 'search';
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  name?: string;
  className?: string;
  icon?: ReactNode;
  clearable?: boolean;
  onClear?: () => void;
};

const VARIANT_STYLES = {
  sm: 'rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
  md: 'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
  lg: 'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all hover:border-slate-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
};

export function TextField({
  variant = 'md',
  type,
  label,
  required,
  error,
  helperText,
  className,
  icon,
  clearable,
  onClear,
  value,
  ...inputProps
}: TextFieldProps) {
  const inputClasses = VARIANT_STYLES[variant];
  const hasValue = Boolean(value && String(value).trim().length > 0);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-medium text-slate-600">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </span>
        )}
        <input
          {...inputProps}
          type={type}
          value={value}
          className={`${inputClasses} ${icon ? 'pl-10' : ''} ${clearable && hasValue ? 'pr-10' : ''} ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
        />
        {clearable && hasValue && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
      {helperText && !error && (
        <span className="text-xs text-slate-400">{helperText}</span>
      )}
    </div>
  );
}

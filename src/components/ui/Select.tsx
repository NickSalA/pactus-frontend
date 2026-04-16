"use client";

import { ChevronDown } from "lucide-react";
import { forwardRef } from "react";

export type SelectVariant = "mini" | "sm" | "md" | "lg";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  /** Controls padding, border-radius and focus ring style. Defaults to "md". */
  variant?: SelectVariant;
  /** Applied to the wrapper <div> — use for width/layout (e.g. "w-full"). */
  className?: string;
};

const selectStyles: Record<SelectVariant, string> = {
  mini: [
    "w-full appearance-none rounded-lg border border-slate-200 bg-white",
    "pl-2 pr-6 py-1.5 text-sm font-medium text-slate-700",
    "outline-none transition-colors",
    "hover:border-slate-300",
    "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
    "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
  ].join(" "),
  sm: [
    "w-full appearance-none rounded-lg border border-slate-200 bg-white",
    "pl-3 pr-8 py-2 text-sm text-slate-700",
    "outline-none transition-all",
    "hover:border-slate-300",
    "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
    "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
  ].join(" "),
  md: [
    "w-full appearance-none rounded-xl border border-slate-200 bg-white",
    "pl-4 pr-9 py-2.5 text-sm text-slate-700",
    "outline-none transition-all",
    "hover:border-slate-300",
    "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
    "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
  ].join(" "),
  lg: [
    "w-full appearance-none rounded-2xl border border-slate-200 bg-white",
    "pl-4 pr-9 py-3 text-sm text-slate-700",
    "outline-none transition-all",
    "hover:border-slate-300",
    "focus:border-blue-400 focus:ring-4 focus:ring-blue-100",
    "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
  ].join(" "),
};

const chevronClasses: Record<SelectVariant, string> = {
  mini: "pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400",
  sm:   "pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400",
  md:   "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400",
  lg:   "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400",
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ variant = "md", className, children, ...props }, ref) => {
    return (
      <div className={`relative${className ? ` ${className}` : ""}`}>
        <select ref={ref} className={selectStyles[variant]} {...props}>
          {children}
        </select>
        <ChevronDown className={chevronClasses[variant]} aria-hidden="true" />
      </div>
    );
  }
);

Select.displayName = "Select";

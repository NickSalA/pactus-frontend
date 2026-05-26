import type { ReactNode } from 'react';

type SelectionCardProps = {
  badge?: { colorClass: string; label: string };
  description: string;
  disabled?: boolean;
  icon: ReactNode;
  onClick?: () => void;
  selected?: boolean;
  title: string;
};

export function SelectionCard({
  badge,
  description,
  disabled,
  icon,
  onClick,
  selected,
  title,
}: SelectionCardProps) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`relative flex h-full flex-col items-center justify-center gap-4 rounded-2xl border-2 p-7 text-center transition-all duration-150 ${
        disabled
          ? 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-60'
          : selected
            ? 'border-blue-500 bg-blue-50/70 shadow-sm'
            : 'border-slate-200 bg-white hover:border-blue-400 hover:shadow-md active:scale-[0.98]'
      }`}
    >
      {badge && (
        <span
          className={`absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-semibold ${badge.colorClass}`}
        >
          {badge.label}
        </span>
      )}
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${selected ? 'bg-blue-100' : disabled ? 'bg-slate-100' : 'bg-blue-50'}`}
      >
        {icon}
      </div>
      <div className="space-y-1">
        <p
          className={`text-sm font-semibold ${disabled ? 'text-slate-400' : 'text-slate-800'}`}
        >
          {title}
        </p>
        <p
          className={`text-xs leading-relaxed ${disabled ? 'text-slate-400' : 'text-slate-500'}`}
        >
          {description}
        </p>
      </div>
    </button>
  );
}
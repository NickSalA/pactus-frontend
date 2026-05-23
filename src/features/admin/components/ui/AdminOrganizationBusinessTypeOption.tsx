import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type AdminOrganizationBusinessTypeOptionProps = {
  Icon: LucideIcon;
  label: string;
  onSelect: () => void;
  selected: boolean;
};

export function AdminOrganizationBusinessTypeOption({
  Icon,
  label,
  onSelect,
  selected,
}: AdminOrganizationBusinessTypeOptionProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        'text-label-main-bold flex min-h-12 items-center justify-between rounded-xl border px-3.5 text-left shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-brand-blue-100',
        selected
          ? 'border-brand-primary bg-brand-primary text-brand-neutral-50'
          : 'border-brand-neutral-300 bg-brand-neutral-50 text-brand-neutral-700 hover:border-brand-blue-200 hover:bg-brand-blue-50',
      )}
    >
      <span>{label}</span>
      <Icon
        aria-hidden="true"
        className={cn(
          'h-5 w-5',
          selected ? 'text-brand-neutral-50' : 'text-brand-neutral-900',
        )}
      />
    </button>
  );
}

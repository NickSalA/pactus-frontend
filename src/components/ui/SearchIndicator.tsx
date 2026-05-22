import { X } from 'lucide-react';

type SearchIndicatorProps = {
  search: string;
  onClear: () => void;
};

export function SearchIndicator({ search, onClear }: SearchIndicatorProps) {
  return (
    <div className="flex items-center gap-2 pt-0.5">
      <span className="text-xs text-slate-400">Buscando:</span>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 py-0.5 pl-2.5 pr-1.5 text-xs font-medium text-blue-700 ring-1 ring-blue-200/60">
        &ldquo;{search.trim()}&rdquo;
        <button
          type="button"
          onClick={onClear}
          className="rounded-full p-0.5 transition-colors hover:bg-blue-100"
        >
          <X className="h-3 w-3" />
        </button>
      </span>
    </div>
  );
}
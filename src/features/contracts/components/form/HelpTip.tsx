import { HelpCircle } from 'lucide-react';

export function HelpTip({ text }: { readonly text: string }) {
  return (
    <span className="group relative ml-1.5 inline-flex cursor-help align-middle">
      <HelpCircle className="h-3.5 w-3.5 text-slate-400 transition-colors group-hover:text-blue-500" />
      <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-60 -translate-x-1/2 rounded-xl bg-slate-800 px-3 py-2.5 text-xs leading-relaxed text-white opacity-0 shadow-2xl transition-opacity duration-150 group-hover:opacity-100">
        {text}
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
      </span>
    </span>
  );
}
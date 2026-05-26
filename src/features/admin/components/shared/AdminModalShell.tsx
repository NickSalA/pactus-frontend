"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminModalShellProps = {
  children: ReactNode;
  description?: string;
  footer?: ReactNode;
  onClose: () => void;
  open: boolean;
  size?: 'md' | 'lg';
  title: string;
};

const sizeClasses: Record<'md' | 'lg', string> = {
  md: 'max-w-3xl',
  lg: 'max-w-5xl',
};

export function AdminModalShell({ children, description, footer, onClose, open, size = 'md', title }: AdminModalShellProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
      <div className={cn('w-full rounded-[28px] bg-white shadow-2xl shadow-slate-900/10', sizeClasses[size])}>
        <div className="flex items-start justify-between border-b border-slate-200/80 px-6 py-5">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
            {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-6">{children}</div>

        {footer && <div className="border-t border-slate-200/80 px-6 py-5">{footer}</div>}
      </div>
    </div>
  );
}

import type { ReactNode } from 'react';

type OrgConfigFormRowProps = {
  label: string;
  children: ReactNode;
};

export function OrgConfigFormRow({ label, children }: OrgConfigFormRowProps) {
  return (
    <div className="grid grid-cols-[2fr_3fr] items-center gap-x-6 px-5 py-3">
      <span className="text-sm text-brand-neutral-600">{label}</span>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

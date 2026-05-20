'use client';

import Link from 'next/link';
import { type ComponentType } from 'react';

type MenuItem = {
  href: string;
  icon: ComponentType<{ className?: string; size?: number }>;
  match?: 'exact' | 'never' | 'prefix';
  name: string;
};

type SidebarLinkProps = {
  item: MenuItem;
  isActive: boolean;
};

export function SidebarLink({ item, isActive }: SidebarLinkProps) {
  const Icon = item.icon;

  return (
    <li>
      <Link
        href={item.href}
        className={`text-body-small-bold group relative flex items-center justify-center gap-4 rounded-xl px-5 py-4 transition-all duration-200 ${
          isActive
            ? 'text-brand-primary bg-brand-neutral-50'
            : 'text-white/70 hover:bg-white/10 hover:text-white'
        }`}
      >
        <Icon size={22} className="shrink-0" />
        <span className="min-w-0 overflow-hidden whitespace-nowrap text-[15px]">
          {item.name}
        </span>
      </Link>
    </li>
  );
}

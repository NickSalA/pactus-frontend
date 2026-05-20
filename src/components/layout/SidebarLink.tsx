'use client';

import Link from 'next/link';
import { type ComponentType } from 'react';
import { useSidebarStore } from '@/store';

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
  const { isCollapsed } = useSidebarStore();
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
        <span
          className={`min-w-0 overflow-hidden whitespace-nowrap text-[15px] transition-all duration-300 ${
            isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
          }`}
        >
          {item.name}
        </span>
        {isCollapsed && (
          <span className="absolute left-full z-50 ml-2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
            {item.name}
          </span>
        )}
      </Link>
    </li>
  );
}

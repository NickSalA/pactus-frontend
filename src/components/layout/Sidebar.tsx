'use client';

import { usePathname } from 'next/navigation';
import {
  Bell,
  Bot,
  FileStack,
  FileText,
  LayoutDashboard,
  Settings2,
  ShieldCheck,
  Users,
  Handshake,
  PanelBottom,
} from 'lucide-react';
import { type ComponentType } from 'react';
import { canAccessAdminConsole } from '@/lib/permissions';
import { useAuthStore, useSidebarStore } from '@/store';
import { ApiUserRole } from '@/types/api';
import { SidebarLink } from './SidebarLink';
import { SidebarNav } from './SidebarNav';
import { SidebarFooter } from './SidebarFooter';

type MenuItem = {
  href: string;
  icon: ComponentType<{ className?: string; size?: number }>;
  match?: 'exact' | 'never' | 'prefix';
  name: string;
};

const buildMainMenuItems = (role: ApiUserRole): MenuItem[] => {
  const prefix = role.toLowerCase();
  const items: MenuItem[] = [
    { name: 'Dashboard', href: `/${prefix}/dashboard`, icon: LayoutDashboard },
    { name: 'Contratos', href: `/${prefix}/contracts`, icon: FileText },
  ];

  if (role === 'HR' || role === 'MANAGER') {
    items.push({
      name: 'Plantillas',
      href: `/${prefix}/templates`,
      icon: FileStack,
      match: 'prefix',
    });
  }

  items.push({ name: 'Agente IA', href: `/${prefix}/ai-agent`, icon: Bot });
  return items;
};

const adminMenuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    match: 'exact',
  },
  {
    name: 'Gestión de Accesos',
    href: '/admin/access',
    icon: Users,
    match: 'prefix',
  },
  {
    name: 'Configuración de Alertas',
    href: '/admin/alerts',
    icon: Bell,
    match: 'prefix',
  },
  {
    name: 'Gestión Documental',
    href: '/admin/document-management',
    icon: Settings2,
    match: 'prefix',
  },
];

const adminEntryItem: MenuItem = {
  name: 'Administración',
  href: '/admin/dashboard',
  icon: ShieldCheck,
};

const isItemActive = (pathname: string, item: MenuItem): boolean => {
  if (item.match === 'never') {
    return false;
  }

  if (item.match === 'prefix') {
    return pathname.startsWith(item.href);
  }

  return pathname === item.href;
};

export default function Sidebar() {
  const pathname = usePathname();
  const userRole = useAuthStore((state) => state.user?.role ?? null);
  const { isCollapsed, toggleSidebar } = useSidebarStore();

  const hasAdminAccess = canAccessAdminConsole(userRole);
  const isAdminConsole = hasAdminAccess && pathname.startsWith('/admin');
  const mainMenuItems = userRole
    ? buildMainMenuItems(userRole as ApiUserRole)
    : [];
  const menuItems = isAdminConsole
    ? adminMenuItems
    : hasAdminAccess
      ? [...mainMenuItems, adminEntryItem]
      : mainMenuItems;

  return (
    <nav
      aria-label="Barra lateral"
      className={`flex h-full max-h-screen flex-col justify-between bg-brand-primary p-5 transition-all duration-300 ${isCollapsed ? 'w-fit' : 'w-72'} rounded-xl`}
    >
      <div className="flex flex-col gap-8">
        <header className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <Handshake
            size={32}
            className={`text-brand-neutral-50 shrink-0 ${isCollapsed ? 'hidden' : ''}`}
          />
          <h1
            className={`text-display-large-logo text-brand-neutral-50 ${isCollapsed ? 'hidden' : ''}`}
          >
            Pactus
          </h1>
          <button
            onClick={toggleSidebar}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <PanelBottom size={24} className="text-brand-neutral-50" />
          </button>
        </header>

        <SidebarNav>
          {menuItems.map((item) => (
            <SidebarLink
              key={`${item.href}-${item.name}`}
              item={item}
              isActive={isItemActive(pathname, item)}
            />
          ))}
        </SidebarNav>
      </div>

      <SidebarFooter />
    </nav>
  );
}

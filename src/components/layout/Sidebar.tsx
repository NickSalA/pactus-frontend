"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Bot,
  FileText,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Settings2,
  ShieldCheck,
  Users,
} from "lucide-react";
import { type ComponentType, useState } from "react";
import { canAccessAdminConsole } from "@/lib/permissions";
import { useAuthStore, useSidebarStore } from "@/store";

type MenuItem = {
  href: string;
  icon: ComponentType<{ className?: string; size?: number }>;
  match?: "exact" | "never" | "prefix";
  name: string;
};

const mainMenuItems: MenuItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Contratos", href: "/contracts", icon: FileText },
  { name: "Agente IA", href: "/ai-agent", icon: Bot },
];

const adminMenuItems: MenuItem[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, match: "exact" },
  { name: "Gestión de Accesos", href: "/admin/access", icon: Users, match: "prefix" },
  { name: "Configuración de Alertas", href: "/admin/alerts", icon: Bell, match: "prefix" },
  { name: "Gestión Documental", href: "/admin/document-management", icon: Settings2, match: "prefix" },
];

const adminEntryItem: MenuItem = { name: "Administración", href: "/admin", icon: ShieldCheck };

const isItemActive = (pathname: string, item: MenuItem): boolean => {
  if (item.match === "never") {
    return false;
  }

  if (item.match === "prefix") {
    return pathname.startsWith(item.href);
  }

  return pathname === item.href;
};

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebarStore();
  const userRole = useAuthStore((state) => state.user?.role ?? null);
  const [isHoveringLogo, setIsHoveringLogo] = useState(false);

  const hasAdminAccess = canAccessAdminConsole(userRole);
  const isAdminConsole = hasAdminAccess && pathname.startsWith("/admin");
  const menuItems = isAdminConsole
    ? adminMenuItems
    : hasAdminAccess
      ? [...mainMenuItems, adminEntryItem]
      : mainMenuItems;

  return (
    <aside
      className={`${isCollapsed ? "w-20" : "w-64"} flex min-h-screen flex-col transition-all duration-300`}
      style={{
        background: "linear-gradient(180deg, #3b82f6 0%, #4f46e5 50%, #1e40af 100%)",
      }}
    >
      <div className="px-4 py-6">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            onMouseEnter={() => setIsHoveringLogo(true)}
            onMouseLeave={() => setIsHoveringLogo(false)}
            className="group relative flex h-9 w-9 flex-shrink-0 items-center justify-center"
          >
            {isHoveringLogo ? (
              isCollapsed ? (
                <PanelLeftOpen size={28} className="text-white" />
              ) : (
                <PanelLeftClose size={28} className="text-white" />
              )
            ) : (
              <Image
                src="/logo-contractAI-azul.png"
                alt="ContractAI Logo"
                width={36}
                height={36}
                className="brightness-0 invert"
              />
            )}
            <span className="absolute left-full z-50 ml-2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
              {isCollapsed ? "Abrir barra lateral" : "Cerrar barra lateral"}
            </span>
          </button>

          <div
            className={`overflow-hidden whitespace-nowrap text-white transition-all duration-300 ${
              isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
            }`}
          >
            <span className="block text-2xl font-semibold">ContractAI</span>
            {isAdminConsole && <span className="block text-[10px] font-medium uppercase tracking-[0.24em] text-white/70">Admin Console</span>}
          </div>
        </div>
      </div>

      {isAdminConsole && (
        <div className="px-3 pb-3">
          <Link
            href="/contracts?new=1"
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-white/15"
          >
            <Plus size={18} className="flex-shrink-0" />
            {!isCollapsed && <span>Nuevo Documento</span>}
          </Link>
        </div>
      )}

      <nav className="flex-1 px-3 py-4">
        {menuItems.map((item) => {
          const isActive = isItemActive(pathname, item);
          const Icon = item.icon;

          return (
            <Link
              key={`${item.href}-${item.name}`}
              href={item.href}
              className={`group relative mb-2 flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                isActive
                  ? "bg-white/20 text-white shadow-lg shadow-black/10"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={22} className="flex-shrink-0" />
              <span
                className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                  isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
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
          );
        })}
      </nav>
    </aside>
  );
}

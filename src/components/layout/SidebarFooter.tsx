'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Settings, User, LogOut } from 'lucide-react';
import { logout as clearApiSession, getNotifications } from '@/api';
import { useAuthStore, useSidebarStore } from '@/store';
import { supabase } from '@/lib/supabaseClient';
import { getUserRoleLabel, toNameAndLastName } from '@/lib/authUser';
import { canAccessAdminConsole } from '@/lib/permissions';
import { OrganizationConfigModal } from '@/features/admin/components/modals/OrganizationConfigModal';
import NotificationDropdown from './NotificationDropdown';
import NotificationSidebar from './NotificationSidebar';
import { ApiNotificationResponse } from '@/types/api';

const LS_READ = 'notifications_read';
const LS_DISMISSED = 'notifications_dismissed';

function loadSet(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function saveSet(key: string, set: Set<string>): void {
  localStorage.setItem(key, JSON.stringify([...set]));
}

export interface DisplayNotification extends ApiNotificationResponse {
  read: boolean;
}

export function SidebarFooter() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [raw, setRaw] = useState<ApiNotificationResponse[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(() => loadSet(LS_READ));
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(() =>
    loadSet(LS_DISMISSED),
  );
  const router = useRouter();
  const { isHydrating, user, logout } = useAuthStore();
  const { isCollapsed } = useSidebarStore();

  const isAdmin = canAccessAdminConsole(user?.role);

  const userName = toNameAndLastName(
    user?.name || (isHydrating ? 'Cargando usuario' : 'Usuario'),
  );
  const userRole = user?.role
    ? getUserRoleLabel(user.role)
    : isHydrating
      ? '...'
      : 'Sin rol';
  const userInitials =
    userName
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2) || 'U';

  const notifications: DisplayNotification[] = raw
    .filter((n) => !dismissedIds.has(n.id))
    .map((n) => ({ ...n, read: readIds.has(n.id) }));

  const hasUnread = notifications.some((n) => !n.read);

  useEffect(() => {
    let mounted = true;

    if (!user) {
      setRaw([]);
      return () => {
        mounted = false;
      };
    }

    getNotifications()
      .then((data) => {
        if (mounted) {
          setRaw(data);
        }
      })
      .catch(() => {
        /* notificaciones no son críticas */
      });

    return () => {
      mounted = false;
    };
  }, [user]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error)
      console.error('Error cerrando sesión en Supabase:', error.message);
    clearApiSession();
    logout();
    router.push('/');
  };

  const handleMarkAsRead = (id: string) => {
    setReadIds((prev) => {
      const next = new Set(prev).add(id);
      saveSet(LS_READ, next);
      return next;
    });
  };

  const handleMarkAllAsRead = () => {
    setReadIds((prev) => {
      const next = new Set(prev);
      raw.forEach((n) => next.add(n.id));
      saveSet(LS_READ, next);
      return next;
    });
  };

  const handleDismissOne = (id: string) => {
    setDismissedIds((prev) => {
      const next = new Set(prev).add(id);
      saveSet(LS_DISMISSED, next);
      return next;
    });
  };

  const handleDismissAll = () => {
    setDismissedIds((prev) => {
      const next = new Set(prev);
      raw.forEach((n) => next.add(n.id));
      saveSet(LS_DISMISSED, next);
      return next;
    });
  };

  return (
    <div
      className={`flex items-center gap-3 ${isCollapsed ? 'flex-col' : 'flex-row-reverse'}`}
    >
      <div
        className={`relative flex items-center gap-2 ${isCollapsed ? 'flex-col' : 'flex-row-reverse'}`}
      >
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="relative p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <Bell size={20} />
            {hasUnread && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {isDropdownOpen && (
            <NotificationDropdown
              notifications={notifications}
              onViewAll={() => setIsSidebarOpen(true)}
              onClose={() => setIsDropdownOpen(false)}
              onMarkAsRead={handleMarkAsRead}
              alignRight={isCollapsed}
            />
          )}
        </div>

        {/* {<Settings size={20} className="text-white/70 shrink-0" />} */}

        {isAdmin && (
          <button
            type="button"
            onClick={() => setIsConfigModalOpen(true)}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Configuración de la organización"
          >
            <Settings size={20} />
          </button>
        )}
      </div>

      {isSidebarOpen && (
        <NotificationSidebar
          notifications={notifications}
          onClose={() => setIsSidebarOpen(false)}
          onDeleteOne={handleDismissOne}
          onDeleteAll={handleDismissAll}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
      )}

      <div className="relative flex-1">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-3 hover:bg-white/10 rounded-lg p-2 transition-colors w-full"
        >
          <div className="w-9 h-9 bg-brand-neutral-50 rounded-full flex items-center justify-center shrink-0">
            <span className="text-brand-primary font-medium text-sm">
              {userInitials}
            </span>
          </div>
          <div className={`text-left min-w-0 ${isCollapsed ? 'hidden' : ''}`}>
            <p className="text-sm font-medium text-white truncate">
              {userName}
            </p>
            <p className="text-xs text-white/50 truncate">{userRole}</p>
          </div>
        </button>

        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="absolute left-0 bottom-full mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push('/profile');
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <User size={18} />
                Ver perfil
              </button>
              <hr className="my-2 border-gray-100" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={18} />
                Cerrar sesión
              </button>
            </div>
          </>
        )}
      </div>

      {isConfigModalOpen && (
        <OrganizationConfigModal
          open={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
        />
      )}
    </div>
  );
}

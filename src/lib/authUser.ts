import type { Session } from '@supabase/supabase-js';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { User as BackendUser } from '@/types/ui.types';
import { ApiUserRole } from '@/types/api';
import { getCurrentUser } from '@/api';

type AuthMetadata = {
  full_name?: string;
  name?: string;
  avatar_url?: string;
};

export type AuthDisplayUser = {
  id: string;
  name: string;
  email: string;
  role: ApiUserRole | string;
  avatarUrl: string | null;
};

const ROLE_LABELS: Record<ApiUserRole, string> = {
  ADMIN: 'Administrador',
  HR: 'RRHH',
  MANAGER: 'Gestor de Contratos',
  WORKER: 'Colaborador',
};

const sanitizeSpaces = (value: string) => value.trim().replace(/\s+/g, ' ');

const fallbackNameFromEmail = (email: string): string => {
  const localPart = email.split('@')[0]?.replace(/[._-]+/g, ' ') || 'Usuario';
  const normalized = sanitizeSpaces(localPart);

  if (!normalized) {
    return 'Usuario';
  }

  return normalized
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
};

export const toNameAndLastName = (rawName: string): string => {
  const normalized = sanitizeSpaces(rawName);
  const parts = normalized.split(' ').filter(Boolean);

  if (parts.length <= 2) {
    return normalized;
  }

  return `${parts[0]} ${parts[1]}`;
};

export const toFirstName = (fullName: string): string => {
  const normalized = sanitizeSpaces(fullName);
  return normalized.split(' ')[0] || 'Usuario';
};

export const getUserRoleLabel = (role: ApiUserRole | string): string => {
  if (role in ROLE_LABELS) {
    return ROLE_LABELS[role as ApiUserRole];
  }

  return role || 'Sin rol';
};

export const mapSupabaseUserToAuthUser = (
  user: SupabaseUser,
): AuthDisplayUser => {
  const metadata = (user.user_metadata || {}) as AuthMetadata;
  const email = user.email || 'sin-email@usuario.local';
  const rawName =
    metadata.full_name || metadata.name || fallbackNameFromEmail(email);
  const name = toNameAndLastName(rawName);

  return {
    id: user.id,
    name,
    email,
    role: 'WORKER',
    avatarUrl: metadata.avatar_url || null,
  };
};

export const mapBackendUserToAuthUser = (
  user: BackendUser,
): AuthDisplayUser => ({
  id: String(user.id),
  name: user.full_name
    ? toNameAndLastName(user.full_name)
    : fallbackNameFromEmail(user.email),
  email: user.email,
  role: user.role,
  avatarUrl: user.avatar_url || null,
});

export const resolveSessionUser = async (
  session: Session,
): Promise<AuthDisplayUser> => {
  try {
    const backendUser = await getCurrentUser();
    return mapBackendUserToAuthUser(backendUser);
  } catch {
    return mapSupabaseUserToAuthUser(session.user);
  }
};

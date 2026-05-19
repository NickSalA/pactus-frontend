import type { DocumentFlatten, DocumentType } from '@/types/api.types';
import { ApiUserRole } from '@/types/api';

type RoleValue = ApiUserRole | string | null | undefined;

const KNOWN_USER_ROLES = new Set<ApiUserRole>([
  'ADMIN',
  'HR',
  'MANAGER',
  'WORKER',
]);

const READABLE_DOCUMENT_TYPES_BY_ROLE: Partial<
  Record<ApiUserRole, readonly DocumentType[]>
> = {
  HR: ['LABOR'],
  MANAGER: ['COMPANY'],
  WORKER: ['COMPANY'],
};

const WRITABLE_DOCUMENT_TYPES_BY_ROLE: Partial<
  Record<ApiUserRole, readonly DocumentType[]>
> = {
  HR: ['LABOR'],
  MANAGER: ['COMPANY'],
  WORKER: [],
};

const FOLDER_CREATOR_ROLES = new Set<ApiUserRole>(['HR', 'MANAGER']);
const MANAGEABLE_FOLDER_OWNER_ROLES_BY_ROLE: Partial<
  Record<ApiUserRole, readonly ApiUserRole[]>
> = {
  HR: ['HR'],
  MANAGER: ['MANAGER'],
  WORKER: [],
};

const normalizeRole = (role: RoleValue): ApiUserRole | null => {
  if (role && KNOWN_USER_ROLES.has(role as ApiUserRole)) {
    return role as ApiUserRole;
  }

  return null;
};

const getAllowedDocumentTypes = (
  role: RoleValue,
  policy: Partial<Record<ApiUserRole, readonly DocumentType[]>>,
): readonly DocumentType[] | null => {
  const normalizedRole = normalizeRole(role);

  if (!normalizedRole) {
    return null;
  }

  return policy[normalizedRole] ?? null;
};

export const isAdminRole = (role: RoleValue): boolean => {
  return normalizeRole(role) === 'ADMIN';
};

export const canAccessAdminConsole = (role: RoleValue): boolean => {
  return isAdminRole(role);
};

export const canAuthorTemplates = (role: RoleValue): boolean => {
  const allowedTypes = getAllowedDocumentTypes(
    role,
    WRITABLE_DOCUMENT_TYPES_BY_ROLE,
  );
  return allowedTypes === null || allowedTypes.length > 0;
};

export const getTemplateAuthoringDocumentTypes = (
  role: RoleValue,
): readonly DocumentType[] | null => {
  return getWritableDocumentTypes(role);
};

export const canViewDocumentType = (
  role: RoleValue,
  documentType: DocumentType,
): boolean => {
  const allowedTypes = getAllowedDocumentTypes(
    role,
    READABLE_DOCUMENT_TYPES_BY_ROLE,
  );
  return allowedTypes === null || allowedTypes.includes(documentType);
};

export const getReadableDocumentTypes = (
  role: RoleValue,
): readonly DocumentType[] | null => {
  return getAllowedDocumentTypes(role, READABLE_DOCUMENT_TYPES_BY_ROLE);
};

export const canManageDocumentType = (
  role: RoleValue,
  documentType: DocumentType,
): boolean => {
  console.log(
    '[DEBUG] canManageDocumentType - Role:',
    role,
    'DocumentType:',
    documentType,
  );
  const allowedTypes = getAllowedDocumentTypes(
    role,
    WRITABLE_DOCUMENT_TYPES_BY_ROLE,
  );
  console.log('[DEBUG] canManageDocumentType - allowedTypes:', allowedTypes);
  const result = allowedTypes === null || allowedTypes.includes(documentType);
  console.log('[DEBUG] canManageDocumentType - result:', result);
  return result;
};

export const getWritableDocumentTypes = (
  role: RoleValue,
): readonly DocumentType[] | null => {
  return getAllowedDocumentTypes(role, WRITABLE_DOCUMENT_TYPES_BY_ROLE);
};

export const getDefaultWritableDocumentType = (
  role: RoleValue,
): DocumentType | null => {
  const allowedTypes = getWritableDocumentTypes(role);
  return allowedTypes?.[0] ?? null;
};

export const canCreateContracts = (role: RoleValue): boolean => {
  return canAuthorTemplates(role);
};

export const canImportContracts = (role: RoleValue): boolean => {
  return canCreateContracts(role);
};

export const canCreateFolders = (role: RoleValue): boolean => {
  const normalizedRole = normalizeRole(role);
  return normalizedRole !== null && FOLDER_CREATOR_ROLES.has(normalizedRole);
};

export const canManageFolderRole = (
  role: RoleValue,
  ownerRole: ApiUserRole | null | undefined,
): boolean => {
  if (!ownerRole) {
    return false;
  }

  const normalizedRole = normalizeRole(role);
  if (normalizedRole === null) {
    return false;
  }

  const allowedOwnerRoles =
    MANAGEABLE_FOLDER_OWNER_ROLES_BY_ROLE[normalizedRole] ?? null;
  if (allowedOwnerRoles === null) {
    return true;
  }

  return allowedOwnerRoles.includes(ownerRole);
};

export const filterVisibleDocuments = (
  documents: DocumentFlatten[],
  role: RoleValue,
): DocumentFlatten[] => {
  return documents.filter((document) =>
    canViewDocumentType(role, document.contract_type),
  );
};

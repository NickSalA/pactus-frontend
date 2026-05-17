import type { Document, DocumentType, UserRole } from "@/types/api.types";

type RoleValue = UserRole | string | null | undefined;

const KNOWN_USER_ROLES = new Set<UserRole>(["ADMIN", "HR", "MANAGER", "WORKER"]);

const READABLE_DOCUMENT_TYPES_BY_ROLE: Partial<Record<UserRole, readonly DocumentType[]>> = {
  HR: ["LABOR"],
  MANAGER: ["COMPANY"],
  WORKER: ["COMPANY"],
};

const WRITABLE_DOCUMENT_TYPES_BY_ROLE: Partial<Record<UserRole, readonly DocumentType[]>> = {
  HR: ["LABOR"],
  MANAGER: ["COMPANY"],
  WORKER: [],
};

const FOLDER_CREATOR_ROLES = new Set<UserRole>(["HR", "MANAGER"]);
const MANAGEABLE_FOLDER_OWNER_ROLES_BY_ROLE: Partial<Record<UserRole, readonly UserRole[]>> = {
  HR: ["HR"],
  MANAGER: ["MANAGER"],
  WORKER: [],
};

const normalizeRole = (role: RoleValue): UserRole | null => {
  if (role && KNOWN_USER_ROLES.has(role as UserRole)) {
    return role as UserRole;
  }

  return null;
};

const getAllowedDocumentTypes = (
  role: RoleValue,
  policy: Partial<Record<UserRole, readonly DocumentType[]>>,
): readonly DocumentType[] | null => {
  const normalizedRole = normalizeRole(role);

  if (!normalizedRole) {
    return null;
  }

  return policy[normalizedRole] ?? null;
};

export const isAdminRole = (role: RoleValue): boolean => {
  return normalizeRole(role) === "ADMIN";
};

export const canAccessAdminConsole = (role: RoleValue): boolean => {
  return isAdminRole(role);
};

export const canAuthorTemplates = (role: RoleValue): boolean => {
  const allowedTypes = getAllowedDocumentTypes(role, WRITABLE_DOCUMENT_TYPES_BY_ROLE);
  return allowedTypes === null || allowedTypes.length > 0;
};

export const getTemplateAuthoringDocumentTypes = (role: RoleValue): readonly DocumentType[] | null => {
  return getWritableDocumentTypes(role);
};

export const canViewDocumentType = (role: RoleValue, documentType: DocumentType): boolean => {
  const allowedTypes = getAllowedDocumentTypes(role, READABLE_DOCUMENT_TYPES_BY_ROLE);
  return allowedTypes === null || allowedTypes.includes(documentType);
};

export const getReadableDocumentTypes = (role: RoleValue): readonly DocumentType[] | null => {
  return getAllowedDocumentTypes(role, READABLE_DOCUMENT_TYPES_BY_ROLE);
};

export const canManageDocumentType = (role: RoleValue, documentType: DocumentType): boolean => {
  const allowedTypes = getAllowedDocumentTypes(role, WRITABLE_DOCUMENT_TYPES_BY_ROLE);
  return allowedTypes === null || allowedTypes.includes(documentType);
};

export const getWritableDocumentTypes = (role: RoleValue): readonly DocumentType[] | null => {
  return getAllowedDocumentTypes(role, WRITABLE_DOCUMENT_TYPES_BY_ROLE);
};

export const getDefaultWritableDocumentType = (role: RoleValue): DocumentType | null => {
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

export const canManageFolderRole = (role: RoleValue, ownerRole: UserRole | null | undefined): boolean => {
  if (!ownerRole) {
    return false;
  }

  const normalizedRole = normalizeRole(role);
  if (normalizedRole === null) {
    return false;
  }

  const allowedOwnerRoles = MANAGEABLE_FOLDER_OWNER_ROLES_BY_ROLE[normalizedRole] ?? null;
  if (allowedOwnerRoles === null) {
    return true;
  }

  return allowedOwnerRoles.includes(ownerRole);
};

export const filterVisibleDocuments = (documents: Document[], role: RoleValue): Document[] => {
  return documents.filter((document) => canViewDocumentType(role, document.contract_type));
};

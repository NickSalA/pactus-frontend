import { getUserRoleLabel } from "@/lib/authUser";
import type { UserRole } from "@/types/api.types";

export const formatAdminDate = (value?: string | null): string => {
  if (!value) {
    return "Sin fecha";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Sin fecha";
  }

  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const getFolderVisibilityLabel = (ownerRole: UserRole): string => {
  if (ownerRole === "HR") {
    return "RRHH";
  }

  if (ownerRole === "MANAGER") {
    return "Gestores y Colaboradores";
  }

  return getUserRoleLabel(ownerRole);
};

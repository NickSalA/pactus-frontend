"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { canAccessAdminConsole } from "@/lib/permissions";
import { useAuthStore } from "@/store";

export function useAdminGuard() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrating = useAuthStore((state) => state.isHydrating);
  const userRole = useAuthStore((state) => state.user?.role ?? null);
  const isAdmin = canAccessAdminConsole(userRole);

  useEffect(() => {
    if (!isHydrating && (!isAuthenticated || !isAdmin)) {
      router.replace("/dashboard");
    }
  }, [isAdmin, isAuthenticated, isHydrating, router]);

  return {
    isAdmin,
    isHydrating,
    shouldBlockContent: isHydrating || !isAuthenticated || !isAdmin,
  };
}

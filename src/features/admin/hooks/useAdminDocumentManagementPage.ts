"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAdminGuard } from "@/features/admin/hooks/useAdminGuard";

export type DocumentManagementSection = "folders" | "masters" | "templates";
export type DocumentManagementCatalog = "document-types" | "services";

const DEFAULT_SECTION: DocumentManagementSection = "templates";
const DEFAULT_CATALOG: DocumentManagementCatalog = "services";

export function useAdminDocumentManagementPage() {
  const access = useAdminGuard();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeSection = useMemo<DocumentManagementSection>(() => {
    const section = searchParams.get("section");
    if (section === "folders" || section === "masters" || section === "templates") {
      return section;
    }
    return DEFAULT_SECTION;
  }, [searchParams]);

  const activeCatalog = useMemo<DocumentManagementCatalog>(() => {
    const catalog = searchParams.get("catalog");
    if (catalog === "document-types" || catalog === "services") {
      return catalog;
    }
    return DEFAULT_CATALOG;
  }, [searchParams]);

  const replaceParams = useCallback(
    (nextSection: DocumentManagementSection, nextCatalog: DocumentManagementCatalog) => {
      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.set("section", nextSection);
      if (nextSection === "masters") {
        nextParams.set("catalog", nextCatalog);
      } else {
        nextParams.delete("catalog");
      }
      router.replace(`${pathname}?${nextParams.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const setActiveSection = useCallback(
    (nextSection: DocumentManagementSection) => {
      replaceParams(nextSection, activeCatalog);
    },
    [activeCatalog, replaceParams],
  );

  const setActiveCatalog = useCallback(
    (nextCatalog: DocumentManagementCatalog) => {
      replaceParams("masters", nextCatalog);
    },
    [replaceParams],
  );

  return {
    ...access,
    activeCatalog,
    activeSection,
    setActiveCatalog,
    setActiveSection,
  };
}

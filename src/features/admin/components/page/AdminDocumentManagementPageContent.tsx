"use client";

import { AdminSegmentedTabs } from "@/features/admin/components/shared/AdminSegmentedTabs";
import { AdminLoadingState } from "@/features/admin/components/shared/AdminLoadingState";
import { AdminFoldersSection } from "@/features/admin/components/sections/AdminFoldersSection";
import { AdminMastersSection } from "@/features/admin/components/sections/AdminMastersSection";
import { AdminTemplatesSection } from "@/features/admin/components/sections/AdminTemplatesSection";
import { useAdminDocumentManagementPage } from "@/features/admin/hooks/use-admin-document-management-page";

export function AdminDocumentManagementPageContent() {
  const page = useAdminDocumentManagementPage();

  if (page.shouldBlockContent) {
    return <AdminLoadingState />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <AdminSegmentedTabs
          activeTab={page.activeSection}
          onChange={page.setActiveSection}
          tabs={[
            { id: "templates", label: "Plantillas de Contratos" },
            { id: "folders", label: "Gestor de Carpetas" },
            { id: "masters", label: "Maestros del Negocio" },
          ]}
        />
      </div>

      {page.activeSection === "templates" && <AdminTemplatesSection />}
      {page.activeSection === "folders" && <AdminFoldersSection />}
      {page.activeSection === "masters" && (
        <AdminMastersSection activeCatalog={page.activeCatalog} onCatalogChange={page.setActiveCatalog} />
      )}
    </div>
  );
}

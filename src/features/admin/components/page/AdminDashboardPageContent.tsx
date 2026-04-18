"use client";

import { Bell, FileStack, FolderKanban, Shield, ShieldCheck, Users, Wrench } from "lucide-react";
import { AdminModuleCard } from "@/features/admin/components/cards/AdminModuleCard";
import { AdminSummaryCard } from "@/features/admin/components/cards/AdminSummaryCard";
import { useAdminDashboard } from "@/features/admin/hooks/use-admin-dashboard";

export function AdminDashboardPageContent() {
  const page = useAdminDashboard();

  if (page.shouldBlockContent) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  if (page.loading) {
    return (
      <div className="flex h-full min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  if (page.error) {
    return (
      <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-base text-red-600">{page.error}</p>
        <button
          type="button"
          onClick={() => {
            void page.reload();
          }}
          className="rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const metricIcons = {
    alerts: <Bell className="h-5 w-5" />,
    folders: <FolderKanban className="h-5 w-5" />,
    services: <Wrench className="h-5 w-5" />,
    templates: <FileStack className="h-5 w-5" />,
    users: <Users className="h-5 w-5" />,
  } as const;

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-slate-200/70 bg-white px-8 py-7 shadow-sm shadow-slate-200/70">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Panel de Administración</h1>
            <p className="mt-1 text-sm text-slate-500">
              Gestiona usuarios, alertas, plantillas y configuraciones del sistema
            </p>
          </div>
        </div>
      </section>

      <section>
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Resumen del Sistema</p>
        <div className="grid gap-4 lg:grid-cols-3">
          {page.metrics.slice(0, 3).map((metric) => (
            <AdminSummaryCard
              key={metric.id}
              icon={metricIcons[metric.id]}
              subtitle={metric.subtitle}
              title={metric.title}
              tone={metric.tone}
              value={metric.value}
            />
          ))}
        </div>
        <div className="mt-4 grid gap-4 lg:max-w-[66.666667%] lg:grid-cols-2">
          {page.metrics.slice(3).map((metric) => (
            <AdminSummaryCard
              key={metric.id}
              icon={metricIcons[metric.id]}
              subtitle={metric.subtitle}
              title={metric.title}
              tone={metric.tone}
              value={metric.value}
            />
          ))}
        </div>
      </section>

      <section>
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Módulos</p>
        <div className="grid gap-4 xl:grid-cols-3">
          <AdminModuleCard
            description="Asignar roles y configurar emails de alerta"
            href="/admin/access"
            icon={<Users className="h-5 w-5" />}
            title="Gestión de Usuarios"
          />
          <AdminModuleCard
            description="Frecuencias, responsables y canales de notificación"
            href="/admin/alerts"
            icon={<Bell className="h-5 w-5" />}
            title="Configuración de Alertas"
          />
          <AdminModuleCard
            description="Plantillas, carpetas y Gestion de servicios"
            href="/admin/document-management"
            icon={<Shield className="h-5 w-5" />}
            title="Gestión Documental"
          />
        </div>
      </section>
    </div>
  );
}

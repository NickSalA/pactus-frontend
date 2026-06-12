import {
  BarChart3,
  BellRing,
  Bot,
  FileStack,
  FileText,
  FolderSync,
  ShieldCheck,
  UsersRound,
} from 'lucide-react';

const capabilities = [
  {
    icon: BarChart3,
    title: 'Dashboard ejecutivo',
    description:
      'Métricas, documentos recientes, acciones rápidas y vistas para contratos empresariales y laborales.',
  },
  {
    icon: FileText,
    title: 'Gestión de contratos',
    description:
      'Creación, edición, estados, carpetas, filtros, carga de PDF e importación documental.',
  },
  {
    icon: Bot,
    title: 'Agente IA',
    description:
      'Chat conversacional para consultar contratos en lenguaje natural con respuestas fundamentadas.',
  },
  {
    icon: FileStack,
    title: 'Plantillas inteligentes',
    description:
      'Campos dinámicos, generación de borradores con IA, previsualización y exportación a PDF.',
  },
  {
    icon: UsersRound,
    title: 'Administración',
    description:
      'Usuarios, roles, permisos, servicios, carpetas, auditoría y configuración organizacional.',
  },
  {
    icon: BellRing,
    title: 'Alertas y notificaciones',
    description:
      'Reglas para vencimientos próximos, emails consolidados y seguimiento de eventos relevantes.',
  },
  {
    icon: ShieldCheck,
    title: 'Seguridad y roles',
    description:
      'Aislamiento por organización, autenticación moderna y acceso filtrado según permisos.',
  },
  {
    icon: FolderSync,
    title: 'Google Drive',
    description:
      'Importación de contratos desde Drive con procesamiento, extracción e indexación en segundo plano.',
  },
];

export default function CapabilitiesSection() {
  return (
    <section
      id="capacidades"
      className="scroll-mt-36 bg-white px-6 py-20 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">
            Capacidades
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-brand-neutral-900 sm:text-5xl">
            Todo lo necesario para operar contratos con inteligencia.
          </h2>
          <p className="mt-5 text-lg leading-8 text-brand-neutral-600">
            Pactus reúne gestión documental, analítica, administración y agentes
            de IA en una plataforma enfocada en contratos modernos.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="group rounded-3xl border border-brand-neutral-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-blue-200 hover:shadow-xl hover:shadow-brand-primary/10"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue-50 text-brand-primary transition-colors group-hover:bg-brand-primary group-hover:text-white">
                  <Icon size={23} />
                </div>
                <h3 className="text-lg font-semibold text-brand-neutral-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-brand-neutral-600">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

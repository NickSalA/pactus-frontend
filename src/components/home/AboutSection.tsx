import { Building2, FileText, ShieldCheck } from 'lucide-react';

const highlights = [
  {
    icon: FileText,
    title: 'Ciclo contractual completo',
    description:
      'Desde la ingesta documental hasta el análisis, consulta y generación de contratos.',
  },
  {
    icon: ShieldCheck,
    title: 'Control organizacional',
    description:
      'Datos separados por organización, permisos por rol y acceso seguro a documentos.',
  },
  {
    icon: Building2,
    title: 'Enfoque empresarial',
    description:
      'Diseñado para contratos laborales, empresariales y operación legal de alto impacto.',
  },
];

export default function AboutSection() {
  return (
    <section id="quienes-somos" className="bg-white px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1fr] lg:items-center">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">
              Quiénes somos
            </span>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-brand-neutral-900 sm:text-5xl">
              Una plataforma para transformar la gestión legal en decisiones
              inteligentes.
            </h2>
          </div>

          <div className="space-y-6 text-lg leading-8 text-brand-neutral-600">
            <p>
              Pactus es una plataforma integral de gestión y análisis legal
              diseñada para automatizar el ciclo de vida de los contratos
              mediante inteligencia artificial avanzada.
            </p>
            <p>
              Permite centralizar documentos, consultar información contractual
              en lenguaje natural, crear plantillas y administrar usuarios,
              permisos, alertas y servicios desde un entorno seguro para la
              organización.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="rounded-3xl border border-brand-neutral-200 bg-brand-neutral-50 p-6"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue-100 text-brand-primary">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-semibold text-brand-neutral-900">
                  {item.title}
                </h3>
                <p className="mt-3 leading-7 text-brand-neutral-600">
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

import { Eye, Target } from 'lucide-react';

const items = [
  {
    icon: Target,
    title: 'Misión',
    description:
      'Simplificar y automatizar la gestión contractual con IA, reduciendo trabajo manual y entregando información legal útil, segura y trazable para cada organización.',
  },
  {
    icon: Eye,
    title: 'Visión',
    description:
      'Convertirnos en una plataforma confiable para administrar contratos empresariales y laborales con precisión legal, seguridad basada en identidad y análisis inteligente.',
  },
];

export default function MissionVisionSection() {
  return (
    <section
      id="mision-vision"
      className="scroll-mt-36 bg-brand-neutral-900 px-6 py-20 text-white lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <span className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary-light">
            Misión y visión
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Tecnología legal con precisión, seguridad y escalabilidad.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-2xl shadow-black/10"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-primary">
                  <Icon size={28} />
                </div>
                <h3 className="text-2xl font-semibold">{item.title}</h3>
                <p className="mt-4 text-lg leading-8 text-white/75">
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

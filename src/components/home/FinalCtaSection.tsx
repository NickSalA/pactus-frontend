import CtaButton from './shared/CtaButton';

export default function FinalCtaSection() {
  return (
    <section className="bg-white px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-brand-blue-100 bg-gradient-to-br from-brand-blue-50 to-white p-8 text-center shadow-xl shadow-brand-primary/5 lg:p-12">
        <h2 className="text-4xl font-bold tracking-tight text-brand-neutral-900 sm:text-5xl">
          Moderniza la gestión contractual de tu organización
        </h2>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-brand-neutral-600">
          Centraliza contratos, automatiza análisis y consulta información legal
          con inteligencia artificial fundamentada en tus propios documentos.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <CtaButton href="/login" variant="primary" showArrow>
            Iniciar sesión
          </CtaButton>
          <CtaButton href="#contacto" variant="secondary">
            Contactar
          </CtaButton>
        </div>
      </div>
    </section>
  );
}

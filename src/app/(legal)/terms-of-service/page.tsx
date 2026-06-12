import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos de Servicio | Pactus',
  description: 'Términos de Servicio de Pactus.',
};

function LegalSection({
  title,
  children,
}: Readonly<{
  title: string;
  children: React.ReactNode;
}>) {
  return (
    <section className="rounded-3xl border border-brand-neutral-200 bg-brand-neutral-50 p-6 sm:p-7">
      <h2 className="text-2xl font-semibold tracking-tight text-brand-neutral-900">
        {title}
      </h2>
      <div className="mt-4 space-y-4 leading-7 text-brand-neutral-600">
        {children}
      </div>
    </section>
  );
}

export default function TermsOfServicePage() {
  return (
    <article className="space-y-8 text-brand-neutral-700">
      <header className="border-b border-brand-neutral-200 pb-8">
        <span className="inline-flex rounded-full bg-brand-blue-50 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-brand-primary">
          Documento legal
        </span>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-brand-neutral-900 sm:text-5xl">
          Términos de Servicio de Pactus
        </h1>
        <p className="mt-4 text-sm font-medium text-brand-neutral-500">
          Última actualización: 17/04/2026
        </p>
        <p className="mt-6 rounded-3xl border border-brand-blue-100 bg-brand-blue-50 p-6 text-lg leading-8 text-brand-neutral-700">
          Al utilizar Pactus, aceptas estos Términos de Servicio. Estos términos
          establecen las condiciones generales de uso de la plataforma y sus
          funcionalidades de gestión contractual e inteligencia artificial.
        </p>
      </header>

      <LegalSection title="1. Descripción del servicio">
        <p>Pactus es una plataforma que permite a usuarios:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Iniciar sesión mediante Google</li>
          <li>Crear, gestionar y almacenar contratos</li>
          <li>Importar documentos desde Google Drive</li>
          <li>
            Utilizar herramientas de inteligencia artificial para análisis y
            generación de contenido
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Uso permitido">
        <p>El usuario se compromete a:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Utilizar la plataforma de forma legal</li>
          <li>No subir contenido ilegal o fraudulento</li>
          <li>No intentar vulnerar la seguridad del sistema</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Cuentas">
        <ul className="list-disc space-y-2 pl-6">
          <li>El usuario es responsable de mantener la seguridad de su cuenta</li>
          <li>El acceso puede ser gestionado por su organización</li>
          <li>Podemos suspender cuentas que incumplan estos términos</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Datos y contenido">
        <ul className="list-disc space-y-2 pl-6">
          <li>El usuario mantiene la propiedad de sus datos</li>
          <li>Pactus puede procesar la información para proporcionar el servicio</li>
          <li>No reclamamos propiedad sobre los documentos del usuario</li>
        </ul>
      </LegalSection>

      <LegalSection title="5. Integración con Google">
        <p>El uso de funcionalidades de Google está sujeto a:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Políticas de Google</li>
          <li>Permisos otorgados por el usuario</li>
        </ul>
        <p>
          El usuario puede revocar el acceso en cualquier momento desde su cuenta
          de Google.
        </p>
      </LegalSection>

      <LegalSection title="6. Servicios de terceros">
        <p>
          El servicio puede depender de terceros como Supabase, OpenAI, Google y
          otros proveedores tecnológicos. No somos responsables por fallas de
          dichos servicios.
        </p>
      </LegalSection>

      <LegalSection title="7. Limitación de responsabilidad">
        <p>Pactus no garantiza:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Exactitud total de los análisis automatizados</li>
          <li>Disponibilidad ininterrumpida del servicio</li>
        </ul>
        <p>El uso es bajo responsabilidad del usuario.</p>
      </LegalSection>

      <LegalSection title="8. Terminación">
        <p>Podemos suspender o cancelar cuentas en caso de:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Incumplimiento de estos términos</li>
          <li>Uso indebido del servicio</li>
        </ul>
      </LegalSection>

      <LegalSection title="9. Cambios en el servicio">
        <p>
          Nos reservamos el derecho de modificar o discontinuar funcionalidades
          en cualquier momento.
        </p>
      </LegalSection>

      <LegalSection title="10. Legislación aplicable">
        <p>Estos términos se rigen por las leyes de Perú.</p>
      </LegalSection>

      <LegalSection title="11. Contacto">
        <p>
          Para consultas:{' '}
          <a
            className="font-semibold text-brand-primary underline underline-offset-4"
            href="mailto:nicksalcedo717@gmail.com"
          >
            nicksalcedo717@gmail.com
          </a>
          {' '}o al teléfono{' '}
          <a
            className="font-semibold text-brand-primary underline underline-offset-4"
            href="tel:+51991258717"
          >
            +51 991 258 717
          </a>
          .
        </p>
      </LegalSection>
    </article>
  );
}

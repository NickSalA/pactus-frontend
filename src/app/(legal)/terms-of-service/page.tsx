import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos de Servicio | ContractAI",
  description: "Términos de Servicio de ContractAI.",
};

export default function TermsOfServicePage() {
  return (
    <article className="mx-auto max-w-3xl space-y-8 leading-7 text-slate-700">
      <header className="space-y-3 border-b border-slate-200 pb-8">
        <h1 className="text-4xl font-bold tracking-tight text-slate-950">Términos de Servicio de ContractAI</h1>
        <p className="text-sm text-slate-500">Última actualización: 17/04/2026</p>
        <p>Al utilizar ContractAI, aceptas estos Términos de Servicio.</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-950">1. Descripción del servicio</h2>
        <p>ContractAI es una plataforma que permite a usuarios:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Iniciar sesión mediante Google</li>
          <li>Crear, gestionar y almacenar contratos</li>
          <li>Importar documentos seleccionados desde Google Drive</li>
          <li>Utilizar herramientas de inteligencia artificial para análisis y generación de contenido</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-950">2. Uso permitido</h2>
        <p>El usuario se compromete a:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Utilizar la plataforma de forma legal</li>
          <li>No subir contenido ilegal o fraudulento</li>
          <li>No intentar vulnerar la seguridad del sistema</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-950">3. Cuentas</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>El usuario es responsable de mantener la seguridad de su cuenta</li>
          <li>El acceso puede ser gestionado por su organización</li>
          <li>Podemos suspender cuentas que incumplan estos términos</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-950">4. Datos y contenido</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>El usuario mantiene la propiedad de sus datos</li>
          <li>ContractAI puede procesar la información para proporcionar el servicio</li>
          <li>No reclamamos propiedad sobre los documentos del usuario</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-950">5. Integración con Google</h2>
        <p>El uso de funcionalidades de Google está sujeto a:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Políticas de Google</li>
          <li>Permisos otorgados por el usuario</li>
        </ul>
        <p>
          El acceso a Google Drive se solicita solo al iniciar el flujo de importación y se limita a los
          archivos seleccionados por el usuario. El usuario puede revocar el acceso en cualquier momento
          desde su cuenta de Google.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-950">6. Servicios de terceros</h2>
        <p>
          El servicio puede depender de terceros (Supabase, OpenAI, Google, etc.). No somos responsables por
          fallas de dichos servicios.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-950">7. Limitación de responsabilidad</h2>
        <p>ContractAI no garantiza:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Exactitud total de los análisis automatizados</li>
          <li>Disponibilidad ininterrumpida del servicio</li>
        </ul>
        <p>El uso es bajo responsabilidad del usuario.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-950">8. Terminación</h2>
        <p>Podemos suspender o cancelar cuentas en caso de:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Incumplimiento de estos términos</li>
          <li>Uso indebido del servicio</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-950">9. Cambios en el servicio</h2>
        <p>Nos reservamos el derecho de modificar o discontinuar funcionalidades en cualquier momento.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-950">10. Legislación aplicable</h2>
        <p>Estos términos se rigen por las leyes de Perú.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-950">11. Contacto</h2>
        <p>
          Para consultas: <a className="text-blue-700 underline underline-offset-4" href="mailto:jmedina@cmtperu.pe">jmedina@cmtperu.pe</a>
        </p>
      </section>
    </article>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | ContractAI",
  description: "Política de Privacidad de ContractAI.",
};

export default function PrivacyPolicyPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-8 leading-7 text-slate-700">
      <header className="space-y-3 border-b border-slate-200 pb-8">
        <h1 className="text-4xl font-bold tracking-tight text-slate-950">Política de Privacidad de ContractAI</h1>
        <p className="text-sm text-slate-500">Última actualización: 17/04/2026</p>
        <p>
          ContractAI respeta la privacidad de sus usuarios y se compromete a proteger su información personal.
          Esta Política de Privacidad describe cómo recopilamos, utilizamos y protegemos los datos cuando
          utilizas nuestra aplicación.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-950">1. Información que recopilamos</h2>
        <p>Podemos recopilar la siguiente información:</p>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-slate-900">Información de cuenta</h3>
          <ul className="list-disc space-y-2 pl-6">
            <li>Nombre completo</li>
            <li>Correo electrónico</li>
            <li>Foto de perfil</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-slate-900">Información de uso y organización</h3>
          <ul className="list-disc space-y-2 pl-6">
            <li>Rol del usuario</li>
            <li>Organización a la que pertenece</li>
            <li>Estado de la cuenta</li>
            <li>Preferencias de notificación</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-slate-900">Información de documentos</h3>
          <ul className="list-disc space-y-2 pl-6">
            <li>Contratos creados o importados</li>
            <li>Metadatos de contratos (cliente, tipo, fechas, montos, estado, servicios)</li>
            <li>Documentos y carpetas</li>
            <li>Conversaciones con el chatbot</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-slate-900">Datos de Google</h3>
          <p>Si el usuario inicia sesión con Google o conecta su cuenta:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Información básica del perfil (nombre, email, foto)</li>
            <li>Acceso limitado a archivos de Google Drive seleccionados explícitamente por el usuario</li>
            <li>Los archivos se utilizan únicamente para importación y procesamiento dentro de la aplicación</li>
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-950">2. Cómo utilizamos la información</h2>
        <p>Utilizamos la información para:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Proporcionar acceso a la plataforma</li>
          <li>Gestionar usuarios y organizaciones</li>
          <li>Crear, almacenar y organizar contratos</li>
          <li>Importar y procesar documentos seleccionados desde Google Drive</li>
          <li>Mejorar la experiencia del usuario</li>
          <li>Generar respuestas mediante inteligencia artificial</li>
          <li>Enviar notificaciones y comunicaciones relevantes</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-950">3. Uso de servicios de terceros</h2>
        <p>Podemos compartir o procesar datos mediante los siguientes proveedores:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Supabase</strong>: autenticación, base de datos y almacenamiento
          </li>
          <li>
            <strong>Google</strong>: autenticación, Google Drive y servicios de correo
          </li>
          <li>
            <strong>Azure OpenAI / OpenAI / Gemini</strong>: procesamiento de lenguaje natural y generación de
            contenido
          </li>
          <li>
            <strong>Qdrant</strong>: búsqueda semántica
          </li>
          <li>
            <strong>LlamaParse</strong>: procesamiento de documentos
          </li>
          <li>
            <strong>Azure Key Vault</strong>: gestión de credenciales
          </li>
        </ul>
        <p>Estos proveedores procesan datos bajo sus propias políticas de privacidad.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-950">4. Protección de datos</h2>
        <p>
          Implementamos medidas de seguridad razonables para proteger la información contra acceso no autorizado,
          pérdida o alteración.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-950">5. Retención de datos</h2>
        <p>Los datos se conservan mientras la cuenta esté activa o sea necesario para proveer el servicio.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-950">6. Derechos del usuario</h2>
        <p>El usuario puede:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Acceder a sus datos</li>
          <li>Solicitar corrección o eliminación</li>
          <li>Revocar permisos de Google en cualquier momento</li>
        </ul>
        <p>
          Para ejercer estos derechos, contactar a: <a className="text-blue-700 underline underline-offset-4" href="mailto:jmedina@cmtperu.pe">jmedina@cmtperu.pe</a>
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-950">7. Uso de Google API</h2>
        <p>
          El uso de información recibida de Google APIs cumple con la <strong>Política de Datos de Usuario de
          Servicios de Google</strong>, incluyendo los requisitos de uso limitado.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-950">8. Usuarios empresariales</h2>
        <p>
          ContractAI está dirigido a organizaciones. Los datos pueden ser gestionados por administradores de la
          organización del usuario.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-950">9. Restricción de edad</h2>
        <p>El servicio está dirigido a usuarios mayores de 18 años.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-950">10. Cambios a esta política</h2>
        <p>Podemos actualizar esta política ocasionalmente. Se notificará a los usuarios mediante la aplicación.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-950">11. Contacto</h2>
        <p>
          Si tienes preguntas sobre esta política, contáctanos en: <a className="text-blue-700 underline underline-offset-4" href="mailto:jmedina@cmtperu.pe">jmedina@cmtperu.pe</a>
        </p>
      </section>
    </article>
  );
}

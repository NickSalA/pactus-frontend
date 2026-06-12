import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad | Pactus',
  description: 'Política de Privacidad de Pactus.',
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

function Subsection({
  title,
  children,
}: Readonly<{
  title: string;
  children: React.ReactNode;
}>) {
  return (
    <div className="space-y-3 rounded-2xl bg-white p-5 ring-1 ring-brand-neutral-200">
      <h3 className="text-lg font-semibold text-brand-neutral-900">{title}</h3>
      {children}
    </div>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <article className="space-y-8 text-brand-neutral-700">
      <header className="border-b border-brand-neutral-200 pb-8">
        <span className="inline-flex rounded-full bg-brand-blue-50 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-brand-primary">
          Documento legal
        </span>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-brand-neutral-900 sm:text-5xl">
          Política de Privacidad de Pactus
        </h1>
        <p className="mt-4 text-sm font-medium text-brand-neutral-500">
          Última actualización: 17/04/2026
        </p>
        <p className="mt-6 rounded-3xl border border-brand-blue-100 bg-brand-blue-50 p-6 text-lg leading-8 text-brand-neutral-700">
          Pactus respeta la privacidad de sus usuarios y se compromete a
          proteger su información personal. Esta Política de Privacidad describe
          cómo recopilamos, utilizamos y protegemos los datos cuando utilizas
          nuestra aplicación.
        </p>
      </header>

      <LegalSection title="1. Información que recopilamos">
        <p>Podemos recopilar la siguiente información:</p>

        <Subsection title="Información de cuenta">
          <ul className="list-disc space-y-2 pl-6">
            <li>Nombre completo</li>
            <li>Correo electrónico</li>
            <li>Foto de perfil</li>
          </ul>
        </Subsection>

        <Subsection title="Información de uso y organización">
          <ul className="list-disc space-y-2 pl-6">
            <li>Rol del usuario</li>
            <li>Organización a la que pertenece</li>
            <li>Estado de la cuenta</li>
            <li>Preferencias de notificación</li>
          </ul>
        </Subsection>

        <Subsection title="Información de documentos">
          <ul className="list-disc space-y-2 pl-6">
            <li>Contratos creados o importados</li>
            <li>
              Metadatos de contratos: cliente, tipo, fechas, montos, estado y
              servicios
            </li>
            <li>Documentos y carpetas</li>
            <li>Conversaciones con el chatbot</li>
          </ul>
        </Subsection>

        <Subsection title="Datos de Google">
          <p>Si el usuario inicia sesión con Google o conecta su cuenta:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Información básica del perfil: nombre, email y foto</li>
            <li>
              Acceso a archivos de Google Drive solo cuando el usuario lo
              autoriza explícitamente
            </li>
            <li>
              Los archivos se utilizan únicamente para importación y
              procesamiento dentro de la aplicación
            </li>
          </ul>
        </Subsection>
      </LegalSection>

      <LegalSection title="2. Cómo utilizamos la información">
        <p>Utilizamos la información para:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Proporcionar acceso a la plataforma</li>
          <li>Gestionar usuarios y organizaciones</li>
          <li>Crear, almacenar y organizar contratos</li>
          <li>Importar y procesar documentos desde Google Drive</li>
          <li>Mejorar la experiencia del usuario</li>
          <li>Generar respuestas mediante inteligencia artificial</li>
          <li>Enviar notificaciones y comunicaciones relevantes</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Uso de servicios de terceros">
        <p>Podemos compartir o procesar datos mediante los siguientes proveedores:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Supabase</strong>: autenticación, base de datos y
            almacenamiento
          </li>
          <li>
            <strong>Google</strong>: autenticación, Google Drive y servicios de
            correo
          </li>
          <li>
            <strong>Azure OpenAI / OpenAI / Gemini</strong>: procesamiento de
            lenguaje natural y generación de contenido
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
      </LegalSection>

      <LegalSection title="4. Protección de datos">
        <p>
          Implementamos medidas de seguridad razonables para proteger la
          información contra acceso no autorizado, pérdida o alteración.
        </p>
      </LegalSection>

      <LegalSection title="5. Retención de datos">
        <p>
          Los datos se conservan mientras la cuenta esté activa o sea necesario
          para proveer el servicio.
        </p>
      </LegalSection>

      <LegalSection title="6. Derechos del usuario">
        <p>El usuario puede:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Acceder a sus datos</li>
          <li>Solicitar corrección o eliminación</li>
          <li>Revocar permisos de Google en cualquier momento</li>
        </ul>
        <p>
          Para ejercer estos derechos, contactar a:{' '}
          <a
            className="font-semibold text-brand-primary underline underline-offset-4"
            href="mailto:nicksalcedo717@gmail.com"
          >
            nicksalcedo717@gmail.com
          </a>
        </p>
      </LegalSection>

      <LegalSection title="7. Uso de Google API">
        <p>
          El uso de información recibida de Google APIs cumple con la{' '}
          <strong>Política de Datos de Usuario de Servicios de Google</strong>,
          incluyendo los requisitos de uso limitado.
        </p>
      </LegalSection>

      <LegalSection title="8. Usuarios empresariales">
        <p>
          Pactus está dirigido a organizaciones. Los datos pueden ser gestionados
          por administradores de la organización del usuario.
        </p>
      </LegalSection>

      <LegalSection title="9. Restricción de edad">
        <p>El servicio está dirigido a usuarios mayores de 18 años.</p>
      </LegalSection>

      <LegalSection title="10. Cambios a esta política">
        <p>
          Podemos actualizar esta política ocasionalmente. Se notificará a los
          usuarios mediante la aplicación.
        </p>
      </LegalSection>

      <LegalSection title="11. Contacto">
        <p>
          Si tienes preguntas sobre esta política, contáctanos en:{' '}
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

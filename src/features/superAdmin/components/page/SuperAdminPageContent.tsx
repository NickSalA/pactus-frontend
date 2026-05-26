'use client';

import Link from 'next/link';
import Image from 'next/image';
import { SuperAdminLoginForm } from '@/features/superAdmin/components/form/SuperAdminLoginForm';
import { SuperAdminCreateOrganizationModal } from '@/features/superAdmin/components/modals/SuperAdminCreateOrganizationModal';
import { useSuperAdminPage } from '@/features/superAdmin/hooks/useSuperAdminPage';

export function SuperAdminPageContent() {
  const page = useSuperAdminPage();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50/50 px-6 py-10">
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[800px] w-[800px] rounded-full bg-blue-500/20 blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-20 -top-60 h-[600px] w-[600px] rounded-full bg-cyan-400/20 blur-[90px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-48 -left-32 h-[750px] w-[750px] rounded-full bg-violet-400/20 blur-[100px]"
        aria-hidden="true"
      />

      <section className="relative z-10 w-full max-w-[480px]">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <Image
            src="/logo-contractAI-azul.png"
            alt="ContractAI"
            width={72}
            height={72}
            className="rounded-xl object-contain"
            priority
          />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-indigo-400">
              Pactus
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              Provisionamiento seguro
            </h2>
          </div>
        </div>

        <SuperAdminLoginForm
          error={page.loginError}
          form={page.loginForm}
          isSubmitting={page.isLoggingIn}
          onSubmit={page.login}
        />

        <div className="mt-5 text-center">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-500 underline underline-offset-4 transition-colors hover:text-slate-900"
          >
            Volver al login de usuarios
          </Link>
        </div>
      </section>

      {page.authUser ? (
        <SuperAdminCreateOrganizationModal
          adminName={page.authUser.name}
          error={page.createError}
          form={page.createForm}
          isSubmitting={page.isCreatingOrganization}
          onLogout={page.clearSession}
          onSubmit={page.createOrganization}
          successMessage={page.successMessage}
        />
      ) : null}
    </main>
  );
}

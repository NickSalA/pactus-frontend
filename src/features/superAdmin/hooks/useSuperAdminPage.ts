'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { logout as clearApiSession, setApiAccessToken } from '@/api';
import { resolveSessionUser, type AuthDisplayUser } from '@/lib/authUser';
import { supabase } from '@/lib/supabaseClient';
import { useAuthStore } from '@/store';
import { useCreateOrganization } from '@/queries/hooks/organizations/mutations';
import {
  superAdminCreateOrganizationSchema,
  superAdminLoginSchema,
  type SuperAdminCreateOrganizationValues,
  type SuperAdminLoginValues,
} from '@/features/superAdmin/lib/super-admin.schema';

const SUCCESS_REDIRECT_DELAY = 1300;

export function useSuperAdminPage() {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.user);
  const setSession = useAuthStore((state) => state.setSession);
  const logout = useAuthStore((state) => state.logout);

  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [authUser, setAuthUser] = useState<AuthDisplayUser | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loginForm = useForm<SuperAdminLoginValues>({
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: zodResolver(superAdminLoginSchema),
  });

  const createForm = useForm<SuperAdminCreateOrganizationValues>({
    defaultValues: { adminEmail: '', organizationName: '' },
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: zodResolver(superAdminCreateOrganizationSchema),
  });

  const createOrganizationMutation = useCreateOrganization();

  const clearSession = useCallback(async () => {
    if (redirectTimerRef.current) {
      clearTimeout(redirectTimerRef.current);
      redirectTimerRef.current = null;
    }

    await supabase.auth.signOut();
    clearApiSession();
    logout();
    setAuthUser(null);
  }, [logout]);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setAuthUser(currentUser?.role === 'SUPERADMIN' ? currentUser : null);
  }, [currentUser]);

  const login = useCallback(
    async (values: SuperAdminLoginValues) => {
      try {
        setLoginError(null);

        const { data, error } = await supabase.auth.signInWithPassword({
          email: values.email.trim().toLowerCase(),
          password: values.password,
        });

        if (error) {
          throw error;
        }

        if (!data.session) {
          throw new Error('No se pudo iniciar sesion.');
        }

        setApiAccessToken(data.session.access_token, { notify: true });
        const resolvedUser = await resolveSessionUser(data.session);

        if (resolvedUser.role !== 'SUPERADMIN') {
          await clearSession();
          throw new Error('Este acceso esta reservado para super administradores.');
        }

        setSession(resolvedUser, data.session.access_token);
        setAuthUser(resolvedUser);
      } catch (error) {
        setLoginError(
          error instanceof Error
            ? error.message
            : 'No se pudo iniciar sesion.',
        );
      }
    },
    [clearSession, setSession],
  );

  const createOrganization = useCallback(
    async (values: SuperAdminCreateOrganizationValues) => {
      try {
        setCreateError(null);
        const organization = await createOrganizationMutation.mutateAsync({
          name: values.organizationName.trim(),
          admin_email: values.adminEmail.trim().toLowerCase(),
        });

        setSuccessMessage(
          `La organizacion ${organization.name} se creo correctamente.`,
        );

        redirectTimerRef.current = setTimeout(() => {
          void clearSession().finally(() => {
            router.replace('/login');
          });
        }, SUCCESS_REDIRECT_DELAY);
      } catch (error) {
        setCreateError(
          error instanceof Error
            ? error.message
            : 'No se pudo crear la organizacion.',
        );
      }
    },
    [clearSession, createOrganizationMutation, router],
  );

  return {
    authUser,
    clearSession,
    createError,
    createForm,
    createOrganization,
    isCreatingOrganization: createOrganizationMutation.isPending,
    isLoggingIn: loginForm.formState.isSubmitting,
    login,
    loginError,
    loginForm,
    successMessage,
  };
}

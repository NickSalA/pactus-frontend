"use client";

import type { Session } from "@supabase/supabase-js";
import { useEffect } from "react";
import { logout as clearApiSession, setApiAccessToken } from "@/api";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/store";
import { resolveSessionUser } from "@/features/auth/lib/resolve-session-user";

type Props = {
  readonly children: React.ReactNode;
};

export default function AuthBootstrap({ children }: Props) {
  const { logout, setAccessToken, setHydrating, setSession } = useAuthStore();

  useEffect(() => {
    let mounted = true;
    let syncRun = 0;
    let lastSupabaseUserId: string | null = null;

    const resetSessionState = () => {
      setApiAccessToken(null, { notify: true });
      logout();
      setHydrating(false);
    };

    const syncSession = async (
      session: Session | null,
      options: { blockUi: boolean; notifySessionChange: boolean },
    ) => {
      const currentRun = ++syncRun;

      if (!mounted) {
        return;
      }

      if (options.blockUi) {
        setHydrating(true);
      }

      if (!session?.user) {
        lastSupabaseUserId = null;
        if (mounted && currentRun === syncRun) {
          resetSessionState();
        }
        return;
      }

      lastSupabaseUserId = session.user.id;
      setApiAccessToken(session.access_token, { notify: options.notifySessionChange });

      try {
        const authUser = await resolveSessionUser(session);

        if (!mounted || currentRun !== syncRun) {
          return;
        }

        setSession(authUser, session.access_token);
      } finally {
        if (mounted && currentRun === syncRun) {
          setHydrating(false);
        }
      }
    };

    const bootstrap = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) {
          return;
        }

        await syncSession(session, { blockUi: true, notifySessionChange: true });
      } catch {
        clearApiSession();
        if (mounted) {
          resetSessionState();
        }
      }
    };

    void bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") {
        return;
      }

      if (!session?.user) {
        void syncSession(session, { blockUi: false, notifySessionChange: true });
        return;
      }

      const currentUser = useAuthStore.getState().user;
      const sameUser = lastSupabaseUserId === session.user.id;

      if (event === "TOKEN_REFRESHED" && sameUser && currentUser) {
        lastSupabaseUserId = session.user.id;
        setApiAccessToken(session.access_token, { notify: false });
        setAccessToken(session.access_token);
        return;
      }

      void syncSession(session, {
        blockUi: currentUser === null,
        notifySessionChange: !sameUser,
      });
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [logout, setAccessToken, setHydrating, setSession]);

  return <>{children}</>;
}

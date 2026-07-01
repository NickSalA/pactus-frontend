import { create } from "zustand";
import type { AuthDisplayUser } from "@/lib/authUser";

interface AuthState {
  user: AuthDisplayUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  subscriptionActive: boolean | null;
  setAccessToken: (accessToken: string | null) => void;
  setHydrating: (isHydrating: boolean) => void;
  setSubscriptionActive: (subscriptionActive: boolean | null) => void;
  setUser: (user: AuthDisplayUser) => void;
  setSession: (user: AuthDisplayUser, accessToken: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isHydrating: true,
  subscriptionActive: null,
  setAccessToken: (accessToken) =>
    set((state) => ({
      accessToken,
      isAuthenticated: state.user !== null,
      user: state.user,
      isHydrating: false,
    })),
  setHydrating: (isHydrating) => set({ isHydrating }),
  setSubscriptionActive: (subscriptionActive) => set({ subscriptionActive }),
  setUser: (user) =>
    set((state) => ({
      user,
      isAuthenticated: true,
      accessToken: state.accessToken,
      subscriptionActive: user.subscriptionActive,
    })),
  setSession: (user, accessToken) =>
    set({
      user,
      accessToken,
      isAuthenticated: true,
      isHydrating: false,
      subscriptionActive: user.subscriptionActive,
    }),
  logout: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isHydrating: false,
      subscriptionActive: null,
    }),
}));

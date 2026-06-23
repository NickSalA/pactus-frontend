"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";

type Props = {
  readonly children: React.ReactNode;
};

export default function PaywallGuard({ children }: Props) {
  const router = useRouter();
  const { isHydrating, isAuthenticated, subscriptionActive } = useAuthStore();

  useEffect(() => {
    if (isHydrating) return;
    if (!isAuthenticated) return;
    if (subscriptionActive === false) {
      router.replace("/pricing");
    }
  }, [isHydrating, isAuthenticated, subscriptionActive, router]);

  if (isHydrating) return null;

  if (isAuthenticated && subscriptionActive === false) return null;

  return <>{children}</>;
}

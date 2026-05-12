"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user?.role) return;

    if (user.role === "MANAGER") {
      router.replace("/dashboard/manager");
    } else {
      router.replace("/dashboard/hr");
    }
  }, [user?.role, router]);

  return null;
}
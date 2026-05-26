import { AdminOrganizationOnboardingGate } from '@/features/admin/components/shared/AdminOrganizationOnboardingGate';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminOrganizationOnboardingGate>{children}</AdminOrganizationOnboardingGate>;
}

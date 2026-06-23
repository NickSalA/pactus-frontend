import Sidebar from '@/components/layout/Sidebar';
import { ContractImportFloatingWidget } from '@/components/layout/ContractImportFloatingWidget';
import PaywallGuard from '@/components/providers/PaywallGuard';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PaywallGuard>
      <div className="grid grid-cols-[auto_1fr] h-screen w-screen overflow-hidden gap-1">
        <aside className="pl-1 py-1">
          <Sidebar />
        </aside>
        <main className="flex-1 p-6 min-h-0 overflow-visible">{children}</main>
        <ContractImportFloatingWidget />
      </div>
    </PaywallGuard>
  );
}

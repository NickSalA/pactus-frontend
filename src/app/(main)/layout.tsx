import Sidebar from '@/components/layout/Sidebar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[auto_1fr] h-screen w-screen overflow-hidden gap-1">
      <aside className="pl-1 py-1">
        <Sidebar />
      </aside>
      <main className="flex-1 p-6 min-h-0 overflow-hidden">{children}</main>
    </div>
  );
}

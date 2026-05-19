import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[auto_1fr] h-screen w-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 bg-gray-50 p-4 min-h-0 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

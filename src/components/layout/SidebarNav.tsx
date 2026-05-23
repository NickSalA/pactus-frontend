type SidebarNavProps = {
  children: React.ReactNode;
};

export function SidebarNav({ children }: SidebarNavProps) {
  return (
    <nav aria-label="Menú principal" className="flex-1">
      <ul className="flex flex-col gap-2">{children}</ul>
    </nav>
  );
}

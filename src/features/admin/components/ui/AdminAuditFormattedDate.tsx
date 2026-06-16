export function AdminAuditFormattedDate({ date }: { date: string }) {
  const d = new Date(date);
  return (
    <span className="text-sm text-slate-500">
      {d.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}
    </span>
  );
}

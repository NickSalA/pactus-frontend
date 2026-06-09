type AuditChatbotUserInfoProps = {
  actor_name: string | null;
  actor_role: string;
};

export function AuditChatbotUserInfo({
  actor_name,
  actor_role,
}: AuditChatbotUserInfoProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-sm font-medium text-slate-900">
        {actor_name ?? '—'}
      </span>
      <span className="inline-flex w-fit rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
        {actor_role}
      </span>
    </div>
  );
}

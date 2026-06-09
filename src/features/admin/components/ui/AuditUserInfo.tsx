import type { ApiAuditUserActivityResponse } from '@/types/api';

type AuditUserInfoProps = {
  target: Pick<
    ApiAuditUserActivityResponse,
    'target_user_name' | 'target_user_email' | 'role' | 'previous_role'
  >;
};

function RoleChange({
  previous_role,
  role,
}: {
  previous_role: string | null;
  role: string | null;
}) {
  if (previous_role && role) {
    return (
      <span className="mt-1 inline-flex items-center gap-1.5 text-xs">
        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-500">
          {previous_role}
        </span>
        <span className="text-slate-300">&rarr;</span>
        <span className="rounded bg-blue-100 px-1.5 py-0.5 font-medium text-blue-700">
          {role}
        </span>
      </span>
    );
  }

  if (role) {
    return (
      <span className="mt-1 inline-flex w-fit rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
        {role}
      </span>
    );
  }

  return null;
}

export function AuditUserInfo({ target }: AuditUserInfoProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-sm font-medium text-slate-900">
        {target.target_user_name ?? '—'}
      </span>
      {target.target_user_email && (
        <span className="text-xs text-slate-500">
          {target.target_user_email}
        </span>
      )}
      <RoleChange
        previous_role={target.previous_role}
        role={target.role}
      />
    </div>
  );
}

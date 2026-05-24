import { ApiDocumentType } from '@/types/api';
import { getDocumentTypeLabel } from '@/lib/document.utils';
import { cn } from '@/lib/utils';

type DocumentTypeBadgeProps = {
  type: ApiDocumentType;
  className?: string;
};

export function DocumentTypeBadge({ type, className }: DocumentTypeBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center bg-brand-blue-100 text-label-main-bold text-brand-blue-600 rounded-md px-2 py-1 font-medium',
        className,
      )}
    >
      {getDocumentTypeLabel(type)}
    </span>
  );
}

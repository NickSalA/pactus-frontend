import { useQuery } from '@tanstack/react-query';
import { getNotificationRules } from '@/api';

export const useNotificationRules = () =>
  useQuery({
    queryKey: ['notifications', 'rules'] as const,
    queryFn: () => getNotificationRules(),
  });
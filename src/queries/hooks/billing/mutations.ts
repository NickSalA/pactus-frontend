import { useMutation } from '@tanstack/react-query';
import { confirmPayPalSubscription } from '@/api';
import type {
  ApiBillingConfirmSubscriptionRequest,
  ApiBillingConfirmSubscriptionResponse,
} from '@/types/api';

export const useConfirmPayPalSubscription = (options?: {
  onSuccess?: (data: ApiBillingConfirmSubscriptionResponse) => void;
  onError?: (error: Error) => void;
}) => {
  return useMutation({
    mutationFn: (payload: ApiBillingConfirmSubscriptionRequest) =>
      confirmPayPalSubscription(payload),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};

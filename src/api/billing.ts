import type {
  ApiBillingConfirmSubscriptionRequest,
  ApiBillingConfirmSubscriptionResponse,
} from '@/types/api';
import { TIMEOUTS } from './constants';
import { apiPost } from './axiosInstance';

export async function confirmPayPalSubscription(
  payload: ApiBillingConfirmSubscriptionRequest,
): Promise<ApiBillingConfirmSubscriptionResponse> {
  return apiPost<ApiBillingConfirmSubscriptionResponse>(
    '/billing/paypal/subscriptions/confirm',
    payload,
    { timeout: TIMEOUTS.DEFAULT },
  );
}

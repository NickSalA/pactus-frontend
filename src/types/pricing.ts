export type BillingCycle = 'month' | 'year';

export interface Plan {
  id: string;
  title: string;
  price: number;
  billing: BillingCycle;
  planId: string;
  highlighted?: boolean;
  badge?: string;
}

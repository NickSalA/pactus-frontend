'use client';

import { PayPalButtons } from '@paypal/react-paypal-js';
import { Check } from 'lucide-react';
import type { Plan } from '@/types/pricing';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PricingCardProps {
  plan: Plan;
  features: string[];
}

export default function PricingCard({ plan, features }: PricingCardProps) {
  const priceLabel = plan.billing === 'month' ? '/mes' : '/año';

  return (
    <Card
      className={cn(
        'relative flex w-full max-w-sm flex-col overflow-visible',
        plan.highlighted &&
          'ring-2 ring-brand-primary shadow-xl shadow-brand-primary/10',
      )}
    >
      {plan.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-primary px-4 py-1 text-xs font-semibold text-white">
          {plan.badge}
        </span>
      )}

      <CardHeader className="items-center pb-2 pt-6 text-center">
        <p className="text-lg font-medium text-brand-neutral-600">
          {plan.title}
        </p>
        <p className="mt-2">
          <span className="text-5xl font-bold tracking-tight text-brand-neutral-900">
            ${plan.price}
          </span>
          <span className="ml-1 text-base text-brand-neutral-500">
            {priceLabel}
          </span>
        </p>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        {features.map((feature) => (
          <div key={feature} className="flex items-start gap-3">
            <Check size={18} className="mt-0.5 shrink-0 text-green-500" />
            <span className="text-sm text-brand-neutral-700">{feature}</span>
          </div>
        ))}
      </CardContent>

      <CardFooter className="w-full flex-col items-stretch gap-2 border-t p-4">
        <PayPalButtons
          style={{
            shape: 'rect',
            color: 'gold',
            label: 'subscribe',
            height: 48,
          }}
          createSubscription={(data, actions) => {
            return actions.subscription.create({
              plan_id: plan.planId,
            });
          }}
          onApprove={async (data) => {
            console.log('Suscripción aprobada:', data);
            // TODO: Conectar con el backend
            // POST /api/payments/subscribe
            // Body: { subscriptionId: data.subscriptionID, planId: plan.planId }
            // Persistir la suscripción en la base de datos
          }}
          onError={(err) => {
            console.error('Error en PayPal:', err);
          }}
        />
      </CardFooter>
    </Card>
  );
}

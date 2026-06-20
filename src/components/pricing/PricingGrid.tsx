import { plans, planFeatures } from '@/lib/pricingData';
import PricingCard from './PricingCard';

export default function PricingGrid() {
  return (
    <section className="flex flex-col items-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-brand-primary sm:text-5xl">
          Planes
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-brand-neutral-600">
          Elige el plan que mejor se adapte a las necesidades de tu organización
        </p>
      </div>

      <div className="mt-12 flex w-full flex-col items-center justify-center gap-8 lg:flex-row lg:items-stretch">
        {plans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} features={planFeatures} />
        ))}
      </div>
    </section>
  );
}

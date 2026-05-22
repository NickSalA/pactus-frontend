import { Card, CardContent } from '@/components/ui/card';

type DashboardWelcomeProps = {
  firstName: string;
};

export function DashboardWelcome({ firstName }: DashboardWelcomeProps) {
  return (
    <Card className="h-fit rounded-2xl bg-white px-6 py-6 shadow-md">
      <CardContent className="flex flex-col gap-2 p-0">
        <span className="text-display-large-bold font-semibold text-brand-primary">
          Bienvenido, {firstName}
        </span>
        <p className="text-body-small-regular text-brand-neutral-500 md:text-base">
          Este es el resumen de tus contratos y documentos para hoy.
        </p>
      </CardContent>
    </Card>
  );
}

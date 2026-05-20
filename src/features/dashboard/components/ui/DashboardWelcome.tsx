import { Card, CardContent } from '@/components/ui/card';

type DashboardWelcomeProps = {
  firstName: string;
};

export function DashboardWelcome({ firstName }: DashboardWelcomeProps) {
  return (
    <Card className="h-fit rounded-2xl bg-white px-6 py-6 shadow-md md:px-8">
      <CardContent className="p-0 space-y-2">
        <h1 className="text-3xl font-semibold text-slate-800">
          Bienvenido, {firstName}
        </h1>
        <p className="text-sm text-brand-gray-medium md:text-base">
          Este es el resumen de tus contratos y documentos para hoy.
        </p>
      </CardContent>
    </Card>
  );
}

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

type DashboardWelcomeProps = {
  firstName: string;
};

export function DashboardWelcome({ firstName }: DashboardWelcomeProps) {
  return (
    <Card className="rounded-2xl bg-white px-6 py-6 shadow-md md:px-8">
      <CardHeader className="p-0 m-0 gap-0">
        <CardTitle className="text-3xl font-semibold text-slate-800">
          Bienvenido, {firstName}
        </CardTitle>
        <CardDescription className="mt-2 text-sm text-gray-medium md:text-base">
          Este es el resumen de tus contratos y documentos para hoy.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
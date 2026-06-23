import type { Plan } from '@/types/pricing';

export const plans: Plan[] = [
  {
    id: 'monthly',
    title: 'Mensual',
    price: 299,
    billing: 'month',
    planId: process.env.NEXT_PUBLIC_PAYPAL_MONTHLY_PLAN_ID ?? '',
  },
  {
    id: 'annual',
    title: 'Anual',
    price: 2990,
    billing: 'year',
    planId: process.env.NEXT_PUBLIC_PAYPAL_ANNUAL_PLAN_ID ?? '',
    highlighted: true,
    badge: 'Recomendado',
  },
];

export const planFeatures = [
  'Dashboard ejecutivo con métricas',
  'Gestión de contratos',
  'Agente IA con RAG',
  'Plantillas inteligentes',
  'Usuarios, roles y permisos',
  'Alertas y notificaciones',
  'Importación Google Drive',
  'Soporte prioritario',
];

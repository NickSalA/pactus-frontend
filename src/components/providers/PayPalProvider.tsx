'use client';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';

export default function PayPalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    console.warn('NEXT_PUBLIC_PAYPAL_CLIENT_ID no está configurada');
    return <>{children}</>;
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        vault: true,
        intent: 'subscription',
      }}
    >
      {children}
    </PayPalScriptProvider>
  );
}

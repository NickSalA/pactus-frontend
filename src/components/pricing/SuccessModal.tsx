'use client';

import { CheckCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import type { ApiBillingConfirmSubscriptionResponse } from '@/types/api';

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  data: ApiBillingConfirmSubscriptionResponse | null;
}

export default function SuccessModal({
  open,
  onClose,
  data,
}: SuccessModalProps) {
  return (
    <AlertDialog open={true} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <CheckCircle size={24} className="text-green-500" />
          </AlertDialogMedia>
          <AlertDialogTitle>¡Suscripción exitosa!</AlertDialogTitle>
          <AlertDialogDescription>
            Tu organización ha sido creada. Ya puedes iniciar sesión con tu
            correo.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {data && (
          <div className="space-y-2 rounded-lg bg-muted p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Organización:</span>
              <span className="font-medium">#{data.organization_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Admin:</span>
              <span className="font-medium">{data.admin_email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Suscripción:</span>
              <span className="font-medium font-mono text-xs">
                {data.paypal_subscription_id}
              </span>
            </div>
          </div>
        )}

        <AlertDialogFooter>
          <Button
            variant="emphasized"
            size="big"
            className="text-white"
            onClick={() => {
              window.location.href = '/login';
            }}
          >
            Ir a iniciar sesión
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

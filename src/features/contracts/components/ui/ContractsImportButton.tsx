'use client';

import { CloudUpload, LoaderCircle } from 'lucide-react';

type ContractsImportButtonProps = {
  isOpeningDrivePicker: boolean;
  onOpenDrive: () => Promise<void> | void;
};

export function ContractsImportButton({
  isOpeningDrivePicker,
  onOpenDrive,
}: ContractsImportButtonProps) {
  return (
    <button
      type="button"
      onClick={() => {
        void onOpenDrive();
      }}
      disabled={isOpeningDrivePicker}
      className="flex min-h-10 items-center gap-2 rounded-xl border border-brand-primary bg-white px-5 py-2 text-sm font-medium text-brand-primary transition-all duration-200 hover:bg-brand-blue-50 disabled:cursor-wait disabled:opacity-70"
    >
      {isOpeningDrivePicker ? (
        <LoaderCircle className="h-4 w-4 animate-spin" />
      ) : (
        <CloudUpload className="h-4 w-4" />
      )}
      {isOpeningDrivePicker ? 'Abriendo Drive...' : 'Importar contratos'}
    </button>
  );
}

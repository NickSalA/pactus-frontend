import type { ChangeEvent } from 'react';
import {
  CURRENCY_OPTIONS,
  DOCUMENT_STATE_OPTIONS,
  DOCUMENT_TYPE_OPTIONS,
} from '@/lib/document.utils';
import {
  type Step1Draft,
} from '@/features/contracts/lib/contract-form.utils';
import { HelpTip } from '@/features/contracts/components/form/HelpTip';
import type { ContractFolder } from '@/features/contracts/lib/contracts-utils';
import { ApiDocumentType } from '@/types/api';
import { Select } from '@/components/ui/Select';

type ContractFormGeneralFieldsProps = {
  allowedDocumentTypes?: readonly ApiDocumentType[] | null;
  data: Step1Draft;
  folderOptions?: readonly ContractFolder[];
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  showFolderField?: boolean;
};

const LABEL_CLASS = "mb-1.5 flex items-center text-sm font-medium text-slate-700";
const INPUT_CLASS = "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

export function ContractFormGeneralFields({
  allowedDocumentTypes,
  data,
  folderOptions = [],
  onChange,
  showFolderField = false,
}: ContractFormGeneralFieldsProps) {
  const documentTypeOptions = allowedDocumentTypes
    ? DOCUMENT_TYPE_OPTIONS.filter((option) =>
        allowedDocumentTypes.includes(option.value),
      )
    : DOCUMENT_TYPE_OPTIONS;

  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-4">
      <div>
        <label className={LABEL_CLASS}>Nombre del contrato</label>
        <input
          name="name"
          value={data.name}
          placeholder="Ej: Contrato de servicios 2024"
          onChange={onChange}
          className={INPUT_CLASS}
        />
      </div>
      <div>
        <label className={LABEL_CLASS}>Cliente</label>
        <input
          name="client"
          value={data.client}
          placeholder="Nombre del cliente"
          onChange={onChange}
          className={INPUT_CLASS}
        />
      </div>
      {showFolderField && (
        <div>
          <label className={LABEL_CLASS}>
            Carpeta
            <HelpTip text="Usa este campo solo si necesitas corregir la carpeta donde se guarda el contrato." />
          </label>
          <Select
            variant="md"
            className="w-full"
            name="folder_id"
            value={data.folder_id ?? ''}
            onChange={onChange}
          >
            <option value="">Sin carpeta</option>
            {folderOptions.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </Select>
        </div>
      )}
      <div>
        <label className={LABEL_CLASS}>
          Tipo de contrato
          <HelpTip text="Empresa = contratos corporativos, comerciales o con clientes. Trabajador = contratos laborales, de personal o gestionados por RRHH." />
        </label>
        <Select
          variant="md"
          className="w-full"
          name="type"
          value={data.type}
          onChange={onChange}
          disabled={documentTypeOptions.length <= 1}
        >
          {documentTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <label className={LABEL_CLASS}>
          Estado
          <HelpTip text="Borrador = en preparacion. Pendiente de firma = generado pero aun no firmado. Por vencer = dentro de la ventana de alerta. Terminado = cierre anticipado." />
        </label>
        <Select
          variant="md"
          className="w-full"
          name="state"
          value={data.state}
          onChange={onChange}
        >
          {DOCUMENT_STATE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <label className={LABEL_CLASS}>Fecha de inicio</label>
        <input
          type="date"
          name="start_date"
          value={data.start_date}
          onChange={onChange}
          className={INPUT_CLASS}
        />
      </div>
      <div>
        <label className={LABEL_CLASS}>Fecha de vencimiento</label>
        <input
          type="date"
          name="end_date"
          value={data.end_date}
          onChange={onChange}
          className={INPUT_CLASS}
        />
      </div>
      <div className="col-span-2">
        <label className={LABEL_CLASS}>
          Moneda del contrato
          <HelpTip text="La moneda elegida se aplicara automaticamente a todos los servicios. No se puede cambiar por servicio individual." />
        </label>
        <Select
          variant="md"
          className="w-full"
          name="contract_currency"
          value={data.contract_currency}
          onChange={onChange}
        >
          {CURRENCY_OPTIONS.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
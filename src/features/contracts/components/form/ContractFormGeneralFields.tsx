import type { ChangeEvent } from "react";
import { CURRENCY_OPTIONS, DOCUMENT_STATE_OPTIONS, DOCUMENT_TYPE_OPTIONS } from "@/lib/document.utils";
import { HelpTip, type Step1Draft } from "@/features/contracts/lib/contract-form.utils";
import type { ContractFolder } from "@/features/contracts/lib/contracts-utils";
import type { DocumentType } from "@/types/api.types";
import { contractFormStyles } from "./contract-form.styles";

type ContractFormGeneralFieldsProps = {
  allowedDocumentTypes?: readonly DocumentType[] | null;
  data: Step1Draft;
  folderOptions?: readonly ContractFolder[];
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  showFolderField?: boolean;
};

export function ContractFormGeneralFields({ allowedDocumentTypes, data, folderOptions = [], onChange, showFolderField = false }: ContractFormGeneralFieldsProps) {
  const documentTypeOptions = allowedDocumentTypes
    ? DOCUMENT_TYPE_OPTIONS.filter((option) => allowedDocumentTypes.includes(option.value))
    : DOCUMENT_TYPE_OPTIONS;

  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-4">
      <div>
        <label className={contractFormStyles.label}>Nombre del contrato</label>
        <input
          name="name"
          value={data.name}
          placeholder="Ej: Contrato de servicios 2024"
          onChange={onChange}
          className={contractFormStyles.input}
        />
      </div>
      <div>
        <label className={contractFormStyles.label}>Cliente</label>
        <input
          name="client"
          value={data.client}
          placeholder="Nombre del cliente"
          onChange={onChange}
          className={contractFormStyles.input}
        />
      </div>
      {showFolderField && (
        <div>
          <label className={contractFormStyles.label}>
            Carpeta
            <HelpTip text="Usa este campo solo si necesitas corregir la carpeta donde se guarda el contrato." />
          </label>
          <select
            name="folder_id"
            value={data.folder_id ?? ""}
            onChange={onChange}
            className={contractFormStyles.select}
          >
            <option value="">Sin carpeta</option>
            {folderOptions.map((folder) => (
              <option key={folder.id} value={folder.id}>
                {folder.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div>
        <label className={contractFormStyles.label}>
          Tipo de contrato
          <HelpTip text="Empresa = contratos corporativos, comerciales o con clientes. Trabajador = contratos laborales, de personal o gestionados por RRHH." />
        </label>
        <select
          name="type"
          value={data.type}
          onChange={onChange}
          className={contractFormStyles.select}
          disabled={documentTypeOptions.length <= 1}
        >
          {documentTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={contractFormStyles.label}>
          Estado
          <HelpTip text="Borrador = en preparacion. Pendiente de firma = generado pero aun no firmado. Por vencer = dentro de la ventana de alerta. Terminado = cierre anticipado." />
        </label>
        <select
          name="state"
          value={data.state}
          onChange={onChange}
          className={contractFormStyles.select}
        >
          {DOCUMENT_STATE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={contractFormStyles.label}>Fecha de inicio</label>
        <input
          type="date"
          name="start_date"
          value={data.start_date}
          onChange={onChange}
          className={contractFormStyles.input}
        />
      </div>
      <div>
        <label className={contractFormStyles.label}>Fecha de vencimiento</label>
        <input
          type="date"
          name="end_date"
          value={data.end_date}
          onChange={onChange}
          className={contractFormStyles.input}
        />
      </div>
      <div className="col-span-2">
        <label className={contractFormStyles.label}>
          Moneda del contrato
          <HelpTip text="La moneda elegida se aplicara automaticamente a todos los servicios. No se puede cambiar por servicio individual." />
        </label>
        <select
          name="contract_currency"
          value={data.contract_currency}
          onChange={onChange}
          className={contractFormStyles.select}
        >
          {CURRENCY_OPTIONS.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Select } from "@/components/ui/Select";
import type { DocumentState } from "@/types/api.types";

type Props = {
  readonly currentState: DocumentState;
  readonly onStatusChange: (nextState: DocumentState | null) => void;
};

/** Shared toggle button used by both variants. */
function StatusSwitch({ checked, onChange }: { checked: boolean; onChange: (next: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 ${
        checked ? "bg-emerald-500" : "bg-slate-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

/** For PENDING_SIGNATURE: direct switch "Marcar como firmado" (original behavior). */
function SignedToggle({ onStatusChange }: { onStatusChange: (next: DocumentState | null) => void }) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-800">Marcar como firmado</p>
          <p className="mt-0.5 text-xs text-slate-500">
            El contrato pasará a estado &quot;Activo&quot; al guardar
          </p>
        </div>
        <StatusSwitch
          checked={checked}
          onChange={(next) => {
            setChecked(next);
            onStatusChange(next ? "ACTIVE" : null);
          }}
        />
      </div>
    </div>
  );
}

/** For DRAFT: switch + dropdown to pick the target state. */
function DraftStatusChanger({ onStatusChange }: { onStatusChange: (next: DocumentState | null) => void }) {
  const [isChanging, setIsChanging] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<DocumentState | "">("");

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-800">Cambiar estado</p>
          {!isChanging ? (
            <p className="mt-0.5 text-xs text-slate-500">Mantener como Borrador</p>
          ) : (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-slate-500">Pasar a:</span>
              <Select
                variant="sm"
                value={selectedStatus}
                onChange={(event) => {
                  const value = event.target.value as DocumentState | "";
                  setSelectedStatus(value);
                  onStatusChange(value || null);
                }}
              >
                <option value="">Seleccionar estado</option>
                <option value="PENDING_SIGNATURE">Pendiente de firma</option>
                <option value="ACTIVE">Activo</option>
              </Select>
            </div>
          )}
          {isChanging && selectedStatus && (
            <p className="mt-1.5 text-xs text-slate-400">El estado se actualizará al guardar.</p>
          )}
        </div>
        <StatusSwitch
          checked={isChanging}
          onChange={(next) => {
            setIsChanging(next);
            if (!next) {
              setSelectedStatus("");
              onStatusChange(null);
            }
          }}
        />
      </div>
    </div>
  );
}

export function ContractStatusChanger({ currentState, onStatusChange }: Props) {
  if (currentState === "PENDING_SIGNATURE") {
    return <SignedToggle onStatusChange={onStatusChange} />;
  }

  if (currentState === "DRAFT") {
    return <DraftStatusChanger onStatusChange={onStatusChange} />;
  }

  return null;
}

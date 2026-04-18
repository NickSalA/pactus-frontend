"use client";

import { useState } from "react";
import { Trash2, X } from "lucide-react";

type TableBulkActionBarProps = {
  isDeleting?: boolean;
  itemLabel?: string;
  onDelete: () => Promise<void>;
  onDeselectAll: () => void;
  onSelectAll?: () => void;
  selectedCount: number;
  totalCount?: number;
};

export function TableBulkActionBar({
  isDeleting = false,
  itemLabel = "elemento",
  onDelete,
  onDeselectAll,
  onSelectAll,
  selectedCount,
  totalCount,
}: TableBulkActionBarProps) {
  const [confirming, setConfirming] = useState(false);

  if (selectedCount === 0) return null;

  const plural = selectedCount !== 1;

  const handleConfirm = async () => {
    await onDelete();
    setConfirming(false);
  };

  return (
    <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm">
      {/* Left: deselect + count */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => { onDeselectAll(); setConfirming(false); }}
          className="rounded-lg p-1 text-blue-400 transition-colors hover:bg-blue-100 hover:text-blue-600"
          title="Deseleccionar todo"
        >
          <X className="h-4 w-4" />
        </button>
        <span className="font-medium text-blue-700">
          {selectedCount} {itemLabel}{plural ? "s" : ""} seleccionado{plural ? "s" : ""}
        </span>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {!confirming && onSelectAll && totalCount !== undefined && (
          <button
            type="button"
            onClick={selectedCount >= totalCount ? onDeselectAll : onSelectAll}
            className="rounded-lg border border-blue-300 bg-white px-3 py-1.5 font-medium text-blue-600 transition-colors hover:border-blue-400 hover:bg-blue-50"
          >
            {selectedCount >= totalCount ? "Deseleccionar todos" : `Seleccionar todos (${totalCount})`}
          </button>
        )}

        {confirming ? (
          <>
            <span className="text-blue-600">
              ¿Eliminar {selectedCount} {itemLabel}{plural ? "s" : ""}?
            </span>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={isDeleting}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => { void handleConfirm(); }}
              disabled={isDeleting}
              className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {isDeleting ? "Eliminando..." : "Confirmar"}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-red-600 transition-colors hover:border-red-300 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Eliminar seleccionados
          </button>
        )}
      </div>
    </div>
  );
}

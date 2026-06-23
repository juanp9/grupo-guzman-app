"use client";

import { useState } from "react";
import { eliminarPropiedad } from "@/lib/actions/propiedades";

export default function DeleteButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setLoading(true);
    const result = await eliminarPropiedad(id);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        {error && <p className="text-xs text-red-600">{error}</p>}
        <span className="text-sm text-slate-600">¿Confirmar eliminación?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-60 transition-colors"
        >
          {loading ? "Eliminando..." : "Sí, eliminar"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={loading}
          className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm rounded-lg hover:bg-slate-200 transition-colors"
        >
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
    >
      Eliminar
    </button>
  );
}

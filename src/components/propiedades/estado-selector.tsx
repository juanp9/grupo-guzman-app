"use client";

import { useState, useTransition } from "react";
import { cambiarEstado } from "@/lib/actions/propiedades";

const ESTADOS = [
  {
    val: "disponible" as const,
    label: "Disponible",
    active: "bg-green-100 text-green-800 ring-1 ring-green-400",
    idle: "bg-white text-slate-500 border-slate-200 hover:bg-green-50 hover:text-green-700",
  },
  {
    val: "reservado" as const,
    label: "Reservado",
    active: "bg-amber-100 text-amber-800 ring-1 ring-amber-400",
    idle: "bg-white text-slate-500 border-slate-200 hover:bg-amber-50 hover:text-amber-700",
  },
  {
    val: "vendido" as const,
    label: "Vendido",
    active: "bg-slate-200 text-slate-700 ring-1 ring-slate-400",
    idle: "bg-white text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-700",
  },
  {
    val: "rentado" as const,
    label: "Rentado",
    active: "bg-purple-100 text-purple-800 ring-1 ring-purple-400",
    idle: "bg-white text-slate-500 border-slate-200 hover:bg-purple-50 hover:text-purple-700",
  },
];

export default function EstadoSelector({
  id,
  estadoActual,
}: {
  id: string;
  estadoActual: string;
}) {
  const [estado, setEstado] = useState(estadoActual);
  const [isPending, startTransition] = useTransition();

  function handleChange(nuevo: typeof ESTADOS[number]["val"]) {
    if (nuevo === estado || isPending) return;
    setEstado(nuevo);
    startTransition(async () => { await cambiarEstado(id, nuevo); });
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</p>
      <div className="flex gap-1.5 flex-wrap">
        {ESTADOS.map(({ val, label, active, idle }) => (
          <button
            key={val}
            onClick={() => handleChange(val)}
            disabled={isPending}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all disabled:opacity-60 ${
              estado === val ? active : idle
            }`}
          >
            {label}
          </button>
        ))}
        {isPending && (
          <span className="text-xs text-slate-400 self-center">Guardando…</span>
        )}
      </div>
    </div>
  );
}

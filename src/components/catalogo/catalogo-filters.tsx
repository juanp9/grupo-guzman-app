"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect, useRef } from "react";

const TIPOS = [
  { value: "apartamento", label: "Apartamento" },
  { value: "casa", label: "Casa" },
  { value: "local_comercial", label: "Local comercial" },
  { value: "oficina", label: "Oficina" },
  { value: "bodega", label: "Bodega" },
  { value: "terreno", label: "Terreno" },
  { value: "lote", label: "Lote" },
  { value: "casa_campestre", label: "Casa campestre" },
  { value: "finca", label: "Finca" },
  { value: "edificio", label: "Edificio" },
  { value: "otro", label: "Otro" },
];

export default function CatalogoFilters({ total }: { total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const operacion = searchParams.get("operacion") ?? "";
  const tipo = searchParams.get("tipo") ?? "";

  function navigate(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    params.delete("pagina");
    const qs = params.toString();
    startTransition(() => router.push(qs ? `${pathname}?${qs}` : pathname));
  }

  const isFirst = useRef(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => navigate({ q }), 400);
    return () => { if (timer.current) clearTimeout(timer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const inputCls =
    "w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent bg-white";

  return (
    <div className={`space-y-3 transition-opacity ${isPending ? "opacity-60" : ""}`}>
      <div className="flex flex-col sm:flex-row gap-2">
        {/* búsqueda */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por título o ubicación..."
            className={`${inputCls} pl-9`}
          />
        </div>

        {/* operación */}
        <div className="flex gap-1.5 shrink-0">
          {[
            { val: "", label: "Todos" },
            { val: "renta", label: "Renta" },
            { val: "venta", label: "Venta" },
          ].map(({ val, label }) => (
            <button
              key={val}
              onClick={() => navigate({ operacion: val })}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                operacion === val
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* tipo de propiedad */}
        <select
          value={tipo}
          onChange={(e) => navigate({ tipo: e.target.value })}
          className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
        >
          <option value="">Tipo de propiedad</option>
          {TIPOS.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <p className="text-xs text-slate-500">
        {isPending
          ? "Buscando..."
          : total === 0
          ? "No encontramos propiedades disponibles con esos filtros"
          : `${total} ${total === 1 ? "propiedad disponible" : "propiedades disponibles"}`}
      </p>
    </div>
  );
}

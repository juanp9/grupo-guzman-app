"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect, useRef } from "react";

const TIPOS_PROPIEDAD = [
  { value: "apartamento", label: "Apartamento" },
  { value: "casa", label: "Casa" },
  { value: "local_comercial", label: "Local comercial" },
  { value: "oficina", label: "Oficina" },
  { value: "bodega", label: "Bodega" },
  { value: "terreno", label: "Terreno" },
  { value: "edificio", label: "Edificio" },
  { value: "otro", label: "Otro" },
];

const inputCls =
  "w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent bg-white";

export default function FiltersBar({ total }: { total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [panelOpen, setPanelOpen] = useState(false);

  // Text inputs use local state (debounced or blur-applied)
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [precioMin, setPrecioMin] = useState(searchParams.get("precio_min") ?? "");
  const [precioMax, setPrecioMax] = useState(searchParams.get("precio_max") ?? "");
  const [metrosMin, setMetrosMin] = useState(searchParams.get("metros_min") ?? "");
  const [metrosMax, setMetrosMax] = useState(searchParams.get("metros_max") ?? "");

  // Select / button filters read directly from the URL (source of truth)
  const orden = searchParams.get("orden") ?? "reciente";
  const operacion = searchParams.get("operacion") ?? "";
  const tipo = searchParams.get("tipo") ?? "";
  const estado = searchParams.get("estado") ?? "";

  // Build new URL preserving all current params + applying updates
  function navigate(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => {
      const val = v.trim();
      if (val && val !== "reciente") params.set(k, val);
      else params.delete(k);
    });
    params.delete("pagina"); // reset page on any filter change
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname);
    });
  }

  // Debounced text search — skip on first render to avoid redundant navigation
  const isFirstRender = useRef(true);
  const qTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (qTimer.current) clearTimeout(qTimer.current);
    qTimer.current = setTimeout(() => navigate({ q }), 400);
    return () => {
      if (qTimer.current) clearTimeout(qTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const activeCount = ["operacion", "tipo", "estado", "precio_min", "precio_max", "metros_min", "metros_max"]
    .filter((k) => searchParams.get(k)).length;

  function clearAll() {
    setQ(""); setPrecioMin(""); setPrecioMax(""); setMetrosMin(""); setMetrosMax("");
    startTransition(() => router.push(pathname));
  }

  return (
    <div className={`space-y-3 transition-opacity duration-150 ${isPending ? "opacity-60 pointer-events-none" : ""}`}>
      {/* ── Barra principal ── */}
      <div className="flex gap-2 flex-wrap sm:flex-nowrap">
        {/* Búsqueda */}
        <div className="relative flex-1 min-w-48">
          <svg
            className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por título, dirección o ubicación..."
            className={`${inputCls} pl-9`}
          />
        </div>

        {/* Orden */}
        <select
          value={orden}
          onChange={(e) => navigate({ orden: e.target.value })}
          className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
        >
          <option value="reciente">Más recientes</option>
          <option value="precio_asc">Precio ↑</option>
          <option value="precio_desc">Precio ↓</option>
          <option value="metros_asc">m² ↑</option>
          <option value="metros_desc">m² ↓</option>
        </select>

        {/* Toggle filtros */}
        <button
          onClick={() => setPanelOpen((v) => !v)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-medium transition-colors whitespace-nowrap ${
            panelOpen || activeCount > 0
              ? "bg-slate-900 text-white border-slate-900"
              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 4h18M7 8h10M11 12h2M9 16h6" />
          </svg>
          Filtros{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>
      </div>

      {/* ── Panel de filtros ── */}
      {panelOpen && (
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {/* Operación */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Operación
              </p>
              <div className="flex gap-1.5">
                {[
                  { val: "", label: "Todos" },
                  { val: "renta", label: "Renta" },
                  { val: "venta", label: "Venta" },
                ].map(({ val, label }) => (
                  <button
                    key={val}
                    onClick={() => navigate({ operacion: val })}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      operacion === val
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tipo de propiedad */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Tipo
              </p>
              <select
                value={tipo}
                onChange={(e) => navigate({ tipo: e.target.value })}
                className={inputCls}
              >
                <option value="">Todos los tipos</option>
                {TIPOS_PROPIEDAD.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Estado */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Estado
              </p>
              <select
                value={estado}
                onChange={(e) => navigate({ estado: e.target.value })}
                className={inputCls}
              >
                <option value="">Todos los estados</option>
                <option value="disponible">Disponible</option>
                <option value="reservado">Reservado</option>
                <option value="vendido">Vendido</option>
                <option value="rentado">Rentado</option>
              </select>
            </div>

            {/* Precio */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Precio (COP)
              </p>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={precioMin}
                  onChange={(e) => setPrecioMin(e.target.value)}
                  onBlur={() => navigate({ precio_min: precioMin })}
                  onKeyDown={(e) => e.key === "Enter" && navigate({ precio_min: precioMin })}
                  placeholder="Mínimo"
                  className={inputCls}
                  min={0}
                />
                <input
                  type="number"
                  value={precioMax}
                  onChange={(e) => setPrecioMax(e.target.value)}
                  onBlur={() => navigate({ precio_max: precioMax })}
                  onKeyDown={(e) => e.key === "Enter" && navigate({ precio_max: precioMax })}
                  placeholder="Máximo"
                  className={inputCls}
                  min={0}
                />
              </div>
            </div>

            {/* Metros cuadrados */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Metros cuadrados
              </p>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={metrosMin}
                  onChange={(e) => setMetrosMin(e.target.value)}
                  onBlur={() => navigate({ metros_min: metrosMin })}
                  onKeyDown={(e) => e.key === "Enter" && navigate({ metros_min: metrosMin })}
                  placeholder="Mínimo"
                  className={inputCls}
                  min={0}
                />
                <input
                  type="number"
                  value={metrosMax}
                  onChange={(e) => setMetrosMax(e.target.value)}
                  onBlur={() => navigate({ metros_max: metrosMax })}
                  onKeyDown={(e) => e.key === "Enter" && navigate({ metros_max: metrosMax })}
                  placeholder="Máximo"
                  className={inputCls}
                  min={0}
                />
              </div>
            </div>
          </div>

          {activeCount > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={clearAll}
                className="text-sm text-slate-500 hover:text-red-600 underline underline-offset-2 transition-colors"
              >
                Limpiar todos los filtros
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Contador de resultados ── */}
      <p className="text-xs text-slate-500">
        {isPending
          ? "Buscando..."
          : total === 0
          ? "Sin resultados para los filtros aplicados"
          : `${total} ${total === 1 ? "propiedad encontrada" : "propiedades encontradas"}`}
      </p>
    </div>
  );
}

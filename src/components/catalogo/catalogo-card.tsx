"use client";

import Link from "next/link";
import type { Propiedad } from "@/types";

const OPERACION_STYLE: Record<string, string> = {
  renta: "bg-blue-100 text-blue-700",
  venta: "bg-emerald-100 text-emerald-700",
};
const OPERACION_LABEL: Record<string, string> = { renta: "Renta", venta: "Venta" };

function formatPrecio(precio: number, moneda: string) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: moneda === "USD" ? "USD" : "COP",
    maximumFractionDigits: 0,
  }).format(precio);
}

export default function CatalogoCard({ p }: { p: Propiedad }) {
  const imagen = p.imagenes?.[0];

  return (
    <Link
      href={`/catalogo/${p.id}`}
      className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col"
    >
      {/* imagen */}
      <div className="relative h-48 bg-slate-100 shrink-0">
        {imagen ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagen}
            alt={p.titulo}
            className="w-full h-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
        )}
        {p.destacado && (
          <span className="absolute top-2 left-2 bg-amber-400 text-amber-900 text-xs font-semibold px-2 py-0.5 rounded-full">
            ★ Destacado
          </span>
        )}
      </div>

      {/* info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <span className={`self-start text-xs font-semibold px-2 py-0.5 rounded-full ${OPERACION_STYLE[p.tipo_operacion]}`}>
          {OPERACION_LABEL[p.tipo_operacion]}
        </span>

        <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-slate-600 transition-colors">
          {p.titulo}
        </h3>

        <p className="text-base font-bold text-slate-900">
          {formatPrecio(p.precio, p.moneda)}
          {p.tipo_operacion === "renta" && (
            <span className="text-xs font-normal text-slate-500 ml-1">/mes</span>
          )}
        </p>

        {/* ubicación general — sin dirección exacta */}
        <p className="text-xs text-slate-500 flex items-center gap-1">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {p.ubicacion}
        </p>

        <div className="flex items-center gap-3 text-xs text-slate-500 mt-auto pt-1 border-t border-slate-100">
          <span>{p.metros_cuadrados} m²</span>
          {p.habitaciones != null && <span>🛏 {p.habitaciones}</span>}
          {p.banos != null && <span>🚿 {p.banos}</span>}
          {p.parqueaderos != null && <span>🚗 {p.parqueaderos}</span>}
        </div>
      </div>
    </Link>
  );
}

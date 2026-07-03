import Link from "next/link";
import { notFound } from "next/navigation";
import { getPropiedad } from "@/lib/actions/propiedades";

const TIPO_OPERACION: Record<string, string> = { renta: "Renta", venta: "Venta" };
const TIPO_PROPIEDAD: Record<string, string> = {
  casa: "Casa", apartamento: "Apartamento", local_comercial: "Local comercial",
  oficina: "Oficina", bodega: "Bodega", terreno: "Terreno", lote: "Lote",
  casa_campestre: "Casa campestre", finca: "Finca", edificio: "Edificio", otro: "Otro",
};
const OPERACION_STYLE: Record<string, string> = {
  renta: "bg-blue-100 text-blue-700",
  venta: "bg-emerald-100 text-emerald-700",
};

function formatPrecio(precio: number, moneda: string) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: moneda === "USD" ? "USD" : "COP",
    maximumFractionDigits: 0,
  }).format(precio);
}

export default async function CatalogoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await getPropiedad(id);
  if (!p) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/catalogo"
        className="text-sm text-slate-500 hover:text-slate-900 transition-colors mb-6 inline-block"
      >
        ← Ver más propiedades
      </Link>

      {/* galería */}
      {p.imagenes?.length > 0 && (
        <div className="flex gap-3 overflow-x-auto pb-2 mb-6 snap-x">
          {p.imagenes.map((url, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={url}
              alt={`Imagen ${i + 1} de ${p.titulo}`}
              className="h-72 w-auto max-w-sm rounded-xl object-cover shrink-0 snap-start border border-slate-200"
            />
          ))}
        </div>
      )}

      {/* contenido */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
        <div className="flex gap-2 mb-4 flex-wrap">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${OPERACION_STYLE[p.tipo_operacion]}`}>
            {TIPO_OPERACION[p.tipo_operacion]}
          </span>
          {p.destacado && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
              ★ Destacado
            </span>
          )}
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-1">{p.titulo}</h1>

        {/* ubicación general — sin dirección exacta */}
        <p className="text-slate-500 text-sm mb-4 flex items-center gap-1.5">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {TIPO_PROPIEDAD[p.tipo_propiedad]} · {p.ubicacion}
        </p>

        <p className="text-3xl font-bold text-slate-900 mb-6">
          {formatPrecio(p.precio, p.moneda)}
          {p.tipo_operacion === "renta" && (
            <span className="text-base font-normal text-slate-500 ml-1">/mes</span>
          )}
        </p>

        {/* características — sin dirección */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <DataItem label="Metros cuadrados" value={`${p.metros_cuadrados} m²`} />
          {p.habitaciones != null && <DataItem label="Habitaciones" value={String(p.habitaciones)} />}
          {p.banos != null && <DataItem label="Baños" value={String(p.banos)} />}
          {p.parqueaderos != null && <DataItem label="Parqueaderos" value={String(p.parqueaderos)} />}
        </div>

        {p.descripcion && (
          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Descripción
            </h2>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
              {p.descripcion}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function DataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <p className="text-xs text-slate-500 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { getPropiedad } from "@/lib/actions/propiedades";
import DeleteButton from "@/components/propiedades/delete-button";
import ShareButton from "@/components/propiedades/share-button";
import EstadoSelector from "@/components/propiedades/estado-selector";
import GaleriaImagenes from "@/components/propiedades/galeria-imagenes";

const TIPO_OPERACION: Record<string, string> = { renta: "Renta", venta: "Venta" };
const TIPO_PROPIEDAD: Record<string, string> = {
  casa: "Casa", apartamento: "Apartamento", local_comercial: "Local comercial",
  oficina: "Oficina", bodega: "Bodega", terreno: "Terreno", lote: "Lote",
  casa_campestre: "Casa campestre", finca: "Finca", edificio: "Edificio", otro: "Otro",
};
const ESTADO_LABEL: Record<string, string> = {
  disponible: "Disponible", reservado: "Reservado", vendido: "Vendido", rentado: "Rentado",
};
const ESTADO_STYLE: Record<string, string> = {
  disponible: "bg-green-100 text-green-700",
  reservado: "bg-amber-100 text-amber-700",
  vendido: "bg-slate-100 text-slate-500",
  rentado: "bg-purple-100 text-purple-700",
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

export default async function DetallePropiedadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = await getPropiedad(id);
  if (!p) notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* breadcrumb + acciones */}
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <Link href="/propiedades" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
          ← Volver al listado
        </Link>
        <div className="flex items-center gap-2 flex-wrap">
          <ShareButton id={p.id} />
          <Link
            href={`/propiedades/${p.id}/editar`}
            className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
          >
            Editar
          </Link>
          <DeleteButton id={p.id} />
        </div>
      </div>

      {/* galería */}
      <GaleriaImagenes imagenes={p.imagenes ?? []} titulo={p.titulo} />

      {/* contenido */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
        {/* header */}
        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div className="flex gap-2 flex-wrap">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${OPERACION_STYLE[p.tipo_operacion]}`}>
              {TIPO_OPERACION[p.tipo_operacion]}
            </span>
            {p.destacado && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                ★ Destacado
              </span>
            )}
          </div>
          {/* Cambio de estado rápido */}
          <EstadoSelector id={p.id} estadoActual={p.estado} />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-1">{p.titulo}</h1>
        <p className="text-slate-500 text-sm mb-4">
          {TIPO_PROPIEDAD[p.tipo_propiedad]} · {p.ubicacion}
        </p>
        <p className="text-3xl font-bold text-slate-900 mb-6">
          {formatPrecio(p.precio, p.moneda)}
          {p.tipo_operacion === "renta" && (
            <span className="text-base font-normal text-slate-500 ml-1">/mes</span>
          )}
        </p>

        {/* grid de datos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <DataItem label="Dirección" value={p.direccion} />
          <DataItem label="Metros cuadrados" value={`${p.metros_cuadrados} m²`} />
          {p.habitaciones != null && <DataItem label="Habitaciones" value={String(p.habitaciones)} />}
          {p.banos != null && <DataItem label="Baños" value={String(p.banos)} />}
          {p.parqueaderos != null && <DataItem label="Parqueaderos" value={String(p.parqueaderos)} />}
          <DataItem label="Moneda" value={p.moneda} />
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

        <p className="text-xs text-slate-400 mt-6 border-t border-slate-100 pt-4">
          Creado el {new Date(p.creado_en).toLocaleDateString("es-CO", { dateStyle: "long" })}
          {p.actualizado_en !== p.creado_en &&
            ` · Actualizado el ${new Date(p.actualizado_en).toLocaleDateString("es-CO", { dateStyle: "long" })}`}
        </p>
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

import { Suspense } from "react";
import Link from "next/link";
import { getPropiedades } from "@/lib/actions/propiedades";
import { PAGE_SIZE } from "@/lib/constants";
import PropiedadCard from "@/components/propiedades/propiedad-card";
import FiltersBar from "@/components/propiedades/filters-bar";
import Pagination from "@/components/ui/pagination";

export default async function PropiedadesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const { propiedades, total } = await getPropiedades(params);
  const currentPage = Math.max(1, parseInt(params.pagina ?? "1", 10));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Propiedades</h1>
        <Link
          href="/propiedades/nueva"
          className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
        >
          + Nueva propiedad
        </Link>
      </div>

      {/* filtros — Suspense requerido por useSearchParams en FiltersBar */}
      <div className="mb-6">
        <Suspense>
          <FiltersBar total={total} />
        </Suspense>
      </div>

      {/* grid */}
      {propiedades.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-400 text-lg mb-2">Sin resultados</p>
          <p className="text-slate-400 text-sm">
            Intenta con otros filtros o términos de búsqueda
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {propiedades.map((p) => (
              <PropiedadCard key={p.id} p={p} />
            ))}
          </div>
          <Pagination
            total={total}
            pageSize={PAGE_SIZE}
            currentPage={currentPage}
            searchParams={params}
          />
        </>
      )}
    </div>
  );
}

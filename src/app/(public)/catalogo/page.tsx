import { Suspense } from "react";
import { getPropiedades } from "@/lib/actions/propiedades";
import { PAGE_SIZE } from "@/lib/constants";
import CatalogoCard from "@/components/catalogo/catalogo-card";
import CatalogoFilters from "@/components/catalogo/catalogo-filters";
import Pagination from "@/components/ui/pagination";

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;

  // El catálogo público SIEMPRE muestra solo propiedades disponibles.
  // Forzamos estado=disponible independientemente de lo que venga en la URL.
  const { propiedades, total } = await getPropiedades({
    ...params,
    estado: "disponible",
  });

  const currentPage = Math.max(1, parseInt(params.pagina ?? "1", 10));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Propiedades disponibles</h1>
        <p className="text-sm text-slate-500 mt-1">
          Encuentra la propiedad ideal para ti
        </p>
      </div>

      <div className="mb-6">
        <Suspense>
          <CatalogoFilters total={total} />
        </Suspense>
      </div>

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
              <CatalogoCard key={p.id} p={p} />
            ))}
          </div>
          <Pagination
            total={total}
            pageSize={PAGE_SIZE}
            currentPage={currentPage}
            searchParams={{ ...params, estado: "disponible" }}
          />
        </>
      )}
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { getPropiedad } from "@/lib/actions/propiedades";
import PropiedadForm from "@/components/propiedades/propiedad-form";

export default async function EditarPropiedadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const propiedad = await getPropiedad(id);
  if (!propiedad) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <Link
          href={`/propiedades/${id}`}
          className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          ← Volver al detalle
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">Editar propiedad</h1>
        <p className="text-sm text-slate-500 mt-0.5">{propiedad.titulo}</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
        <PropiedadForm propiedad={propiedad} />
      </div>
    </div>
  );
}

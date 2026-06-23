import Link from "next/link";
import PropiedadForm from "@/components/propiedades/propiedad-form";

export default function NuevaPropiedadPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <Link
          href="/propiedades"
          className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          ← Volver al listado
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mt-2">Nueva propiedad</h1>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
        <PropiedadForm />
      </div>
    </div>
  );
}

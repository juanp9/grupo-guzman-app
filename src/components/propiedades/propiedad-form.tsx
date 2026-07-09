"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propiedadSchema, type PropiedadFormData } from "@/lib/schemas/propiedad";
import { crearPropiedad, actualizarPropiedad } from "@/lib/actions/propiedades";
import ImageUploader from "@/components/propiedades/image-uploader";
import type { Propiedad } from "@/types";

// ── helpers ──────────────────────────────────────────────────────────────────

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition disabled:opacity-60";

const selectCls = inputCls + " cursor-pointer";

// ── component ─────────────────────────────────────────────────────────────────

export default function PropiedadForm({
  propiedad,
}: {
  propiedad?: Propiedad | null;
}) {
  const isEditing = !!propiedad;

  const [imageUrls, setImageUrls] = useState<string[]>(
    propiedad?.imagenes?.length ? propiedad.imagenes : []
  );
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PropiedadFormData>({
    resolver: zodResolver(propiedadSchema) as Resolver<PropiedadFormData>,
    defaultValues: propiedad
      ? {
          titulo: propiedad.titulo,
          tipo_operacion: propiedad.tipo_operacion || "venta",
          tipo_propiedad: propiedad.tipo_propiedad || "apartamento",
          ubicacion: propiedad.ubicacion,
          direccion: propiedad.direccion,
          metros_cuadrados: propiedad.metros_cuadrados,
          precio: propiedad.precio,
          moneda: propiedad.moneda,
          habitaciones: propiedad.habitaciones ?? undefined,
          banos: propiedad.banos ?? undefined,
          parqueaderos: propiedad.parqueaderos ?? undefined,
          descripcion: propiedad.descripcion ?? "",
          estado: propiedad.estado || "disponible",
          destacado: propiedad.destacado,
        }
      : {
          tipo_operacion: "venta",
          tipo_propiedad: "apartamento",
          moneda: "COP",
          estado: "disponible",
          destacado: false,
        },
  });

  async function onSubmit(data: PropiedadFormData) {
    setServerError(null);
    const payload = {
      ...data,
      imagenes: imageUrls.filter(Boolean),
    };

    const result = isEditing
      ? await actualizarPropiedad(propiedad.id, payload)
      : await crearPropiedad(payload);

    if (result?.error) setServerError(result.error);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {serverError}
        </div>
      )}

      {/* ── Información básica ── */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
          Información básica
        </h2>
        <Field label="Título" error={errors.titulo?.message} required>
          <input
            {...register("titulo")}
            className={inputCls}
            placeholder="Ej. Apartamento moderno en El Poblado"
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Tipo de operación" error={errors.tipo_operacion?.message} required>
            <select {...register("tipo_operacion")} className={selectCls}>
              <option value="venta">Venta</option>
              <option value="renta">Renta</option>
            </select>
          </Field>

          <Field label="Tipo de propiedad" error={errors.tipo_propiedad?.message} required>
            <select {...register("tipo_propiedad")} className={selectCls}>
              <option value="apartamento">Apartamento</option>
              <option value="casa">Casa</option>
              <option value="local_comercial">Local comercial</option>
              <option value="oficina">Oficina</option>
              <option value="bodega">Bodega</option>
              <option value="terreno">Terreno</option>
              <option value="lote">Lote</option>
              <option value="casa_campestre">Casa campestre</option>
              <option value="finca">Finca</option>
              <option value="edificio">Edificio</option>
              <option value="otro">Otro</option>
            </select>
          </Field>
        </div>
      </section>

      {/* ── Ubicación ── */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
          Ubicación
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Ciudad / Zona / Barrio" error={errors.ubicacion?.message} required>
            <input
              {...register("ubicacion")}
              className={inputCls}
              placeholder="Ej. El Poblado, Medellín"
            />
          </Field>
          <Field label="Dirección completa" error={errors.direccion?.message} required>
            <input
              {...register("direccion")}
              className={inputCls}
              placeholder="Ej. Calle 10 # 43-12 Apto 301"
            />
          </Field>
        </div>
      </section>

      {/* ── Características ── */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
          Características
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Field label="Precio" error={errors.precio?.message} required>
            <input
              {...register("precio")}
              type="number"
              min={0}
              className={inputCls}
              placeholder="0"
            />
          </Field>
          <Field label="Moneda" error={errors.moneda?.message}>
            <select {...register("moneda")} className={selectCls}>
              <option value="COP">COP</option>
              <option value="USD">USD</option>
            </select>
          </Field>
          <Field label="Metros cuadrados" error={errors.metros_cuadrados?.message} required>
            <input
              {...register("metros_cuadrados")}
              type="number"
              min={0}
              step="0.01"
              className={inputCls}
              placeholder="0"
            />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Habitaciones" error={errors.habitaciones?.message}>
            <input
              {...register("habitaciones")}
              type="number"
              min={0}
              className={inputCls}
              placeholder="—"
            />
          </Field>
          <Field label="Baños" error={errors.banos?.message}>
            <input
              {...register("banos")}
              type="number"
              min={0}
              className={inputCls}
              placeholder="—"
            />
          </Field>
          <Field label="Parqueaderos" error={errors.parqueaderos?.message}>
            <input
              {...register("parqueaderos")}
              type="number"
              min={0}
              className={inputCls}
              placeholder="—"
            />
          </Field>
        </div>
      </section>

      {/* ── Estado ── */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
          Estado y visibilidad
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <Field label="Estado" error={errors.estado?.message}>
            <select {...register("estado")} className={selectCls}>
              <option value="disponible">Disponible</option>
              <option value="reservado">Reservado</option>
              <option value="vendido">Vendido</option>
              <option value="rentado">Rentado</option>
            </select>
          </Field>
          <div className="flex items-center gap-2 pt-6">
            <input
              {...register("destacado")}
              id="destacado"
              type="checkbox"
              className="w-4 h-4 accent-slate-900 cursor-pointer"
            />
            <label htmlFor="destacado" className="text-sm text-slate-700 cursor-pointer">
              Marcar como destacado
            </label>
          </div>
        </div>
      </section>

      {/* ── Descripción ── */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
          Descripción
        </h2>
        <textarea
          {...register("descripcion")}
          rows={4}
          className={inputCls + " resize-none"}
          placeholder="Describe la propiedad: características, estado, amenidades, etc."
        />
      </section>

      {/* ── Imágenes ── */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
          Imágenes
        </h2>
        <ImageUploader value={imageUrls} onChange={setImageUrls} />
      </section>

      {/* ── Submit ── */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2 border-t border-slate-100">
        <a
          href={isEditing ? `/propiedades/${propiedad.id}` : "/propiedades"}
          className="w-full sm:w-auto text-center px-6 py-2.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
        >
          Cancelar
        </a>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting
            ? "Guardando..."
            : isEditing
            ? "Guardar cambios"
            : "Crear propiedad"}
        </button>
      </div>
    </form>
  );
}

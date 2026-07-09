"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import { propiedadSchema } from "@/lib/schemas/propiedad";
import type { Propiedad } from "@/types";
import { PAGE_SIZE } from "@/lib/constants";

export async function getPropiedades(
  params: Record<string, string> = {}
): Promise<{ propiedades: Propiedad[]; total: number }> {
  const pagina = Math.max(1, parseInt(params.pagina ?? "1", 10));
  const from = (pagina - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabaseAdmin
    .from("propiedades")
    .select("*", { count: "exact" });

  if (params.q?.trim()) {
    const q = params.q.trim();
    query = query.or(
      `titulo.ilike.%${q}%,ubicacion.ilike.%${q}%,direccion.ilike.%${q}%`
    );
  }
  if (params.operacion) query = query.eq("tipo_operacion", params.operacion);
  if (params.tipo) query = query.eq("tipo_propiedad", params.tipo);
  if (params.estado) query = query.eq("estado", params.estado);
  if (params.precio_min) query = query.gte("precio", Number(params.precio_min));
  if (params.precio_max) query = query.lte("precio", Number(params.precio_max));
  if (params.metros_min) query = query.gte("metros_cuadrados", Number(params.metros_min));
  if (params.metros_max) query = query.lte("metros_cuadrados", Number(params.metros_max));

  switch (params.orden) {
    case "precio_asc":
      query = query.order("precio", { ascending: true });
      break;
    case "precio_desc":
      query = query.order("precio", { ascending: false });
      break;
    case "metros_asc":
      query = query.order("metros_cuadrados", { ascending: true });
      break;
    case "metros_desc":
      query = query.order("metros_cuadrados", { ascending: false });
      break;
    default:
      query = query.order("creado_en", { ascending: false });
  }

  const { data, count, error } = await query.range(from, to);
  if (error) throw new Error(error.message);
  return { propiedades: (data ?? []) as Propiedad[], total: count ?? 0 };
}

export async function getPropiedad(id: string): Promise<Propiedad | null> {
  const { data, error } = await supabaseAdmin
    .from("propiedades")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Propiedad;
}

export async function crearPropiedad(payload: unknown) {
  const parsed = propiedadSchema.safeParse(payload);
  if (!parsed.success) {
    const errors = parsed.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(", ");
    console.error("Validación fallida:", errors);
    return { error: errors || "Revisa los campos requeridos." };
  }

  const dataToInsert = {
    ...parsed.data,
    tipo_operacion: (parsed.data.tipo_operacion as string)?.toLowerCase().trim() || parsed.data.tipo_operacion,
    tipo_propiedad: (parsed.data.tipo_propiedad as string)?.toLowerCase().trim() || parsed.data.tipo_propiedad,
  };

  console.log("=== INSERTANDO PROPIEDAD ===");
  console.log("tipo_propiedad:", dataToInsert.tipo_propiedad);
  console.log("tipo_operacion:", dataToInsert.tipo_operacion);

  const { data, error } = await supabaseAdmin
    .from("propiedades")
    .insert(dataToInsert)
    .select("id")
    .single();

  if (error) {
    console.error("=== ERROR DE SUPABASE ===");
    console.error("Código:", error.code);
    console.error("Mensaje:", error.message);
    return { error: `${error.message}${error.hint ? ` - ${error.hint}` : ""}` };
  }

  console.log("=== PROPIEDAD INSERTADA EXITOSAMENTE ===");
  console.log("ID:", data.id);

  revalidatePath("/propiedades");
  redirect(`/propiedades/${data.id}`);
}

export async function actualizarPropiedad(id: string, payload: unknown) {
  const parsed = propiedadSchema.safeParse(payload);
  if (!parsed.success) {
    const errors = parsed.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(", ");
    return { error: errors || "Revisa los campos requeridos." };
  }

  const dataToUpdate = {
    ...parsed.data,
    tipo_operacion: parsed.data.tipo_operacion?.trim() || parsed.data.tipo_operacion,
    tipo_propiedad: parsed.data.tipo_propiedad?.trim() || parsed.data.tipo_propiedad,
  };

  const { error } = await supabaseAdmin
    .from("propiedades")
    .update(dataToUpdate)
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/propiedades");
  revalidatePath(`/propiedades/${id}`);
  redirect(`/propiedades/${id}`);
}

export async function cambiarEstado(
  id: string,
  estado: "disponible" | "reservado" | "vendido" | "rentado"
) {
  const { error } = await supabaseAdmin
    .from("propiedades")
    .update({ estado })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/propiedades");
  revalidatePath(`/propiedades/${id}`);
  // El catálogo público muestra solo disponibles — forzar revalidación
  revalidatePath("/catalogo");
  revalidatePath(`/catalogo/${id}`);
}

export async function eliminarPropiedad(id: string) {
  const { error } = await supabaseAdmin
    .from("propiedades")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/propiedades");
  redirect("/propiedades");
}

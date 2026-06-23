"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export async function subirImagen(
  formData: FormData
): Promise<{ url: string } | { error: string }> {
  const file = formData.get("file") as File;

  if (!file || file.size === 0) return { error: "No se seleccionó ningún archivo." };
  if (file.size > 5 * 1024 * 1024) return { error: "El archivo supera los 5 MB." };
  if (!file.type.startsWith("image/")) return { error: "Solo se permiten imágenes." };

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from("propiedades")
    .upload(path, await file.arrayBuffer(), {
      contentType: file.type,
      upsert: false,
    });

  if (error) return { error: error.message };

  const { data } = supabaseAdmin.storage
    .from("propiedades")
    .getPublicUrl(path);

  return { url: data.publicUrl };
}

export async function eliminarImagenStorage(url: string): Promise<void> {
  const marker = "/object/public/propiedades/";
  const idx = url.indexOf(marker);
  if (idx === -1) return;
  const path = decodeURIComponent(url.slice(idx + marker.length));
  await supabaseAdmin.storage.from("propiedades").remove([path]);
}

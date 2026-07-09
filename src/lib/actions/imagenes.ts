"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export async function subirImagen(
  formData: FormData
): Promise<{ url: string } | { error: string }> {
  try {
    const file = formData.get("file") as File;

    console.log("📸 Iniciando carga de imagen:", {
      nombre: file?.name,
      tipo: file?.type,
      tamaño: file?.size,
    });

    if (!file || file.size === 0) {
      console.error("❌ Archivo no válido:", file);
      return { error: "No se seleccionó ningún archivo." };
    }

    if (file.size > 5 * 1024 * 1024) {
      console.error("❌ Archivo muy grande:", file.size);
      return { error: "El archivo supera los 5 MB." };
    }

    const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const allowedExtensions = ["jpg", "jpeg", "png", "webp", "gif"];
    
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const isMimeValid = allowedMimes.includes(file.type);
    const isExtValid = allowedExtensions.includes(ext);
    
    console.log("🔍 Validación:", { ext, isMimeValid, isExtValid, mimeType: file.type });

    if (!isMimeValid && !isExtValid) {
      console.error("❌ Formato no permitido:", { ext, type: file.type });
      return { error: `Formato no permitido. Usa JPG, PNG, WebP o GIF.` };
    }

    const path = `${crypto.randomUUID()}.${ext || "jpg"}`;
    const contentType = file.type || "image/jpeg";

    console.log("📤 Subiendo a Supabase:", { path, contentType });

    const { error } = await supabaseAdmin.storage
      .from("propiedades")
      .upload(path, await file.arrayBuffer(), {
        contentType,
        upsert: false,
      });

    if (error) {
      console.error("❌ Error de Supabase:", error);
      return { error: error.message };
    }

    const { data } = supabaseAdmin.storage
      .from("propiedades")
      .getPublicUrl(path);

    console.log("✅ Imagen subida exitosamente:", data.publicUrl);
    return { url: data.publicUrl };
  } catch (err) {
    console.error("❌ Error inesperado:", err);
    return { error: `Error: ${err instanceof Error ? err.message : "desconocido"}` };
  }
}

export async function eliminarImagenStorage(url: string): Promise<void> {
  const marker = "/object/public/propiedades/";
  const idx = url.indexOf(marker);
  if (idx === -1) return;
  const path = decodeURIComponent(url.slice(idx + marker.length));
  await supabaseAdmin.storage.from("propiedades").remove([path]);
}

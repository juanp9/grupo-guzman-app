"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export async function subirImagen(
  formData: FormData
): Promise<{ url: string } | { error: string }> {
  try {
    const file = formData.get("file") as File | null;

    console.log("📸 Iniciando carga de imagen:", {
      nombre: file?.name,
      tipo: file?.type,
      tamaño: file?.size,
    });

    if (!file) {
      console.error("❌ Archivo no encontrado en FormData");
      return { error: "Archivo no válido." };
    }

    if (file.size === 0) {
      console.error("❌ Archivo vacío:", file.name);
      return { error: "El archivo está vacío." };
    }

    if (file.size > 5 * 1024 * 1024) {
      console.error("❌ Archivo muy grande:", file.size, "bytes");
      return { error: "El archivo supera los 5 MB." };
    }

    const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const allowedExtensions = ["jpg", "jpeg", "png", "webp", "gif"];
    
    const nameWithExt = file.name || "imagen.jpg";
    const ext = nameWithExt.split(".").pop()?.toLowerCase() ?? "";
    const isMimeValid = allowedMimes.includes(file.type);
    const isExtValid = allowedExtensions.includes(ext);
    
    console.log("🔍 Validación:", { ext, isMimeValid, isExtValid, mimeType: file.type });

    if (!isMimeValid && !isExtValid) {
      console.error("❌ Formato no permitido:", { ext, type: file.type });
      return { error: `Formato no permitido (${ext}). Usa JPG, PNG, WebP o GIF.` };
    }

    const finalPath = `${crypto.randomUUID()}.${ext || "jpg"}`;
    const contentType = file.type || "image/jpeg";

    console.log("📤 Subiendo a Supabase:", { path: finalPath, contentType, size: file.size });

    const arrayBuffer = await file.arrayBuffer();
    console.log("✅ Archivo convertido a ArrayBuffer:", arrayBuffer.byteLength, "bytes");

    const { error: uploadError } = await supabaseAdmin.storage
      .from("propiedades")
      .upload(finalPath, arrayBuffer, {
        contentType,
        upsert: false,
      });

    if (uploadError) {
      console.error("❌ Error de Supabase al subir:", {
        message: uploadError.message,
        status: (uploadError as any).status,
      });
      return { error: `Error al subir: ${uploadError.message}` };
    }

    console.log("✅ Archivo subido a Supabase");

    const { data } = supabaseAdmin.storage
      .from("propiedades")
      .getPublicUrl(finalPath);

    if (!data?.publicUrl) {
      console.error("❌ No se pudo obtener URL pública");
      return { error: "Error al obtener URL de la imagen." };
    }

    console.log("✅ Imagen subida exitosamente:", data.publicUrl);
    return { url: data.publicUrl };
  } catch (err) {
    console.error("❌ Error inesperado en subirImagen:", err);
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { error: `Error: ${errorMsg}` };
  }
}

export async function eliminarImagenStorage(url: string): Promise<void> {
  const marker = "/object/public/propiedades/";
  const idx = url.indexOf(marker);
  if (idx === -1) return;
  const path = decodeURIComponent(url.slice(idx + marker.length));
  await supabaseAdmin.storage.from("propiedades").remove([path]);
}

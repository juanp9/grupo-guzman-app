import { supabaseAdmin } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

function sanitizeFileName(fileName: string): string {
  return fileName
    .toLowerCase()
    .replace(/[^\w.-]/g, "_")
    .replace(/_{2,}/g, "_")
    .replace(/^_+|_+$/g, "");
}

export async function POST(request: NextRequest) {
  try {
    console.log("📸 [API] Iniciando carga de imagen...");

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      console.error("❌ [API] Archivo no encontrado");
      return NextResponse.json(
        { error: "Archivo no válido." },
        { status: 400 }
      );
    }

    console.log("📸 [API] Archivo recibido:", {
      nombre: file.name,
      tipo: file.type,
      tamaño: file.size,
    });

    if (file.size === 0) {
      return NextResponse.json({ error: "El archivo está vacío." }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "El archivo supera los 5 MB." },
        { status: 413 }
      );
    }

    const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const allowedExtensions = ["jpg", "jpeg", "png", "webp", "gif"];

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const isMimeValid = allowedMimes.includes(file.type);
    const isExtValid = allowedExtensions.includes(ext);

    console.log("🔍 [API] Validación:", { ext, isMimeValid, isExtValid });

    if (!isMimeValid && !isExtValid) {
      return NextResponse.json(
        { error: `Formato no permitido (${ext}). Usa JPG, PNG, WebP o GIF.` },
        { status: 400 }
      );
    }

    const sanitizedName = sanitizeFileName(file.name.replace(/\.[^/.]+$/, ""));
    const path = `${sanitizedName}_${crypto.randomUUID()}.${ext || "jpg"}`;
    const contentType = file.type || "image/jpeg";

    console.log("📤 [API] Subiendo a Supabase:", { path, contentType, originalName: file.name });

    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabaseAdmin.storage
      .from("propiedades")
      .upload(path, arrayBuffer, {
        contentType,
        upsert: false,
      });

    if (uploadError) {
      console.error("❌ [API] Error de Supabase:", uploadError);
      return NextResponse.json(
        { error: `Error al subir: ${uploadError.message}` },
        { status: 500 }
      );
    }

    const { data } = supabaseAdmin.storage
      .from("propiedades")
      .getPublicUrl(path);

    if (!data?.publicUrl) {
      console.error("❌ [API] No se pudo obtener URL pública");
      return NextResponse.json(
        { error: "Error al obtener URL de la imagen." },
        { status: 500 }
      );
    }

    console.log("✅ [API] Imagen subida:", data.publicUrl);
    return NextResponse.json({ url: data.publicUrl }, { status: 200 });
  } catch (err) {
    console.error("❌ [API] Error inesperado:", err);
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Error del servidor: ${errorMsg}` },
      { status: 500 }
    );
  }
}

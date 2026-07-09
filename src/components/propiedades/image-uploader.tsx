"use client";

import { useRef, useState } from "react";
import { subirImagen, eliminarImagenStorage } from "@/lib/actions/imagenes";

export default function ImageUploader({
  value,
  onChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  async function handleFiles(files: FileList) {
    if (files.length === 0) return;
    setUploading(true);
    setError(null);

    try {
      const results = await Promise.all(
        Array.from(files).map(async (file) => {
          console.log("Procesando archivo:", file.name, file.type, file.size);
          const fd = new FormData();
          fd.append("file", file);
          
          try {
            const response = await fetch("/api/upload-image", {
              method: "POST",
              body: fd,
            });

            if (!response.ok) {
              const errorData = await response.json();
              return { error: errorData.error || `Error ${response.status}` };
            }

            const data = await response.json();
            return { url: data.url };
          } catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err);
            return { error: `Error de red: ${errorMsg}` };
          }
        })
      );

      const errors = results.filter((r): r is { error: string } => "error" in r);
      const urls = results
        .filter((r): r is { url: string } => "url" in r)
        .map((r) => r.url);

      if (errors.length > 0) {
        const errorMsg = errors.map((e) => e.error).join(" · ");
        console.error("Errores en carga:", errorMsg);
        setError(errorMsg);
      }
      if (urls.length > 0) onChange([...value, ...urls]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error("Error fatal al cargar imágenes:", err);
      setError(`Error: ${errorMsg}`);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function removeImage(index: number) {
    const url = value[index];
    onChange(value.filter((_, i) => i !== index));
    // Borrar del storage en background (no bloqueamos la UI)
    eliminarImagenStorage(url).catch(() => undefined);
  }

  return (
    <div className="space-y-4">
      {/* ── Grid de imágenes subidas ── */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {value.map((url, i) => (
            <div key={url} className="relative group aspect-video">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Imagen ${i + 1}`}
                className="w-full h-full object-cover rounded-xl border border-slate-200"
              />
              {/* overlay con botón de borrar */}
              <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                >
                  Quitar
                </button>
              </div>
              {/* número */}
              <span className="absolute top-1.5 left-1.5 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded-md">
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── Zona de carga ── */}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (!uploading) handleFiles(e.dataTransfer.files);
        }}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer select-none ${
          dragOver
            ? "border-slate-900 bg-slate-50"
            : uploading
            ? "border-slate-200 bg-slate-50 cursor-not-allowed"
            : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <svg
              className="w-6 h-6 text-slate-400 animate-spin"
              fill="none" viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
            </svg>
            <p className="text-sm text-slate-500">Subiendo imágenes…</p>
          </div>
        ) : (
          <>
            <svg
              className="w-8 h-8 text-slate-300 mx-auto mb-3"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm font-medium text-slate-700">
              {dragOver ? "Suelta las imágenes aquí" : "Arrastra imágenes o haz clic para seleccionar"}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              JPG, PNG, WebP · máx. 5 MB por imagen · puedes subir varias a la vez
            </p>
          </>
        )}
      </div>

      {/* ── Error ── */}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
    </div>
  );
}

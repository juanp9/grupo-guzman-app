"use client";

import { useState } from "react";
import ImageLightbox from "@/components/propiedades/image-lightbox";

interface GaleriaImagenesProps {
  imagenes: string[];
  titulo: string;
}

export default function GaleriaImagenes({ imagenes, titulo }: GaleriaImagenesProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!imagenes?.length) return null;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      {/* Galería en miniatura */}
      <div className="flex gap-3 overflow-x-auto pb-2 mb-6 snap-x">
        {imagenes.map((url, i) => (
          <button
            key={i}
            onClick={() => openLightbox(i)}
            className="h-64 w-auto max-w-sm rounded-xl object-cover shrink-0 snap-start border border-slate-200 hover:border-slate-400 transition-all hover:shadow-md active:scale-95 cursor-pointer overflow-hidden flex-shrink-0"
            aria-label={`Abrir imagen ${i + 1} en pantalla completa`}
            type="button"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`Imagen ${i + 1} de ${titulo}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <ImageLightbox
        images={imagenes}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}

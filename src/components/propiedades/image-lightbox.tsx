"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

interface ImageLightboxProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageLightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setZoom(1);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setZoom(1);
  };

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.max(1, Math.min(5, prev + delta)));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
    if (e.key === "Escape") onClose();
    if (e.key === "+") handleZoom(0.2);
    if (e.key === "-") handleZoom(-0.2);
  };

  const content = (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-label="Visor de imágenes en pantalla completa"
      tabIndex={0}
    >
      <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        {/* Imagen principal */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentImage}
            alt={`Imagen ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain transition-transform duration-200"
            style={{ transform: `scale(${zoom})` }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Controles superiores */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
          <div className="bg-black/50 text-white px-4 py-2 rounded-lg text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </div>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Controles de zoom */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          <button
            onClick={() => handleZoom(-0.2)}
            className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors"
            aria-label="Reducir zoom"
            title="Zoom fuera (-))"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            </svg>
          </button>
          <div className="bg-black/50 text-white px-3 py-2 rounded-lg text-sm font-medium min-w-12 text-center">
            {Math.round(zoom * 100)}%
          </div>
          <button
            onClick={() => handleZoom(0.2)}
            className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-lg transition-colors"
            aria-label="Aumentar zoom"
            title="Zoom dentro (+)"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </button>
        </div>

        {/* Botones de navegación */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-lg transition-colors"
              aria-label="Imagen anterior"
              title="Anterior (←)"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-700 hover:bg-slate-600 text-white p-3 rounded-lg transition-colors"
              aria-label="Siguiente imagen"
              title="Siguiente (→)"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Info teclas */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-2 rounded-lg text-xs">
          <p>ESC: cerrar | ←→: navegar | +/-: zoom</p>
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(content, document.body) : null;
}

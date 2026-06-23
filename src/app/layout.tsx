import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "Grupo Guzmán | Gestión de Propiedades",
  description: "Sistema interno de gestión de inmuebles en renta y venta",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${geist.variable} font-sans antialiased bg-slate-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}

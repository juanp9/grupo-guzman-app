"use client";

import { signOut } from "next-auth/react";

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 px-6 h-14 flex items-center justify-between">
      <span className="font-semibold text-slate-900 tracking-tight">Grupo Guzmán</span>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="text-sm text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
      >
        Cerrar sesión
      </button>
    </header>
  );
}

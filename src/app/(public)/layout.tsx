export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 h-14 flex items-center gap-2">
        <span className="font-semibold text-slate-900 tracking-tight">Grupo Guzmán</span>
        <span className="text-slate-300">·</span>
        <span className="text-slate-500 text-sm">Propiedades disponibles</span>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}

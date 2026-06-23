import Header from "@/components/ui/header";

export default function PropiedadesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}

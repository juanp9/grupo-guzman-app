"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
      redirect: false,
    });

    if (result?.error) {
      setError("Usuario o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    router.push("/propiedades");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Grupo Guzmán
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Sistema de gestión de propiedades
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                autoFocus
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                placeholder="Ingresa tu usuario"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                placeholder="Ingresa tu contraseña"
              />
            </div>

            {error && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-slate-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

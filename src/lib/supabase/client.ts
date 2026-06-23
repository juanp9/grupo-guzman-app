import { createBrowserClient } from "@supabase/ssr";

// Cliente para el browser — usa la anon key (pública).
// Con RLS configurado para service role, este cliente no puede leer ni escribir datos.
// Reservado para posibles operaciones públicas futuras (ej. páginas sin auth).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

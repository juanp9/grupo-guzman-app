import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Falta NEXT_PUBLIC_SUPABASE_URL en las variables de entorno");
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY en las variables de entorno");
}

// Cliente de servidor con service role key — bypasea RLS.
// NUNCA exportar ni exponer al cliente (browser).
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

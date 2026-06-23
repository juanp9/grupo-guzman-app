import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const envContent = readFileSync(join(__dirname, "../.env.local"), "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) return;
  env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// Crear bucket "propiedades" (público, solo imágenes, máx 5 MB por archivo)
const { error } = await supabase.storage.createBucket("propiedades", {
  public: true,
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  fileSizeLimit: 5 * 1024 * 1024,
});

if (error && error.message !== "The resource already exists") {
  console.error("✗ Error creando bucket:", error.message);
  process.exit(1);
}

if (error?.message === "The resource already exists") {
  console.log("✓ Bucket 'propiedades' ya existe — sin cambios.");
} else {
  console.log("✓ Bucket 'propiedades' creado correctamente (público, 5 MB máx.)");
}

// Verificar que el bucket es accesible
const { data: buckets } = await supabase.storage.listBuckets();
const bucket = buckets?.find((b) => b.name === "propiedades");
if (bucket) {
  console.log(`  → public: ${bucket.public}`);
  console.log(`  → id: ${bucket.id}`);
}

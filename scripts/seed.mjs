import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Leer .env.local manualmente (sin depender de process.env)
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

const propiedades = [
  {
    titulo: "Apartamento moderno en el centro de Palmira",
    tipo_operacion: "renta",
    tipo_propiedad: "apartamento",
    ubicacion: "Centro, Palmira, Valle del Cauca",
    direccion: "Carrera 28 # 29-45 Apto 302",
    metros_cuadrados: 72,
    precio: 1200000,
    moneda: "COP",
    habitaciones: 2,
    banos: 2,
    parqueaderos: 1,
    estado: "disponible",
    destacado: false,
    imagenes: [],
    descripcion:
      "Cómodo apartamento en el corazón de Palmira. Sala-comedor amplio, cocina integral, dos habitaciones con closets y dos baños completos. Conjunto cerrado con vigilancia 24 horas, zona de lavandería y parqueadero cubierto. A pocos minutos del centro comercial y vías principales.",
  },
  {
    titulo: "Casa bifamiliar en Urbanización La Emilia",
    tipo_operacion: "venta",
    tipo_propiedad: "casa",
    ubicacion: "La Emilia, Palmira, Valle del Cauca",
    direccion: "Calle 52 # 18-60",
    metros_cuadrados: 180,
    precio: 380000000,
    moneda: "COP",
    habitaciones: 4,
    banos: 3,
    parqueaderos: 2,
    estado: "disponible",
    destacado: true,
    imagenes: [],
    descripcion:
      "Amplia casa bifamiliar en excelente estado en una de las urbanizaciones más tranquilas de Palmira. Primer piso: sala, comedor, cocina con mesón de granito, habitación de servicio y patio. Segundo piso: cuatro habitaciones, tres baños completos y terraza. Jardín con zona verde y dos parqueaderos privados.",
  },
];

const { data, error } = await supabase
  .from("propiedades")
  .insert(propiedades)
  .select("id, titulo, tipo_operacion, precio");

if (error) {
  console.error("✗ Error insertando datos:", error.message);
  process.exit(1);
}

console.log("✓ Datos de muestra insertados:");
data.forEach((p) => {
  const precio = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(p.precio);
  console.log(`  • ${p.titulo}`);
  console.log(`    ${p.tipo_operacion.toUpperCase()} · ${precio} · id: ${p.id}`);
});
console.log("\nPara borrarlos: ve a /propiedades, entra al detalle y usa el botón Eliminar.");

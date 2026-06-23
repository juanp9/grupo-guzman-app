import { readFileSync, writeFileSync, existsSync } from "fs";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../.env.local");

if (!existsSync(envPath)) {
  console.error("ERROR: No se encontró .env.local en la raíz del proyecto.");
  console.error("Ruta buscada:", envPath);
  process.exit(1);
}

const password = "hola1234";
const newHash = await bcrypt.hash(password, 12);

let content = readFileSync(envPath, "utf-8");
const before = content;

if (content.includes("ADMIN_PASSWORD_HASH=")) {
  content = content.replace(/^ADMIN_PASSWORD_HASH=.*/m, `ADMIN_PASSWORD_HASH=${newHash}`);
} else {
  content += `\nADMIN_PASSWORD_HASH=${newHash}\n`;
}

writeFileSync(envPath, content, "utf-8");

console.log("✓ .env.local actualizado correctamente");
console.log("  Ruta:", envPath);
console.log("  Hash generado:", newHash);
console.log("  Longitud:", newHash.length, "(debe ser 60)");
console.log("  Empieza con $2b$:", newHash.startsWith("$2b$"));
console.log("\nVerificando que el hash valida 'hola1234'...");
const ok = await bcrypt.compare("hola1234", newHash);
console.log("  compare('hola1234', hash):", ok, ok ? "✓ CORRECTO" : "✗ ERROR");

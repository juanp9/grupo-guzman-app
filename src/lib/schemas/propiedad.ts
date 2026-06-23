import { z } from "zod";

const optionalInt = z.preprocess(
  (v) => (v === "" || v == null ? null : Number(v)),
  z.number().int().min(0).nullable()
);

export const propiedadSchema = z.object({
  titulo: z.string().min(1, "El título es requerido"),
  tipo_operacion: z.enum(["renta", "venta"], { error: "Selecciona una opción" }),
  tipo_propiedad: z.enum(
    ["casa", "apartamento", "local_comercial", "oficina", "bodega", "terreno", "edificio", "otro"],
    { error: "Selecciona una opción" }
  ),
  ubicacion: z.string().min(1, "La ubicación es requerida"),
  direccion: z.string().min(1, "La dirección es requerida"),
  metros_cuadrados: z.coerce
    .number({ error: "Ingresa un número válido" })
    .positive("Debe ser mayor a 0"),
  precio: z.coerce
    .number({ error: "Ingresa un número válido" })
    .min(0, "No puede ser negativo"),
  moneda: z.string().default("COP"),
  habitaciones: optionalInt,
  banos: optionalInt,
  parqueaderos: optionalInt,
  descripcion: z.string().nullable().optional(),
  estado: z.enum(["disponible", "reservado", "vendido", "rentado"]).default("disponible"),
  destacado: z.boolean().default(false),
  imagenes: z.array(z.string()).default([]),
});

export type PropiedadFormData = z.infer<typeof propiedadSchema>;

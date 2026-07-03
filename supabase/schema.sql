-- ============================================================
-- Grupo Guzmán App — Schema de base de datos
-- Ejecutar en: Supabase > SQL Editor > New query
-- ============================================================

-- Tabla principal de propiedades
CREATE TABLE IF NOT EXISTS propiedades (
  id               uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo           text        NOT NULL,
  tipo_operacion   text        NOT NULL
                               CHECK (tipo_operacion IN ('renta', 'venta')),
  tipo_propiedad   text        NOT NULL
                               CHECK (tipo_propiedad IN (
                                 'casa', 'apartamento', 'local_comercial', 'oficina',
                                 'bodega', 'terreno', 'lote', 'casa_campestre', 'finca',
                                 'edificio', 'otro'
                               )),
  ubicacion        text        NOT NULL,
  direccion        text        NOT NULL,
  metros_cuadrados numeric     NOT NULL CHECK (metros_cuadrados > 0),
  precio           numeric     NOT NULL CHECK (precio >= 0),
  moneda           text        NOT NULL DEFAULT 'COP',
  habitaciones     int         CHECK (habitaciones >= 0),
  banos            int         CHECK (banos >= 0),
  parqueaderos     int         CHECK (parqueaderos >= 0),
  descripcion      text,
  estado           text        NOT NULL DEFAULT 'disponible'
                               CHECK (estado IN ('disponible', 'reservado', 'vendido', 'rentado')),
  destacado        boolean     NOT NULL DEFAULT false,
  imagenes         text[]      NOT NULL DEFAULT '{}',
  creado_en        timestamptz NOT NULL DEFAULT now(),
  actualizado_en   timestamptz NOT NULL DEFAULT now()
);

-- Índices para las consultas más frecuentes (filtros + orden)
CREATE INDEX IF NOT EXISTS idx_propiedades_tipo_operacion ON propiedades (tipo_operacion);
CREATE INDEX IF NOT EXISTS idx_propiedades_tipo_propiedad ON propiedades (tipo_propiedad);
CREATE INDEX IF NOT EXISTS idx_propiedades_estado        ON propiedades (estado);
CREATE INDEX IF NOT EXISTS idx_propiedades_creado_en     ON propiedades (creado_en DESC);
CREATE INDEX IF NOT EXISTS idx_propiedades_precio        ON propiedades (precio);
CREATE INDEX IF NOT EXISTS idx_propiedades_metros        ON propiedades (metros_cuadrados);

-- Trigger: auto-actualizar actualizado_en en cada UPDATE
CREATE OR REPLACE FUNCTION actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizado_en = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS propiedades_actualizado_en ON propiedades;
CREATE TRIGGER propiedades_actualizado_en
  BEFORE UPDATE ON propiedades
  FOR EACH ROW EXECUTE FUNCTION actualizar_timestamp();

-- ============================================================
-- Row Level Security (RLS)
-- Solo el service_role key (backend) puede acceder.
-- El service_role bypasea RLS por diseño de Supabase.
-- La política bloquea explícitamente anon y authenticated.
-- ============================================================

ALTER TABLE propiedades ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Sin acceso publico" ON propiedades;
CREATE POLICY "Sin acceso publico" ON propiedades
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- ============================================================
-- Storage — Políticas para el bucket "propiedades"
--
-- ANTES de ejecutar esto:
--   1. Ve a Supabase > Storage > New bucket
--   2. Nombre: propiedades
--   3. Public bucket: activado (ON)
--   4. Guarda y luego ejecuta las líneas de abajo
-- ============================================================

DROP POLICY IF EXISTS "Imagenes publicas - lectura" ON storage.objects;
CREATE POLICY "Imagenes publicas - lectura" ON storage.objects
  FOR SELECT);

-- Las operaciones de escritura (upload/delete) se hacen desde el servidor
-- con el service_role key, que bypasea RLS — no se necesita política adicional.

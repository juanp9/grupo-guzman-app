-- ============================================================
-- FIX: Actualizar el CHECK constraint de tipo_propiedad
-- Para incluir todos los valores correctos
-- ============================================================

-- IMPORTANTE: Ejecutar esta migración en Supabase SQL Editor
-- Ir a: Supabase > SQL Editor > New query
-- Copiar y pegar el contenido de este archivo

-- 1. Primero, obtener el nombre exacto del constraint (para validación)
-- SELECT constraint_name FROM information_schema.table_constraints 
-- WHERE table_name = 'propiedades' AND constraint_type = 'CHECK';

-- 2. Borrar el constraint antiguo
ALTER TABLE propiedades DROP CONSTRAINT IF EXISTS "propiedades_tipo_propiedad_check";

-- 3. Agregar el nuevo constraint con todos los valores correctos
ALTER TABLE propiedades ADD CONSTRAINT propiedades_tipo_propiedad_check
  CHECK (tipo_propiedad IN (
    'casa', 'apartamento', 'local_comercial', 'oficina',
    'bodega', 'terreno', 'lote', 'casa_campestre', 'finca',
    'edificio', 'otro'
  ));

-- Verificación: Intentar insertar un registro con uno de los valores problemáticos
-- SELECT 'Test: finca' AS test;
-- INSERT INTO propiedades (titulo, tipo_operacion, tipo_propiedad, ubicacion, direccion, metros_cuadrados, precio)
-- VALUES ('Test Finca', 'venta', 'finca', 'Test', 'Test', 100, 1000000);
-- DELETE FROM propiedades WHERE titulo = 'Test Finca';

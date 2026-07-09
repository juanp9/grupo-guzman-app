-- ============================================================
-- SCRIPT DE DIAGNÓSTICO: Identificar por qué fallan estos valores
-- ============================================================
-- Ejecutar en: Supabase > SQL Editor > New query

-- 1. Ver el constraint exacto y sus valores permitidos
SELECT 
  constraint_name,
  table_name,
  column_name,
  constraint_definition
FROM information_schema.check_constraints
WHERE table_name = 'propiedades';

-- 2. Ver la definición más detallada del constraint
SELECT pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE relname = 'propiedades' AND contype = 'c';

-- 3. Intentar insertar un test con "finca" para ver el error exacto
INSERT INTO propiedades (
  titulo, tipo_operacion, tipo_propiedad, ubicacion, 
  direccion, metros_cuadrados, precio
) VALUES (
  'TEST FINCA', 'venta', 'finca', 'Test Location',
  'Test Address', 100, 1000000
);

-- 4. Si el insert anterior falla, intenta con "casa"
INSERT INTO propiedades (
  titulo, tipo_operacion, tipo_propiedad, ubicacion, 
  direccion, metros_cuadrados, precio
) VALUES (
  'TEST CASA', 'venta', 'casa', 'Test Location',
  'Test Address', 100, 1000000
);

-- 5. Ver todos los registros creados en el test (opcional, borrar después)
SELECT id, tipo_propiedad FROM propiedades WHERE titulo LIKE 'TEST%';

-- 6. BORRAR registros de prueba
DELETE FROM propiedades WHERE titulo LIKE 'TEST%';

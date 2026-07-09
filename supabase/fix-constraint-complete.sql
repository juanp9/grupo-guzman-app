-- ============================================================
-- SOLUCIÓN DEFINITIVA: Reemplazar el CHECK constraint
-- ============================================================
-- Ejecutar en: Supabase > SQL Editor > New query
-- IMPORTANTE: Ejecutar línea por línea, no todo junto

-- PASO 1: Ver todas las restricciones CHECK existentes
SELECT constraint_name, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'propiedades'::regclass AND contype = 'c';

-- PASO 2: Obtener el nombre EXACTO del constraint (importante)
-- Ejecuta esto y copia el nombre que aparece:
SELECT constraint_name 
FROM information_schema.table_constraints 
WHERE table_name = 'propiedades' 
  AND constraint_type = 'CHECK'
  AND constraint_name LIKE '%tipo_propiedad%';

-- PASO 3: Una vez tengas el nombre, reemplaza "propiedades_tipo_propiedad_check" 
-- en las líneas de abajo con el nombre exacto que obtuviste:

-- Borrar el constraint (REEMPLAZA EL NOMBRE SI ES DIFERENTE)
ALTER TABLE propiedades 
DROP CONSTRAINT IF EXISTS "propiedades_tipo_propiedad_check" CASCADE;

-- PASO 4: Crear el nuevo constraint con TODOS los valores correctos
ALTER TABLE propiedades 
ADD CONSTRAINT propiedades_tipo_propiedad_check CHECK (
  tipo_propiedad IN (
    'casa',
    'apartamento',
    'local_comercial',
    'oficina',
    'bodega',
    'terreno',
    'lote',
    'casa_campestre',
    'finca',
    'edificio',
    'otro'
  )
);

-- PASO 5: Verificar que el nuevo constraint existe
SELECT constraint_name, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'propiedades'::regclass 
  AND constraint_name = 'propiedades_tipo_propiedad_check';

-- PASO 6: Test - Intentar insertar un registro con 'finca'
INSERT INTO propiedades (
  titulo, tipo_operacion, tipo_propiedad, ubicacion, 
  direccion, metros_cuadrados, precio
) VALUES (
  'TEST FINCA 123', 'venta', 'finca', 'Test', 'Test', 100, 1000000
) RETURNING id, tipo_propiedad;

-- PASO 7: Limpiar el registro de test
DELETE FROM propiedades WHERE titulo = 'TEST FINCA 123';

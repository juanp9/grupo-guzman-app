-- ============================================================
-- QUERY DEFINITIVA: Verificar el CHECK constraint actual
-- ============================================================

-- 1. Ver TODOS los constraints de la tabla propiedades
SELECT 
  con.conname as constraint_name,
  con.contype as constraint_type,
  pg_get_constraintdef(con.oid) as constraint_definition
FROM pg_constraint con
WHERE con.conrelid = (SELECT oid FROM pg_class WHERE relname = 'propiedades')
ORDER BY con.contype;

-- 2. Si ves el constraint de tipo_propiedad, verifica si incluye estos valores:
-- (ejecuta esto después de ver el resultado anterior)
SELECT 
  'finca' as tipo_propiedad,
  'finca'::text = ANY(ARRAY[
    'casa', 'apartamento', 'local_comercial', 'oficina',
    'bodega', 'terreno', 'lote', 'casa_campestre', 'finca',
    'edificio', 'otro'
  ]) as esta_en_array;

SELECT 
  'lote' as tipo_propiedad,
  'lote'::text = ANY(ARRAY[
    'casa', 'apartamento', 'local_comercial', 'oficina',
    'bodega', 'terreno', 'lote', 'casa_campestre', 'finca',
    'edificio', 'otro'
  ]) as esta_en_array;

SELECT 
  'casa_campestre' as tipo_propiedad,
  'casa_campestre'::text = ANY(ARRAY[
    'casa', 'apartamento', 'local_comercial', 'oficina',
    'bodega', 'terreno', 'lote', 'casa_campestre', 'finca',
    'edificio', 'otro'
  ]) as esta_en_array;

-- 3. Ver la definición exacta del constraint CHECK de tipo_propiedad
SELECT pg_get_constraintdef(oid) as constraint_def
FROM pg_constraint
WHERE conrelid = 'propiedades'::regclass
  AND conname LIKE '%tipo_propiedad%';

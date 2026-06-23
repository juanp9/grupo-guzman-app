# Prompt para Claude Code — App Web de Gestión de Propiedades Inmobiliarias

Copia y pega todo el bloque de abajo (desde "## CONTEXTO" hasta el final) en Claude Code dentro de la carpeta donde quieras crear el proyecto.

---

## CONTEXTO

Quiero que me ayudes a construir una aplicación web interna para una empresa de bienes raíces. La usarán los encargados de promocionar propiedades (agentes), para consultar rápidamente el inventario de inmuebles en renta y venta. No es un sitio público: es una herramienta interna de gestión.

Objetivo principal: que los agentes encuentren rápido la propiedad que necesitan (filtros y búsqueda ágil), y que el administrador (yo) pueda cargar, editar y dar de baja propiedades fácilmente.

El desarrollo y el hosting deben ser completamente gratuitos.

## STACK TÉCNICO (no te desvíes de esto)

- **Next.js 14+ (App Router)** con **React** y **TypeScript**
- **Tailwind CSS** para estilos
- **Supabase** (plan gratuito) como base de datos PostgreSQL y almacenamiento de imágenes (bucket de Storage)
- **NextAuth.js** con **Credentials Provider** para un **único usuario administrador**, configurado por variables de entorno (usuario y hash de contraseña). NO uses Supabase Auth, NO implementes registro de usuarios, NO debe existir ninguna pantalla ni endpoint para crear cuentas nuevas. Es un solo perfil que yo controlo manualmente vía `.env`.
- Despliegue final en **Vercel** (plan gratuito), con el repo conectado a GitHub para despliegue automático.

## MODELO DE DATOS — Tabla `propiedades`

Crea la tabla en Supabase con (al menos) estos campos:

| Campo | Tipo | Notas |
|---|---|---|
| id | uuid (PK) | generado automático |
| titulo | text | nombre/título corto de la propiedad |
| tipo_operacion | text | enum: `renta` \| `venta` |
| tipo_propiedad | text | enum: `casa`, `apartamento`, `local_comercial`, `oficina`, `bodega`, `terreno`, `edificio`, `otro` |
| ubicacion | text | ciudad / zona / barrio |
| direccion | text | dirección completa |
| metros_cuadrados | numeric | |
| precio | numeric | |
| moneda | text | default 'COP' (o la que uses) |
| habitaciones | int | nullable |
| banos | int | nullable |
| parqueaderos | int | nullable |
| descripcion | text | nullable |
| estado | text | enum: `disponible`, `reservado`, `vendido`, `rentado` |
| destacado | boolean | default false |
| imagenes | text[] | URLs del bucket de Supabase Storage |
| creado_en | timestamptz | default now() |
| actualizado_en | timestamptz | auto-update |

Genera el script SQL de creación de la tabla, los enums/checks correspondientes, y las políticas de Row Level Security de Supabase (acceso solo mediante la service role key del backend, nunca expuesta al cliente).

## FUNCIONALIDADES REQUERIDAS

1. **Login** (`/login`): formulario simple usuario + contraseña. Sin "olvidé mi contraseña", sin registro. Sesión vía NextAuth (JWT). Todas las rutas excepto `/login` deben estar protegidas por middleware.

2. **Dashboard / Listado de propiedades** (`/propiedades`):
   - Vista en tarjetas (cards) con imagen principal, título, tipo de operación (badge renta/venta), precio, ubicación, m².
   - **Filtros combinables**: tipo de operación, tipo de propiedad, ubicación, rango de precio, rango de m², estado.
   - Barra de búsqueda por texto (título, dirección, ubicación).
   - Orden por: más reciente, precio asc/desc, m² asc/desc.
   - Paginación o scroll infinito (lo que sea más simple de implementar bien).

3. **Detalle de propiedad** (`/propiedades/[id]`): toda la info, galería de imágenes, botones de editar/eliminar.

4. **Crear propiedad** (`/propiedades/nueva`): formulario completo con validación (usa `react-hook-form` + `zod`), subida múltiple de imágenes a Supabase Storage.

5. **Editar propiedad** (`/propiedades/[id]/editar`): mismo formulario pre-cargado.

6. **Eliminar propiedad**: confirmación antes de borrar (y borrar también las imágenes asociadas en Storage).

7. **Responsive**: debe verse bien en celular, porque los agentes probablemente lo usarán en campo.

## ENTREGABLES Y FORMA DE TRABAJO

Quiero que avancemos por fases, y que antes de pasar a la siguiente fase me muestres qué hiciste y que yo pueda probarlo:

1. **Fase 1**: Setup del proyecto Next.js + Tailwind + estructura de carpetas + conexión a Supabase (variables de entorno en `.env.local`, archivo `.env.example` documentado).
2. **Fase 2**: Script SQL del modelo de datos + login con NextAuth (usuario único) + middleware de protección de rutas.
3. **Fase 3**: CRUD completo de propiedades (listado, crear, editar, eliminar, detalle).
4. **Fase 4**: Filtros, búsqueda y orden en el listado.
5. **Fase 5**: Subida de imágenes a Supabase Storage y galería.
6. **Fase 6**: Pulido responsive + checklist de despliegue a Vercel (variables de entorno necesarias, conexión del repo, dominio gratuito `.vercel.app`).

Al final, dame también un `README.md` con:
- Instrucciones para correr el proyecto en local.
- Cómo crear el usuario admin (usuario + cómo generar el hash de contraseña).
- Cómo configurar el proyecto de Supabase desde cero (tablas, bucket, políticas).
- Pasos para desplegar en Vercel gratis.

Empecemos por la Fase 1. Antes de escribir código, dime si tienes alguna duda sobre los requerimientos.

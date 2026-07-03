export type TipoOperacion = "renta" | "venta";

export type TipoPropiedad =
  | "casa"
  | "apartamento"
  | "local_comercial"
  | "oficina"
  | "bodega"
  | "terreno"
  | "lote"
  | "casa_campestre"
  | "finca"
  | "edificio"
  | "otro";

export type EstadoPropiedad = "disponible" | "reservado" | "vendido" | "rentado";

export interface Propiedad {
  id: string;
  titulo: string;
  tipo_operacion: TipoOperacion;
  tipo_propiedad: TipoPropiedad;
  ubicacion: string;
  direccion: string;
  metros_cuadrados: number;
  precio: number;
  moneda: string;
  habitaciones: number | null;
  banos: number | null;
  parqueaderos: number | null;
  descripcion: string | null;
  estado: EstadoPropiedad;
  destacado: boolean;
  imagenes: string[];
  creado_en: string;
  actualizado_en: string;
}

export type PropiedadInsert = Omit<Propiedad, "id" | "creado_en" | "actualizado_en">;
export type PropiedadUpdate = Partial<PropiedadInsert>;

export interface FiltrosPropiedades {
  tipo_operacion?: TipoOperacion;
  tipo_propiedad?: TipoPropiedad;
  ubicacion?: string;
  estado?: EstadoPropiedad;
  precio_min?: number;
  precio_max?: number;
  metros_min?: number;
  metros_max?: number;
  busqueda?: string;
  orden?: "reciente" | "precio_asc" | "precio_desc" | "metros_asc" | "metros_desc";
  pagina?: number;
}

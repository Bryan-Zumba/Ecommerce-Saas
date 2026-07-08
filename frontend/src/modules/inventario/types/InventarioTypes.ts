export interface Bodega {
  id_bodega: number;
  nombre: string;
}

export interface CategoriaInventario {
  id_categoria: number;
  nombre: string;
  estado: boolean;
}

export interface ItemInventario {
  id_item: number;
  nombre: string;
  tipo_item: string;
  costo: number;
  precio: number;
  imagen_url: string | null;
  estado: boolean;
  categoria: CategoriaInventario | null;
}

export interface InventarioDetalle {
  id_inventario: number;
  id_bodega: number;
  stock_actual: number;
  stock_disponible: number;
  stock_reservado: number;
  fecha_ultima_actualizacion: string;
  item: ItemInventario;
}

export interface InventarioResponse {
  success: boolean;
  inventario?: InventarioDetalle[];
  message?: string;
}

export type TipoMovimiento = 'Ingreso' | 'Salida';

export interface MovimientoInventario {
  id_movimiento: number;
  fecha: string;
  id_item: number;
  producto_nombre: string;
  id_bodega: number;
  bodega_nombre: string;
  tipo: TipoMovimiento;
  cantidad: number;
  motivo: string;
}

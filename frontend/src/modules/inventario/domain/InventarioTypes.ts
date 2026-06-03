export interface Bodega {
  id_bodega: number;
  nombre: string;
}

export interface InventarioItem {
  id_inventario: number;
  id_item: number;
  id_bodega: number;
  producto_nombre: string;
  bodega_nombre: string;
  stock_disponible: number;
  stock_actual: number;
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

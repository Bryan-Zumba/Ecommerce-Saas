import { Bodega } from './BodegaTypes';
import { Item } from './ItemTypes';

export type TipoMovimientoInventario = 'Compra' | 'Venta' | 'Devolucion';

export interface MovimientoInventario {
  id_movimiento_inventario: number;
  id_item: number;
  id_bodega: number;
  id_venta?: number | null;
  id_compra?: number | null;
  tipo_movimiento: TipoMovimientoInventario;
  cantidad: number;
  stock_anterior: number;
  stock_nuevo: number;
  fecha_movimiento: string;
  item?: Item;
  bodega?: Bodega;
}

export interface MovimientosInventarioResponse {
  success: boolean;
  message?: string;
  movimientosInventario: MovimientoInventario[];
}

export interface MovimientoInventarioResponse {
  success: boolean;
  message?: string;
  movimientoInventario: MovimientoInventario;
}

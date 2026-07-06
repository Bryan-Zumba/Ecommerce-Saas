import { apiClient } from '@/core/apiClient';
import {
  MovimientoInventarioResponse,
  MovimientosInventarioResponse,
} from '../types/MovimientoInventarioTypes';

export const MovimientoInventarioService = {
  obtenerPorBodega(id_bodega: number): Promise<MovimientosInventarioResponse> {
    return apiClient.get<MovimientosInventarioResponse>(
      `/api/movimiento-inventario/obtener-movimientos-inventario-bodega/${id_bodega}`
    );
  },

  obtenerPorItem(id_item: number): Promise<MovimientosInventarioResponse> {
    return apiClient.get<MovimientosInventarioResponse>(
      `/api/movimiento-inventario/obtener-movimientos-inventario-item/${id_item}`
    );
  },

  obtenerPorId(id_movimiento_inventario: number): Promise<MovimientoInventarioResponse> {
    return apiClient.get<MovimientoInventarioResponse>(
      `/api/movimiento-inventario/obtener-movimientos-inventario-id/${id_movimiento_inventario}`
    );
  },
};

import { apiClient } from '@/core/apiClient';
import { MovimientoCaja, MovimientoCajaResponse } from '../types/MovimientoCajaTypes';

export const MovimientoCajaService = {
  obtenerMovimientos: async (): Promise<MovimientoCaja[]> => {
    // Retorna directamente el array de movimientos (como lo devuelve el backend en la respuesta)
    return apiClient.get<MovimientoCaja[]>('/api/movimiento-caja/obtener-movimientos');
  },

  obtenerMovimientoPorId: async (id: number): Promise<MovimientoCaja | null> => {
    return apiClient.get<MovimientoCaja | null>(`/api/movimiento-caja/obtener-movimiento/${id}`);
  },
};

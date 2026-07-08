import { apiClient } from '@/core/apiClient';
import { InventarioResponse } from '../types/InventarioTypes';

export const InventarioService = {
  obtenerInventarioBodega: async (): Promise<InventarioResponse> => {
    return apiClient.get<InventarioResponse>('/api/inventario/obtener-inventario-bodega');
  },
};

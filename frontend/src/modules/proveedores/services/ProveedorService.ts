import { apiClient } from '@/core/apiClient';
import { ProveedorResponse, ProveedorRequest, ProveedorLocal } from '../types/ProveedorTypes';

export const ProveedorService = {
  obtenerProveedores: async (): Promise<ProveedorResponse> => {
    return apiClient.get<ProveedorResponse>('/api/proveedor/obtener-proveedores');
  },

  obtenerProveedorPorId: async (id_proveedor: number): Promise<ProveedorResponse> => {
    return apiClient.get<ProveedorResponse>(`/api/proveedor/obtener-proveedor/${id_proveedor}`);
  },

  crearProveedor: async (proveedor: ProveedorRequest): Promise<ProveedorResponse> => {
    return apiClient.post<ProveedorResponse>('/api/proveedor/crear-proveedor', proveedor);
  },

  actualizarProveedor: async (id_proveedor: number, proveedor: ProveedorRequest): Promise<ProveedorResponse> => {
    return apiClient.put<ProveedorResponse>(`/api/proveedor/actualizar-proveedor/${id_proveedor}`, proveedor);
  },

  activarProveedor: async (id_proveedor: number): Promise<ProveedorResponse> => {
    return apiClient.put<ProveedorResponse>(`/api/proveedor/activar-proveedor/${id_proveedor}`, {});
  },

  desactivarProveedor: async (id_proveedor: number): Promise<ProveedorResponse> => {
    return apiClient.put<ProveedorResponse>(`/api/proveedor/desactivar-proveedor/${id_proveedor}`, {});
  },
};


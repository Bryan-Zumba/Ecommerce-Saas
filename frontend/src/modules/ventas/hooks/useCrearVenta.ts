import { useState } from 'react';
import { apiClient } from '@/core/apiClient';

export interface VentaCreateDTO {
  id_cliente: number;
  observacion?: string | null;
  detalles: Array<{
    id_item: number;
    id_bodega: number;
    cantidad: number;
    precio_unitario: number;
  }>;
}

interface VentaResponse {
  success: boolean;
  message?: string;
  venta?: Record<string, unknown>; // Or the specific Venta interface
}

export const useCrearVenta = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [ventaCreada, setVentaCreada] = useState<Record<string, unknown> | null>(null);

  const crearVenta = async (datos: VentaCreateDTO) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await apiClient.post<VentaResponse>('/api/venta/crear-venta', datos);
      
      if (response.success) {
        setSuccess(true);
        setVentaCreada(response.venta || null);
        return { success: true, venta: response.venta };
      } else {
        setError(response.message || 'Error al procesar la orden');
        return { success: false, error: response.message };
      }
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage = e.response?.data?.message || e.message || 'Error al conectar con el servidor';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const resetVenta = () => {
    setSuccess(false);
    setVentaCreada(null);
    setError(null);
  };

  return {
    crearVenta,
    resetVenta,
    loading,
    error,
    success,
    ventaCreada
  };
};

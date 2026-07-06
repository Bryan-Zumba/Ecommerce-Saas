import { useCallback, useState } from 'react';
import { MovimientoInventarioService } from '../services/MovimientoInventarioService';
import { MovimientoInventario } from '../types/MovimientoInventarioTypes';

export const useMovimientosInventario = () => {
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([]);
  const [movimientoDetalle, setMovimientoDetalle] = useState<MovimientoInventario | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMovimientosBodega = useCallback(async (id_bodega: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await MovimientoInventarioService.obtenerPorBodega(id_bodega);
      if (response.success) {
        setMovimientos(response.movimientosInventario ?? []);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al obtener movimientos');
      setMovimientos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHistorialItem = useCallback(async (id_item: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await MovimientoInventarioService.obtenerPorItem(id_item);
      if (response.success) {
        setMovimientos(response.movimientosInventario ?? []);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al obtener historial del producto');
      setMovimientos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMovimientoDetalle = useCallback(async (id_movimiento_inventario: number) => {
    setLoadingDetalle(true);
    setError(null);
    try {
      const response = await MovimientoInventarioService.obtenerPorId(id_movimiento_inventario);
      if (response.success) {
        setMovimientoDetalle(response.movimientoInventario);
        return response.movimientoInventario;
      }
      return null;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al obtener detalle del movimiento');
      setMovimientoDetalle(null);
      return null;
    } finally {
      setLoadingDetalle(false);
    }
  }, []);

  const limpiarDetalle = () => setMovimientoDetalle(null);

  return {
    movimientos,
    movimientoDetalle,
    loading,
    loadingDetalle,
    error,
    fetchMovimientosBodega,
    fetchHistorialItem,
    fetchMovimientoDetalle,
    limpiarDetalle,
  };
};

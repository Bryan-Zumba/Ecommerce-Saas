import { useCallback, useState } from 'react';
import { InventarioService } from '../services/InventarioService';
import { InventarioDetalle } from '../types/InventarioTypes';

export const useInventario = () => {
  const [inventario, setInventario] = useState<InventarioDetalle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInventario = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await InventarioService.obtenerInventarioBodega();
      if (response.success) {
        setInventario(response.inventario ?? []);
      } else {
        setError(response.message || 'Error al obtener inventario');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al cargar inventario');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    inventario,
    loading,
    error,
    fetchInventario,
  };
};

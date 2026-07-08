import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '@/core/apiClient';
import { ItemCatalogo } from '../types/VentaTypes';

interface CatalogoResponse {
  success: boolean;
  message?: string;
  catalogo?: ItemCatalogo[];
}

export const useCatalogoVenta = () => {
  const [catalogo, setCatalogo] = useState<ItemCatalogo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCatalogo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<CatalogoResponse>('/api/venta/catalogo');
      if (response.success && response.catalogo) {
        setCatalogo(response.catalogo);
      } else {
        setError(response.message || 'Error al obtener catálogo');
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || 'Error al cargar catálogo');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCatalogo();
  }, [fetchCatalogo]);

  return {
    catalogo,
    loading,
    error,
    refrescar: fetchCatalogo,
  };
};

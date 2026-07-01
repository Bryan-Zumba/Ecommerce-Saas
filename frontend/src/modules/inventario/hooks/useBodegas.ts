import { useState, useCallback } from 'react';
import { BodegaService } from '../services/BodegaService';
import { Bodega, BodegaRequest, BodegaUpdate } from '../types/BodegaTypes';
import Swal from 'sweetalert2';

export const useBodegas = () => {
  const [bodega, setBodega] = useState<Bodega | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBodegaEmpresa = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await BodegaService.obtenerBodegaEmpresa();
      if (response.success && response.bodega) {
        setBodega(response.bodega);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al obtener bodega');
      setBodega(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const createBodega = async (datos: BodegaRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await BodegaService.crearBodega(datos);
      if (response.success) {
        Swal.fire('Éxito', 'Bodega creada correctamente', 'success');
        await fetchBodegaEmpresa();
        return true;
      }
      return false;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al crear bodega';
      setError(msg);
      Swal.fire('Error', msg, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateBodega = async (id_bodega: number, datos: BodegaUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await BodegaService.actualizarInformacionBodega(id_bodega, datos);
      if (response.success) {
        Swal.fire('Éxito', 'Bodega actualizada correctamente', 'success');
        await fetchBodegaEmpresa();
        return true;
      }
      return false;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al actualizar bodega';
      setError(msg);
      Swal.fire('Error', msg, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    bodega,
    loading,
    error,
    fetchBodegaEmpresa,
    createBodega,
    updateBodega
  };
};

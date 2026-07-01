import { useState, useCallback } from 'react';
import { Bodega } from '../domain/Bodega';
import { BodegaRepository } from '../domain/BodegaRepository';

export const useBodega = (repository: BodegaRepository) => {
  const [bodega, setBodega] = useState<Bodega | null>(null);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [existeBodega, setExisteBodega] = useState<boolean>(false);

  const cargarBodega = useCallback(async (id_empresa: number) => {
    setCargando(true);
    setError(null);
    try {
      const datos = await repository.obtener(id_empresa);
      setBodega(datos);
      setExisteBodega(datos !== null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar la bodega');
    } finally {
      setCargando(false);
    }
  }, [repository]);

  const registrarBodega = async (datosBodega: Omit<Bodega, 'id_bodega' | 'fecha_registro'>) => {
    setCargando(true);
    setError(null);
    try {
      const nuevaBodega = await repository.registrar(datosBodega);
      setBodega(nuevaBodega);
      setExisteBodega(true);
      return { success: true, data: nuevaBodega };
    } catch (err: any) {
      setError(err.message || 'Error al registrar la bodega');
      return { success: false, error: err.message };
    } finally {
      setCargando(false);
    }
  };

  const editarBodega = async (id_empresa: number, datosActualizados: Partial<Omit<Bodega, 'id_bodega' | 'id_empresa'>>) => {
    setCargando(true);
    setError(null);
    try {
      const bodegaActualizada = await repository.actualizar(id_empresa, datosActualizados);
      setBodega(bodegaActualizada);
      return { success: true, data: bodegaActualizada };
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la bodega');
      return { success: false, error: err.message };
    } finally {
      setCargando(false);
    }
  };

  return {
    bodega,
    cargando,
    error,
    existeBodega,
    cargarBodega,
    registrarBodega,
    editarBodega,
  };
};

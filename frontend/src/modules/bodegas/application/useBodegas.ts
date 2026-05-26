import { useState, useEffect, useCallback } from 'react';
import { Bodega } from '../domain/Bodega';
import { BodegaRepository } from '../domain/BodegaRepository';

export const useBodegas = (repository: BodegaRepository) => {
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const obtenerBodegas = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const datos = await repository.obtenerTodos();
      setBodegas(datos);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las bodegas');
    } finally {
      setCargando(false);
    }
  }, [repository]);

  useEffect(() => {
    obtenerBodegas();
  }, [obtenerBodegas]);

  const agregarBodega = async (datosBodega: Omit<Bodega, 'id_bodega' | 'fecha_registro'>) => {
    setCargando(true);
    setError(null);
    try {
      const nuevaBodega = await repository.crear(datosBodega);
      setBodegas((prev) => [nuevaBodega, ...prev]);
      return { success: true, data: nuevaBodega };
    } catch (err: any) {
      setError(err.message || 'Error al crear la bodega');
      return { success: false, error: err.message };
    } finally {
      setCargando(false);
    }
  };

  const actualizarBodega = async (id: number, datosActualizados: Partial<Omit<Bodega, 'id_bodega'>>) => {
    setCargando(true);
    setError(null);
    try {
      const itemActualizado = await repository.actualizar(id, datosActualizados);
      setBodegas((prev) =>
        prev.map((b) => (b.id_bodega === id ? itemActualizado : b))
      );
      return { success: true, data: itemActualizado };
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la bodega');
      return { success: false, error: err.message };
    } finally {
      setCargando(false);
    }
  };

  const toggleEstadoBodega = async (id: number) => {
    setCargando(true);
    setError(null);
    try {
      const itemActualizado = await repository.toggleEstado(id);
      setBodegas((prev) =>
        prev.map((b) => (b.id_bodega === id ? itemActualizado : b))
      );
      return { success: true, data: itemActualizado };
    } catch (err: any) {
      setError(err.message || 'Error al cambiar el estado de la bodega');
      return { success: false, error: err.message };
    } finally {
      setCargando(false);
    }
  };

  const eliminarBodega = async (id: number) => {
    setCargando(true);
    setError(null);
    try {
      await repository.eliminar(id);
      setBodegas((prev) => prev.filter((b) => b.id_bodega !== id));
      return { success: true };
    } catch (err: any) {
      setError(err.message || 'Error al eliminar la bodega');
      return { success: false, error: err.message };
    } finally {
      setCargando(false);
    }
  };

  const restaurarDemo = async () => {
    setCargando(true);
    setError(null);
    try {
      if (repository.restaurarDemo) {
        const datos = await repository.restaurarDemo();
        setBodegas(datos);
      }
    } catch (err: any) {
      setError(err.message || 'Error al restaurar los datos demo');
    } finally {
      setCargando(false);
    }
  };

  return {
    bodegas,
    cargando,
    error,
    obtenerBodegas,
    agregarBodega,
    actualizarBodega,
    toggleEstadoBodega,
    eliminarBodega,
    restaurarDemo,
  };
};

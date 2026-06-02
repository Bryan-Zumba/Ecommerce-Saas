import { useState, useEffect, useCallback } from 'react';
import { Item } from '../domain/Item';
import { ItemRepository } from '../domain/ItemRepository';

export const useItems = (repository: ItemRepository) => {
  const [items, setItems] = useState<Item[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const obtenerItems = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const datos = await repository.obtenerTodos();
      setItems(datos);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los ítems');
    } finally {
      setCargando(false);
    }
  }, [repository]);

  useEffect(() => {
    obtenerItems();
  }, [obtenerItems]);

  const agregarItem = async (datosItem: Omit<Item, 'id_item'>) => {
    setCargando(true);
    setError(null);
    try {
      const nuevoItem = await repository.crear(datosItem);
      setItems((prev) => [nuevoItem, ...prev]);
      return { success: true, data: nuevoItem };
    } catch (err: any) {
      setError(err.message || 'Error al crear el ítem');
      return { success: false, error: err.message };
    } finally {
      setCargando(false);
    }
  };

  const actualizarItem = async (id: number, datosActualizados: Partial<Omit<Item, 'id_item'>>) => {
    setCargando(true);
    setError(null);
    try {
      const itemActualizado = await repository.actualizar(id, datosActualizados);
      setItems((prev) =>
        prev.map((p) => (p.id_item === id ? itemActualizado : p))
      );
      return { success: true, data: itemActualizado };
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el ítem');
      return { success: false, error: err.message };
    } finally {
      setCargando(false);
    }
  };

  const toggleEstadoItem = async (id: number) => {
    setCargando(true);
    setError(null);
    try {
      const itemActualizado = await repository.toggleEstado(id);
      setItems((prev) =>
        prev.map((p) => (p.id_item === id ? itemActualizado : p))
      );
      return { success: true, data: itemActualizado };
    } catch (err: any) {
      setError(err.message || 'Error al cambiar el estado del ítem');
      return { success: false, error: err.message };
    } finally {
      setCargando(false);
    }
  };

  const eliminarItem = async (id: number) => {
    setCargando(true);
    setError(null);
    try {
      await repository.eliminar(id);
      setItems((prev) => prev.filter((p) => p.id_item !== id));
      return { success: true };
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el ítem');
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
        setItems(datos);
      }
    } catch (err: any) {
      setError(err.message || 'Error al restaurar los datos demo');
    } finally {
      setCargando(false);
    }
  };

  return {
    items,
    cargando,
    error,
    obtenerItems,
    agregarItem,
    actualizarItem,
    toggleEstadoItem,
    eliminarItem,
    restaurarDemo,
  };
};

import { useState, useCallback } from 'react';
import { ItemService } from '../services/ItemService';
import { Item, ItemInputDTO, ItemUpdateDTO } from '../types/ItemTypes';
import Swal from 'sweetalert2';

export const useItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ItemService.obtenerItems();
      if (response.success && response.items) {
        setItems(response.items);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al obtener items');
    } finally {
      setLoading(false);
    }
  }, []);

  const createItem = async (datos: ItemInputDTO) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ItemService.crearItem(datos);
      if (response.success) {
        await Swal.fire('Éxito', 'Item creado correctamente', 'success');
        await fetchItems();
        return true;
      }
      return false;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al crear item';
      setError(msg);
      await Swal.fire('Error', msg, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id_item: number, datos: ItemUpdateDTO) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ItemService.actualizarItem(id_item, datos);
      if (response.success) {
        await Swal.fire('Éxito', 'Item actualizado correctamente', 'success');
        await fetchItems();
        return true;
      }
      return false;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al actualizar item';
      setError(msg);
      await Swal.fire('Error', msg, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleEstadoItem = async (id_item: number, estadoActual: boolean) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (estadoActual) {
        response = await ItemService.desactivarItem(id_item);
      } else {
        response = await ItemService.activarItem(id_item);
      }
      
      if (response.success) {
        await Swal.fire('Éxito', `Item ${estadoActual ? 'desactivado' : 'activado'} correctamente`, 'success');
        await fetchItems();
        return true;
      }
      return false;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al cambiar estado de item';
      setError(msg);
      await Swal.fire('Error', msg, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    toggleEstadoItem
  };
};

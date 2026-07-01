import { useState, useCallback } from 'react';
import { CategoriaService } from '../services/CategoriaService';
import { Categoria, CategoriaRequest, CategoriaUpdate } from '../types/CategoriaTypes';
import Swal from 'sweetalert2';

export const useCategorias = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategorias = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await CategoriaService.obtenerCategorias();
      if (response.success && response.categorias) {
        setCategorias(response.categorias);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al obtener categorías');
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategoria = async (datos: CategoriaRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await CategoriaService.crearCategoria(datos);
      if (response.success) {
        Swal.fire('Éxito', 'Categoría creada correctamente', 'success');
        await fetchCategorias();
        return true;
      }
      return false;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al crear categoría';
      setError(msg);
      Swal.fire('Error', msg, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCategoria = async (id_categoria: number, datos: CategoriaUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await CategoriaService.actualizarCategoria(id_categoria, datos);
      if (response.success) {
        Swal.fire('Éxito', 'Categoría actualizada correctamente', 'success');
        await fetchCategorias();
        return true;
      }
      return false;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al actualizar categoría';
      setError(msg);
      Swal.fire('Error', msg, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleEstadoCategoria = async (id_categoria: number, estadoActual: boolean) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (estadoActual) {
        response = await CategoriaService.desactivarCategoria(id_categoria);
      } else {
        response = await CategoriaService.activarCategoria(id_categoria);
      }
      
      if (response.success) {
        Swal.fire('Éxito', `Categoría ${estadoActual ? 'desactivada' : 'activada'} correctamente`, 'success');
        await fetchCategorias();
        return true;
      }
      return false;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al cambiar estado de categoría';
      setError(msg);
      Swal.fire('Error', msg, 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    categorias,
    loading,
    error,
    fetchCategorias,
    createCategoria,
    updateCategoria,
    toggleEstadoCategoria
  };
};

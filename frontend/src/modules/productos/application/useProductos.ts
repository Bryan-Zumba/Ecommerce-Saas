import { useState, useEffect, useCallback } from 'react';
import { Producto } from '../domain/Producto';
import { ProductoRepository } from '../domain/ProductoRepository';

export const useProductos = (repository: ProductoRepository) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const obtenerProductos = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const datos = await repository.obtenerTodos();
      setProductos(datos);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los productos');
    } finally {
      setCargando(false);
    }
  }, [repository]);

  useEffect(() => {
    obtenerProductos();
  }, [obtenerProductos]);

  const agregarProducto = async (datosProducto: Omit<Producto, 'id_productos'>) => {
    setCargando(true);
    setError(null);
    try {
      const nuevoProducto = await repository.crear(datosProducto);
      setProductos((prev) => [nuevoProducto, ...prev]);
      return { success: true, data: nuevoProducto };
    } catch (err: any) {
      setError(err.message || 'Error al crear el producto');
      return { success: false, error: err.message };
    } finally {
      setCargando(false);
    }
  };

  const actualizarProducto = async (id: number, datosActualizados: Partial<Omit<Producto, 'id_productos'>>) => {
    setCargando(true);
    setError(null);
    try {
      const itemActualizado = await repository.actualizar(id, datosActualizados);
      setProductos((prev) =>
        prev.map((p) => (p.id_productos === id ? itemActualizado : p))
      );
      return { success: true, data: itemActualizado };
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el producto');
      return { success: false, error: err.message };
    } finally {
      setCargando(false);
    }
  };

  const toggleEstadoProducto = async (id: number) => {
    setCargando(true);
    setError(null);
    try {
      const itemActualizado = await repository.toggleEstado(id);
      setProductos((prev) =>
        prev.map((p) => (p.id_productos === id ? itemActualizado : p))
      );
      return { success: true, data: itemActualizado };
    } catch (err: any) {
      setError(err.message || 'Error al cambiar el estado del producto');
      return { success: false, error: err.message };
    } finally {
      setCargando(false);
    }
  };

  const eliminarProducto = async (id: number) => {
    setCargando(true);
    setError(null);
    try {
      await repository.eliminar(id);
      setProductos((prev) => prev.filter((p) => p.id_productos !== id));
      return { success: true };
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el producto');
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
        setProductos(datos);
      }
    } catch (err: any) {
      setError(err.message || 'Error al restaurar los datos demo');
    } finally {
      setCargando(false);
    }
  };

  return {
    productos,
    cargando,
    error,
    obtenerProductos,
    agregarProducto,
    actualizarProducto,
    toggleEstadoProducto,
    eliminarProducto,
    restaurarDemo,
  };
};

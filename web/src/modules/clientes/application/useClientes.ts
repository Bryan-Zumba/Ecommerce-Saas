import { useState, useEffect, useCallback } from 'react';
import { servicioClientes, Cliente } from '@/modules/clientes/infrastructure/repositories/servicioClientes';

/**
 * Hook para gestionar la lógica de clientes.
 */
export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const obtenerClientes = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const datos = await servicioClientes.obtenerClientes();
      setClientes(datos);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los clientes');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    obtenerClientes();
  }, [obtenerClientes]);

  const agregarCliente = async (datosCliente: Cliente) => {
    setCargando(true);
    setError(null);
    try {
      const nuevoCliente = await servicioClientes.crearCliente(datosCliente);
      setClientes((prev) => [...prev, nuevoCliente]);
      return { success: true, data: nuevoCliente };
    } catch (err: any) {
      setError(err.message || 'Error al crear cliente');
      return { success: false, error: err.message };
    } finally {
      setCargando(false);
    }
  };

  const actualizarCliente = async (id: string, datosActualizados: Partial<Cliente>) => {
    setCargando(true);
    setError(null);
    try {
      const itemActualizado = await servicioClientes.actualizarCliente(id, datosActualizados);
      if (itemActualizado) {
        setClientes((prev) =>
          prev.map((c) => (c.id === id ? itemActualizado! : c))
        );
      }
      return { success: true, data: itemActualizado };
    } catch (err: any) {
      setError(err.message || 'Error al actualizar cliente');
      return { success: false, error: err.message };
    } finally {
      setCargando(false);
    }
  };

  const eliminarCliente = async (id: string) => {
    setCargando(true);
    setError(null);
    try {
      await servicioClientes.eliminarCliente(id);
      setClientes((prev) => prev.filter((c) => c.id !== id));
      return { success: true };
    } catch (err: any) {
      setError(err.message || 'Error al eliminar cliente');
      return { success: false, error: err.message };
    } finally {
      setCargando(false);
    }
  };

  return {
    clientes,
    cargando,
    error,
    obtenerClientes,
    agregarCliente,
    actualizarCliente,
    eliminarCliente,
  };
};

import { useState, useEffect, useCallback } from 'react';
import { Cliente } from '../domain/Cliente';
import { ClienteRepository } from '../domain/ClienteRepository';

export const useClientes = (repository: ClienteRepository) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cargarClientes = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const datos = await repository.obtenerTodos();
      setClientes(datos);
    } catch (err: any) {
      setError(err.message || 'Error al obtener los clientes');
    } finally {
      setCargando(false);
    }
  }, [repository]);

  const agregarCliente = async (datosCliente: Omit<Cliente, 'id' | 'created_at'> ) => {
    setCargando(true);
    setError(null);
    try {
      const nuevoCliente = await repository.crear(datosCliente);
      setClientes((prev) => [...prev, nuevoCliente]);
      return { success: true, data: nuevoCliente };
    } catch (err: any) {
      setError(err.message || 'Error al crear cliente');
      return { success: false, error: err.message };
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, [cargarClientes]);

  return {
    clientes,
    cargando,
    error,
    refrescar: cargarClientes,
    agregarCliente
  };
};
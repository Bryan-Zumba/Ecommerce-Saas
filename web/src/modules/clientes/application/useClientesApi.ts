import { useState, useEffect, useCallback } from 'react';
import { Cliente } from '../domain/Cliente';
import { ClienteRepository } from '../domain/ClienteRepository';

export const useClientesApi = (repository: ClienteRepository) => {
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

  useEffect(() => {
    cargarClientes();
  }, [cargarClientes]);

  return {
    clientes,
    cargando,
    error,
    refrescar: cargarClientes,
  };
};

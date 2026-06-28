import { useState, useEffect, useCallback } from 'react';
import { ClienteService } from '../services/ClienteService';
import { ClienteResponse } from '../types/ClienteResponse';

export const useClientes = (id_empresa: number) => {
  const [clientes, setClientes] = useState<ClienteResponse["clientes"]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cargarClientes = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const response = await ClienteService.obtenerClientesEmpresa(id_empresa);
      setClientes(response.clientes);
    } catch (err: any) {
      setError(err.message || 'Error al obtener los clientes para esta empresa');
    } finally {
      setCargando(false);
    }
  }, [id_empresa]);

  // const agregarCliente = async (datosCliente: Omit<Cliente, 'id' | 'created_at'> ) => {
  //   setCargando(true);
  //   setError(null);
  //   try {
  //     const nuevoCliente = await repository.crear(datosCliente);
  //     setClientes((prev) => [...prev, nuevoCliente]);
  //     return { success: true, data: nuevoCliente };
  //   } catch (err: any) {
  //     setError(err.message || 'Error al crear cliente');
  //     return { success: false, error: err.message };
  //   } finally {
  //     setCargando(false);
  //   }
  // };

  useEffect(() => {
    cargarClientes();
  }, [cargarClientes]);

  return {
    clientes,
    cargando,
    error,
    refrescar: cargarClientes,
    // agregarCliente
  };
};
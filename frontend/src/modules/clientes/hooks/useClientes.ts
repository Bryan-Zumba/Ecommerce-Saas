import { useState, useEffect, useCallback } from 'react';
import { ClienteService } from '../services/ClienteService';
import { ClienteResponse } from '../types/ClienteResponse';
import { ClienteCreateDTO, ClienteUpdateDTO } from '../types/ClienteRequest';

export const useClientes = (id_empresa: number) => {
  const [clientes, setClientes] = useState<ClienteResponse["clientes"]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [procesando, setProcesando] = useState<boolean>(false);
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

  const agregarCliente = async (datosCliente: Omit<ClienteCreateDTO, 'id_empresa'>) => {
    setProcesando(true);
    setError(null);
    try {
      const nuevoCliente = await ClienteService.crearCliente({ ...datosCliente, id_empresa });
      await cargarClientes();
      return { success: true, data: nuevoCliente };
    } catch (err: any) {
      setError(err.message || 'Error al crear cliente');
      return { success: false, error: err.message };
    } finally {
      setProcesando(false);
    }
  };

  const editarCliente = async (id_cliente: number, datosCliente: ClienteUpdateDTO) => {
    setProcesando(true);
    setError(null);
    try {
      const respuesta = await ClienteService.actualizarInformacionCliente(id_cliente, datosCliente);
      await cargarClientes();
      return { success: true, data: respuesta };
    } catch (err: any) {
      setError(err.message || 'Error al actualizar cliente');
      return { success: false, error: err.message };
    } finally {
      setProcesando(false);
    }
  };

  const cambiarEstadoCliente = async (id_cliente: number, estadoActual: boolean) => {
    setProcesando(true);
    setError(null);
    try {
      if (estadoActual) {
        await ClienteService.desactivarCliente(id_cliente);
      } else {
        await ClienteService.activarCliente(id_cliente);
      }
      await cargarClientes();
      return { success: true };
    } catch (err: any) {
      setError(err.message || `Error al ${estadoActual ? 'desactivar' : 'activar'} el cliente`);
      return { success: false, error: err.message };
    } finally {
      setProcesando(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, [cargarClientes]);

  return {
    clientes,
    cargando,
    procesando,
    error,
    refrescar: cargarClientes,
    agregarCliente,
    editarCliente,
    cambiarEstadoCliente
  };
};
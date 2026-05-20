import { useState, useEffect, useCallback } from 'react';
import { Cliente } from '../domain/Cliente';
import { ClienteRepository } from '../domain/ClienteRepository';
// 1. Definimos una interfaz intermedia para que la pantalla de React no se rompa
export interface ClienteUI {
  id: string;      // DNI / Cédula
  nombre: string;  // Nombre Completo
  email: string;
  telefono: string;
}
export const useClientesApi = (repository: ClienteRepository) => {
  const [clientes, setClientes] = useState<ClienteUI[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  /**
   * 2. Caso de uso: Cargar clientes
   * Traducimos del formato de base de datos a formato de interfaz visual
   */
  const cargarClientes = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const datos = await repository.obtenerTodos();
      
      // Adaptamos el array que viene del Backend
      const datosMapeados = datos.map((c: Cliente) => ({
        id: c.cedula,
        nombre: `${c.nombres} ${c.apellidos}`.trim(),
        email: c.email || '',
        telefono: c.telefono || '',
      }));
      setClientes(datosMapeados);
    } catch (err: any) {
      setError(err.message || 'Error al obtener los clientes');
    } finally {
      setCargando(false);
    }
  }, [repository]);
  useEffect(() => {
    cargarClientes();
  }, [cargarClientes]);
  /**
   * 3. Caso de uso: Agregar cliente
   * Traducimos de la interfaz visual al formato que espera tu backend (Prisma)
   */
  const agregarCliente = async (datosClienteUI: ClienteUI) => {
    setCargando(true);
    setError(null);
    try {
      // Separamos el nombre completo para el backend
      const partes = datosClienteUI.nombre.trim().split(/\s+/);
      const nombres = partes[0] || '';
      const apellidos = partes.slice(1).join(' ') || ' ';
      // Formato que exige tu backend/Prisma
      const cuerpoParaBackend: any = {
        cedula: datosClienteUI.id,
        nombres: nombres,
        apellidos: apellidos,
        email: datosClienteUI.email || null,
        telefono: datosClienteUI.telefono || null,
      };
      // Guardamos en el Backend real
      const nuevoClienteDb = await repository.crear(cuerpoParaBackend);
      // Convertimos el resultado de vuelta a formato de interfaz visual
      const nuevoClienteUI: ClienteUI = {
        id: nuevoClienteDb.cedula,
        nombre: `${nuevoClienteDb.nombres} ${nuevoClienteDb.apellidos}`.trim(),
        email: nuevoClienteDb.email || '',
        telefono: nuevoClienteDb.telefono || '',
      };
      setClientes((prev) => [...prev, nuevoClienteUI]);
      return { success: true, data: nuevoClienteUI };
    } catch (err: any) {
      setError(err.message || 'Error al crear cliente');
      return { success: false, error: err.message };
    } finally {
      setCargando(false);
    }
  };
  return {
    clientes,
    cargando,
    error,
    refrescar: cargarClientes,
    agregarCliente, // Retornamos la función para que la pantalla pueda usar el botón "Guardar"
  };
};

import { useState, useCallback, useEffect } from 'react';
import { ProveedorService } from '../services/ProveedorService';
import { ProveedorLocal, ProveedorRequest, ProveedorUpdateDTO } from '../types/ProveedorTypes';
import Swal from 'sweetalert2';

export const useProveedores = () => {
  const [proveedores, setProveedores] = useState<ProveedorLocal[]>([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProveedores = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await ProveedorService.obtenerProveedores();
      if (data.success && data.proveedores) {
        setProveedores(data.proveedores);
      } else {
        setError(data.message || 'Error al obtener proveedores');
      }
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    fetchProveedores();
  }, [fetchProveedores]);

  const agregarProveedor = async (proveedor: ProveedorRequest) => {
    try {
      setProcesando(true);
      Swal.fire({
        title: 'Guardando...',
        text: 'Por favor, espera',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });
      const data = await ProveedorService.crearProveedor(proveedor);
      if (data.success && data.proveedor) {
        setProveedores((prev) => [...prev, data.proveedor!]);
        Swal.fire('¡Éxito!', 'Proveedor creado exitosamente', 'success');
        return true;
      }
      Swal.fire('Error', data.message || 'Error al crear proveedor', 'error');
      return false;
    } catch (err: any) {
      Swal.fire('Error', err.message, 'error');
      return false;
    } finally {
      setProcesando(false);
    }
  };

  const editarProveedor = async (id_proveedor: number, proveedor: ProveedorRequest) => {
    try {
      setProcesando(true);
      Swal.fire({
        title: 'Actualizando...',
        text: 'Por favor, espera',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });
      const data = await ProveedorService.actualizarProveedor(id_proveedor, proveedor);
      if (data.success && data.proveedor) {
        setProveedores((prev) =>
          prev.map((p) => (p.id_proveedor === id_proveedor ? data.proveedor! : p))
        );
        Swal.fire('¡Éxito!', 'Proveedor actualizado exitosamente', 'success');
        return true;
      }
      Swal.fire('Error', data.message || 'Error al actualizar proveedor', 'error');
      return false;
    } catch (err: any) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
      return false;
    } finally {
      setProcesando(false);
    }
  };

  const cambiarEstadoProveedor = async (id_proveedor: number, estadoActual: boolean) => {
    try {
      setProcesando(true);
      Swal.fire({
        title: 'Procesando...',
        text: 'Cambiando estado del proveedor',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });
      
      const res = estadoActual
        ? await ProveedorService.desactivarProveedor(id_proveedor)
        : await ProveedorService.activarProveedor(id_proveedor);

      if (res.success && res.proveedor) {
        setProveedores((prev) =>
          prev.map((p) => (p.id_proveedor === id_proveedor ? res.proveedor! : p))
        );
        Swal.fire('¡Éxito!', 'Estado cambiado correctamente', 'success');
        return true;
      }
      Swal.fire('Error', res.message || 'Error al cambiar estado', 'error');
      return false;
    } catch (err: any) {
      Swal.fire('Error', err.message, 'error');
      return false;
    } finally {
      setProcesando(false);
    }
  };

  return {
    proveedores,
    cargando,
    procesando,
    error,
    refrescar: fetchProveedores,
    agregarProveedor,
    editarProveedor,
    cambiarEstadoProveedor,
  };
};

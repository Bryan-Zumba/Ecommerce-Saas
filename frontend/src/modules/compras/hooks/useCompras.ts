import { useCallback, useMemo, useState } from 'react';
import { CompraService } from '../services/CompraService';
import { CompraEmpresa, DetalleCompra, EstadoCompra } from '../types/CompraTypes';
import Swal from 'sweetalert2';

export const useCompras = () => {
  const [compras, setCompras] = useState<CompraEmpresa[]>([]);
  const [detalleCompra, setDetalleCompra] = useState<DetalleCompra[]>([]);
  const [compraSeleccionada, setCompraSeleccionada] = useState<CompraEmpresa | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoCompra | 'Todos'>('Todos');

  const fetchCompras = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await CompraService.obtenerComprasEmpresa();
      if (response.success) {
        setCompras(response.compras ?? []);
      }
    } catch (err: any) {
      setError(err?.message || 'Error al obtener compras');
    } finally {
      setLoading(false);
    }
  }, []);

  const seleccionarCompra = useCallback(async (compra: CompraEmpresa) => {
    setCompraSeleccionada(compra);
    setDetalleCompra([]);
    setLoadingDetalle(true);
    setError(null);
    try {
      const response = await CompraService.obtenerDetalleCompra(compra.id_compra);
      if (response.success) {
        setDetalleCompra(response.detalleCompra ?? []);
      }
    } catch (err: any) {
      setError(err?.message || 'Error al obtener detalle de compra');
    } finally {
      setLoadingDetalle(false);
    }
  }, []);

  const comprasFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return compras.filter((compra) => {
      const coincideEstado = estadoFiltro === 'Todos' || compra.estado_compra === estadoFiltro;
      const coincideTexto = !texto
        || compra.codigo_factura.toLowerCase().includes(texto)
        || String(compra.id_compra).includes(texto)
        || String(compra.id_proveedor).includes(texto);

      return coincideEstado && coincideTexto;
    });
  }, [busqueda, compras, estadoFiltro]);

  const aprobarCompra = useCallback(async (id_compra: number) => {
    const confirmacion = await Swal.fire({
      title: '¿Aprobar solicitud?',
      text: 'Se sumará el stock a los productos y se registrará el egreso en caja.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aprobar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
    });

    if (!confirmacion.isConfirmed) return;

    Swal.fire({
      title: 'Procesando...',
      text: 'Aprobando la compra y actualizando inventarios.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await CompraService.aprobarCompra(id_compra);
      if (response.success) {
        await Swal.fire('¡Éxito!', 'La compra ha sido aprobada correctamente.', 'success');
        // Refrescar compras
        await fetchCompras();
        setCompraSeleccionada(null);
        setDetalleCompra([]);
      } else {
        Swal.fire('Error', response.message || 'No se pudo aprobar la compra', 'error');
      }
    } catch (err: any) {
      Swal.fire('Error', err?.message || 'Error en la petición de aprobación', 'error');
    }
  }, [fetchCompras]);

  const rechazarCompra = useCallback(async (id_compra: number) => {
    const confirmacion = await Swal.fire({
      title: '¿Rechazar solicitud?',
      text: 'Se cancelará el registro de compra. Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Rechazar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
    });

    if (!confirmacion.isConfirmed) return;

    Swal.fire({
      title: 'Procesando...',
      text: 'Rechazando y cancelando la solicitud de compra.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await CompraService.rechazarCompra(id_compra);
      if (response.success) {
        await Swal.fire('Cancelada', 'La compra ha sido rechazada y cancelada.', 'success');
        // Refrescar compras
        await fetchCompras();
        setCompraSeleccionada(null);
        setDetalleCompra([]);
      } else {
        Swal.fire('Error', response.message || 'No se pudo rechazar la compra', 'error');
      }
    } catch (err: any) {
      Swal.fire('Error', err?.message || 'Error en la petición de rechazo', 'error');
    }
  }, [fetchCompras]);

  const deseleccionarCompra = useCallback(() => {
    setCompraSeleccionada(null);
    setDetalleCompra([]);
  }, []);

  return {
    compras,
    comprasFiltradas,
    detalleCompra,
    compraSeleccionada,
    loading,
    loadingDetalle,
    error,
    busqueda,
    estadoFiltro,
    setBusqueda,
    setEstadoFiltro,
    fetchCompras,
    seleccionarCompra,
    aprobarCompra,
    rechazarCompra,
    deseleccionarCompra,
  };
};


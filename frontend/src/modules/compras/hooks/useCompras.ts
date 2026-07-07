import { useCallback, useMemo, useState } from 'react';
import { CompraService } from '../services/CompraService';
import { CompraEmpresa, DetalleCompra, EstadoCompra } from '../types/CompraTypes';

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
  };
};


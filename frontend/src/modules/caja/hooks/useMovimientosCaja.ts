import { useState, useEffect, useCallback } from 'react';
import { MovimientoCaja, TipoMovimientoCaja } from '../types/MovimientoCajaTypes';
import { MovimientoCajaService } from '../services/MovimientoCajaService';

export const useMovimientosCaja = () => {
  const [movimientos, setMovimientos] = useState<MovimientoCaja[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [movimientoSeleccionado, setMovimientoSeleccionado] = useState<MovimientoCaja | null>(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState<TipoMovimientoCaja | 'Todos'>('Todos');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const fetchMovimientos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await MovimientoCajaService.obtenerMovimientos();
      if (Array.isArray(data)) {
        setMovimientos(data);
      } else {
        setMovimientos([]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al obtener movimientos de caja');
      setMovimientos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const selectMovimiento = async (id: number) => {
    setLoadingDetalle(true);
    try {
      const data = await MovimientoCajaService.obtenerMovimientoPorId(id);
      setMovimientoSeleccionado(data);
    } catch (err: any) {
      console.error('Error al obtener detalle del movimiento', err);
    } finally {
      setLoadingDetalle(false);
    }
  };

  useEffect(() => {
    fetchMovimientos();
  }, [fetchMovimientos]);

  // Filtrado de movimientos local
  const filteredMovimientos = movimientos.filter((mov) => {
    // 1. Filtrado por termino (referencia o responsable)
    const term = searchTerm.toLowerCase();
    const matchesTerm =
      mov.referencia.toLowerCase().includes(term) ||
      `${mov.turno_caja?.usuario?.nombres} ${mov.turno_caja?.usuario?.apellidos}`.toLowerCase().includes(term) ||
      mov.turno_caja?.caja?.nombre.toLowerCase().includes(term);

    // 2. Filtrado por tipo
    const matchesTipo = tipoFiltro === 'Todos' || mov.tipo_movimiento === tipoFiltro;

    // 3. Filtrado por fechas
    let matchesFecha = true;
    if (fechaInicio) {
      const fInicio = new Date(fechaInicio);
      const fMov = new Date(mov.fecha_movimiento);
      matchesFecha = matchesFecha && fMov >= fInicio;
    }
    if (fechaFin) {
      const fFin = new Date(fechaFin);
      fFin.setHours(23, 59, 59, 999);
      const fMov = new Date(mov.fecha_movimiento);
      matchesFecha = matchesFecha && fMov <= fFin;
    }

    return matchesTerm && matchesTipo && matchesFecha;
  });

  const limpiarFiltros = () => {
    setSearchTerm('');
    setTipoFiltro('Todos');
    setFechaInicio('');
    setFechaFin('');
  };

  return {
    movimientos: filteredMovimientos,
    allMovimientos: movimientos,
    loading,
    error,
    movimientoSeleccionado,
    loadingDetalle,
    searchTerm,
    setSearchTerm,
    tipoFiltro,
    setTipoFiltro,
    fechaInicio,
    setFechaInicio,
    fechaFin,
    setFechaFin,
    fetchMovimientos,
    selectMovimiento,
    setMovimientoSeleccionado,
    limpiarFiltros,
  };
};

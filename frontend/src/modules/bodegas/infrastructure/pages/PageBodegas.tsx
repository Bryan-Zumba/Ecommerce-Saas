import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBodegas } from '../../application/useBodegas';
import { LocalstorageBodegaRepository } from '../repositories/LocalstorageBodegaRepository';
import { KPICards } from '../components/KPICards';
import { BusquedaBodega } from '../components/BusquedaBodega';
import { TarjetasBodegas } from '../components/TarjetasBodegas';
import { TablaBodegas } from '../components/TablaBodegas';
import { FormularioBodega } from '../components/FormularioBodega';
import { ConfirmacionEliminar } from '../components/ConfirmacionEliminar';
import { ToastContainer, Toast } from '../components/ToastContainer';
import { Bodega } from '../../domain/Bodega';

const repository = new LocalstorageBodegaRepository();

export const PageBodegas: React.FC = () => {
  const navigate = useNavigate();
  const {
    bodegas,
    cargando,
    error,
    agregarBodega,
    actualizarBodega,
    toggleEstadoBodega,
    eliminarBodega,
    restaurarDemo,
  } = useBodegas(repository);

  // Vista activa: 'tarjetas' | 'tabla'
  const [vista, setVista] = useState<'tarjetas' | 'tabla'>('tarjetas');

  // Filtros y búsqueda
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'activas' | 'inactivas'>('todos');
  const [ordenarPor, setOrdenarPor] = useState<'nombre' | 'fecha_reciente' | 'id'>('nombre');

  // Sistema de Toasts (Notificaciones)
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Modales
  const [estaFormAbierto, setEstaFormAbierto] = useState(false);
  const [bodegaAEditar, setBodegaAEditar] = useState<Bodega | null>(null);
  const [bodegaAEliminar, setBodegaAEliminar] = useState<Bodega | null>(null);

  const lanzarToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const nuevoToast: Toast = {
      id: Date.now() + Math.random(),
      message,
      type
    };
    setToasts((prev) => [...prev, nuevoToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== nuevoToast.id));
    }, 3000);
  }, []);

  // Abrir formulario para Crear
  const manejarAbrirCrear = () => {
    setBodegaAEditar(null);
    setEstaFormAbierto(true);
  };

  // Abrir formulario para Editar
  const manejarAbrirEditar = (bodega: Bodega) => {
    setBodegaAEditar(bodega);
    setEstaFormAbierto(true);
  };

  // Guardar (Creación o Edición)
  const manejarGuardar = async (datosFormulario: {
    nombre: string;
    descripcion: string;
    ubicacion: string;
    estado: boolean;
  }) => {
    // Validaciones
    if (!datosFormulario.nombre.trim()) {
      lanzarToast("El nombre de la bodega es requerido.", "error");
      return;
    }
    if (datosFormulario.nombre.length > 30) {
      lanzarToast("El nombre no puede superar los 30 caracteres.", "error");
      return;
    }
    if (datosFormulario.descripcion.length > 50) {
      lanzarToast("La descripción no puede superar los 50 caracteres.", "error");
      return;
    }
    if (datosFormulario.ubicacion.length > 30) {
      lanzarToast("La ubicación no puede superar los 30 caracteres.", "error");
      return;
    }

    if (bodegaAEditar) {
      // Editar
      const res = await actualizarBodega(bodegaAEditar.id_bodega, {
        nombre: datosFormulario.nombre,
        descripcion: datosFormulario.descripcion,
        ubicacion: datosFormulario.ubicacion,
        estado: datosFormulario.estado,
      });

      if (res.success) {
        lanzarToast(`Bodega "${datosFormulario.nombre}" actualizada exitosamente.`, "success");
      } else {
        lanzarToast(res.error || "Error al actualizar la bodega", "error");
      }
    } else {
      // Crear
      const res = await agregarBodega({
        id_empresa: 1, // Empresa por defecto
        nombre: datosFormulario.nombre,
        descripcion: datosFormulario.descripcion,
        ubicacion: datosFormulario.ubicacion,
        estado: datosFormulario.estado,
      });

      if (res.success) {
        lanzarToast(`Bodega "${datosFormulario.nombre}" creada correctamente.`, "success");
      } else {
        lanzarToast(res.error || "Error al crear la bodega", "error");
      }
    }

    setEstaFormAbierto(false);
  };

  // Switch rápido de estado en línea (Toggle)
  const manejarToggleEstado = async (id: number, nombreBodega: string, estadoActual: boolean) => {
    const res = await toggleEstadoBodega(id);
    if (res.success) {
      lanzarToast(
        `Bodega "${nombreBodega}" ahora está ${!estadoActual ? 'Activa 🟢' : 'Inactiva 🔴'}.`,
        'info'
      );
    } else {
      lanzarToast(res.error || "Error al cambiar el estado de la bodega", "error");
    }
  };

  // Abrir confirmación de eliminación
  const manejarAbrirEliminar = (bodega: Bodega) => {
    setBodegaAEliminar(bodega);
  };

  // Confirmar eliminación
  const manejarConfirmarEliminar = async () => {
    if (bodegaAEliminar) {
      const res = await eliminarBodega(bodegaAEliminar.id_bodega);
      if (res.success) {
        lanzarToast(`Bodega "${bodegaAEliminar.nombre}" eliminada de forma permanente.`, "success");
      } else {
        lanzarToast(res.error || "Error al eliminar la bodega", "error");
      }
      setBodegaAEliminar(null);
    }
  };

  // Restablecer datos semilla si está vacío
  const manejarRestaurarSemilla = async () => {
    await restaurarDemo();
    lanzarToast("Datos de demostración restablecidos.", "info");
  };

  // ==========================================
  // Filtrado y Ordenamiento Reactivo
  // ==========================================
  const counts = useMemo(() => {
    return {
      todas: bodegas.length,
      activas: bodegas.filter((b) => b.estado).length,
      inactivas: bodegas.filter((b) => !b.estado).length
    };
  }, [bodegas]);

  const bodegasProcesadas = useMemo(() => {
    let resultado = [...bodegas];

    // Búsqueda por texto (Nombre o Ubicación o Descripción)
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      resultado = resultado.filter(
        (b) =>
          b.nombre.toLowerCase().includes(q) ||
          b.ubicacion.toLowerCase().includes(q) ||
          b.descripcion.toLowerCase().includes(q)
      );
    }

    // Filtro por píldora de estado
    if (filtroEstado === 'activas') {
      resultado = resultado.filter((b) => b.estado);
    } else if (filtroEstado === 'inactivas') {
      resultado = resultado.filter((b) => !b.estado);
    }

    // Ordenamiento
    resultado.sort((a, b) => {
      if (ordenarPor === 'nombre') {
        return a.nombre.localeCompare(b.nombre);
      } else if (ordenarPor === 'fecha_reciente') {
        return new Date(b.fecha_registro).getTime() - new Date(a.fecha_registro).getTime();
      } else {
        return a.id_bodega - b.id_bodega;
      }
    });

    return resultado;
  }, [bodegas, busqueda, filtroEstado, ordenarPor]);

  return (
    <div className="min-h-screen bg-gray-50/50 animate-in fade-in duration-500 relative flex flex-col">
      {/* Barra Superior de Navegación */}
      <nav className="bg-white border-b border-gray-100 py-4 px-6 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors font-semibold group text-sm"
          >
            <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Volver al Inicio
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl">🏬</span>
            <div className="font-extrabold text-lg text-emerald-600 tracking-tight">SaaS Bodegas</div>
          </div>
        </div>
      </nav>

      {/* Contenedor Principal */}
      <main className="max-w-7xl mx-auto p-6 lg:p-10 flex-1 w-full text-left">
        {/* Cabecera de Página */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="text-left">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight flex flex-wrap items-center gap-3">
              Gestión de Bodegas
              <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Módulo Administrativo
              </span>
            </h1>
            <p className="text-gray-500 mt-1 font-medium text-sm lg:text-base">
              Administra el inventario de ubicaciones físicas, sucursales y centros de distribución de tu negocio.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {bodegas.length === 0 && (
              <button
                onClick={manejarRestaurarSemilla}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 shadow-sm"
              >
                🔄 Restaurar Demo
              </button>
            )}
            <button
              onClick={manejarAbrirCrear}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-emerald-600/20 flex items-center gap-2"
            >
              <span>➕</span> Nueva Bodega
            </button>
          </div>
        </div>

        {/* Panel de KPIs */}
        <KPICards
          total={counts.todas}
          activas={counts.activas}
          inactivas={counts.inactivas}
        />

        {/* Filtros y Buscador */}
        <BusquedaBodega
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          ordenarPor={ordenarPor}
          setOrdenarPor={setOrdenarPor}
          vista={vista}
          setVista={setVista}
          filtroEstado={filtroEstado}
          setFiltroEstado={setFiltroEstado}
          counts={counts}
        />

        {/* Mensaje de Error global */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl font-medium text-left">
            ⚠️ {error}
          </div>
        )}

        {/* Listado de Bodegas */}
        {cargando ? (
          <div className="bg-white rounded-[2.5rem] p-12 text-center border border-gray-100 shadow-sm">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mb-2"></div>
            <p className="text-gray-400 text-sm font-medium">Cargando bodegas...</p>
          </div>
        ) : bodegasProcesadas.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-12 text-center border border-gray-100 shadow-sm">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No se encontraron bodegas</h3>
            <p className="text-gray-400 max-w-sm mx-auto text-sm font-medium">
              Prueba modificando tus parámetros de búsqueda o filtros de estado, o bien crea una nueva bodega para comenzar.
            </p>
          </div>
        ) : vista === 'tarjetas' ? (
          <TarjetasBodegas
            bodegas={bodegasProcesadas}
            onToggleEstado={manejarToggleEstado}
            onEditar={manejarAbrirEditar}
            onEliminar={manejarAbrirEliminar}
          />
        ) : (
          <TablaBodegas
            bodegas={bodegasProcesadas}
            onToggleEstado={manejarToggleEstado}
            onEditar={manejarAbrirEditar}
            onEliminar={manejarAbrirEliminar}
          />
        )}
      </main>

      {/* Modal Formulario */}
      <FormularioBodega
        isOpen={estaFormAbierto}
        onClose={() => setEstaFormAbierto(false)}
        bodegaAEditar={bodegaAEditar}
        onGuardar={manejarGuardar}
      />

      {/* Modal Confirmar Eliminar */}
      <ConfirmacionEliminar
        bodegaAEliminar={bodegaAEliminar}
        onClose={() => setBodegaAEliminar(null)}
        onConfirmar={manejarConfirmarEliminar}
      />

      {/* Notificaciones Toasts */}
      <ToastContainer toasts={toasts} />
    </div>
  );
};

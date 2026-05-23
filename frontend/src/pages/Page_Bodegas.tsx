import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// ==========================================
// 1. Interfaces y Tipos
// ==========================================
interface Bodega {
  id_bodega: number;
  id_empresa: number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  estado: boolean;
  fecha_registro: string;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
}

// ==========================================
// 2. Datos Semilla Iniciales
// ==========================================
const DATOS_SEMILLA: Bodega[] = [
  {
    id_bodega: 1,
    id_empresa: 1,
    nombre: "Bodega Principal Guayaquil",
    descripcion: "Almacén central para la distribución a nivel nacional.",
    ubicacion: "Av. Carlos Julio Arosemena Km 3.5",
    estado: true,
    fecha_registro: "2026-01-10",
  },
  {
    id_bodega: 2,
    id_empresa: 1,
    nombre: "Sucursal Norte Quito",
    descripcion: "Bodega secundaria para despachos rápidos en la sierra.",
    ubicacion: "Av. 10 de Agosto y Orellana",
    estado: true,
    fecha_registro: "2026-02-15",
  },
  {
    id_bodega: 3,
    id_empresa: 1, // session-based
    nombre: "Centro Distribución Cuenca",
    descripcion: "Bodega pequeña y punto de retiro local.",
    ubicacion: "Calle Larga y Benigno Malo",
    estado: false,
    fecha_registro: "2026-04-01",
  }
];

function Page_Bodegas() {
  const navigate = useNavigate();

  // ==========================================
  // 3. Estados Principales
  // ==========================================
  const [bodegas, setBodegas] = useState<Bodega[]>(() => {
    const saved = localStorage.getItem('saas_bodegas');
    return saved ? JSON.parse(saved) : DATOS_SEMILLA;
  });

  // Persistencia de bodegas en localStorage
  useEffect(() => {
    localStorage.setItem('saas_bodegas', JSON.stringify(bodegas));
  }, [bodegas]);

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

  // Formulario temporal (se omite id_empresa ya que proviene de la sesión interna/por defecto)
  const [formNombre, setFormNombre] = useState('');
  const [formDescripcion, setFormDescripcion] = useState('');
  const [formUbicacion, setFormUbicacion] = useState('');
  const [formEstado, setFormEstado] = useState(true);

  // ==========================================
  // 4. Funciones Auxiliares / Lógica de Toasts
  // ==========================================
  const lanzarToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const nuevoToast: Toast = {
      id: Date.now() + Math.random(),
      message,
      type
    };
    setToasts((prev) => [...prev, nuevoToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== nuevoToast.id));
    }, 3000);
  };

  // ==========================================
  // 5. CRUD Operations
  // ==========================================
  
  // Abrir formulario para Crear
  const manejarAbrirCrear = () => {
    setBodegaAEditar(null);
    setFormNombre('');
    setFormDescripcion('');
    setFormUbicacion('');
    setFormEstado(true);
    setEstaFormAbierto(true);
  };

  // Abrir formulario para Editar
  const manejarAbrirEditar = (bodega: Bodega) => {
    setBodegaAEditar(bodega);
    setFormNombre(bodega.nombre);
    setFormDescripcion(bodega.descripcion);
    setFormUbicacion(bodega.ubicacion);
    setFormEstado(bodega.estado);
    setEstaFormAbierto(true);
  };

  // Guardar (Creación o Edición)
  const manejarGuardar = (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formNombre.trim()) {
      lanzarToast("El nombre de la bodega es requerido.", "error");
      return;
    }
    if (formNombre.length > 30) {
      lanzarToast("El nombre no puede superar los 30 caracteres.", "error");
      return;
    }
    if (formDescripcion.length > 50) {
      lanzarToast("La descripción no puede superar los 50 caracteres.", "error");
      return;
    }
    if (formUbicacion.length > 30) {
      lanzarToast("La ubicación no puede superar los 30 caracteres.", "error");
      return;
    }

    if (bodegaAEditar) {
      // Editar
      setBodegas((prev) =>
        prev.map((b) =>
          b.id_bodega === bodegaAEditar.id_bodega
            ? {
                ...b,
                nombre: formNombre.trim(),
                descripcion: formDescripcion.trim(),
                ubicacion: formUbicacion.trim(),
                estado: formEstado,
                // id_empresa permanece intacto como estaba
              }
            : b
        )
      );
      lanzarToast(`Bodega "${formNombre.trim()}" actualizada exitosamente.`, "success");
    } else {
      // Crear
      const nuevoId = bodegas.length > 0 ? Math.max(...bodegas.map((b) => b.id_bodega)) + 1 : 1;
      const nuevaBodega: Bodega = {
        id_bodega: nuevoId,
        id_empresa: 1, // Empresa default (obtenida de la sesión bajo el capó)
        nombre: formNombre.trim(),
        descripcion: formDescripcion.trim(),
        ubicacion: formUbicacion.trim(),
        estado: formEstado,
        fecha_registro: new Date().toISOString().split('T')[0]
      };
      setBodegas((prev) => [nuevaBodega, ...prev]);
      lanzarToast(`Bodega "${formNombre.trim()}" creada correctamente.`, "success");
    }

    setEstaFormAbierto(false);
  };

  // Switch rápido de estado en línea (Toggle)
  const manejarToggleEstado = (id: number, nombreBodega: string, estadoActual: boolean) => {
    setBodegas((prev) =>
      prev.map((b) => (b.id_bodega === id ? { ...b, estado: !b.estado } : b))
    );
    lanzarToast(
      `Bodega "${nombreBodega}" ahora está ${!estadoActual ? 'Activa 🟢' : 'Inactiva 🔴'}.`,
      'info'
    );
  };

  // Abrir confirmación de eliminación
  const manejarAbrirEliminar = (bodega: Bodega) => {
    setBodegaAEliminar(bodega);
  };

  // Confirmar eliminación
  const manejarConfirmarEliminar = () => {
    if (bodegaAEliminar) {
      setBodegas((prev) => prev.filter((b) => b.id_bodega !== bodegaAEliminar.id_bodega));
      lanzarToast(`Bodega "${bodegaAEliminar.nombre}" eliminada de forma permanente.`, "success");
      setBodegaAEliminar(null);
    }
  };

  // Restablecer datos semilla si está vacío
  const manejarRestaurarSemilla = () => {
    setBodegas(DATOS_SEMILLA);
    lanzarToast("Datos de demostración restablecidos.", "info");
  };

  // ==========================================
  // 6. Filtrado y Ordenamiento Reactivo
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

    // Búsqueda por texto (Nombre o Ubicación)
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

  // ==========================================
  // 7. Renderizado
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-50/50 animate-in fade-in duration-500 relative flex flex-col">
      {/* 7.1 Barra Superior de Navegación */}
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
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
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

        {/* 7.2 Panel de Estadísticas Rápidas (KPIs) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 text-2xl font-bold shadow-inner">
              🏬
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Total Bodegas</p>
              <h3 className="text-3xl font-black text-gray-800">{counts.todas}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 text-2xl font-bold shadow-inner">
              🟢
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Activas</p>
              <h3 className="text-3xl font-black text-gray-800">{counts.activas}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 text-2xl font-bold shadow-inner">
              🔴
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Inactivas</p>
              <h3 className="text-3xl font-black text-gray-800">{counts.inactivas}</h3>
            </div>
          </div>
        </div>

        {/* 7.3 Filtros y Controles de Listado */}
        <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 mb-8 flex flex-col gap-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Buscador de Texto */}
            <div className="relative flex-1 max-w-md">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 text-sm">🔍</span>
              <input
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 border border-gray-100 rounded-2xl bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-sm font-medium"
                placeholder="Buscar bodega por nombre, ubicación o descripción..."
              />
            </div>

            {/* Alternar Vistas y Ordenamiento */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Dropdown de Orden */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ordenar:</span>
                <select
                  value={ordenarPor}
                  onChange={(e: any) => setOrdenarPor(e.target.value)}
                  className="bg-gray-50 border border-gray-100 text-gray-700 py-2 px-4 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="nombre">Nombre (A-Z)</option>
                  <option value="fecha_reciente">Fecha de Registro</option>
                  <option value="id">ID Bodega</option>
                </select>
              </div>

              <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

              {/* Botón Selector Vista Tarjetas / Tabla */}
              <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1">
                <button
                  onClick={() => setVista('tarjetas')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    vista === 'tarjetas' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  🎴 Tarjetas
                </button>
                <button
                  onClick={() => setVista('tabla')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    vista === 'tabla' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  📊 Tabla
                </button>
              </div>
            </div>

          </div>

          <div className="h-px bg-gray-100"></div>

          {/* Píldoras de Filtro por Estado */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">Filtro de Estado:</span>
            <button
              onClick={() => setFiltroEstado('todos')}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all border ${
                filtroEstado === 'todos'
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-md'
                  : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
              }`}
            >
              Todas ({counts.todas})
            </button>
            <button
              onClick={() => setFiltroEstado('activas')}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all border ${
                filtroEstado === 'activas'
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-md'
                  : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
              }`}
            >
              Activas ({counts.activas})
            </button>
            <button
              onClick={() => setFiltroEstado('inactivas')}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all border ${
                filtroEstado === 'inactivas'
                  ? 'bg-gray-600 border-gray-600 text-white shadow-md'
                  : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
              }`}
            >
              Inactivas ({counts.inactivas})
            </button>
          </div>
        </div>

        {/* 7.4 Listado de Bodegas */}
        {bodegasProcesadas.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-12 text-center border border-gray-100 shadow-sm">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No se encontraron bodegas</h3>
            <p className="text-gray-400 max-w-sm mx-auto text-sm font-medium">
              Prueba modificando tus parámetros de búsqueda o filtros de estado, o bien crea una nueva bodega para comenzar.
            </p>
          </div>
        ) : vista === 'tarjetas' ? (
          /* ========================================================
             VISTA 1: TARJETAS PREMIUM (GRID)
             ======================================================== */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {bodegasProcesadas.map((bodega) => (
              <div
                key={bodega.id_bodega}
                className="bg-white rounded-[2.5rem] border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* ID de Bodega de fondo sutil */}
                <div className="absolute right-6 top-6 text-7xl font-black text-gray-50 opacity-40 select-none group-hover:scale-110 transition-transform pointer-events-none">
                  #{bodega.id_bodega}
                </div>

                <div>
                  {/* Encabezado Tarjeta */}
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl bg-emerald-50 p-3 rounded-2xl text-emerald-600 shadow-sm block">🏬</span>
                    
                    {/* Glowing Pulse para estado activo */}
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                      <span className={`w-2.5 h-2.5 rounded-full ${bodega.estado ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]' : 'bg-gray-400'}`}></span>
                      <span className="text-[10px] font-extrabold uppercase text-gray-500 tracking-wider">
                        {bodega.estado ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>
                  </div>

                  {/* Título y Descripción */}
                  <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-emerald-600 transition-colors pr-8">
                    {bodega.nombre}
                  </h3>

                  <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6 min-h-[40px]">
                    {bodega.descripcion || <span className="italic text-gray-300">Sin descripción registrada.</span>}
                  </p>

                  <div className="h-px bg-gray-50 mb-4"></div>

                  {/* Ubicación y Fecha */}
                  <div className="space-y-2 text-xs font-semibold text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">📍</span>
                      <span className="text-gray-600 truncate" title={bodega.ubicacion}>
                        {bodega.ubicacion || <span className="italic text-gray-300">Sin ubicación asignada</span>}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">📅</span>
                      <span>Registrada: <span className="text-gray-600">{bodega.fecha_registro}</span></span>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-gray-50 my-4"></div>

                {/* Acciones e Interruptor en Tarjeta */}
                <div className="flex items-center justify-between">
                  {/* Interruptor de Estado Rápido */}
                  <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bodega.estado}
                        onChange={() => manejarToggleEstado(bodega.id_bodega, bodega.nombre, bodega.estado)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                    <span className="text-[10px] font-bold text-gray-400">Estado rápido</span>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => manejarAbrirEditar(bodega)}
                      className="w-9 h-9 rounded-xl border border-gray-100 bg-white hover:bg-emerald-50 hover:text-emerald-600 transition-colors flex items-center justify-center text-gray-500 shadow-sm"
                      title="Editar bodega"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => manejarAbrirEliminar(bodega)}
                      className="w-9 h-9 rounded-xl border border-gray-100 bg-white hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center text-gray-500 shadow-sm"
                      title="Eliminar bodega"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ========================================================
             VISTA 2: TABLA DETALLADA
             ======================================================== */
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">ID</th>
                    <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Nombre / Descripción</th>
                    <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Ubicación</th>
                    <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Registro</th>
                    <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Estado rápido</th>
                    <th className="p-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bodegasProcesadas.map((bodega) => (
                    <tr key={bodega.id_bodega} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-5 text-sm font-extrabold text-gray-400">#{bodega.id_bodega}</td>
                      <td className="p-5">
                        <div className="font-bold text-gray-800 text-base">{bodega.nombre}</div>
                        <div className="text-xs text-gray-400 font-medium max-w-xs truncate">{bodega.descripcion || "Sin descripción"}</div>
                      </td>
                      <td className="p-5 text-sm font-semibold text-gray-500">
                        <span className="mr-1.5">📍</span>{bodega.ubicacion || <span className="italic text-gray-300">No asignada</span>}
                      </td>
                      <td className="p-5 text-xs font-semibold text-gray-400">{bodega.fecha_registro}</td>
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={bodega.estado}
                              onChange={() => manejarToggleEstado(bodega.id_bodega, bodega.nombre, bodega.estado)}
                              className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                          </label>
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                            bodega.estado ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {bodega.estado ? 'ACTIVO' : 'INACTIVO'}
                          </span>
                        </div>
                      </td>
                      <td className="p-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => manejarAbrirEditar(bodega)}
                            className="w-9 h-9 rounded-xl border border-gray-100 bg-white hover:bg-emerald-50 hover:text-emerald-600 transition-colors flex items-center justify-center text-gray-500 shadow-sm"
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => manejarAbrirEliminar(bodega)}
                            className="w-9 h-9 rounded-xl border border-gray-100 bg-white hover:bg-red-50 hover:text-red-600 transition-colors flex items-center justify-center text-gray-500 shadow-sm"
                            title="Eliminar"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ============================================================
         MODAL 1: FORMULARIO CREAR / EDITAR BODEGA
         ============================================================ */}
      {estaFormAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabecera Modal */}
            <div className="p-6 border-b border-gray-50 bg-gradient-to-r from-emerald-50 to-white flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-gray-900">
                  {bodegaAEditar ? "✏️ Editar Bodega" : "🏬 Registrar Nueva Bodega"}
                </h3>
                <p className="text-xs text-gray-400 font-semibold mt-1">
                  Introduce los campos correspondientes respetando las longitudes de la base de datos.
                </p>
              </div>
              <button
                onClick={() => setEstaFormAbierto(false)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-400 font-bold transition-colors flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={manejarGuardar}>
              <div className="p-6 space-y-5">
                
                {/* Nombre (Máx 30) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Nombre de la Bodega *</label>
                    <span className={`text-[10px] font-bold ${formNombre.length > 30 ? 'text-red-500' : 'text-gray-400'}`}>
                      {formNombre.length}/30 caract.
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={30}
                    value={formNombre}
                    onChange={(e) => setFormNombre(e.target.value)}
                    className="block w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm font-semibold text-gray-800 transition-all"
                    placeholder="Ej. Bodega Matriz Guayaquil"
                  />
                </div>

                {/* Ubicación (Máx 30) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Ubicación física</label>
                    <span className={`text-[10px] font-bold ${formUbicacion.length > 30 ? 'text-red-500' : 'text-gray-400'}`}>
                      {formUbicacion.length}/30 caract.
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={30}
                    value={formUbicacion}
                    onChange={(e) => setFormUbicacion(e.target.value)}
                    className="block w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm font-semibold text-gray-800 transition-all"
                    placeholder="Ej. Av. De la República N-45"
                  />
                </div>

                {/* Descripción (Máx 50) */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Descripción del Almacén</label>
                    <span className={`text-[10px] font-bold ${formDescripcion.length > 50 ? 'text-red-500' : 'text-gray-400'}`}>
                      {formDescripcion.length}/50 caract.
                    </span>
                  </div>
                  <textarea
                    maxLength={50}
                    value={formDescripcion}
                    onChange={(e) => setFormDescripcion(e.target.value)}
                    rows={3}
                    className="block w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm font-semibold text-gray-800 transition-all resize-none"
                    placeholder="Escribe detalles breves sobre el almacenamiento..."
                  />
                </div>

                {/* Estado Toggle (Ocupa todo el ancho ya que id_empresa proviene de la sesión) */}
                <div className="space-y-1.5 pt-2 flex flex-col">
                  <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">Estado Activo</label>
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formEstado}
                        onChange={(e) => setFormEstado(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                    <span className="text-sm font-bold text-gray-700">
                      {formEstado ? "Bodega Activa 🟢" : "Bodega Inactiva 🔴"}
                    </span>
                  </div>
                </div>

              </div>

              {/* Pie de Formulario */}
              <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEstaFormAbierto(false)}
                  className="bg-white border border-gray-100 hover:bg-gray-100 text-gray-700 px-5 py-3 rounded-2xl font-extrabold text-xs uppercase tracking-widest transition-all active:scale-95 shadow-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-emerald-600/10"
                >
                  {bodegaAEditar ? "Actualizar" : "Registrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
         MODAL 2: CONFIRMACIÓN DE ELIMINACIÓN PERSONALIZADA
         ============================================================ */}
      {bodegaAEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabecera Modal Eliminar */}
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 text-3xl mx-auto mb-4 animate-bounce">
                ⚠️
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">
                ¿Eliminar Bodega Permanente?
              </h3>
              <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-xs mx-auto">
                ¿Estás seguro de que deseas eliminar <span className="font-extrabold text-gray-800">"{bodegaAEliminar.nombre}"</span>? Esta acción no se puede deshacer.
              </p>
            </div>

            {/* Acciones */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setBodegaAEliminar(null)}
                className="bg-white border border-gray-100 hover:bg-gray-100 text-gray-700 px-5 py-3 rounded-2xl font-extrabold text-xs uppercase tracking-widest transition-all active:scale-95 shadow-sm"
              >
                No, Cancelar
              </button>
              <button
                type="button"
                onClick={manejarConfirmarEliminar}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-red-600/10"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
         SISTEMA DE TOASTS (FLOTANTE SUPERIOR DERECHO)
         ============================================================ */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 pointer-events-auto min-w-[280px] max-w-sm animate-in slide-in-from-right-10 duration-300 border ${
              toast.type === 'success'
                ? 'bg-white border-emerald-100 text-gray-800'
                : toast.type === 'error'
                ? 'bg-white border-red-100 text-gray-800'
                : 'bg-white border-blue-100 text-gray-800'
            }`}
          >
            {/* Icono de Toast */}
            <span className="text-xl">
              {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : '⚠️'}
            </span>
            <div className="flex-1">
              <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                {toast.type === 'success' ? 'Éxito' : toast.type === 'error' ? 'Error' : 'Aviso'}
              </p>
              <p className="text-xs font-bold text-gray-700 leading-snug mt-0.5">{toast.message}</p>
            </div>
            {/* Pequeña barra animada de progreso */}
            <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r rounded-b-2xl transition-all duration-3000 ${
              toast.type === 'success' ? 'from-emerald-400 to-emerald-600 w-full animate-out fade-out' : toast.type === 'error' ? 'from-red-400 to-red-600 w-full' : 'from-blue-400 to-blue-600 w-full'
            }`} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Page_Bodegas;

import React, { useState, useMemo, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBodegas } from '@/modules/inventario/hooks/useBodegas';
import FormularioFactura, { DatosFacturaType } from '@/modules/stock/infrastructure/components/FormularioFactura';
import MatrizProductos, { ProductoIngreso } from '@/modules/stock/infrastructure/components/MatrizProductos';
import { enviarSolicitudStock } from '@/modules/stock/infrastructure/repositories/servicioStock';
import { servicioHistorial, Operacion } from '@/modules/ventas/infrastructure/repositories/servicioHistorial';
import ModalDetalleSolicitudStock from '@/modules/stock/infrastructure/components/ModalDetalleSolicitudStock';
import { sincronizarInventarioDesdeHistorial } from '@/modules/items/application/inventarioItems';

const ID_EMPRESA = 1;

function Page_GestionStock() {
  const navigate = useNavigate();
  const [vistaActual, setVistaActual] = useState<'lista' | 'formulario'>('lista');

  // ================= ESTADOS PARA EL HISTORIAL =================
  const [historial, setHistorial] = useState<Operacion[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>('Todos');
  const [operacionSeleccionada, setOperacionSeleccionada] = useState<Operacion | null>(null);

  const cargarHistorial = () => {
    const solicitudes = servicioHistorial.obtenerSolicitudesStock();
    setHistorial(solicitudes);
  };

  useEffect(() => {
    if (vistaActual === 'lista') {
      cargarHistorial();
    }
  }, [vistaActual]);

  const solicitudesFiltradas = useMemo(() => {
    if (filtroEstado === 'Todos') return historial;
    return historial.filter(op => op.estado === filtroEstado);
  }, [historial, filtroEstado]);

  const handleAprobar = (idInterno: number) => {
    const exito = servicioHistorial.actualizarEstadoOperacion(idInterno, 'Aprobado');
    if (exito) {
      sincronizarInventarioDesdeHistorial();
      alert("Solicitud Aprobada correctamente.");
      setOperacionSeleccionada(null);
      cargarHistorial();
    }
  };

  const handleRechazar = (idInterno: number, motivo: string) => {
    const exito = servicioHistorial.actualizarEstadoOperacion(idInterno, 'Rechazado', motivo);
    if (exito) {
      alert("Solicitud Rechazada.");
      setOperacionSeleccionada(null);
      cargarHistorial();
    }
  };

  const calcularTotalOperacion = (operacion: Operacion) => {
    if (operacion.productos && operacion.productos.length > 0) {
      return operacion.productos.reduce((acc, p) => acc + (p.cantidad * p.costoUnitario), 0);
    }
    return 0;
  };

  const getColorPorEstado = (estado?: string) => {
    switch (estado) {
      case 'Aprobado': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Rechazado': return 'bg-red-100 text-red-800 border-red-200';
      case 'Pendiente': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // ================= ESTADOS PARA EL FORMULARIO =================
  const { bodega, loading: cargandoBodegas, fetchBodegaEmpresa: cargarBodega } = useBodegas();
  const [cargandoForm, setCargandoForm] = useState(false);
  const [exito, setExito] = useState<null | { ordenIngreso: string }>(null);
  const [bodegaSeleccionada, setBodegaSeleccionada] = useState<number | null>(null);

  const [datosFactura, setDatosFactura] = useState<DatosFacturaType>({
    codigo: '',
    fecha: '',
    total: '',
    imagenAdjunta: null
  });

  const [productos, setProductos] = useState<ProductoIngreso[]>([]);

  useEffect(() => {
    cargarBodega();
  }, [cargarBodega]);

  useEffect(() => {
    if (bodega) {
      setBodegaSeleccionada(bodega.id_bodega);
    }
  }, [bodega]);

  const resetFormulario = () => {
    setExito(null);
    setDatosFactura({ codigo: '', fecha: '', total: '', imagenAdjunta: null });
    setProductos([]);
    setBodegaSeleccionada(bodega?.id_bodega ?? null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!bodegaSeleccionada) {
      alert('Debe seleccionar una bodega antes de enviar la solicitud.');
      return;
    }
    if (productos.length === 0) {
      alert("Debe agregar al menos un producto a la matriz.");
      return;
    }

    const productosIncompletos = productos.some(p => !p.productoId || p.cantidad <= 0 || p.costoUnitario <= 0);
    if (productosIncompletos) {
      alert("Por favor, complete todos los campos de los productos en la matriz.");
      return;
    }

    setCargandoForm(true);
    try {
      const resultado = await enviarSolicitudStock(datosFactura, productos, bodegaSeleccionada);

      // Guardar en el historial personal
      servicioHistorial.guardarOperacion({
        tipo: 'stock',
        ordenId: resultado.ordenIngreso,
        datosFactura: { ...datosFactura },
        productos: [...productos],
        estado: 'Pendiente',
        cajero: "Bryan Zumba", // Ajustar según usuario logueado
        bodegaId: bodegaSeleccionada
      });

      setExito(resultado);
    } catch (error: any) {
      console.error("Error al enviar la solicitud", error);
      alert("Hubo un error al procesar la solicitud.");
    } finally {
      setCargandoForm(false);
    }
  };


  // ================= RENDERIZADO =================
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Encabezado Principal */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            {vistaActual === 'formulario' && (
              <button
                onClick={() => { setVistaActual('lista'); resetFormulario(); }}
                className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                ←
              </button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {vistaActual === 'lista' ? 'Gestión de Solicitudes de Stock' : 'Nueva Solicitud de Ingreso'}
              </h1>
              <p className="text-gray-500">
                {vistaActual === 'lista' 
                  ? 'Consulta el historial y gestiona las solicitudes de ingreso.' 
                  : 'Registre los datos de la factura y los productos a ingresar.'}
              </p>
            </div>
          </div>

          {vistaActual === 'lista' && (
            <button
              onClick={() => setVistaActual('formulario')}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2"
            >
              <span className="text-xl leading-none">+</span> Solicitar Registro
            </button>
          )}
        </div>

        {/* CONTENIDO: VISTA DE LISTA */}
        {vistaActual === 'lista' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b flex flex-wrap gap-2">
              {['Todos', 'Pendiente', 'Aprobado', 'Rechazado'].map(estado => (
                <button
                  key={estado}
                  onClick={() => setFiltroEstado(estado)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filtroEstado === estado 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {estado}
                </button>
              ))}
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 font-semibold text-gray-600 text-sm">Fecha</th>
                    <th className="p-4 font-semibold text-gray-600 text-sm">Nº Orden</th>
                    <th className="p-4 font-semibold text-gray-600 text-sm">Bodega Destino</th>
                    <th className="p-4 font-semibold text-gray-600 text-sm">Cajero</th>
                    <th className="p-4 font-semibold text-gray-600 text-sm text-right">Total Solicitado</th>
                    <th className="p-4 font-semibold text-gray-600 text-sm text-center">Estado</th>
                    <th className="p-4 font-semibold text-gray-600 text-sm text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {solicitudesFiltradas.length > 0 ? (
                    solicitudesFiltradas.map((op) => (
                      <tr key={op.idInterno} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 text-sm text-gray-700">
                          {new Date(op.fechaRegistro).toLocaleDateString()} {new Date(op.fechaRegistro).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </td>
                        <td className="p-4 text-sm font-medium text-gray-900">{op.ordenId}</td>
                        <td className="p-4 text-sm text-gray-700">{op.bodegaId || 'N/A'}</td>
                        <td className="p-4 text-sm text-gray-700">{op.cajero}</td>
                        <td className="p-4 text-sm font-medium text-gray-900 text-right">
                          ${calcularTotalOperacion(op).toFixed(2)}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getColorPorEstado(op.estado)}`}>
                            {op.estado}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => setOperacionSeleccionada(op)}
                            className="text-emerald-600 hover:text-emerald-800 text-sm font-medium underline"
                          >
                            Ver Detalle
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-500">
                        No se encontraron solicitudes de stock.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CONTENIDO: VISTA DE FORMULARIO */}
        {vistaActual === 'formulario' && (
          exito ? (
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center mx-auto mt-10">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                ✓
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Solicitud Enviada!</h2>
              <p className="text-gray-600 mb-6">
                La solicitud de ingreso de stock se ha enviado correctamente.
              </p>
              <div className="bg-gray-50 p-4 rounded-xl mb-8 border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Orden de Ingreso</p>
                <p className="text-xl font-mono font-bold text-gray-800">{exito.ordenIngreso}</p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => resetFormulario()}
                  className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                >
                  Nueva Solicitud
                </button>
                <button
                  onClick={() => { setVistaActual('lista'); resetFormulario(); }}
                  className="w-full bg-white text-gray-700 border border-gray-200 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Volver al Historial
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Bodega de Destino</label>
                {cargandoBodegas ? (
                  <p className="text-gray-500 text-sm">Cargando bodega...</p>
                ) : (
                  <select
                    value={bodegaSeleccionada ?? ''}
                    onChange={e => setBodegaSeleccionada(Number(e.target.value) || null)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                  >
                    <option value="">-- Seleccione una bodega --</option>
                    {bodega && (
                      <option key={bodega.id_bodega} value={bodega.id_bodega}>
                        {bodega.nombre}
                      </option>
                    )}
                  </select>
                )}
              </div>
              
              <FormularioFactura datos={datosFactura} setDatos={setDatosFactura} />

              <div className="mt-8">
                <MatrizProductos productos={productos} setProductos={setProductos} />
              </div>

              {/* Botones de acción formulario */}
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setVistaActual('lista')}
                  className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={cargandoForm}
                  className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
                >
                  {cargandoForm ? 'Enviando...' : 'Enviar Solicitud'}
                </button>
              </div>
            </form>
          )
        )}

      </div>

      {/* MODAL DE DETALLES Y APROBACIÓN */}
      {operacionSeleccionada && (
        <ModalDetalleSolicitudStock
          operacion={operacionSeleccionada}
          onClose={() => setOperacionSeleccionada(null)}
          onAprobar={handleAprobar}
          onRechazar={handleRechazar}
        />
      )}
    </div>
  );
}

export default Page_GestionStock;

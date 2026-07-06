import React, { useState, useEffect, useRef, FormEvent } from 'react';
import Swal from 'sweetalert2';
import { useBodegas } from '../hooks/useBodegas';
import { useItems } from '../hooks/useItems';
import { ProveedorService } from '@/modules/proveedores/services/ProveedorService';
import { ProveedorLocal } from '@/modules/proveedores/types/ProveedorTypes';
import { CompraService } from '../services/CompraService';
import { FilaDetalle } from '../types/CompraTypes';
import { Tipo_Item } from '../types/ItemTypes';
import { useNavigate } from 'react-router-dom';

// ─── helpers ──────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2);

function filaVacia(idBodega: number | null, item?: { id_item: number; nombre: string; costo: number | string }): FilaDetalle {
  return {
    id_fila: uid(),
    id_item: item?.id_item ?? null,
    nombre_item: item?.nombre ?? '',
    id_bodega: idBodega,
    cantidad: 1,
    costo_unitario: item ? Number(item.costo) : 0,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
export const PageSolicitudCompra: React.FC = () => {
  const navigate = useNavigate();
  const { bodega, fetchBodegaEmpresa, loading: cargandoBodega } = useBodegas();
  const { items, fetchItems } = useItems();
  const [proveedores, setProveedores] = useState<ProveedorLocal[]>([]);
  const [cargandoProveedores, setCargandoProveedores] = useState(false);

  useEffect(() => {
    fetchBodegaEmpresa();
    fetchItems();
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    setCargandoProveedores(true);
    try {
      const res = await ProveedorService.obtenerProveedores();
      if (res.success) setProveedores(res.proveedores.filter(p => p.estado));
    } catch { /* silent */ }
    finally { setCargandoProveedores(false); }
  };

  // ── Estado formulario ───────────────────────────────────────────────────────
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState<ProveedorLocal | null>(null);
  const [busquedaProveedor, setBusquedaProveedor] = useState('');
  const [busquedaItem, setBusquedaItem] = useState('');
  const [codigoFactura, setCodigoFactura] = useState('');
  const [observacion, setObservacion] = useState('');
  const [imagen, setImagen] = useState<File | null>(null);
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const [filas, setFilas] = useState<FilaDetalle[]>([]);
  const [enviando, setEnviando] = useState(false);
  const imagenRef = useRef<HTMLInputElement>(null);

  // ── Reset completo del formulario ───────────────────────────────────────────
  const resetForm = () => {
    setProveedorSeleccionado(null);
    setBusquedaProveedor('');
    setBusquedaItem('');
    setCodigoFactura('');
    setObservacion('');
    setImagen(null);
    setImagenPreview(null);
    setFilas([]);
    if (imagenRef.current) imagenRef.current.value = '';
  };

  // Items solo tipo Producto activos
  const itemsProducto = items.filter(i => i.tipo_item === Tipo_Item.Producto && i.estado);
  const itemsFiltrados = itemsProducto.filter(i =>
    i.nombre.toLowerCase().includes(busquedaItem.toLowerCase())
  );
  const proveedoresFiltrados = proveedores.filter(p =>
    p.nombre.toLowerCase().includes(busquedaProveedor.toLowerCase()) ||
    (p.email?.toLowerCase().includes(busquedaProveedor.toLowerCase()) ?? false)
  );

  // ── Imagen ──────────────────────────────────────────────────────────────────
  const handleImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImagen(file);
    setImagenPreview(file ? URL.createObjectURL(file) : null);
  };

  const quitarImagen = () => {
    setImagen(null);
    setImagenPreview(null);
    if (imagenRef.current) imagenRef.current.value = '';
  };

  // ── Filas detalle ───────────────────────────────────────────────────────────
  const agregarProducto = (item: typeof itemsProducto[0]) => {
    // Si ya existe la fila, incrementar cantidad
    const existe = filas.find(f => f.id_item === item.id_item);
    if (existe) {
      setFilas(prev => prev.map(f =>
        f.id_item === item.id_item ? { ...f, cantidad: f.cantidad + 1 } : f
      ));
    } else {
      setFilas(prev => [...prev, filaVacia(bodega?.id_bodega ?? null, { id_item: item.id_item, nombre: item.nombre, costo: item.costo })]);
    }
  };

  const quitarFila = (id_fila: string) => {
    setFilas(prev => prev.filter(f => f.id_fila !== id_fila));
  };

  const actualizarFila = (id_fila: string, campo: Partial<FilaDetalle>) => {
    setFilas(prev => prev.map(f => f.id_fila === id_fila ? { ...f, ...campo } : f));
  };

  const total = filas.reduce((acc, f) => acc + f.cantidad * f.costo_unitario, 0);

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!proveedorSeleccionado) { Swal.fire('Aviso', 'Debe seleccionar un proveedor en el panel izquierdo.', 'warning'); return; }
    if (!codigoFactura.trim()) { Swal.fire('Aviso', 'El código de factura es obligatorio.', 'warning'); return; }
    if (filas.length === 0) { Swal.fire('Aviso', 'Agrega al menos un producto desde el panel izquierdo.', 'warning'); return; }
    const incompleta = filas.some(f => !f.id_item || !f.id_bodega || f.cantidad <= 0 || f.costo_unitario <= 0);
    if (incompleta) { Swal.fire('Aviso', 'Complete cantidad y costo en todos los productos.', 'warning'); return; }

    // Confirmación antes de enviar
    const confirmacion = await Swal.fire({
      title: '¿Confirmar solicitud?',
      text: `Proveedor: ${proveedorSeleccionado.nombre} · ${filas.length} producto(s) · Total: $${total.toFixed(2)}`,
      icon: 'question',
      showCancelButton: true,
      html: `<p style="color:#374151;margin:0">Proveedor: ${proveedorSeleccionado.nombre} | ${filas.length} producto(s) | Total: $${total.toFixed(2)}</p>`,
      confirmButtonColor: '#059669',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Si, enviar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    });
    if (!confirmacion.isConfirmed) return;

    setEnviando(true);
    try {
      const res = await CompraService.crearSolicitudCompra({
        id_proveedor: proveedorSeleccionado.id_proveedor,
        codigo_factura: codigoFactura.trim(),
        observacion: observacion.trim() || undefined,
        imagen: imagen ?? undefined,
        detalles: filas.map(f => ({
          id_bodega: f.id_bodega!,
          id_item: f.id_item!,
          cantidad: f.cantidad,
          costo_unitario: f.costo_unitario,
        })),
      });

      if (res.success) {
        await Swal.fire('Exito', 'Solicitud de compra creada correctamente.', 'success');
        resetForm();
        navigate('/compras');
      } else {
        Swal.fire('Error', res.message || 'No se pudo crear la solicitud.', 'error');
      }
    } catch (err: any) {
      Swal.fire('Error', err?.response?.data?.message || err.message || 'Error al enviar.', 'error');
    } finally {
      setEnviando(false);
    }
  };

  // ══════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gray-50/50 animate-in fade-in duration-500">
      <main className="max-w-[1400px] mx-auto p-6 lg:p-8">

        {/* ── Cabecera ── */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/compras')}
            className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-gray-600 font-bold flex-shrink-0"
          >
            ←
          </button>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              🧾 Solicitar Registro de Compra
            </h1>
            <p className="text-gray-500 mt-0.5 font-medium text-sm">
              Selecciona el proveedor y los productos en los paneles izquierdos, luego completa el formulario.
            </p>
          </div>
        </div>

        {/* ══ LAYOUT 2 COLUMNAS ══ */}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col xl:flex-row gap-6 items-start">

            {/* ════ COLUMNA IZQUIERDA — Paneles de selección ════ */}
            <div className="flex flex-col gap-6 w-full xl:w-[380px] xl:flex-shrink-0">

              {/* ── Panel Proveedor ── */}
              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 bg-emerald-600 rounded-t-[2rem]">
                  <p className="text-white font-extrabold uppercase tracking-widest text-[10px]">Proveedores</p>
                  <p className="text-white/70 text-xs mt-0.5">Selecciona uno para la solicitud</p>
                </div>
                {/* Buscador */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <svg className="h-3.5 w-3.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={busquedaProveedor}
                      onChange={e => setBusquedaProveedor(e.target.value)}
                      placeholder="Buscar proveedor..."
                      className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                    />
                  </div>
                </div>
                {/* Lista */}
                <div className="max-h-56 overflow-y-auto divide-y divide-gray-50">
                  {cargandoProveedores ? (
                    <div className="p-5 text-center text-gray-400 text-xs">Cargando...</div>
                  ) : proveedoresFiltrados.length === 0 ? (
                    <div className="p-5 text-center text-gray-400 text-xs">Sin resultados</div>
                  ) : proveedoresFiltrados.map(p => {
                    const seleccionado = proveedorSeleccionado?.id_proveedor === p.id_proveedor;
                    return (
                      <button
                        key={p.id_proveedor}
                        type="button"
                        onClick={() => setProveedorSeleccionado(seleccionado ? null : p)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
                          seleccionado
                            ? 'bg-emerald-50 border-l-[3px] border-emerald-500'
                            : 'hover:bg-gray-50 border-l-[3px] border-transparent'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs flex-shrink-0 transition-colors ${
                          seleccionado ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {p.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-gray-800 truncate">{p.nombre}</p>
                          <p className="text-[10px] text-gray-500 truncate">{p.email ?? p.telefono ?? '—'}</p>
                        </div>
                        {seleccionado && (
                          <span className="text-emerald-600 font-black text-base flex-shrink-0">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Panel Items / Productos ── */}
              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 bg-emerald-700 rounded-t-[2rem]">
                  <p className="text-white font-extrabold uppercase tracking-widest text-[10px]">Productos</p>
                  <p className="text-white/70 text-xs mt-0.5">Haz clic en "+" para agregar al detalle</p>
                </div>
                {/* Buscador */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <svg className="h-3.5 w-3.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={busquedaItem}
                      onChange={e => setBusquedaItem(e.target.value)}
                      placeholder="Buscar producto..."
                      className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                    />
                  </div>
                </div>
                {/* Lista */}
                <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                  {itemsFiltrados.length === 0 ? (
                    <div className="p-5 text-center text-gray-400 text-xs">Sin productos</div>
                  ) : itemsFiltrados.map(item => {
                    const yaAgregado = filas.some(f => f.id_item === item.id_item);
                    return (
                      <div
                        key={item.id_item}
                        className={`flex items-center gap-3 px-4 py-3 transition-colors ${yaAgregado ? 'bg-emerald-50/60' : 'hover:bg-gray-50'}`}
                      >
                        {/* Imagen o ícono */}
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {item.imagen_url
                            ? <img src={item.imagen_url} alt={item.nombre} className="w-full h-full object-cover" />
                            : <span className="text-emerald-600 text-sm">📦</span>
                          }
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-gray-800 truncate">{item.nombre}</p>
                          <p className="text-[10px] text-gray-500">${Number(item.costo).toFixed(2)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => agregarProducto(item)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm transition-all flex-shrink-0 ${
                            yaAgregado
                              ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-400/30'
                              : 'bg-gray-100 text-gray-500 hover:bg-emerald-500 hover:text-white'
                          }`}
                          title={yaAgregado ? 'Agregar uno más' : 'Agregar al detalle'}
                        >
                          +
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ════ COLUMNA DERECHA — Formulario ════ */}
            <div className="flex-1 min-w-0 flex flex-col gap-6">

              {/* ── Datos de la Compra ── */}
              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-7 py-5 bg-emerald-600 rounded-t-[2rem]">
                  <p className="text-white font-extrabold uppercase tracking-widest text-[10px]">Datos de la Compra</p>
                </div>
                <div className="p-7 space-y-5">

                  {/* Proveedor seleccionado (badge) */}
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-600 mb-2">
                      Proveedor Seleccionado
                    </label>
                    {proveedorSeleccionado ? (
                      <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-extrabold text-sm flex-shrink-0">
                          {proveedorSeleccionado.nombre.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-emerald-800">{proveedorSeleccionado.nombre}</p>
                          <p className="text-xs text-emerald-600">{proveedorSeleccionado.email ?? proveedorSeleccionado.telefono ?? '—'}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setProveedorSeleccionado(null)}
                          className="text-emerald-400 hover:text-red-500 transition-colors text-lg font-black"
                          title="Quitar selección"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 bg-gray-50 border border-dashed border-gray-300 rounded-xl px-4 py-3 text-gray-400 text-xs font-medium">
                        <span>←</span>
                        <span>Selecciona un proveedor en el panel izquierdo</span>
                      </div>
                    )}
                  </div>

                  {/* Código de factura */}
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-600 mb-2">
                      Código de Factura *
                    </label>
                    <input
                      type="text"
                      value={codigoFactura}
                      onChange={e => setCodigoFactura(e.target.value)}
                      maxLength={100}
                      placeholder="Ej: FAC-001-2025"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                    />
                  </div>

                  {/* Observación */}
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-600 mb-2">
                      Observación
                    </label>
                    <textarea
                      value={observacion}
                      onChange={e => setObservacion(e.target.value)}
                      maxLength={500}
                      rows={2}
                      placeholder="Notas adicionales..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 resize-none"
                    />
                  </div>

                  {/* Imagen */}
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-gray-600 mb-2">
                      Imagen de Factura
                    </label>
                    {imagenPreview ? (
                      <div className="flex items-start gap-4">
                        <img src={imagenPreview} alt="Preview" className="w-20 h-20 object-cover rounded-xl border border-gray-200" />
                        <div className="flex flex-col gap-2">
                          <p className="text-xs text-gray-600 font-medium truncate max-w-[200px]">{imagen?.name}</p>
                          <button
                            type="button"
                            onClick={quitarImagen}
                            className="text-xs text-red-500 hover:text-red-700 font-bold border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors w-fit"
                          >
                            × Quitar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex items-center gap-3 w-full border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors px-4 py-4">
                        <span className="text-xl">📎</span>
                        <span className="text-xs text-gray-500 font-medium">Haz clic para adjuntar imagen de factura</span>
                        <input
                          ref={imagenRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImagen}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Detalle de Productos ── */}
              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-7 py-5 bg-emerald-600 rounded-t-[2rem] flex items-center justify-between">
                  <div>
                    <p className="text-white font-extrabold uppercase tracking-widest text-[10px]">Detalle de Productos</p>
                    {!cargandoBodega && bodega && (
                      <p className="text-white/70 text-[10px] mt-0.5">Bodega: {bodega.nombre}</p>
                    )}
                  </div>
                  <span className="bg-white/20 text-white text-xs font-extrabold px-2.5 py-1 rounded-full">
                    {filas.length} {filas.length === 1 ? 'producto' : 'productos'}
                  </span>
                </div>

                <div className="p-7">
                  {filas.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                      <p className="text-3xl mb-2">←</p>
                      <p className="text-sm font-medium">Agrega productos desde el panel izquierdo</p>
                      <p className="text-xs mt-1">Usa el botón "+" junto a cada producto</p>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="bg-gray-50 text-gray-500 text-[10px] font-extrabold uppercase tracking-widest">
                              <th className="px-4 py-3 rounded-l-xl">Producto</th>
                              <th className="px-3 py-3 text-center w-24">Cantidad</th>
                              <th className="px-3 py-3 text-center w-28">Costo Unit.</th>
                              <th className="px-3 py-3 text-right w-24">Subtotal</th>
                              <th className="px-3 py-3 rounded-r-xl text-center w-12"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {filas.map(fila => (
                              <tr key={fila.id_fila} className="group hover:bg-gray-50/50 transition-colors">
                                {/* Nombre producto */}
                                <td className="px-4 py-3">
                                  <p className="text-xs font-bold text-gray-800 truncate max-w-[160px]">{fila.nombre_item || '—'}</p>
                                </td>
                                {/* Cantidad */}
                                <td className="px-3 py-3 text-center">
                                  <input
                                    type="number"
                                    min={1}
                                    value={fila.cantidad}
                                    onChange={e => actualizarFila(fila.id_fila, { cantidad: Math.max(1, Number(e.target.value)) })}
                                    className="w-20 text-center px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                  />
                                </td>
                                {/* Costo unitario */}
                                <td className="px-3 py-3 text-center">
                                  <input
                                    type="number"
                                    min={0}
                                    step={0.01}
                                    value={fila.costo_unitario}
                                    onChange={e => actualizarFila(fila.id_fila, { costo_unitario: Number(e.target.value) })}
                                    className="w-24 text-center px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                  />
                                </td>
                                {/* Subtotal */}
                                <td className="px-3 py-3 text-right text-xs font-bold text-gray-800">
                                  ${(fila.cantidad * fila.costo_unitario).toFixed(2)}
                                </td>
                                {/* Quitar */}
                                <td className="px-3 py-3 text-center">
                                  <button
                                    type="button"
                                    onClick={() => quitarFila(fila.id_fila)}
                                    className="w-7 h-7 flex items-center justify-center mx-auto rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-colors font-black text-sm opacity-0 group-hover:opacity-100"
                                  >
                                    ×
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          {/* Total */}
                          <tfoot>
                            <tr className="border-t-2 border-gray-100">
                              <td colSpan={3} className="px-4 pt-4 text-right text-xs font-extrabold text-gray-600 uppercase tracking-widest">
                                Total estimado:
                              </td>
                              <td className="px-3 pt-4 text-right text-base font-black text-emerald-700">
                                ${total.toFixed(2)}
                              </td>
                              <td />
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* ── Acciones ── */}
              <div className="flex justify-end gap-4 pb-4">
                <button
                  type="button"
                  onClick={() => { resetForm(); navigate('/compras'); }}
                  className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={enviando}
                  className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all active:scale-95 shadow-md shadow-emerald-600/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {enviando ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    '🛒 Enviar Solicitud de Compra'
                  )}
                </button>
              </div>

            </div>{/* fin columna derecha */}
          </div>{/* fin layout 2 cols */}
        </form>
      </main>
    </div>
  );
};

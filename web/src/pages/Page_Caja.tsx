import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "@/shared/context/ContextoCarrito";
import { servicioClientes } from "@/modules/clientes/infrastructure/repositories/servicioClientes";

/**
 * Página de Caja (Checkout)
 * Gestiona la selección de clientes, facturación y pago en efectivo.
 */
function Caja() {
    const navigate = useNavigate();
    const { carrito, total, subtotal, iva } = useCarrito();
    
    // ─── Estado del Panel de Clientes ─────────
    const [modoCliente, setModoCliente] = useState("idle"); // 'idle', 'search_result', 'create', 'edit'
    const [consultaBusqueda, setConsultaBusqueda] = useState("");
    const [errorBusqueda, setErrorBusqueda] = useState("");
    const [cargandoBusqueda, setCargandoBusqueda] = useState(false);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    
    // Formulario temporal para Crear / Editar
    const [formularioCliente, setFormularioCliente] = useState({ id: "", nombre: "", email: "", telefono: "" });
    
    // ─── Estado del formulario de Facturación ─
    const [datosCliente, setDatosCliente] = useState({ nombre: "", dni: "", email: "", telefono: "" });
    const [esConsumidorFinal, setEsConsumidorFinal] = useState(false);
    
    // ─── Estado de Pago ───────────────────────
    const [montoRecibido, setMontoRecibido] = useState("");
    const vuelto = montoRecibido !== "" ? Math.max(0, Number(montoRecibido) - total) : 0;
    const saldoFaltante = montoRecibido !== "" ? Math.max(0, total - Number(montoRecibido)) : total;

    // ─────────────────────────────────────────
    // LÓGICA: Gestión de Clientes
    // ─────────────────────────────────────────
    const buscarCliente = async () => {
        setErrorBusqueda("");
        setCargandoBusqueda(true);
        try {
            const encontrado = await servicioClientes.obtenerClientePorId(consultaBusqueda.trim());
            if (encontrado) {
                setClienteSeleccionado(encontrado);
                setModoCliente("search_result");
            } else {
                setClienteSeleccionado(null);
                setModoCliente("idle");
                setErrorBusqueda("No se encontró ningún cliente con esa cédula.");
            }
        } finally {
            setCargandoBusqueda(false);
        }
    };

    const seleccionarCliente = (cliente) => {
        setClienteSeleccionado(cliente);
        setDatosCliente({ nombre: cliente.nombre, dni: cliente.id, email: cliente.email, telefono: cliente.telefono });
        setEsConsumidorFinal(false);
        setModoCliente("search_result");
    };

    const abrirCrear = () => {
        setFormularioCliente({ id: "", nombre: "", email: "", telefono: "" });
        setModoCliente("create");
        setErrorBusqueda("");
    };

    const abrirEditar = () => {
        if (clienteSeleccionado) {
            setFormularioCliente({ ...clienteSeleccionado });
            setModoCliente("edit");
        }
    };

    const guardarCliente = async () => {
        try {
            let guardado;
            if (modoCliente === "create") {
                guardado = await servicioClientes.crearCliente(formularioCliente);
            } else {
                guardado = await servicioClientes.actualizarCliente(formularioCliente.id, formularioCliente);
            }
            setClienteSeleccionado(guardado);
            setDatosCliente({ nombre: guardado.nombre, dni: guardado.id, email: guardado.email, telefono: guardado.telefono });
            setEsConsumidorFinal(false);
            setModoCliente("search_result");
        } catch (err) {
            alert(err.message);
        }
    };

    const cancelarAccionCliente = () => {
        setModoCliente(clienteSeleccionado ? "search_result" : "idle");
    };

    // ─────────────────────────────────────────
    // LÓGICA: Facturación
    // ─────────────────────────────────────────
    const aplicarConsumidorFinal = () => {
        setEsConsumidorFinal(true);
        setDatosCliente({ nombre: "CONSUMIDOR FINAL", dni: "9999999999", email: "consumidor@final.com", telefono: "999999999" });
    };

    const manejarEntradaCliente = (e) => {
        setEsConsumidorFinal(false);
        setDatosCliente(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const finalizarVenta = (e) => {
        e.preventDefault();
        if (montoRecibido !== "" && Number(montoRecibido) >= total) {
            navigate("/success", { state: { customer: datosCliente } });
        }
    };

    if (carrito.length === 0) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Carrito vacío</h2>
              <button onClick={() => navigate("/")} className="text-emerald-600 font-semibold hover:underline">
                ← Volver a la tienda
              </button>
            </div>
          </div>
        );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button onClick={() => navigate("/")} className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors font-medium">
              <span className="mr-2">←</span> Volver a la tienda
            </button>
            <div className="font-bold text-xl text-emerald-600 italic tracking-tighter">SaaS Ecommerce</div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto p-6 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            <div className="space-y-6">
              {/* SECCIÓN 1: GESTIÓN DE CLIENTES */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-left">
                    <h2 className="text-lg font-bold text-gray-800">Gestión de Clientes</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Busca, crea o edita un cliente</p>
                  </div>
                  {modoCliente !== "create" && modoCliente !== "edit" && (
                    <button type="button" onClick={abrirCrear} className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all active:scale-95 shadow-sm shadow-emerald-200">
                      <span>+</span> Nuevo Cliente
                    </button>
                  )}
                </div>

                {(modoCliente === "idle" || modoCliente === "search_result") && (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                        <input 
                          type="text" 
                          placeholder="Buscar por Cédula / RUC..." 
                          value={consultaBusqueda} 
                          onChange={e => { setConsultaBusqueda(e.target.value); setErrorBusqueda(""); }} 
                          onKeyDown={e => e.key === "Enter" && buscarCliente()} 
                          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-gray-50 text-left"
                        />
                      </div>
                      <button type="button" onClick={buscarCliente} className="bg-gray-800 hover:bg-black text-white text-xs font-bold px-4 rounded-xl transition-all active:scale-95">
                        Buscar
                      </button>
                    </div>
                    {errorBusqueda && (<p className="text-xs text-red-500 font-medium text-left">{errorBusqueda}</p>)}

                    {modoCliente === "search_result" && clienteSeleccionado && (
                      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between gap-4">
                        <div className="text-left flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md">● Encontrado</span>
                          </div>
                          <p className="font-bold text-gray-800 text-sm leading-tight">{clienteSeleccionado.nombre}</p>
                          <p className="text-xs text-gray-500 font-mono mt-0.5">{clienteSeleccionado.id}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{clienteSeleccionado.email} · {clienteSeleccionado.telefono}</p>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <button type="button" onClick={() => seleccionarCliente(clienteSeleccionado)} className="text-[11px] font-bold px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all">
                            Seleccionar
                          </button>
                          <button type="button" onClick={abrirEditar} className="text-[11px] font-bold px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg hover:border-gray-400 transition-all">
                            Editar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {(modoCliente === "create" || modoCliente === "edit") && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${modoCliente === "create" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}>
                        {modoCliente === "create" ? "● Nuevo Registro" : "● Editando Cliente"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-left">
                      <div className="col-span-2 space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Cédula / RUC</label>
                        <input type="text" value={formularioCliente.id} onChange={e => setFormularioCliente(prev => ({ ...prev, id: e.target.value }))} placeholder="17xxxxxxxx" disabled={modoCliente === "edit"} className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400"/>
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Nombre Completo</label>
                        <input type="text" value={formularioCliente.nombre} onChange={e => setFormularioCliente(prev => ({ ...prev, nombre: e.target.value }))} placeholder="Juan Pérez" className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"/>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Email</label>
                        <input type="email" value={formularioCliente.email} onChange={e => setFormularioCliente(prev => ({ ...prev, email: e.target.value }))} placeholder="juan@ejemplo.com" className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"/>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Teléfono</label>
                        <input type="text" value={formularioCliente.telefono} onChange={e => setFormularioCliente(prev => ({ ...prev, telefono: e.target.value }))} placeholder="099xxxxxxx" className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"/>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={guardarCliente} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2.5 rounded-xl transition-all active:scale-95 shadow-sm shadow-emerald-200">
                        {modoCliente === "create" ? "Guardar y Seleccionar" : "Guardar Cambios"}
                      </button>
                      <button type="button" onClick={cancelarAccionCliente} className="px-4 border border-gray-200 text-gray-500 text-sm font-bold rounded-xl hover:border-gray-400 transition-all">
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* SECCIÓN 2: FACTURACIÓN */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-1 text-left">Facturación</h2>
                <p className="text-xs text-gray-400 mb-6 text-left">Datos del cliente para la orden actual</p>
                <form onSubmit={finalizarVenta} className="space-y-5">
                  <button type="button" onClick={aplicarConsumidorFinal} className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${esConsumidorFinal ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-100 text-gray-400 hover:border-gray-300 hover:text-gray-600'}`}>
                    👤 Consumidor Final
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Nombre</label>
                      <input required name="nombre" value={datosCliente.nombre} onChange={manejarEntradaCliente} className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="Nombre completo"/>
                    </div>
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Cédula / RUC</label>
                      <input required name="dni" value={datosCliente.dni} onChange={manejarEntradaCliente} className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="17xxxxxxxx"/>
                    </div>
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Email</label>
                      <input required type="email" name="email" value={datosCliente.email} onChange={manejarEntradaCliente} className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="correo@ejemplo.com"/>
                    </div>
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Teléfono</label>
                      <input name="telefono" value={datosCliente.telefono} onChange={manejarEntradaCliente} className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="099xxxxxxx"/>
                    </div>
                  </div>
                  <hr className="border-gray-50 my-2"/>
                  <h3 className="text-base font-bold text-gray-700 text-left">Pago en Efectivo</h3>
                  <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 space-y-4">
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-bold text-emerald-700 uppercase ml-1">Monto Recibido</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 font-bold">$</span>
                        <input required type="text" inputMode="decimal" value={montoRecibido} onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9.]/g, '');
                          if (val.split('.').length <= 2) setMontoRecibido(val);
                        }} className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 outline-none font-bold text-emerald-800 text-lg" placeholder="0.00"/>
                      </div>
                    </div>
                    <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                      <span className="text-gray-600 font-medium text-sm">Cambio (Vuelto):</span>
                      <span className={`text-2xl font-black ${vuelto > 0 ? 'text-emerald-600' : 'text-gray-300'}`}>
                        ${vuelto.toFixed(2)}
                      </span>
                    </div>
                    {saldoFaltante > 0 && montoRecibido !== "" && (
                      <p className="text-red-500 text-xs font-bold text-center animate-pulse">
                        ⚠️ Faltan ${saldoFaltante.toFixed(2)} para cubrir el total
                      </p>
                    )}
                  </div>
                  <button type="submit" disabled={montoRecibido === "" || Number(montoRecibido) < total} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-emerald-100 transition-all active:scale-95">
                    Confirmar Venta y Generar Ticket
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:sticky lg:top-28">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-8 border-b border-gray-50 pb-4 text-left">Resumen de Orden</h2>
                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {carrito.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover"/>
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="font-bold text-gray-800 text-sm leading-tight">{item.nombre}</h4>
                        <p className="text-xs text-gray-400 mt-1">{item.quantity} x ${item.precio.toFixed(2)}</p>
                      </div>
                      <div className="font-bold text-gray-800 text-sm">${(item.precio * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Subtotal (85%)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>IVA (15%)</span>
                    <span>${iva.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-black text-gray-900 pt-2">
                    <span>Total a Pagar</span>
                    <span className="text-emerald-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
}

export default Caja;

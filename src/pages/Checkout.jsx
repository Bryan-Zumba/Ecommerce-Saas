import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { customerService } from "../services/customerService";

function Checkout() {
    const navigate = useNavigate();
    const { cart, total, subtotal, iva } = useCart();
    // ─── Estado del Panel de Clientes ─────────
    const [clientMode, setClientMode] = useState("idle");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchError, setSearchError] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    // Form temporal para Crear / Editar
    const [clientForm, setClientForm] = useState({ id: "", nombre: "", email: "", telefono: "" });
    // ─── Estado del formulario de Facturación ─
    const [customer, setCustomer] = useState({ nombre: "", dni: "", email: "", telefono: "" });
    const [isConsumidorFinal, setIsConsumidorFinal] = useState(false);
    // ─── Estado de Pago ───────────────────────
    const [montoRecibido, setMontoRecibido] = useState("");
    const vuelto = montoRecibido !== "" ? Math.max(0, Number(montoRecibido) - total) : 0;
    const saldoFaltante = montoRecibido !== "" ? Math.max(0, total - Number(montoRecibido)) : total;
    // ─────────────────────────────────────────
    // LÓGICA: Panel de Gestión de Clientes
    // ─────────────────────────────────────────
    const handleSearch = async () => {
        setSearchError("");
        setSearchLoading(true);
        try {
            const found = await customerService.getCustomerById(searchQuery.trim());
            if (found) {
                setSelectedClient(found);
                setClientMode("search_result");
            } else {
                setSelectedClient(null);
                setClientMode("idle");
                setSearchError("No se encontró ningún cliente con esa cédula.");
            }
        } finally {
            setSearchLoading(false);
        }
    };
    const handleSelectClient = (client) => {
        setSelectedClient(client);
        setCustomer({ nombre: client.nombre, dni: client.id, email: client.email, telefono: client.telefono });
        setIsConsumidorFinal(false);
        setClientMode("search_result");
    };
    const handleOpenCreate = () => {
        setClientForm({ id: "", nombre: "", email: "", telefono: "" });
        setClientMode("create");
        setSearchError("");
    };
    const handleOpenEdit = () => {
        if (selectedClient) {
            setClientForm({ ...selectedClient });
            setClientMode("edit");
        }
    };
    const handleSaveClient = async () => {
        try {
            let saved;
            if (clientMode === "create") {
                saved = await customerService.createCustomer(clientForm);
            } else {
                saved = await customerService.updateCustomer(clientForm.id, clientForm);
            }
            setSelectedClient(saved);
            setCustomer({ nombre: saved.nombre, dni: saved.id, email: saved.email, telefono: saved.telefono });
            setIsConsumidorFinal(false);
            setClientMode("search_result");
        } catch (err) {
            alert(err.message);
        }
    };
    const handleCancelClientAction = () => {
        setClientMode(selectedClient ? "search_result" : "idle");
    };
    // ─────────────────────────────────────────
    // LÓGICA: Facturación
    // ─────────────────────────────────────────
    const applyConsumidorFinal = () => {
        setIsConsumidorFinal(true);
        setCustomer({ nombre: "CONSUMIDOR FINAL", dni: "9999999999", email: "consumidor@final.com", telefono: "999999999" });
    };
    const handleCustomerInput = (e) => {
        setIsConsumidorFinal(false);
        setCustomer(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    const handleFinalizarVenta = (e) => {
        e.preventDefault();
        if (montoRecibido !== "" && Number(montoRecibido) >= total) {
            navigate("/success");
        }
    };
    if (cart.length === 0) {
        return (<div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Carrito vacío</h2>
          <button onClick={() => navigate("/")} className="text-emerald-600 font-semibold hover:underline">
            ← Volver a la tienda
          </button>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gray-50">
      {/* ── Navbar ── */}
      <nav className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors font-medium">
            <span className="mr-2">←</span> Volver a la tienda
          </button>
          <div className="font-bold text-xl text-emerald-600 italic">Ecommerce SaaS</div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* ════════════════════════════════
            COLUMNA IZQUIERDA
        ════════════════════════════════ */}
          <div className="space-y-6">

            {/* ── SECCIÓN 1: GESTIÓN DE CLIENTES ── */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">Gestión de Clientes</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Busca, crea o edita un cliente</p>
                </div>
                {clientMode !== "create" && clientMode !== "edit" && (<button type="button" onClick={handleOpenCreate} className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all active:scale-95 shadow-sm shadow-emerald-200">
                    <span>+</span> Nuevo Cliente
                  </button>)}
              </div>

              {/* ─ Modo: Buscar ─ */}
              {(clientMode === "idle" || clientMode === "search_result") && (<div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                      <input type="text" placeholder="Buscar por Cédula / RUC..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setSearchError(""); }} onKeyDown={e => e.key === "Enter" && handleSearch()} className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-gray-50"/>
                    </div>
                    <button type="button" onClick={handleSearch} className="bg-gray-800 hover:bg-black text-white text-xs font-bold px-4 rounded-xl transition-all active:scale-95">
                      Buscar
                    </button>
                  </div>

                  {searchError && (<p className="text-xs text-red-500 font-medium">{searchError}</p>)}

                  {/* Resultado de búsqueda */}
                  {clientMode === "search_result" && selectedClient && (<div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between gap-4">
                      <div className="text-left flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md">● Encontrado</span>
                        </div>
                        <p className="font-bold text-gray-800 text-sm leading-tight">{selectedClient.nombre}</p>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">{selectedClient.id}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{selectedClient.email} · {selectedClient.telefono}</p>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <button type="button" onClick={() => handleSelectClient(selectedClient)} className="text-[11px] font-bold px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all">
                          Seleccionar
                        </button>
                        <button type="button" onClick={handleOpenEdit} className="text-[11px] font-bold px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg hover:border-gray-400 transition-all">
                          Editar
                        </button>
                      </div>
                    </div>)}
                </div>)}

              {/* ─ Modo: Crear / Editar ─ */}
              {(clientMode === "create" || clientMode === "edit") && (<div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${clientMode === "create" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}>
                      {clientMode === "create" ? "● Nuevo Registro" : "● Editando Cliente"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Cédula / RUC</label>
                      <input type="text" value={clientForm.id} onChange={e => setClientForm(prev => ({ ...prev, id: e.target.value }))} placeholder="17xxxxxxxx" disabled={clientMode === "edit"} className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400"/>
                    </div>
                    <div className="col-span-2 space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Nombre Completo</label>
                      <input type="text" value={clientForm.nombre} onChange={e => setClientForm(prev => ({ ...prev, nombre: e.target.value }))} placeholder="Juan Pérez" className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"/>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Email</label>
                      <input type="email" value={clientForm.email} onChange={e => setClientForm(prev => ({ ...prev, email: e.target.value }))} placeholder="juan@ejemplo.com" className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"/>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Teléfono</label>
                      <input type="text" value={clientForm.telefono} onChange={e => setClientForm(prev => ({ ...prev, telefono: e.target.value }))} placeholder="099xxxxxxx" className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"/>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={handleSaveClient} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2.5 rounded-xl transition-all active:scale-95 shadow-sm shadow-emerald-200">
                      {clientMode === "create" ? "Guardar y Seleccionar" : "Guardar Cambios"}
                    </button>
                    <button type="button" onClick={handleCancelClientAction} className="px-4 border border-gray-200 text-gray-500 text-sm font-bold rounded-xl hover:border-gray-400 transition-all">
                      Cancelar
                    </button>
                  </div>
                </div>)}
            </div>

            {/* ── SECCIÓN 2: FACTURACIÓN ── */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-1 text-left">Facturación</h2>
              <p className="text-xs text-gray-400 mb-6 text-left">Datos del cliente para la orden actual</p>

              <form onSubmit={handleFinalizarVenta} className="space-y-5">
                {/* Acceso rápido Consumidor Final */}
                <button type="button" onClick={applyConsumidorFinal} className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${isConsumidorFinal
            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
            : 'border-gray-100 text-gray-400 hover:border-gray-300 hover:text-gray-600'}`}>
                  👤 Consumidor Final
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Nombre</label>
                    <input required name="nombre" value={customer.nombre} onChange={handleCustomerInput} className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="Nombre completo"/>
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Cédula / RUC</label>
                    <input required name="dni" value={customer.dni} onChange={handleCustomerInput} className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="17xxxxxxxx"/>
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Email</label>
                    <input required type="email" name="email" value={customer.email} onChange={handleCustomerInput} className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="correo@ejemplo.com"/>
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Teléfono</label>
                    <input name="telefono" value={customer.telefono} onChange={handleCustomerInput} className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="099xxxxxxx"/>
                  </div>
                </div>

                <hr className="border-gray-50 my-2"/>

                {/* ─ PAGO EN EFECTIVO ─ */}
                <h3 className="text-base font-bold text-gray-700 text-left">Pago en Efectivo</h3>
                <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 space-y-4">
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold text-emerald-700 uppercase ml-1">Monto Recibido</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 font-bold">$</span>
                      <input required type="text" inputMode="decimal" value={montoRecibido} onChange={(e) => {
            const val = e.target.value.replace(/[^0-9.]/g, '');
            if (val.split('.').length <= 2) {
                setMontoRecibido(val);
            }
        }} className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 outline-none font-bold text-emerald-800 text-lg" placeholder="0.00"/>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                    <span className="text-gray-600 font-medium text-sm">Cambio (Vuelto):</span>
                    <span className={`text-2xl font-black ${vuelto > 0 ? 'text-emerald-600' : 'text-gray-300'}`}>
                      ${vuelto.toFixed(2)}
                    </span>
                  </div>

                  {saldoFaltante > 0 && montoRecibido !== "" && (<p className="text-red-500 text-xs font-bold text-center animate-pulse">
                      ⚠️ Faltan ${saldoFaltante.toFixed(2)} para cubrir el total
                    </p>)}
                </div>

                <button type="submit" disabled={montoRecibido === "" || Number(montoRecibido) < total} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-emerald-100 transition-all active:scale-95">
                  Confirmar Venta y Generar Ticket
                </button>
              </form>
            </div>
          </div>

          {/* ════════════════════════════════
            COLUMNA DERECHA: RESUMEN
        ════════════════════════════════ */}
          <div className="lg:sticky lg:top-28">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 border-b border-gray-50 pb-4">Resumen de Orden</h2>

              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (<div key={item.id} className="flex gap-4 items-center">
                    <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover"/>
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-bold text-gray-800 text-sm leading-tight">{item.nombre}</h4>
                      <p className="text-xs text-gray-400 mt-1">{item.quantity} x ${item.precio.toFixed(2)}</p>
                    </div>
                    <div className="font-bold text-gray-800 text-sm">${(item.precio * item.quantity).toFixed(2)}</div>
                  </div>))}
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

              <div className="mt-6 bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200">
                <p className="text-[10px] text-gray-400 text-center uppercase font-bold tracking-widest">
                  Solo se aceptan pagos en efectivo
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>);
}
export default Checkout;

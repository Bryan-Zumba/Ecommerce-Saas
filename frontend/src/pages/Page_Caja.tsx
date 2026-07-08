import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrdenVenta } from "@/modules/ventas/hooks/useOrdenVenta";
import { useClientes } from "@/modules/clientes/hooks/useClientes";
import { TableClientes } from "@/modules/clientes/components/TableClientes";
import FiltrosBusqueda from "@/modules/clientes/components/Busqueda";
import { useAuth } from "@/shared/context/auth/AuthContext";
import { ClienteResponse } from "@/modules/clientes/types/ClienteResponse";

function Caja() {
  const navigate = useNavigate();
  const { orden, total, subtotal, iva } = useOrdenVenta();
  const usuario = useAuth();
  const id_empresa = Number(usuario?.usuario?.id_empresa);
  type Cliente = ClienteResponse["clientes"][number];
  const { clientes, cargando, error, refrescar } = useClientes(id_empresa);
  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [datosCliente, setDatosCliente] = useState({
    nombre: "",
    dni: "",
    email: "",
    telefono: "",
  });
  const [esConsumidorFinal, setEsConsumidorFinal] = useState(false);
  const [montoRecibido, setMontoRecibido] = useState("");

  const vuelto = montoRecibido !== "" ? Math.max(0, Number(montoRecibido) - total) : 0;
  const saldoFaltante = montoRecibido !== "" ? Math.max(0, total - Number(montoRecibido)) : total;

  const seleccionarCliente = (cliente: Cliente) => {
    setDatosCliente({
      nombre: `${cliente.nombres} ${cliente.apellidos}`.trim(),
      dni: cliente.cedula,
      email: cliente.email || "",
      telefono: cliente.telefono || "",
    });
    setEsConsumidorFinal(false);
  };

  const aplicarConsumidorFinal = () => {
    setEsConsumidorFinal(true);
    setDatosCliente({
      nombre: "CONSUMIDOR FINAL",
      dni: "9999999999",
      email: "consumidor@final.com",
      telefono: "999999999",
    });
  };

  const manejarEntradaCliente = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEsConsumidorFinal(false);
    setDatosCliente((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const finalizarVenta = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (montoRecibido !== "" && Number(montoRecibido) >= total) {
      navigate("/success", { state: { customer: datosCliente } });
    }
  };

  const clientesFiltradosCaja = useMemo(() => {
    if (!busquedaCliente.trim()) return clientes.slice(0, 0);

    const query = busquedaCliente.toLowerCase();

    return clientes
      .filter((cliente) =>
        cliente.cedula.toLowerCase().includes(query) ||
        cliente.nombres.toLowerCase().includes(query) ||
        cliente.apellidos.toLowerCase().includes(query) ||
        (cliente.email && cliente.email.toLowerCase().includes(query)) ||
        (cliente.telefono && cliente.telefono.toLowerCase().includes(query))
      )
      .slice(0, 5);
  }, [clientes, busquedaCliente]);

  if (orden.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">orden vacio</h2>
          <button onClick={() => navigate("/")} className="text-emerald-600 font-semibold hover:underline">
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto p-6 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="mb-6 text-left">
                <h2 className="text-lg font-bold text-gray-800">Clientes</h2>
                <p className="text-xs text-gray-400 mt-0.5">Selecciona un cliente para la factura.</p>
              </div>

              {error && (
                <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}
              <FiltrosBusqueda
                search={busquedaCliente}
                setSearch={setBusquedaCliente}
              />
              <div className="space-y-2 mt-4">
                {clientesFiltradosCaja.map((cliente) => (
                  <button
                    key={cliente.id_cliente}
                    type="button"
                    onClick={() => seleccionarCliente(cliente)}
                    className="w-full text-left p-3 rounded-xl border border-gray-100 hover:border-emerald-300 hover:bg-emerald-50 transition-all"
                  >
                    <p className="font-bold text-sm text-gray-800">
                      {cliente.nombres} {cliente.apellidos}
                    </p>
                    <p className="text-xs text-gray-500">
                      {cliente.cedula} · {cliente.email || "Sin email"}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-1 text-left">Facturacion</h2>
              <p className="text-xs text-gray-400 mb-6 text-left">Datos del cliente para la orden actual</p>

              <form onSubmit={finalizarVenta} className="space-y-5">
                <button
                  type="button"
                  onClick={aplicarConsumidorFinal}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${esConsumidorFinal
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-gray-100 text-gray-400 hover:border-gray-300 hover:text-gray-600"
                    }`}
                >
                  Consumidor Final
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label className="text-[12px] font-bold text-gray-400 ml-1">Nombre</label>
                    <input required name="nombre" value={datosCliente.nombre} onChange={manejarEntradaCliente} className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="Nombre completo" disabled />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[12px] font-bold text-gray-400 ml-1">Cedula / RUC</label>
                    <input required name="dni" value={datosCliente.dni} onChange={manejarEntradaCliente} className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="17xxxxxxxx" disabled />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[12px] font-bold text-gray-400 ml-1">Email</label>
                    <input required type="email" name="email" value={datosCliente.email} onChange={manejarEntradaCliente} className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="correo@ejemplo.com" disabled />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[12px] font-bold text-gray-400 ml-1">Telefono</label>
                    <input name="telefono" value={datosCliente.telefono} onChange={manejarEntradaCliente} className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="099xxxxxxx" disabled />
                  </div>
                </div>

                <hr className="border-gray-50 my-2" />
                <h3 className="text-base font-bold text-gray-700 text-left">Pago en Efectivo</h3>
                <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 space-y-4">
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold text-emerald-700 uppercase ml-1">Monto Recibido</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 font-bold">$</span>
                      <input
                        required
                        type="text"
                        inputMode="decimal"
                        value={montoRecibido}
                        onChange={(e) => {
                          let val = e.target.value.replace(/[^0-9.,]/g, "");

                          val = val.replace(",", ".");

                          if (val.split(".").length <= 2) {
                            setMontoRecibido(val);
                          }
                        }}
                        className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 outline-none font-bold text-emerald-800 text-lg"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                    <span className="text-gray-600 font-medium text-sm">Cambio:</span>
                    <span className={`text-2xl font-black ${vuelto > 0 ? "text-emerald-600" : "text-gray-300"}`}>
                      ${vuelto.toFixed(2)}
                    </span>
                  </div>
                  {saldoFaltante > 0 && montoRecibido !== "" && (
                    <p className="text-red-500 text-xs font-bold text-center animate-pulse">
                      Faltan ${saldoFaltante.toFixed(2)} para cubrir el total
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
                {orden.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
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

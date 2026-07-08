import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrdenVenta } from "@/modules/ventas/hooks/useOrdenVenta";
import { useClientes } from "@/modules/clientes/hooks/useClientes";
import FiltrosBusqueda from "@/modules/clientes/components/Busqueda";
import { useAuth } from "@/shared/context/auth/AuthContext";
import { ClienteResponse } from "@/modules/clientes/types/ClienteResponse";
import { useCrearVenta } from "../hooks/useCrearVenta";
import FormularioCliente, { DatosFormularioCliente } from "@/modules/clientes/components/FormularioClientes";
import Swal from "sweetalert2";

function PageGenerarOrden() {
  const navigate = useNavigate();
  const { orden, total, subtotal, iva, limpiarOrden } = useOrdenVenta();
  const usuario = useAuth();
  const id_empresa = Number(usuario?.usuario?.id_empresa);
  type Cliente = ClienteResponse["clientes"][number];
  
  const { clientes, error, agregarCliente } = useClientes(id_empresa);
  const { crearVenta, loading: procesando } = useCrearVenta();

  const [isModalClienteOpen, setIsModalClienteOpen] = useState(false);

  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [clienteSeleccionadoId, setClienteSeleccionadoId] = useState<number | null>(null);
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
    setClienteSeleccionadoId(cliente.id_cliente);
    setDatosCliente({
      nombre: `${cliente.nombres} ${cliente.apellidos}`.trim(),
      dni: cliente.cedula,
      email: cliente.email || "",
      telefono: cliente.telefono || "",
    });
    setEsConsumidorFinal(false);
  };

  const aplicarConsumidorFinal = () => {
    const clienteCF = clientes.find(c => 
      c.nombres.toUpperCase() === "CONSUMIDOR" && 
      c.apellidos.toUpperCase() === "FINAL"
    );

    if (clienteCF) {
      seleccionarCliente(clienteCF);
      
      // Forzar datos por defecto si en la base de datos están nulos o vacíos
      if (!clienteCF.email || !clienteCF.telefono) {
        setDatosCliente(prev => ({
          ...prev,
          email: clienteCF.email || "consumidor@final.com",
          telefono: clienteCF.telefono || "0999999999"
        }));
      }
      
      setEsConsumidorFinal(true); // Mantenemos el estilo activo del botón
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'No se encontró el cliente Consumidor Final en la base de datos.',
        confirmButtonColor: '#10b981'
      });
      setEsConsumidorFinal(true);
      setClienteSeleccionadoId(null);
      setDatosCliente({
        nombre: "CONSUMIDOR FINAL",
        dni: "9999999999",
        email: "consumidor@final.com",
        telefono: "999999999",
      });
    }
  };

  const manejarEntradaCliente = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEsConsumidorFinal(false);
    setDatosCliente((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const finalizarVenta = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!clienteSeleccionadoId && !esConsumidorFinal) {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Por favor, selecciona un cliente o elige Consumidor Final.',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    if (montoRecibido !== "" && Number(montoRecibido) >= total) {
      Swal.fire({
        title: '¿Confirmar y Cobrar?',
        html: `El total de la orden es <b>$${total.toFixed(2)}</b>.<br/>Se registrará la venta.`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#ef4444',
        confirmButtonText: 'Sí, procesar venta',
        cancelButtonText: 'Cancelar'
      }).then(async (result) => {
        if (result.isConfirmed) {
          ejecutarCreacionVenta();
        }
      });
    }
  };

  const ejecutarCreacionVenta = async () => {
    const detalles = orden.map((item) => {
      if (!item.id_item) throw new Error("Falta el id_item en el carrito");
      if (item.id_bodega === undefined) throw new Error("Falta el id_bodega en el carrito");
      return {
        id_item: item.id_item,
        id_bodega: item.id_bodega,
        cantidad: item.quantity,
        precio_unitario: item.precio,
      };
    });

    const idAEnviar = clienteSeleccionadoId as number;

    const response = await crearVenta({
      id_cliente: idAEnviar,
      observacion: null,
      detalles,
    });

    if (response.success) {
      navigate('/ventas/success', { state: { vuelto, total, customer: datosCliente } });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error al procesar',
        text: response.error || "Hubo un problema procesando la venta.",
        confirmButtonColor: '#10b981'
      });
    }
  };

  const manejarGuardarCliente = async (datos: DatosFormularioCliente) => {
    const res = await agregarCliente(datos);
    if (res.success && res.data?.cliente) {
      seleccionarCliente(res.data.cliente);
      setIsModalClienteOpen(false);
      Swal.fire({
        icon: 'success',
        title: 'Cliente registrado',
        text: 'El cliente se ha creado y seleccionado exitosamente.',
        confirmButtonColor: '#10b981',
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: res.error || 'No se pudo crear el cliente.',
        confirmButtonColor: '#10b981',
      });
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">El carrito está vacío</h2>
          <button onClick={() => navigate("/ventas/catalogo")} className="text-emerald-600 font-semibold hover:underline">
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto p-4 lg:p-8">
        
        {/* Botón de retroceso y Título de Página */}
        <div className="mb-8 flex items-center gap-4 text-left">
          <button
            onClick={() => navigate('/ventas/catalogo')}
            className="w-10 h-10 flex items-center justify-center bg-white shadow-sm border border-gray-100 hover:bg-gray-50 text-gray-600 rounded-full transition-colors cursor-pointer flex-shrink-0"
          >
            ←
          </button>
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">Finalizar Compra</h1>
            <p className="text-[12px] text-gray-400 font-bold tracking-wider mt-1">
              Completa los datos de pago
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
              <div className="mb-6 text-left">
                <h2 className="text-[14px] font-bold text-gray-800">Clientes</h2>
                <p className="text-[12px] text-gray-400 mt-0.5">Selecciona un cliente para la factura.</p>
              </div>

              {error && (
                <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}
              <div className="flex gap-2">
                <div className="flex-1">
                  <FiltrosBusqueda
                    search={busquedaCliente}
                    setSearch={setBusquedaCliente}
                  />
                </div>
                <button 
                  onClick={() => setIsModalClienteOpen(true)}
                  className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl font-bold hover:bg-emerald-100 transition-colors border border-emerald-200 text-sm flex items-center justify-center"
                  title="Registrar nuevo cliente"
                >
                  + Nuevo
                </button>
              </div>
              <div className="space-y-2 mt-4 text-left">
                {clientesFiltradosCaja.map((cliente) => (
                  <button
                    key={cliente.id_cliente}
                    type="button"
                    onClick={() => seleccionarCliente(cliente)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${clienteSeleccionadoId === cliente.id_cliente ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 hover:border-emerald-300 hover:bg-emerald-50'}`}
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

            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-[14px] font-bold text-gray-800 mb-1 text-left">Facturación</h2>
              <p className="text-[12px] text-gray-400 mb-6 text-left">Datos del cliente para la orden actual</p>

              <form onSubmit={finalizarVenta} className="space-y-5">
                <button
                  type="button"
                  onClick={aplicarConsumidorFinal}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-[12px] font-bold transition-all ${esConsumidorFinal
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-gray-100 text-gray-400 hover:border-gray-300 hover:text-gray-600"
                    }`}
                >
                  Consumidor Final
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label className="text-[12px] font-bold text-gray-400 ml-1">Nombre</label>
                    <input required name="nombre" value={datosCliente.nombre} onChange={manejarEntradaCliente} className="w-full px-4 py-2 text-[12px] rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="Nombre completo" disabled />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[12px] font-bold text-gray-400 ml-1">Cedula / RUC</label>
                    <input required name="dni" value={datosCliente.dni} onChange={manejarEntradaCliente} className="w-full px-4 py-2 text-[12px] rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="17xxxxxxxx" disabled />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[12px] font-bold text-gray-400 ml-1">Email</label>
                    <input required type="email" name="email" value={datosCliente.email} onChange={manejarEntradaCliente} className="w-full px-4 py-2 text-[12px] rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="correo@ejemplo.com" disabled />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[12px] font-bold text-gray-400 ml-1">Telefono</label>
                    <input name="telefono" value={datosCliente.telefono} onChange={manejarEntradaCliente} className="w-full px-4 py-2 text-[12px] rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="099xxxxxxx" disabled />
                  </div>
                </div>

                <hr className="border-gray-50 my-2" />
                <h3 className="text-[14px] font-bold text-gray-700 text-left">Pago en efectivo</h3>
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-emerald-700 ml-1 block mb-1 text-left">Monto recibido</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 font-bold">$</span>
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
                        className="w-full pl-7 pr-3 py-2 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 outline-none font-bold text-emerald-800 text-[14px]"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="flex-1 bg-white p-3 rounded-xl shadow-sm border border-emerald-100 h-[62px] flex flex-col justify-center">
                    <span className="text-gray-500 font-medium text-[10px] text-left">Cambio:</span>
                    <span className={`text-[16px] text-left font-black leading-none mt-0.5 ${vuelto > 0 ? "text-emerald-600" : "text-gray-300"}`}>
                      ${vuelto.toFixed(2)}
                    </span>
                  </div>
                </div>
                {saldoFaltante > 0 && montoRecibido !== "" && (
                  <p className="text-red-500 text-[10px] font-bold text-center animate-pulse mt-0">
                    Faltan ${saldoFaltante.toFixed(2)} para cubrir el total
                  </p>
                )}

                <button type="submit" disabled={procesando || montoRecibido === "" || Number(montoRecibido) < total} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 text-white py-3 rounded-2xl font-bold text-[14px] shadow-lg shadow-emerald-100 transition-all active:scale-95 cursor-pointer">
                  {procesando ? 'Procesando...' : 'Confirmar Venta y Generar Ticket'}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:sticky lg:top-28">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-[14px] font-bold text-gray-800 mb-6 border-b border-gray-50 pb-4 text-left">Resumen de orden</h2>
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {orden.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center text-[16px] font-bold text-gray-400 uppercase">
                      {item.imagen ? (
                        <img src={item.imagen} alt={item.nombre} className="w-full h-full object-cover" />
                      ) : (
                        item.nombre.charAt(0)
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-bold text-[12px] text-gray-800 line-clamp-1">{item.nombre}</p>
                      <p className="text-[12px] text-gray-400 mt-0.5">{item.quantity} x ${item.precio.toFixed(2)}</p>
                    </div>
                    <div className="font-black text-[12px] text-gray-900">
                      ${(item.quantity * item.precio).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-[12px] text-gray-400">
                  <span>Subtotal (85%)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[12px] text-gray-400">
                  <span>IVA (15%)</span>
                  <span>${iva.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[16px] font-black text-gray-900 pt-2">
                  <span>Total a pagar</span>
                  <span className="text-emerald-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <FormularioCliente 
        isOpen={isModalClienteOpen}
        onCancelar={() => setIsModalClienteOpen(false)}
        onGuardar={manejarGuardarCliente}
      />
    </div>
  );
}

export default PageGenerarOrden;

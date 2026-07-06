import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { TableClientes } from '../components/TableClientes';
import { useClientes } from '../hooks/useClientes';
import FormularioCliente, { DatosFormularioCliente } from '../components/FormularioClientes';
import { useAuth } from '@/shared/context/auth/AuthContext';
import { usePermisos } from '@/shared/hooks/usePermisos';
import { ClienteResponse } from '../types/ClienteResponse';
import { ClienteUpdateDTO } from '../types/ClienteRequest';

type ClienteLocal = ClienteResponse['clientes'][0];

export const PageClientes: React.FC = () => {
  const { usuario } = useAuth();
  const id_empresa = Number(usuario?.id_empresa);
  const { clientes, cargando, error, refrescar, agregarCliente, editarCliente, cambiarEstadoCliente } = useClientes(id_empresa);
  const { tienePermiso, cargandoPermisos } = usePermisos();

  // Mientras cargandoPermisos=true, asumimos null (desconocido) para evitar
  // el flash de "sin permiso" antes de que el backend responda.
  const permisoVerCliente = cargandoPermisos ? null : tienePermiso('clientes.ver');
  const permisoCrearCliente = cargandoPermisos ? false : tienePermiso('clientes.crear');
  const permisoEditarCliente = cargandoPermisos ? false : tienePermiso('clientes.actualizar');
  const permisoToggleEstado = cargandoPermisos ? false : (tienePermiso('clientes.activar') || tienePermiso('clientes.desactivar'));

  const [clienteSeleccionado, setClienteSeleccionado] = useState<ClienteLocal | null>(null);
  const [drawerAbierto, setDrawerAbierto] = useState(false);
  const [errorAccion, setErrorAccion] = useState<string | null>(null);

  const abrirFormularioNuevo = () => {
    setClienteSeleccionado(null);
    setDrawerAbierto(true);
  };

  const abrirFormularioEditar = (cliente: ClienteLocal) => {
    setClienteSeleccionado(cliente);
    setDrawerAbierto(true);
  };

  const cerrarFormulario = () => {
    setDrawerAbierto(false);
    setClienteSeleccionado(null);
  };

  const guardarCliente = async (datos: DatosFormularioCliente) => {
    setErrorAccion(null);

    if (clienteSeleccionado) {
      // Calcular solo los campos que cambiaron
      const diff: ClienteUpdateDTO = {};
      if (datos.nombres !== clienteSeleccionado.nombres) diff.nombres = datos.nombres;
      if (datos.apellidos !== clienteSeleccionado.apellidos) diff.apellidos = datos.apellidos;
      if ((datos.email || null) !== clienteSeleccionado.email) diff.email = datos.email || null;
      if ((datos.telefono || null) !== clienteSeleccionado.telefono) diff.telefono = datos.telefono || null;
      if ((datos.direccion || null) !== clienteSeleccionado.direccion) diff.direccion = datos.direccion || null;

      if (Object.keys(diff).length === 0) {
        cerrarFormulario();
        return; // Sin cambios, no llamamos al backend
      }

      const respuesta = await editarCliente(clienteSeleccionado.id_cliente, diff);
      if (!respuesta.success) {
        setErrorAccion(respuesta.error || 'Error al actualizar el cliente');
        return;
      }
    } else {
      const respuesta = await agregarCliente(datos);
      if (!respuesta.success) {
        setErrorAccion(respuesta.error || 'Error al crear el cliente');
        return;
      }
    }

    cerrarFormulario();
    refrescar();
  };

  const toggleEstadoCliente = async (cliente: ClienteLocal) => {
    setErrorAccion(null);
    const accion = cliente.estado ? 'desactivar' : 'activar';
    const resultado = await Swal.fire({
      title: `Deseas ${accion} este cliente?`,
      text: `${cliente.nombres} ${cliente.apellidos}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#059669',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Si, ${accion}`,
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    });

    if (!resultado.isConfirmed) return;

    const respuesta = await cambiarEstadoCliente(cliente.id_cliente, cliente.estado);
    if (!respuesta.success) {
      setErrorAccion(respuesta.error || `Error al ${accion} el cliente`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 animate-in fade-in duration-500 relative flex flex-col">
      <main className="max-w-7xl mx-auto p-6 lg:p-10 flex-1 w-full text-left">

        <FormularioCliente
          isOpen={drawerAbierto}
          clienteActual={clienteSeleccionado}
          onGuardar={guardarCliente}
          onCancelar={cerrarFormulario}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="text-left">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              👥 Gestión de Clientes
            </h1>
            <p className="text-gray-500 mt-1 font-medium text-sm lg:text-base">
              Administra tu cartera de clientes, añade nuevos o edita los existentes.
            </p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            {permisoCrearCliente && (
              <button onClick={abrirFormularioNuevo} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-emerald-600/10 flex items-center justify-center gap-2">
                <span>+</span> Añadir Cliente
              </button>
            )}
          </div>
        </div>

        {(error || errorAccion) && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium">
            ⚠️ {error || errorAccion}
          </div>
        )}

        {permisoVerCliente === false && !cargando && !cargandoPermisos && (
          <div className="p-6 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl font-medium">
            ⚠️ No tienes permiso para ver los clientes.
          </div>
        )}

        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <TableClientes
            clientes={clientes}
            cargando={cargando}
            refrescar={refrescar}
            onEdit={permisoEditarCliente ? abrirFormularioEditar : undefined}
            onToggleEstado={permisoToggleEstado ? toggleEstadoCliente : undefined}
          />
        </div>
      </main>
    </div>
  );
};

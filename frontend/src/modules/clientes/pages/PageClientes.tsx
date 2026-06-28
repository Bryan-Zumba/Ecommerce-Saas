import React, { useState } from 'react';
import { TableClientes } from '../components/TableClientes';
import { useClientes } from '../hooks/useClientes';
import PanelLateralDer from '@/shared/layout/PanelLateralDer';
import FormularioCliente, { DatosFormularioCliente } from '../components/FormularioClientes';
import { useAuth } from '@/shared/context/auth/AuthContext';
import { ClienteResponse } from '../types/ClienteResponse';


export const PageClientes: React.FC = () => {
  const usuario = useAuth();
  const id_empresa = Number(usuario?.usuario?.id_empresa);
  const { clientes, cargando, error, refrescar } = useClientes(id_empresa);

  const permisoEditCliente = true;
  const permisoDeleteCliente = true;
  const permisoAddCliente = true;
  const [clienteSeleccionado, setClienteSeleccionado] = useState<ClienteResponse | null>(null);
  const [drawerAbierto, setDrawerAbierto] = useState(false);

  const abrirFormularioNuevo = () => {
    setClienteSeleccionado(null);
    setDrawerAbierto(true);
  };

  const abrirFormularioEditar = (cliente: ClienteResponse) => {
    setClienteSeleccionado(cliente);
    setDrawerAbierto(true);
  };

  const cerrarFormulario = () => {
    setDrawerAbierto(false);
  };

  const guardarCliente = async (datos: DatosFormularioCliente) => {
    if (clienteSeleccionado) {
      console.log('Editar cliente:', datos);
    } else {
      console.log('Agregar cliente:', datos);
      /*const respuesta = await agregarCliente({
        cedula: datos.cedula,
        nombres: datos.nombres,
        apellidos: datos.apellidos,
        email: datos.email || null,
        telefono: datos.telefono || null
      })
      if (respuesta.success) {
        refrescar();
      }*/
    }
    cerrarFormulario();
  };

  const eliminarCliente = (cliente: ClienteResponse) => {
    console.log('Eliminar:', cliente);
  };

  return (
    <div className="min-h-screen bg-gray-50 animate-in fade-in duration-500">
      <main className="max-w-7xl mx-auto p-6 lg:p-12">

        <PanelLateralDer
          abierto={drawerAbierto}
          titulo="Formulario de Cliente"
          onCerrar={cerrarFormulario}
        >
          <FormularioCliente
            clienteActual={clienteSeleccionado}
            onGuardar={guardarCliente}
            onCancelar={cerrarFormulario}
          />
        </PanelLateralDer>
        <div className="flex justify-between items-center">
          <div className="flex flex-col mb-8 text-left">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Gestión de Clientes</h1>
            <p className="text-gray-500 mt-1 font-medium">Administra tu cartera de clientes, añade nuevos o edita los existentes.</p>
          </div>
          {permisoAddCliente && (
            <button onClick={abrirFormularioNuevo} className='px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold shadow transition-all'>
              Registrar nuevo cliente
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl font-medium">
            ⚠️ {error}
          </div>
        )}

        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <TableClientes
            clientes={clientes}
            cargando={cargando}
            refrescar={refrescar}
            onEdit={permisoEditCliente ? abrirFormularioEditar : undefined}
            onDelete={permisoDeleteCliente ? eliminarCliente : undefined}
          />
        </div>
      </main>
    </div>
  );
};
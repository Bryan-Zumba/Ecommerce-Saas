import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
//import { useClientes } from '@/modules/clientes/application/useClientes';
import { useClientesApi } from '@/modules/clientes/application/useClienteApi2';
import { ApiClienteRepository } from '@/modules/clientes/infrastructure/ApiClienteRepository';

import FiltrosClientes from '@/modules/clientes/infrastructure/components/FiltrosClientes';
import TablaClientes from '@/modules/clientes/infrastructure/components/TablaClientes';
import ModalFormularioCliente from '@/modules/clientes/infrastructure/components/FormularioCliente';

/**
 * Página de Gestión de Clientes
 * Permite buscar, listar, crear, editar y eliminar clientes.
 */

const apiClienteRepository = new ApiClienteRepository();

function ClientesPage() {
  const navigate = useNavigate();
  //const { clientes, cargando, agregarCliente, actualizarCliente, eliminarCliente } = useClientes();

  const { clientes, cargando, agregarCliente } = useClientesApi(apiClienteRepository);

  // Stubs temporales para evitar errores de compilación mientras probamos Crear/Listar
  const actualizarCliente = async (id: string, datosActualizados: any) => {
    console.log('Actualizar deshabilitado temporalmente para pruebas de creación:', id, datosActualizados);
    return { success: false, error: 'Función no implementada aún en la API' };
  };

  const eliminarCliente = async (id: string) => {
    console.log('Eliminar deshabilitado temporalmente para pruebas de creación:', id);
    return { success: false, error: 'Función no implementada aún en la API' };
  };

  const [consultaBusqueda, setConsultaBusqueda] = useState('');

  // Estado del modal
  const [estaModalAbierto, setEstaModalAbierto] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  // Filtrar clientes localmente por búsqueda
  const clientesFiltrados = useMemo(() => {
    if (!consultaBusqueda.trim()) return clientes;
    const query = consultaBusqueda.toLowerCase();
    return clientes.filter(
      (c) =>
        c.nombre.toLowerCase().includes(query) ||
        c.id.toLowerCase().includes(query) ||
        (c.email && c.email.toLowerCase().includes(query))
    );
  }, [clientes, consultaBusqueda]);

  const manejarAgregarNuevo = () => {
    setClienteSeleccionado(null);
    setEstaModalAbierto(true);
  };

  const manejarEditar = (cliente) => {
    setClienteSeleccionado(cliente);
    setEstaModalAbierto(true);
  };

  const manejarGuardar = async (datosFormulario) => {
    if (clienteSeleccionado) {
      return await actualizarCliente(datosFormulario.id, datosFormulario);
    } else {
      return await agregarCliente(datosFormulario);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 animate-in fade-in duration-500">
      <nav className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors font-medium"
          >
            <span className="mr-2">←</span> Ir a la Tienda
          </button>
          <div className="font-bold text-xl text-emerald-600 italic tracking-tighter">SaaS Ecommerce</div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 lg:p-12">
        <div className="flex flex-col mb-8 text-left">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Gestión de Clientes</h1>
          <p className="text-gray-500 mt-1 font-medium">Administra tu cartera de clientes, añade nuevos o edita los existentes.</p>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
          <FiltrosClientes
            searchQuery={consultaBusqueda}
            setSearchQuery={setConsultaBusqueda}
            onAddNew={manejarAgregarNuevo}
          />

          <TablaClientes
            data={clientesFiltrados}
            isLoading={cargando}
            onEdit={manejarEditar}
            onDelete={eliminarCliente}
          />
        </div>
      </main>

      {/* Modal para Crear/Editar */}
      <ModalFormularioCliente
        isOpen={estaModalAbierto}
        onClose={() => setEstaModalAbierto(false)}
        initialData={clienteSeleccionado}
        onSave={manejarGuardar}
      />
    </div>
  );
}

export default ClientesPage;

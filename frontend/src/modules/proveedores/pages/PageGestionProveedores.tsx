import React, { useState } from 'react';
import { useProveedores } from '../hooks/useProveedores';
import { TableProveedores } from '../components/TableProveedores';
import { FormularioProveedor } from '../components/FormularioProveedor';
import { usePermisos } from '@/shared/hooks/usePermisos';
import { ProveedorLocal } from '../types/ProveedorTypes';

export const PageGestionProveedores: React.FC = () => {
  const { proveedores, cargando, procesando, agregarProveedor, editarProveedor, cambiarEstadoProveedor, refrescar } = useProveedores();
  const { tienePermiso, cargandoPermisos } = usePermisos();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [proveedorEditando, setProveedorEditando] = useState<ProveedorLocal | null>(null);

  // Permisos
  const permisoVer = cargandoPermisos ? null : tienePermiso('proveedor.ver');
  const permisoCrear = cargandoPermisos ? false : tienePermiso('proveedor.crear');
  const permisoActualizar = cargandoPermisos ? false : tienePermiso('proveedor.actualizar');
  const permisoToggle = cargandoPermisos ? false : (tienePermiso('proveedor.activar') || tienePermiso('proveedor.desactivar'));

  const abrirCrear = () => {
    setProveedorEditando(null);
    setModalAbierto(true);
  };

  const abrirEditar = (proveedor: ProveedorLocal) => {
    setProveedorEditando(proveedor);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setProveedorEditando(null);
  };

  const handleGuardar = async (data: any) => {
    if (proveedorEditando) {
      // Detectar si realmente hubo cambios vs los datos originales
      const sinCambios =
        (data.nombre?.trim() || '') === (proveedorEditando.nombre || '') &&
        (data.descripcion?.trim() || null) === (proveedorEditando.descripcion || null) &&
        (data.direccion?.trim() || null) === (proveedorEditando.direccion || null) &&
        (data.telefono?.trim() || null) === (proveedorEditando.telefono || null) &&
        (data.email?.trim() || null) === (proveedorEditando.email || null);

      if (sinCambios) {
        cerrarModal();
        return; // Nada cambió, no llamamos al backend
      }

      const success = await editarProveedor(proveedorEditando.id_proveedor, data);
      if (success) cerrarModal();
    } else {
      const success = await agregarProveedor(data);
      if (success) cerrarModal();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 animate-in fade-in duration-500 relative flex flex-col">
      <main className="max-w-7xl mx-auto p-6 lg:p-10 flex-1 w-full text-left">

        {modalAbierto && (
          <FormularioProveedor
            isOpen={modalAbierto}
            onClose={cerrarModal}
            proveedorActual={proveedorEditando}
            onGuardar={handleGuardar}
            procesando={procesando}
          />
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="text-left">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              🚚 Gestión de Proveedores
            </h1>
            <p className="text-gray-500 mt-1 font-medium text-sm lg:text-base">
              Administra los proveedores para las compras e inventario.
            </p>
          </div>

          {permisoCrear && (
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={abrirCrear}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-emerald-600/10 flex items-center justify-center gap-2"
              >
                <span>+</span> Añadir Proveedor
              </button>
            </div>
          )}
        </div>

        {permisoVer === false && !cargandoPermisos && (
          <div className="p-6 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl font-medium mb-4">
            ⚠️ No tienes permiso para ver los proveedores.
          </div>
        )}

        {permisoVer !== false && (
          <TableProveedores
            proveedores={proveedores}
            cargando={cargando}
            refrescar={refrescar}
            onEdit={permisoActualizar ? abrirEditar : undefined}
            onToggleEstado={permisoToggle ? (p) => cambiarEstadoProveedor(p.id_proveedor, p.estado) : undefined}
          />
        )}

      </main>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useBodegas } from '../hooks/useBodegas';
import { VistaBodega } from '../components/VistaBodega';
import { FormularioBodega } from '../components/FormularioBodega';
import Swal from 'sweetalert2';

export const PageBodega: React.FC = () => {
  const {
    bodega,
    loading: cargando,
    error,
    fetchBodegaEmpresa,
    updateBodega,
  } = useBodegas();

  const [modoEdicion, setModoEdicion] = useState(false);

  useEffect(() => {
    fetchBodegaEmpresa();
  }, [fetchBodegaEmpresa]);

  const manejarGuardarEdicion = async (datosFormulario: {
    nombre: string;
    descripcion: string;
    ubicacion: string;
  }) => {
    if (!datosFormulario.nombre.trim()) {
      Swal.fire('Error', 'El nombre de la bodega es requerido.', 'error');
      return;
    }
    if (!bodega?.id_bodega) return;

    const success = await updateBodega(bodega.id_bodega, {
      nombre: datosFormulario.nombre,
      descripcion: datosFormulario.descripcion,
      ubicacion: datosFormulario.ubicacion,
    });

    if (success) {
      setModoEdicion(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 animate-in fade-in duration-500 relative flex flex-col">
      <main className="max-w-4xl mx-auto p-6 lg:p-10 flex-1 w-full text-left">
        {/* Cabecera de Página */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="text-left">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              🏬 Bodega
            </h1>
            <p className="text-gray-500 mt-1 font-medium text-sm lg:text-base">
              Información del almacén de tu empresa
            </p>
          </div>
        </div>

        {/* Mensaje de Error global */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl font-medium text-left">
            ⚠️ {error}
          </div>
        )}

        {/* Contenido Principal */}
        {cargando && !bodega ? (
          <div className="bg-white rounded-[2.5rem] p-12 text-center border border-gray-100 shadow-sm">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mb-2" />
            <p className="text-gray-400 text-sm font-medium">Cargando información de bodega...</p>
          </div>
        ) : !bodega ? (
          /* Sin bodega registrada */
          <div className="bg-white rounded-[2.5rem] p-12 text-center border border-gray-100 shadow-sm">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No hay bodega registrada</h3>
            <p className="text-gray-400 max-w-md mx-auto text-sm font-medium mb-6">
              La bodega de tu empresa aún no ha sido configurada. Puedes registrarla desde la
              <span className="text-emerald-600 font-bold"> configuración inicial (Onboarding)</span>.
            </p>
          </div>
        ) : modoEdicion ? (
          /* Formulario de edición */
          <FormularioBodega
            bodegaAEditar={bodega}
            onGuardar={manejarGuardarEdicion}
            onCancelar={() => setModoEdicion(false)}
            modo="edicion"
          />
        ) : (
          /* Vista de detalle */
          <VistaBodega
            bodega={bodega!}
            onEditar={() => setModoEdicion(true)}
          />
        )}
      </main>
    </div>
  );
};

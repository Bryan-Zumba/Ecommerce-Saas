import React, { useState, useEffect, useCallback } from 'react';
import { useBodega } from '../../application/useBodega';
import { LocalstorageBodegaRepository } from '../repositories/LocalstorageBodegaRepository';
import { VistaBodega } from '../../components/VistaBodega';
import { FormularioBodega } from '../../components/FormularioBodega';

const repository = new LocalstorageBodegaRepository();

// ID de empresa por defecto (se integrará con autenticación más adelante)
const ID_EMPRESA = 1;

export const PageBodega: React.FC = () => {
  const {
    bodega,
    cargando,
    error,
    existeBodega,
    cargarBodega,
    editarBodega,
  } = useBodega(repository);

  const [modoEdicion, setModoEdicion] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    cargarBodega(ID_EMPRESA);
  }, [cargarBodega]);

  const lanzarToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const manejarGuardarEdicion = async (datosFormulario: {
    nombre: string;
    descripcion: string;
    ubicacion: string;
  }) => {
    if (!datosFormulario.nombre.trim()) {
      lanzarToast('El nombre de la bodega es requerido.', 'error');
      return;
    }

    const res = await editarBodega(ID_EMPRESA, {
      nombre: datosFormulario.nombre,
      descripcion: datosFormulario.descripcion,
      ubicacion: datosFormulario.ubicacion,
    });

    if (res.success) {
      lanzarToast(`Bodega "${datosFormulario.nombre}" actualizada exitosamente.`, 'success');
      setModoEdicion(false);
    } else {
      lanzarToast(res.error || 'Error al actualizar la bodega', 'error');
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
        {cargando ? (
          <div className="bg-white rounded-[2.5rem] p-12 text-center border border-gray-100 shadow-sm">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mb-2" />
            <p className="text-gray-400 text-sm font-medium">Cargando información de bodega...</p>
          </div>
        ) : !existeBodega ? (
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
          /* HU-016: Formulario de edición */
          <FormularioBodega
            bodegaAEditar={bodega}
            onGuardar={manejarGuardarEdicion}
            onCancelar={() => setModoEdicion(false)}
            modo="edicion"
          />
        ) : (
          /* HU-014: Vista de detalle */
          <VistaBodega
            bodega={bodega!}
            onEditar={() => setModoEdicion(true)}
          />
        )}
      </main>

      {/* Toast de notificación */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className={`px-5 py-3.5 rounded-2xl shadow-lg font-bold text-sm flex items-center gap-2 ${
            toast.type === 'success'
              ? 'bg-emerald-600 text-white shadow-emerald-600/20'
              : 'bg-red-600 text-white shadow-red-600/20'
          }`}>
            <span>{toast.type === 'success' ? '✅' : '❌'}</span>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
};

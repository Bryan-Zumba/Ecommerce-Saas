import React, { useState, useEffect } from 'react';
import { useCategorias } from '../hooks/useCategorias';
import { ListaCategorias } from '../components/ListaCategorias';
import { FormularioCategoria } from '../components/FormularioCategoria';
import { Categoria, CategoriaRequest, CategoriaUpdate } from '../types/CategoriaTypes';

const ID_EMPRESA = 1; // Default for now until auth is connected

export const PageCategorias: React.FC = () => {
  const { categorias, loading, error, fetchCategorias, createCategoria, updateCategoria, toggleEstadoCategoria } = useCategorias();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [catSeleccionada, setCatSeleccionada] = useState<Categoria | null>(null);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  const abrirCrear = () => {
    setCatSeleccionada(null);
    setModalAbierto(true);
  };

  const abrirEditar = (c: Categoria) => {
    setCatSeleccionada(c);
    setModalAbierto(true);
  };

  const cerrarModal = () => setModalAbierto(false);

  const categoriasFiltradas = categorias.filter((c) =>
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const total = categoriasFiltradas.length;

  return (
    <div className="min-h-screen bg-gray-50/50 animate-in fade-in duration-500 relative flex flex-col">
      <main className="max-w-6xl mx-auto p-6 lg:p-10 flex-1 w-full text-left">
        
        {/* Cabecera */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="text-left">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              📂 Categorías
            </h1>
            <p className="text-gray-500 mt-1 font-medium text-sm lg:text-base">
              Gestiona las categorías de tus productos (Total: {total})
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-100 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm shadow-sm"
                placeholder="Buscar categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={abrirCrear}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-emerald-600/10 flex items-center justify-center gap-2"
            >
              <span>+</span> Añadir Categoría
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl font-medium text-left">
            ⚠️ {error}
          </div>
        )}

        {loading && categorias.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-12 text-center border border-gray-100 shadow-sm">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mb-2" />
            <p className="text-gray-400 text-sm font-medium">Cargando categorías...</p>
          </div>
        ) : (
          <ListaCategorias
            categorias={categoriasFiltradas}
            onEditar={abrirEditar}
            onToggleEstado={(c) => toggleEstadoCategoria(c.id_categoria, c.estado)}
          />
        )}

        {modalAbierto && (
          <FormularioCategoria
            isOpen={modalAbierto}
            categoriaAEditar={catSeleccionada}
            idEmpresa={ID_EMPRESA}
            onClose={cerrarModal}
            onGuardar={async (datos) => {
              let success = false;
              if (catSeleccionada) {
                success = await updateCategoria(catSeleccionada.id_categoria, datos as CategoriaUpdate);
              } else {
                success = await createCategoria(datos as CategoriaRequest);
              }
              if (success) cerrarModal();
            }}
          />
        )}
      </main>
    </div>
  );
};

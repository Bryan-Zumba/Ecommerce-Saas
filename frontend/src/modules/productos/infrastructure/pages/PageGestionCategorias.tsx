import React, { useState, useMemo } from 'react';
import { useCategorias } from '../../application/useCategorias';
import { LocalstorageCategoriaRepository } from '../repositories/LocalstorageCategoriaRepository';
import { ListaCategorias } from '../components/ListaCategorias';
import { FormularioCategoria } from '../components/FormularioCategoria';

export const PageGestionCategorias: React.FC = () => {
  const repository = useMemo(() => new LocalstorageCategoriaRepository(), []);
  const { categorias, cargando, error, crear, actualizar, eliminar } = useCategorias(repository);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [catSeleccionada, setCatSeleccionada] = useState<null | any>(null);

  const abrirCrear = () => {
    setCatSeleccionada(null);
    setModalAbierto(true);
  };
  const abrirEditar = (c: any) => {
    setCatSeleccionada(c);
    setModalAbierto(true);
  };
  const cerrarModal = () => setModalAbierto(false);

  const total = categorias.length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-black mb-6">Gestión de Categorías</h1>
      <p className="mb-4 text-sm text-gray-600">Total: {total}</p>

      <button
        onClick={abrirCrear}
        className="mt-4 mb-6 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors"
      >
        + Añadir Categoría
      </button>

      <ListaCategorias
        categorias={categorias}
        onEditar={abrirEditar}
        onEliminar={(c) => eliminar(c.id)}
      />

      {modalAbierto && (
        <FormularioCategoria
          isOpen={modalAbierto}
          categoriaAEditar={catSeleccionada}
          onClose={cerrarModal}
          onGuardar={async (datos) => {
            if (catSeleccionada) {
              await actualizar(catSeleccionada.id, datos);
            } else {
              await crear(datos);
            }
            cerrarModal();
          }}
        />
      )}

      {cargando && <p className="mt-4 text-gray-500">Cargando…</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

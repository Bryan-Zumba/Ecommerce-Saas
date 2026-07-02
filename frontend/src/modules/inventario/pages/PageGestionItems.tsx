import React, { useState, useEffect } from 'react';
import { useItems } from '../hooks/useItems';
import { useCategorias } from '../hooks/useCategorias';
import { KPIItems } from '../components/items/KPIItems';
import { TablaItems } from '../components/items/TablaItems';
import { FormularioItem } from '../components/items/FormularioItem';
import { Item, ItemInputDTO, ItemUpdateDTO } from '../types/ItemTypes';

export const PageGestionItems: React.FC = () => {
  const {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    toggleEstadoItem,
  } = useItems();

  const {
    categorias,
    fetchCategorias
  } = useCategorias();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [itemSeleccionado, setItemSeleccionado] = useState<Item | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchItems();
    fetchCategorias();
  }, [fetchItems, fetchCategorias]);

  const abrirCrear = () => {
    setItemSeleccionado(null);
    setModalAbierto(true);
  };
  const abrirEditar = (item: Item) => {
    setItemSeleccionado(item);
    setModalAbierto(true);
  };
  const cerrarModal = () => setModalAbierto(false);

  const itemsFiltrados = items.filter((i) =>
    i.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (i.descripcion && i.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const total = itemsFiltrados.length;
  const totalProductos = itemsFiltrados.filter(i => i.tipo_item === 'Producto').length;
  const totalServicios = itemsFiltrados.filter(i => i.tipo_item === 'Servicio').length;

  return (
    <div className="min-h-screen bg-gray-50/50 animate-in fade-in duration-500 relative flex flex-col">
      <main className="max-w-7xl mx-auto p-6 lg:p-10 flex-1 w-full text-left">
        
        {/* Cabecera */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="text-left">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              📦 Gestión de Ítems
            </h1>
            <p className="text-gray-500 mt-1 font-medium text-sm lg:text-base">
              Administra los productos y servicios del catálogo.
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
                placeholder="Buscar ítem..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={abrirCrear}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-emerald-600/10 flex items-center justify-center gap-2"
            >
              <span>+</span> Añadir Ítem
            </button>
          </div>
        </div>

        <KPIItems total={total} totalProductos={totalProductos} totalServicios={totalServicios} />

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl font-medium text-left">
            ⚠️ {error}
          </div>
        )}

        {loading && items.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-12 text-center border border-gray-100 shadow-sm mt-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mb-2" />
            <p className="text-gray-400 text-sm font-medium">Cargando ítems...</p>
          </div>
        ) : (
          <TablaItems
            items={itemsFiltrados}
            onToggleEstado={(item) => toggleEstadoItem(item.id_item, item.estado)}
            onEditar={abrirEditar}
          />
        )}

        {modalAbierto && (
          <FormularioItem
            isOpen={modalAbierto}
            itemAEditar={itemSeleccionado}
            categorias={categorias}
            onClose={cerrarModal}
            onGuardar={async (datos) => {
              if (itemSeleccionado) {
                const res = await updateItem(itemSeleccionado.id_item, datos as ItemUpdateDTO);
                if (res) cerrarModal();
              } else {
                const res = await createItem(datos as ItemInputDTO);
                if (res) cerrarModal();
              }
            }}
          />
        )}
      </main>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { useItems } from '../../application/useItems';
import { LocalstorageItemRepository } from '../repositories/LocalstorageItemRepository';
import { KPIItems } from '../components/KPIItems';
import { TablaItems } from '../components/TablaItems';
import { FormularioItem } from '../components/FormularioItem';
import { Item } from '../../domain/Item';

export const PageGestionItems: React.FC = () => {
  const repository = useMemo(() => new LocalstorageItemRepository(), []);

  const {
    items,
    cargando,
    error,
    agregarItem,
    actualizarItem,
    toggleEstadoItem,
    eliminarItem,
    restaurarDemo,
  } = useItems(repository);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [itemSeleccionado, setItemSeleccionado] = useState<Item | null>(null);

  const abrirCrear = () => {
    setItemSeleccionado(null);
    setModalAbierto(true);
  };
  const abrirEditar = (item: Item) => {
    setItemSeleccionado(item);
    setModalAbierto(true);
  };
  const cerrarModal = () => setModalAbierto(false);

  const total = items.length;
  const totalProductos = items.filter(i => i.tipo_item === 'Producto').length;
  const totalServicios = items.filter(i => i.tipo_item === 'Servicio').length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-black mb-2">Gestión de Ítems</h1>
      <p className="text-gray-500 mb-6">Administra los productos y servicios del catálogo.</p>

      <KPIItems total={total} totalProductos={totalProductos} totalServicios={totalServicios} />

      <button
        onClick={abrirCrear}
        className="mt-4 mb-6 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors"
      >
        + Añadir Ítem
      </button>

      <TablaItems
        items={items}
        onToggleEstado={(id) => toggleEstadoItem(id)}
        onEditar={abrirEditar}
        onEliminar={(item) => eliminarItem(item.id_item)}
      />

      {modalAbierto && (
        <FormularioItem
          isOpen={modalAbierto}
          itemAEditar={itemSeleccionado}
          onClose={cerrarModal}
          onGuardar={async (datos) => {
            const datosConEmpresa = { ...datos, id_empresa: 1 };
            if (itemSeleccionado) {
              await actualizarItem(itemSeleccionado.id_item, datosConEmpresa);
            } else {
              await agregarItem(datosConEmpresa);
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

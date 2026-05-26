import React, { useState, useMemo } from 'react';
import { useProductos } from '../../application/useProductos';
import { LocalstorageProductoRepository } from '../repositories/LocalstorageProductoRepository';
import { KPIProductos } from '../components/KPIProductos';
import { TablaProductos } from '../components/TablaProductos';
import { FormularioProducto } from '../components/FormularioProducto';

export const PageGestionProductos: React.FC = () => {
  const repository = useMemo(() => new LocalstorageProductoRepository(), []);

  const {
    productos,
    cargando,
    error,
    agregarProducto,
    actualizarProducto,
    toggleEstadoProducto,
    eliminarProducto,
    restaurarDemo,
  } = useProductos(repository);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<null | any>(null);

  const abrirCrear = () => {
    setProductoSeleccionado(null);
    setModalAbierto(true);
  };
  const abrirEditar = (p: any) => {
    setProductoSeleccionado(p);
    setModalAbierto(true);
  };
  const cerrarModal = () => setModalAbierto(false);

  const total = productos.length;
  const bajoStock = productos.filter(p => p.stock > 0 && p.stock <= 5).length;
  const sinStock = productos.filter(p => p.stock === 0).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-black mb-6">Gestión de Productos</h1>

      <KPIProductos total={total} bajoStock={bajoStock} sinStock={sinStock} />

      <button
        onClick={abrirCrear}
        className="mt-4 mb-6 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors"
      >
        + Añadir producto
      </button>

      <TablaProductos
        productos={productos}
        onToggleEstado={(id, _nombre, _estado) => toggleEstadoProducto(id)}
        onEditar={abrirEditar}
        onEliminar={(p) => eliminarProducto(p.id_productos)}
      />

      {modalAbierto && (
        <FormularioProducto
          isOpen={modalAbierto}
          productoAEditar={productoSeleccionado}
          onClose={cerrarModal}
          onGuardar={async (datos) => {
              const datosConEmpresa = { ...datos, id_empresa: 1 };
              if (productoSeleccionado) {
                await actualizarProducto(productoSeleccionado.id_productos, datosConEmpresa);
              } else {
                await agregarProducto(datosConEmpresa);
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

import React from 'react';
import { productsData } from '../../data/products';

function MatrizProductos({ productos, setProductos }) {
  // Función para agregar una fila vacía
  const agregarFila = () => {
    setProductos([...productos, { productoId: '', nombre: '', cantidad: 1, costoUnitario: 0, costoTotal: 0 }]);
  };

  // Función para eliminar una fila
  const eliminarFila = (index) => {
    const nuevosProductos = [...productos];
    nuevosProductos.splice(index, 1);
    setProductos(nuevosProductos);
  };

  // Manejar el cambio en una fila
  const handleChange = (index, campo, valor) => {
    const nuevosProductos = [...productos];
    const fila = { ...nuevosProductos[index] };

    if (campo === 'productoId') {
      const productoSeleccionado = productsData.find(p => p.id === parseInt(valor));
      if (productoSeleccionado) {
        fila.productoId = productoSeleccionado.id;
        fila.nombre = productoSeleccionado.nombre;
      } else {
        fila.productoId = '';
        fila.nombre = '';
      }
    } else if (campo === 'cantidad' || campo === 'costoUnitario') {
      fila[campo] = parseFloat(valor) || 0;
      fila.costoTotal = fila.cantidad * fila.costoUnitario;
    }

    nuevosProductos[index] = fila;
    setProductos(nuevosProductos);
  };

  const totalGeneral = productos.reduce((acc, p) => acc + (p.costoTotal || 0), 0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-xl font-bold text-gray-800">Matriz de Productos</h2>
        <button
          type="button"
          onClick={agregarFila}
          className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-4 py-2 rounded-xl font-medium transition-colors text-sm"
        >
          + Agregar Producto
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm">
              <th className="p-3 font-medium rounded-tl-xl">Producto</th>
              <th className="p-3 font-medium w-32">Cantidad</th>
              <th className="p-3 font-medium w-36">Costo Unitario ($)</th>
              <th className="p-3 font-medium w-36">Costo Total ($)</th>
              <th className="p-3 font-medium w-16 text-center rounded-tr-xl">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  No hay productos en la matriz. Haz clic en "Agregar Producto" para comenzar.
                </td>
              </tr>
            ) : (
              productos.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-2">
                    <select
                      value={item.productoId}
                      onChange={(e) => handleChange(index, 'productoId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                      required
                    >
                      <option value="">Seleccione un producto...</option>
                      {productsData.map(prod => (
                        <option key={prod.id} value={prod.id}>
                          {prod.nombre} ({prod.categoria})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      min="1"
                      value={item.cantidad}
                      onChange={(e) => handleChange(index, 'cantidad', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      required
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.costoUnitario}
                      onChange={(e) => handleChange(index, 'costoUnitario', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      required
                    />
                  </td>
                  <td className="p-2">
                    <div className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg font-medium text-gray-700">
                      ${item.costoTotal.toFixed(2)}
                    </div>
                  </td>
                  <td className="p-2 text-center">
                    <button
                      type="button"
                      onClick={() => eliminarFila(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      title="Eliminar fila"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {productos.length > 0 && (
            <tfoot>
              <tr>
                <td colSpan="3" className="p-4 text-right font-bold text-gray-700">
                  Total General:
                </td>
                <td className="p-4 font-bold text-emerald-600 text-lg">
                  ${totalGeneral.toFixed(2)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}

export default MatrizProductos;

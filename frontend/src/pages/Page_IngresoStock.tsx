import React, { useState, useMemo, FormEvent } from 'react';

// Tipo para los productos ingresados en stock
interface ProductoIngreso {
  productoId: string;
  cantidad: number;
  costoUnitario: number;
}

// Tipo para los datos de la factura
interface DatosFactura {
  codigo: string;
  fecha: string;
  total: string;
  imagenAdjunta: File | null;
}
import { useNavigate } from 'react-router-dom';
import { LocalstorageBodegaRepository } from '@/modules/bodegas/infrastructure/repositories/LocalstorageBodegaRepository';
import { useBodegas } from '@/modules/bodegas/application/useBodegas';
import FormularioFactura from '@/modules/stock/infrastructure/components/FormularioFactura';
import MatrizProductos from '@/modules/stock/infrastructure/components/MatrizProductos';
import { enviarSolicitudStock } from '@/modules/stock/infrastructure/repositories/servicioStock';
import { servicioHistorial } from '@/modules/ventas/infrastructure/repositories/servicioHistorial';

function IngresoStock() {
  const navigate = useNavigate();
  const repositoryBodega = useMemo(() => new LocalstorageBodegaRepository(), []);
  const { bodegas, cargando: cargandoBodegas } = useBodegas(repositoryBodega);
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState<null | { ordenIngreso: string }>(null);
  const [bodegaSeleccionada, setBodegaSeleccionada] = useState<number | null>(null);

  // Estado para los datos de la factura
  const [datosFactura, setDatosFactura] = useState({
    codigo: '',
    fecha: '',
    total: '',
    imagenAdjunta: null
  });

  // Estado para la matriz de productos
  // Estado para la matriz de productos
  const [productos, setProductos] = useState<ProductoIngreso[]>([]);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validación básica
    if (!bodegaSeleccionada) {
      alert('Debe seleccionar una bodega antes de enviar la solicitud.');
      return;
    }
    if (productos.length === 0) {
      alert("Debe agregar al menos un producto a la matriz.");
      return;
    }

    const productosIncompletos = productos.some(p => !p.productoId || p.cantidad <= 0 || p.costoUnitario <= 0);
    if (productosIncompletos) {
      alert("Por favor, complete todos los campos de los productos en la matriz.");
      return;
    }

    setCargando(true);
    try {
      const resultado = await enviarSolicitudStock(datosFactura, productos, bodegaSeleccionada);

      // Guardar en el historial personal
      servicioHistorial.guardarOperacion({
        tipo: 'stock',
        ordenId: resultado.ordenIngreso,
        datosFactura: { ...datosFactura },
        productos: [...productos],
        estado: 'Pendiente',
        cajero: "Bryan Zumba",
        bodegaId: bodegaSeleccionada
      });

      setExito(resultado);
    } catch (error: any) {
      console.error("Error al enviar la solicitud", error);
      alert("Hubo un error al procesar la solicitud.");
    } finally {
      setCargando(false);
    }
  };

  if (exito) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Solicitud Enviada!</h2>
          <p className="text-gray-600 mb-6">
            La solicitud de ingreso de stock se ha enviado correctamente al supervisor.
          </p>
          <div className="bg-gray-50 p-4 rounded-xl mb-8 border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Orden de Ingreso</p>
            <p className="text-xl font-mono font-bold text-gray-800">{exito.ordenIngreso}</p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setExito(null);
                setDatosFactura({ codigo: '', fecha: '', total: '', imagenAdjunta: null });
                setProductos([]);
              }}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors"
            >
              Nueva Solicitud
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-white text-gray-700 border border-gray-200 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Encabezado */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            ←
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Solicitud de Ingreso de Stock</h1>
            <p className="text-gray-500">Registre los datos de la factura y los productos a ingresar.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar Bodega</label>
            {cargandoBodegas ? (
              <p className="text-gray-500">Cargando bodegas…</p>
            ) : (
              <select
                value={bodegaSeleccionada ?? ''}
                onChange={e => setBodegaSeleccionada(Number(e.target.value) || null)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">-- Seleccione una bodega --</option>
                {bodegas.map(b => (
                  <option key={b.id_bodega} value={b.id_bodega}>{b.nombre}</option>
                ))}
              </select>
            )}
          </div>
          <FormularioFactura datos={datosFactura} setDatos={setDatosFactura} />

          {/* Matriz de Productos */}
          <MatrizProductos productos={productos} setProductos={setProductos} />

          {/* Botones de acción */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando}
              className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {cargando ? 'Enviando...' : 'Enviar Solicitud al Supervisor'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default IngresoStock;

import { Item } from '../domain/Item';
import { Operacion, servicioHistorial } from '@/modules/ventas/infrastructure/repositories/servicioHistorial';

export const STOCK_SERVICIO_ILIMITADO = null;

const KEY_INVENTARIO = 'saas_inventario_items';

type InventarioItems = Record<string, number>;

const leerInventario = (): InventarioItems => {
  try {
    return JSON.parse(localStorage.getItem(KEY_INVENTARIO) || '{}');
  } catch {
    return {};
  }
};

const guardarInventario = (inventario: InventarioItems) => {
  localStorage.setItem(KEY_INVENTARIO, JSON.stringify(inventario));
};

const obtenerIdItemDesdeOperacion = (registro: any): number | null => {
  const id = registro.id_item ?? registro.itemId ?? registro.productoId ?? registro.id;
  const numero = Number(id);
  return Number.isFinite(numero) ? numero : null;
};

const esStockAprobado = (operacion: Operacion) => {
  return (
    operacion.tipo === 'stock' &&
    String(operacion.estado || '').trim().toLowerCase() === 'aprobado'
  );
};

const sumarCantidad = (inventario: InventarioItems, idItem: number, cantidad: number) => {
  const key = String(idItem);
  inventario[key] = Math.max(0, (inventario[key] || 0) + cantidad);
};

const reconstruirInventarioDesdeHistorial = (): InventarioItems => {
  const inventario: InventarioItems = {};

  servicioHistorial.obtenerTodo().forEach((operacion) => {
    if (esStockAprobado(operacion)) {
      (operacion.productos || []).forEach((registro) => {
        const idItem = obtenerIdItemDesdeOperacion(registro);
        if (idItem !== null) {
          sumarCantidad(inventario, idItem, Number(registro.cantidad) || 0);
        }
      });
      return;
    }

    if (operacion.tipo === 'venta') {
      (operacion.productos || []).forEach((registro) => {
        const idItem = obtenerIdItemDesdeOperacion(registro);
        if (idItem !== null) {
          sumarCantidad(inventario, idItem, -(Number(registro.quantity ?? registro.cantidad) || 0));
        }
      });
    }
  });

  guardarInventario(inventario);
  return inventario;
};

export const sincronizarInventarioDesdeHistorial = () => {
  return reconstruirInventarioDesdeHistorial();
};

const obtenerInventarioActual = () => {
  const inventario = leerInventario();
  return Object.keys(inventario).length > 0 ? inventario : reconstruirInventarioDesdeHistorial();
};

export const calcularStockDisponible = (item: Item): number | null => {
  if (item.tipo_item === 'Servicio') return STOCK_SERVICIO_ILIMITADO;

  const inventario = reconstruirInventarioDesdeHistorial();
  return Math.max(0, inventario[String(item.id_item)] || 0);
};

export const registrarIngresoInventario = (productos: any[]) => {
  const inventario = obtenerInventarioActual();

  productos.forEach((registro) => {
    const idItem = obtenerIdItemDesdeOperacion(registro);
    if (idItem !== null) {
      sumarCantidad(inventario, idItem, Number(registro.cantidad) || 0);
    }
  });

  guardarInventario(inventario);
};

export const registrarSalidaInventario = (productos: any[]) => {
  const inventario = obtenerInventarioActual();

  productos.forEach((registro) => {
    const idItem = obtenerIdItemDesdeOperacion(registro);
    if (idItem !== null) {
      sumarCantidad(inventario, idItem, -(Number(registro.quantity ?? registro.cantidad) || 0));
    }
  });

  guardarInventario(inventario);
};

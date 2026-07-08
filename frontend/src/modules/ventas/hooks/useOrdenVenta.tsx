import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export interface ItemOrdenType {
  id: number | string;
  id_item?: number;
  id_bodega?: number; // Agregado para el backend
  nombre: string;
  precio: number;
  stock?: number | null;
  imagen?: string;
  categoria?: string;
  tipo_item?: 'Producto' | 'Servicio';
  quantity: number;
}

interface OrdenVentaContextType {
  orden: ItemOrdenType[];
  agregarItem: (item: Omit<ItemOrdenType, 'quantity'>) => boolean;
  eliminarItem: (idItem: number | string) => void;
  actualizarCantidadItem: (idItem: number | string, cantidad: number) => void;
  limpiarOrden: () => void;
  subtotal: number;
  iva: number;
  total: number;
}

const OrdenVentaContext = createContext<OrdenVentaContextType | undefined>(undefined);

export const ProveedorOrdenVenta = ({ children }: { children: ReactNode }) => {
  const [orden, setOrden] = useState<ItemOrdenType[]>(() => {
    try {
      const itemStorage = localStorage.getItem('carritoVentaLocal');
      return itemStorage ? JSON.parse(itemStorage) : [];
    } catch (error) {
      console.error("Error leyendo localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('carritoVentaLocal', JSON.stringify(orden));
    } catch (error) {
      console.error("Error guardando localStorage", error);
    }
  }, [orden]);

  const agregarItem = (item: Omit<ItemOrdenType, 'quantity'>): boolean => {
    const itemExistente = orden.find((itemOrden) => itemOrden.id === item.id);
    const tieneLimiteStock = typeof item.stock === 'number' && item.stock !== null;

    if (itemExistente) {
      if (!tieneLimiteStock || itemExistente.quantity < (item.stock ?? 0)) {
        setOrden((prevOrden) =>
          prevOrden.map((itemOrden) =>
            itemOrden.id === item.id
              ? { ...itemOrden, quantity: itemOrden.quantity + 1 }
              : itemOrden
          )
        );
        return true;
      }
      Swal.fire({
        icon: 'warning',
        title: 'Límite de Stock',
        text: `Stock máximo alcanzado para ${item.nombre}.`,
        confirmButtonColor: '#10b981',
        timer: 2000,
        showConfirmButton: false
      });
      return false;
    }

    if (!tieneLimiteStock || (item.stock ?? 0) > 0) {
      setOrden((prevOrden) => [...prevOrden, { ...item, quantity: 1 }]);
      return true;
    }

    Swal.fire({
      icon: 'error',
      title: 'Sin Stock',
      text: `No hay stock disponible para ${item.nombre}.`,
      confirmButtonColor: '#10b981',
      timer: 2000,
      showConfirmButton: false
    });
    return false;
  };

  const eliminarItem = (idItem: number | string) => {
    setOrden((prevOrden) => prevOrden.filter((item) => item.id !== idItem));
  };

  const actualizarCantidadItem = (idItem: number | string, cantidad: number) => {
    setOrden((prevOrden) =>
      prevOrden.map((item) => {
        if (item.id === idItem) {
          const nuevaCantidad = item.quantity + cantidad;
          const tieneLimiteStock = typeof item.stock === 'number' && item.stock !== null;

          if (nuevaCantidad >= 1 && (!tieneLimiteStock || nuevaCantidad <= (item.stock ?? 0))) {
            return { ...item, quantity: nuevaCantidad };
          } else if (tieneLimiteStock && nuevaCantidad > (item.stock ?? 0)) {
             Swal.fire({
               icon: 'warning',
               title: 'Límite de Stock',
               text: `Stock máximo alcanzado para ${item.nombre}.`,
               confirmButtonColor: '#10b981',
               timer: 2000,
               showConfirmButton: false
             });
          }
        }
        return item;
      })
    );
  };

  const limpiarOrden = () => setOrden([]);

  const total = orden.reduce((acc, item) => acc + item.precio * item.quantity, 0);
  const subtotal = total * 0.85; // TODO: Manejar IVA dinámico si es necesario
  const iva = total * 0.15;

  return (
    <OrdenVentaContext.Provider
      value={{
        orden,
        agregarItem,
        eliminarItem,
        actualizarCantidadItem,
        limpiarOrden,
        subtotal,
        iva,
        total,
      }}
    >
      {children}
    </OrdenVentaContext.Provider>
  );
};

export const useOrdenVenta = () => {
  const contexto = useContext(OrdenVentaContext);
  if (contexto === undefined) {
    throw new Error('useOrdenVenta debe ser usado dentro de un ProveedorOrdenVenta');
  }
  return contexto;
};

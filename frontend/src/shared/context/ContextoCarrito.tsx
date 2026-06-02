import { createContext, ReactNode, useContext, useState } from 'react';

export interface ItemCarritoType {
  id: number | string;
  id_item?: number;
  nombre: string;
  precio: number;
  stock?: number | null;
  imagen?: string;
  categoria?: string;
  tipo_item?: 'Producto' | 'Servicio';
  quantity: number;
}

interface ContextoCarritoType {
  cart: ItemCarritoType[];
  carrito: ItemCarritoType[];
  agregarAlCarrito: (item: Omit<ItemCarritoType, 'quantity'>) => void;
  eliminarDelCarrito: (idItem: number | string) => void;
  actualizarCantidad: (idItem: number | string, cantidad: number) => void;
  limpiarCarrito: () => void;
  subtotal: number;
  iva: number;
  total: number;
  addToCart: (item: Omit<ItemCarritoType, 'quantity'>) => void;
  removeFromCart: (idItem: number | string) => void;
  updateQuantity: (idItem: number | string, cantidad: number) => void;
  clearCart: () => void;
}

const ContextoCarrito = createContext<ContextoCarritoType | undefined>(undefined);

export const ProveedorCarrito = ({ children }: { children: ReactNode }) => {
  const [carrito, setCarrito] = useState<ItemCarritoType[]>([]);

  const agregarAlCarrito = (item: Omit<ItemCarritoType, 'quantity'>) => {
    setCarrito((prevCarrito) => {
      const itemExistente = prevCarrito.find((itemCarrito) => itemCarrito.id === item.id);
      const tieneLimiteStock = typeof item.stock === 'number';

      if (itemExistente) {
        if (!tieneLimiteStock || itemExistente.quantity < item.stock) {
          return prevCarrito.map((itemCarrito) =>
            itemCarrito.id === item.id
              ? { ...itemCarrito, quantity: itemCarrito.quantity + 1 }
              : itemCarrito
          );
        }

        console.warn('Stock maximo alcanzado');
        return prevCarrito;
      }

      if (!tieneLimiteStock || item.stock > 0) {
        return [...prevCarrito, { ...item, quantity: 1 }];
      }

      return prevCarrito;
    });
  };

  const eliminarDelCarrito = (idItem: number | string) => {
    setCarrito((prevCarrito) => prevCarrito.filter((item) => item.id !== idItem));
  };

  const actualizarCantidad = (idItem: number | string, cantidad: number) => {
    setCarrito((prevCarrito) =>
      prevCarrito.map((item) => {
        if (item.id === idItem) {
          const nuevaCantidad = item.quantity + cantidad;
          const tieneLimiteStock = typeof item.stock === 'number';

          if (nuevaCantidad >= 1 && (!tieneLimiteStock || nuevaCantidad <= item.stock)) {
            return { ...item, quantity: nuevaCantidad };
          }
        }

        return item;
      })
    );
  };

  const limpiarCarrito = () => setCarrito([]);

  const total = carrito.reduce((acc, item) => acc + item.precio * item.quantity, 0);
  const subtotal = total * 0.85;
  const iva = total * 0.15;

  return (
    <ContextoCarrito.Provider
      value={{
        cart: carrito,
        carrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        actualizarCantidad,
        limpiarCarrito,
        subtotal,
        iva,
        total,
        addToCart: agregarAlCarrito,
        removeFromCart: eliminarDelCarrito,
        updateQuantity: actualizarCantidad,
        clearCart: limpiarCarrito,
      }}
    >
      {children}
    </ContextoCarrito.Provider>
  );
};

export const useCarrito = () => {
  const contexto = useContext(ContextoCarrito);
  if (contexto === undefined) {
    throw new Error('useCarrito debe ser usado dentro de un ProveedorCarrito');
  }
  return contexto;
};

export const useCart = useCarrito;

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../data/products';

// Definimos el tipo de ítem que estará en el carrito (incluye la cantidad que el usuario elige)
interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, amount: number) => void;
  clearCart: () => void;
  subtotal: number;
  iva: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Función principal para agregar productos respetando el stock
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      
      if (existingItem) {
        // Si ya está en el carro, verificamos que no supere el stock al sumarle 1
        if (existingItem.quantity < product.stock) {
          return prevCart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          // Si ya llegó al límite de stock, no hacemos nada o podrías lanzar una alerta
          console.warn("Stock máximo alcanzado para este producto");
          return prevCart;
        }
      }
      
      // Si el producto es nuevo en el carro, lo añadimos con cantidad 1 (siempre que el stock sea > 0)
      if (product.stock > 0) {
        return [...prevCart, { ...product, quantity: 1 }];
      }
      
      return prevCart;
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: number, amount: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === productId) {
          const newQuantity = item.quantity + amount;
          // Validamos: que no sea menor a 1 y que no supere el stock del producto
          if (newQuantity >= 1 && newQuantity <= item.stock) {
            return { ...item, quantity: newQuantity };
          }
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  // CÁLCULOS MATEMÁTICOS DEL FLUJO (Desglose 85% / 15%)
  const total = cart.reduce((acc, item) => acc + item.precio * item.quantity, 0);
  const subtotal = total * 0.85; // Base imponible
  const iva = total * 0.15;      // Impuesto (IVA)

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        iva,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizado para usar el carrito fácilmente en cualquier componente
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

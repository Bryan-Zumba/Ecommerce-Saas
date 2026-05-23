import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Producto {
    id: number | string;
    nombre: string;
    precio: number;
    stock: number;
    imagen?: string;
    categoria?: string;
    quantity: number;
}

interface ContextoCarritoType {
    cart: Producto[];
    carrito: Producto[];
    agregarAlCarrito: (producto: any) => void;
    eliminarDelCarrito: (idProducto: number | string) => void;
    actualizarCantidad: (idProducto: number | string, cantidad: number) => void;
    limpiarCarrito: () => void;
    subtotal: number;
    iva: number;
    total: number;
    addToCart: (producto: any) => void;
    removeFromCart: (idProducto: number | string) => void;
    updateQuantity: (idProducto: number | string, cantidad: number) => void;
    clearCart: () => void;
}

const ContextoCarrito = createContext<ContextoCarritoType | undefined>(undefined);

export const ProveedorCarrito = ({ children }: { children: ReactNode }) => {
    const [carrito, setCarrito] = useState<Producto[]>([]);

    const agregarAlCarrito = (producto: any) => {
        setCarrito((prevCarrito) => {
            const itemExistente = prevCarrito.find((item) => item.id === producto.id);
            if (itemExistente) {
                if (itemExistente.quantity < producto.stock) {
                    return prevCarrito.map((item) => item.id === producto.id ? { ...item, quantity: item.quantity + 1 } : item);
                } else {
                    console.warn("Stock máximo alcanzado");
                    return prevCarrito;
                }
            }
            if (producto.stock > 0) {
                return [...prevCarrito, { ...producto, quantity: 1 }];
            }
            return prevCarrito;
        });
    };

    const eliminarDelCarrito = (idProducto: number | string) => {
        setCarrito((prevCarrito) => prevCarrito.filter((item) => item.id !== idProducto));
    };

    const actualizarCantidad = (idProducto: number | string, cantidad: number) => {
        setCarrito((prevCarrito) => prevCarrito.map((item) => {
            if (item.id === idProducto) {
                const nuevaCantidad = item.quantity + cantidad;
                if (nuevaCantidad >= 1 && nuevaCantidad <= item.stock) {
                    return { ...item, quantity: nuevaCantidad };
                }
            }
            return item;
        }));
    };

    const limpiarCarrito = () => setCarrito([]);

    const total = carrito.reduce((acc, item) => acc + item.precio * item.quantity, 0);
    const subtotal = total * 0.85;
    const iva = total * 0.15;

    return (
        <ContextoCarrito.Provider value={{
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
        }}>
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

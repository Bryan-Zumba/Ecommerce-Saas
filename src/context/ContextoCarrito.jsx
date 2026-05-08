import React, { createContext, useContext, useState } from 'react';

const ContextoCarrito = createContext(undefined);

export const ProveedorCarrito = ({ children }) => {
    const [carrito, setCarrito] = useState([]);

    const agregarAlCarrito = (producto) => {
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

    const eliminarDelCarrito = (idProducto) => {
        setCarrito((prevCarrito) => prevCarrito.filter((item) => item.id !== idProducto));
    };

    const actualizarCantidad = (idProducto, cantidad) => {
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
            cart: carrito, // Mantengo 'cart' por ahora para retrocompatibilidad parcial mientras migro
            carrito,
            agregarAlCarrito,
            eliminarDelCarrito,
            actualizarCantidad,
            limpiarCarrito,
            subtotal,
            iva,
            total,
            // Aliases para no romper todo de golpe
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

// Alias para retrocompatibilidad
export const useCart = useCarrito;

import { useState } from 'react';
import { useOrdenVenta } from '@/modules/ventas/hooks/useOrdenVenta';
import { ItemCatalogo } from '../types/VentaTypes';

interface TarjetaItemCatalogoProps {
  itemCatalogo: ItemCatalogo;
}

function TarjetaItemCatalogo({ itemCatalogo }: TarjetaItemCatalogoProps) {
  const { agregarItem } = useOrdenVenta();
  const [isClicked, setIsClicked] = useState(false);
  const { item, stock_disponible, id_bodega } = itemCatalogo;

  const esServicio = item.tipo_item === 'Servicio';
  const estaDisponible = esServicio || stock_disponible > 0;

  const handleAgregar = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 150);

    const fueAgregado = agregarItem({
      id: item.id_item,
      id_item: item.id_item,
      id_bodega: id_bodega,
      nombre: item.nombre,
      precio: Number(item.precio),
      stock: esServicio ? null : stock_disponible,
      categoria: item.categoria?.nombre || 'Sin categoría',
      tipo_item: item.tipo_item as 'Producto' | 'Servicio',
      imagen: item.imagen_url || '',
    });

    // Animación de viaje al carrito solo si se pudo agregar
    if (fueAgregado && estaDisponible) {
      const rect = e.currentTarget.getBoundingClientRect();
      const ghost = document.createElement('div');
      
      // Estilos iniciales del emoji volador
      ghost.innerHTML = '✨';
      ghost.style.position = 'fixed';
      ghost.style.left = `${rect.left + rect.width / 2}px`;
      ghost.style.top = `${rect.top + rect.height / 2}px`;
      ghost.style.fontSize = '3rem';
      ghost.style.zIndex = '9999';
      ghost.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
      ghost.style.pointerEvents = 'none';
      ghost.style.transform = 'translate(-50%, -50%) scale(1)';
      ghost.style.opacity = '1';
      
      document.body.appendChild(ghost);

      // Buscar el botón del carrito (escritorio o móvil dependiendo de cuál esté visible)
      let cartBtn = document.getElementById('btn-carrito-escritorio');
      if (!cartBtn || window.getComputedStyle(cartBtn).display === 'none') {
        cartBtn = document.getElementById('btn-carrito-movil');
      }

      const targetRect = cartBtn ? cartBtn.getBoundingClientRect() : { left: window.innerWidth - 50, top: window.innerHeight / 2, width: 50, height: 50 };

      // Disparar animación en el siguiente frame
      requestAnimationFrame(() => {
        ghost.style.left = `${targetRect.left + (targetRect.width / 2)}px`;
        ghost.style.top = `${targetRect.top + (targetRect.height / 2)}px`;
        ghost.style.transform = 'translate(-50%, -50%) scale(0.2) rotate(360deg)';
        ghost.style.opacity = '0.5';
      });

      // Limpiar DOM después de la animación
      setTimeout(() => {
        if (document.body.contains(ghost)) {
          document.body.removeChild(ghost);
        }
      }, 800);
    }
  };

  return (
    <div
      onClick={handleAgregar}
      className={`rounded-2xl p-4 shadow-sm border transition-all duration-200 flex flex-col justify-between text-left h-full cursor-pointer 
        ${
          estaDisponible 
            ? 'bg-white border-gray-100 hover:shadow-md hover:scale-[1.02] active:scale-[0.95]' 
            : 'bg-rose-50/50 border-rose-200 hover:scale-[1.02] active:scale-[0.95]'
        } 
        ${isClicked ? 'scale-[0.90] opacity-80' : ''}
      `}
    >
      <div>
        <div className="flex items-center gap-1.5 self-start mb-2">
          <span className="bg-emerald-50 text-emerald-700 font-semibold text-[9px] px-2 py-0.5 rounded-full whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px]">
            {item.categoria?.nombre || 'Sin categoría'}
          </span>
          <span className="bg-gray-100 text-gray-600 font-semibold text-[9px] px-2 py-0.5 rounded-full">
            {item.tipo_item}
          </span>
        </div>

        {item.imagen_url && item.imagen_url.trim() !== '' ? (
          <img
            src={item.imagen_url}
            alt={item.nombre}
            className="w-full h-28 object-cover rounded-xl mb-3 bg-gray-50 border border-gray-100"
          />
        ) : (
          <div className="w-full h-28 rounded-xl mb-3 bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300 text-4xl font-black">
            {item.nombre.charAt(0).toUpperCase()}
          </div>
        )}

        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-0.5 leading-snug line-clamp-2 min-h-[40px]">{item.nombre}</h3>
          <p className="font-bold text-emerald-600 text-sm">
            <span>$</span>
            <span>{Number(item.precio).toFixed(2)}</span>
          </p>
        </div>
      </div>

      <div className="mt-3 border-t border-gray-100 pt-3 flex justify-between items-center text-sm">
        {esServicio ? (
          <span className="text-emerald-600 font-semibold">Servicio disponible</span>
        ) : (
          <>
            <span className="text-gray-500 font-semibold">Stock:</span>
            <span
              className={`font-black font-mono text-base ${
                stock_disponible === 0 ? 'text-rose-600' : 'text-gray-900'
              }`}
            >
              {stock_disponible === 0 ? '0 u (Agotado)' : `${stock_disponible} u`}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default TarjetaItemCatalogo;

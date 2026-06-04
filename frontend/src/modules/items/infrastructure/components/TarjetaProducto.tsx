import React, { useState } from "react";
import { useCarrito } from "@/shared/context/ContextoCarrito";
import { obtenerStockPorBodega } from "../../application/inventarioItems";
import { Item, obtenerNombreCategoria } from "../../domain/Item";

function TarjetaProducto({ item }: { item: Item }) {
  const { agregarAlCarrito } = useCarrito();
  const esServicio = item.tipo_item === "Servicio";
  
  // Obtener stocks por bodegas
  const bodegasStock = obtenerStockPorBodega(item.id_item);
  const defaultBodega = bodegasStock.find(b => b.bodega === 'Bodega Central (Caja)') || { bodega: 'Bodega Central (Caja)', stock: 0 };
  
  const [mostrarModalBodegas, setMostrarModalBodegas] = useState(false);
  const estaDisponibleAlternativas = bodegasStock.some(b => b.stock > 0);
  const estaDisponible = item.estado && (esServicio || defaultBodega.stock > 0 || estaDisponibleAlternativas);

  const agregarConBodega = (bodega: string, stock: number | null) => {
    const itemParaCarrito = {
      id: `${item.id_item}-${bodega}`,
      id_item: item.id_item,
      nombre: item.nombre,
      precio: item.precio,
      stock: stock,
      categoria: obtenerNombreCategoria(item.id_categoria),
      tipo_item: item.tipo_item,
      imagen: item.imagen || "/assets/coca_cola_sin_azu_300ml.png",
      bodegaSeleccionada: esServicio ? undefined : bodega
    };
    agregarAlCarrito(itemParaCarrito);
  };

  const handleAgregar = () => {
    if (!estaDisponible) return;
    
    if (esServicio || defaultBodega.stock > 0) {
      // Agregar directo desde Bodega Central
      agregarConBodega('Bodega Central (Caja)', esServicio ? null : defaultBodega.stock);
    } else if (estaDisponibleAlternativas) {
      // Abrir modal de bodegas alternativas
      setMostrarModalBodegas(true);
    }
  };

  return (
    <>
      <div
        onClick={handleAgregar}
        className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transition-all duration-200 flex flex-col justify-between text-left h-full ${
          estaDisponible
            ? "cursor-pointer hover:shadow-md hover:scale-[1.01] active:scale-[0.98]"
            : "opacity-60 cursor-not-allowed"
        }`}
      >
        <div>
          <div className="flex items-center gap-2 self-start mb-2">
            <span className="bg-emerald-50 text-emerald-700 font-semibold text-[10px] px-2 py-0.5 rounded-full">
              {obtenerNombreCategoria(item.id_categoria)}
            </span>
            <span className="bg-gray-100 text-gray-600 font-semibold text-[10px] px-2 py-0.5 rounded-full">
              {item.tipo_item}
            </span>
          </div>

          <img
            src={item.imagen || "/assets/coca_cola_sin_azu_300ml.png"}
            alt={item.nombre}
            className="w-full h-40 object-cover rounded-xl mb-4"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/assets/coca_cola_sin_azu_300ml.png";
            }}
          />

          <div>
            <h3 className="text-base font-bold text-gray-800 mb-1 leading-snug">{item.nombre}</h3>
            <p className="font-bold text-emerald-600 text-sm">
              <span>$</span>
              <span>{item.precio.toFixed(2)}</span>
            </p>
          </div>
        </div>

        <div className="mt-3 border-t border-gray-50 pt-2 flex justify-between items-center text-xs">
          {esServicio ? (
            <span className="text-emerald-600 font-semibold">Servicio disponible</span>
          ) : (
            <>
              <span className="text-gray-400 font-semibold">Stock disponible:</span>
              <span className={`font-black font-mono ${defaultBodega.stock === 0 ? 'text-rose-500' : 'text-gray-800'}`}>
                {defaultBodega.stock === 0 ? '0 u (Agotado)' : `${defaultBodega.stock} u`}
              </span>
            </>
          )}
        </div>
      </div>

      {/* MODAL DE BODEGAS ALTERNATIVAS */}
      {mostrarModalBodegas && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={(e) => {
            e.stopPropagation();
            setMostrarModalBodegas(false);
          }}
        >
          <div 
            className="bg-white rounded-[2.5rem] p-8 max-w-md w-full text-center border border-gray-100 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Icon */}
            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner animate-bounce">
              ⚠️
            </div>
            
            <h3 className="text-xl font-black text-gray-900 leading-tight">Stock Agotado en Caja</h3>
            <p className="text-xs text-gray-500 font-semibold mt-2.5 leading-relaxed px-2">
              El artículo <strong className="text-emerald-600">"{item.nombre}"</strong> no dispone de stock en la Bodega Central. Selecciona un punto de distribución alternativo:
            </p>

            {/* Alternativas en tarjetas ricas */}
            <div className="flex flex-col gap-3 mt-6">
              {bodegasStock.filter(b => b.stock > 0).map((b, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    agregarConBodega(b.bodega, b.stock);
                    setMostrarModalBodegas(false);
                  }}
                  className="w-full text-left p-4 bg-gray-50 hover:bg-emerald-50/50 border border-gray-150 hover:border-emerald-500/80 rounded-2xl transition-all duration-200 cursor-pointer flex justify-between items-center group active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white group-hover:bg-emerald-100 rounded-xl flex items-center justify-center text-lg shadow-2xs transition-colors">
                      📦
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-800 group-hover:text-emerald-950 transition-colors">
                        {b.bodega}
                      </p>
                      <p className="text-[10px] text-gray-400 font-semibold">Despacho alternativo</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-black font-mono px-3 py-1 rounded-xl">
                      {b.stock} u
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setMostrarModalBodegas(false)}
              className="mt-6 w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 cursor-pointer"
            >
              Cancelar Selección
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default TarjetaProducto;

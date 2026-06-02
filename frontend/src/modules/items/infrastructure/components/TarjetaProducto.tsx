import { useCarrito } from "@/shared/context/ContextoCarrito";
import { calcularStockDisponible } from "../../application/inventarioItems";
import { Item, obtenerNombreCategoria } from "../../domain/Item";

function TarjetaProducto({ item }: { item: Item }) {
  const { agregarAlCarrito } = useCarrito();
  const stockDisponible = calcularStockDisponible(item);
  const esServicio = item.tipo_item === "Servicio";
  const estaDisponible = item.estado && (esServicio || (stockDisponible ?? 0) > 0);

  const itemParaCarrito = {
    id: item.id_item,
    id_item: item.id_item,
    nombre: item.nombre,
    precio: item.precio,
    stock: stockDisponible,
    categoria: obtenerNombreCategoria(item.id_categoria),
    tipo_item: item.tipo_item,
    imagen: item.imagen || "/assets/coca_cola_sin_azu_300ml.png",
  };

  return (
    <div
      onClick={() => estaDisponible && agregarAlCarrito(itemParaCarrito)}
      className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transition-all duration-200 flex flex-col text-left ${
        estaDisponible
          ? "cursor-pointer hover:shadow-md hover:scale-[1.01] active:scale-95"
          : "opacity-60 cursor-not-allowed"
      }`}
    >
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
        <h3 className="text-lg font-bold text-gray-900 mb-1">{item.nombre}</h3>
        <p className="font-bold text-emerald-600">
          <span>$</span>
          <span>{item.precio.toFixed(2)}</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {esServicio ? (
            <span className="font-semibold">Servicio disponible</span>
          ) : (
            <>
              <span>Stock: </span>
              <span className="font-semibold">{stockDisponible} unidades</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default TarjetaProducto;

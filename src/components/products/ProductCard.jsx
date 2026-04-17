import { useCart } from "../../context/CartContext";
function ProductCard({ data }) {
    const { addToCart } = useCart();
    return (<div onClick={() => addToCart(data)} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md hover:scale-[1.01] active:scale-95 transition-all duration-200 flex flex-col">
        <span className="bg-emerald-50 text-emerald-700 font-semibold text-[10px] px-2 py-0.5 rounded-full self-start mb-2">
          {data.categoria}
        </span>
        
        <img src={data.imagen} alt={data.nombre} className="w-full h-40 object-cover rounded-xl mb-4"/>
        
        {/*Div para detalles de producto*/}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{data.nombre}</h3>

          <p className="font-bold text-emerald-600">
            <span className="">$</span>
            <span>{data.precio.toFixed(2)}</span>
          </p>

          <p className="text-xs text-gray-500 mt-1">
            <span>Stock: </span>
            <span className="font-semibold">{data.stock} unidades</span>
          </p>
        </div>
      </div>);
}
export default ProductCard;

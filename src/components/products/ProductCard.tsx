import { Product } from "../../data/products.ts";

type Props = {
    data: Product;
};

function ProductCard({data}:Props){
    return(
      <div className="bg-white rounded-2xl">
        <span className="bg-emerald-50 text-emerald-700 font-semibold text-xs rounded-full">{data.categoria}</span>
        <img
          src={data.imagen} 
          alt={data.nombre} 
          className="w-full h-50 object-cover rounded-xl mb-4"/>
        
        {/*Div para detalles de producto*/}
        <div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">{data.nombre}</h3>

          <p className="font-bold ">
            <span className="">$</span>
            <span>{data.precio.toFixed(2)}</span>
          </p>

          <p>
            <span>Stock: </span>
            <span className="font-semibold">{data.stock} unidades</span>
          </p>
        </div>

      </div>  
    );
}

export default ProductCard;
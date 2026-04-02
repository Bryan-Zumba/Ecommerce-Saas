import { Product } from "../../data/products.ts";

type CartItemProps = {
  item: Product;
};

function CartItem({ item }: CartItemProps) {
  return (
    <div className=" flex items-center justify-between bg-white p-2 rounded-xl shadow">
      
      <img src={item.imagen} alt={item.nombre} className="w-16 h-16 object-cover rounded"/>
      
      <div className="flex-1 flex  flex-col text-center ">
        {/* Nombre */}
          <span className="font-medium">{item.nombre}</span>
          {/* Precio */}
          <p className="text-xs mt-3">Precio</p>
          <span className="font-semibold text-1xl ">
          ${(item.precio * item.cantidad).toFixed(2)}
            </span>
        
         <p className=" text-xs mt-2">Cantidad</p>
              {/* Controles */}
              <div className="flex  items-center justify-center">
              {/* Botones + - */}
                  <div className="flex items-center gap-4 rounded-full shadow-sm border border-gray-400 p-0.5 r ">
                    <button className=" bg-sky-100  w-7 h-7 rounded-full hover:bg-gray-300  ">
                    - </button>

                    <span className="font-semibold  ">{item.cantidad}</span>

                    <button className="bg-sky-100  w-7 h-7 rounded-full hover:bg-gray-300 ">
                      + </button>
                  </div>
              </div>
        </div>

      <div className="flex gap-1">

        <button className="w-6 h-6">
          <img src="/assets/ico-eliminar.png" alt="eliminar" />
        </button>
      </div>
    </div>
  );
}

export default CartItem;
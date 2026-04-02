import { Product } from "../../data/products.ts";

type Props = {
    data: Product;
};

function ProductCard({data}:Props){
    return(
      <div>
        <img src={data.imagen} alt="" />
        <h6>{data.categoria}</h6>
        <h3>{data.nombre}</h3>
      </div>  
    );
}

export default ProductCard;
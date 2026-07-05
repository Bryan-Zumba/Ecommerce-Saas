export interface InventarioInputDTO{
    id_item:number;
    id_bodega:number;
}

export interface InventarioUpdateDTO{
    stock_actual?:number;
    stock_disponible?:number;
    stock_reservado?:number;
}
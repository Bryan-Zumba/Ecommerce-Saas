import { Decimal } from "@prisma/client/runtime/library";

export interface DetalleCompraInputDTO {
    id_compra:number;
    id_bodega:number;
    id_item:number;
    cantidad:number;
    costo_unitario:Decimal;
}

export interface DetalleCompraCreateDTO {
    id_compra:number;
    id_bodega:number;
    id_item:number;
    cantidad:number;
    costo_unitario:Decimal;
    subtotal:Decimal;
}
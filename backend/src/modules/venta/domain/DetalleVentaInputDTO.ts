import { Decimal } from "@prisma/client/runtime/library";

export interface DetalleVentaInputDTO {
    id_venta?: number;
    id_item: number;
    id_bodega: number;
    cantidad: number;
    precio_unitario: number;
}

export interface DetalleVentaCreateDTO {
    id_venta: number;
    id_item: number;
    id_bodega: number;
    cantidad: number;
    precio_unitario: Decimal;
    subtotal: Decimal;
}

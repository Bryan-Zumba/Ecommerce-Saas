import { Decimal } from "@prisma/client/runtime/library";

export interface DetalleCompra {
    id_detalle_compra: number;
    id_compra: number;
    id_bodega: number;
    id_item: number;
    cantidad: number;
    costo_unitario: Decimal;
    subtotal: Decimal;
    item?: {
        nombre: string;
        imagen_url: string | null;
    };
}
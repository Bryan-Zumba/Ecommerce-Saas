import { Decimal } from "@prisma/client/runtime/library";

export interface DetalleVenta {
    id_detalle_venta: number;
    id_venta: number;
    id_item: number;
    id_bodega?: number | null;
    cantidad: number;
    precio_unitario: Decimal;
    subtotal: Decimal;
    item?: {
        nombre: string;
        imagen_url: string | null;
    };
}

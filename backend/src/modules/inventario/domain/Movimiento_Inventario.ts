import { Tipo_movimiento_inventario } from "@prisma/client";

export interface Movimiento_Inventario {
    id_movimiento_inventario: number;
    id_item: number;
    id_bodega: number;
    id_venta?: number | null;
    id_compra?: number | null;
    tipo_movimiento: Tipo_movimiento_inventario;
    cantidad: number;
    stock_anterior: number;
    stock_nuevo: number;
    fecha_movimiento: Date;
}
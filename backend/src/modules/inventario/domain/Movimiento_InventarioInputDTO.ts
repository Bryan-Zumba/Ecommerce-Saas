import { Tipo_movimiento_inventario } from "@prisma/client";

export interface Movimiento_InventarioInputDTO {
    id_item: number;
    id_bodega: number;
    id_venta?: number | null;
    id_compra?: number | null;
    tipo_movimiento: Tipo_movimiento_inventario;
    cantidad: number;
}
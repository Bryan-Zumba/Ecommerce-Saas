import { Tipo_Item } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface InventarioDetalleDTO {
    id_inventario: number;
    id_bodega:number

    stock_actual: number;
    stock_disponible: number;
    stock_reservado: number;

    item: {
        id_item: number;
        nombre: string;
        tipo_item: Tipo_Item;
        costo: Decimal;
        precio: Decimal;
        imagen_url: string | null;
        estado: boolean;

        categoria: {
            id_categoria: number;
            nombre: string;
            estado: boolean;
        };
    };
}
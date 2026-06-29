import { Decimal } from "@prisma/client/runtime/library";
import { Tipo_Item } from "@prisma/client";

export interface ItemUpdateDTO {
    id_categoria: number
    nombre: string;
    descripcion?: string | null;
    costo: Decimal;
    precio: Decimal;
    tipo_item: Tipo_Item;
    imagen_url?: string | null;
    estado: boolean;
}
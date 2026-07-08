import { Tipo_Item } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface CatalogoVentaRepositoryDTO {
    id_item: number;
    nombre: string;
    descripcion: string | null;
    costo: Decimal;
    precio: Decimal;
    tipo_item: Tipo_Item;
    imagen_url: string | null;
    estado: boolean;

    categoria: {
        id_categoria: number;
        nombre: string;
        estado: boolean;
    };

    inventarios: {
        id_inventario: number;
        stock_disponible: number;
    }[];
}

export interface CatalogoVentaItemDTO {
    id_item: number;
    nombre: string;
    descripcion: string | null;
    costo: number;
    precio: number;
    tipo_item: Tipo_Item;
    imagen_url: string | null;
    estado: boolean;
    categoria: {
        id_categoria: number;
        nombre: string;
        estado: boolean;
    };
}

export interface CatalogoVentaDTO {
    id_bodega: number;
    stock_disponible: number;
    item: CatalogoVentaItemDTO;
}

export enum Tipo_Item {
    Producto = 'Producto',
    Servicio = 'Servicio'
}

export interface Item {
    id_item: number;
    id_empresa: number;
    id_categoria: number;
    nombre: string;
    descripcion: string | null;
    costo: number | string; // backend returns as string or number since Decimal
    precio: number | string; 
    tipo_item: Tipo_Item;
    imagen_url: string | null;
    imagen_public_id: string | null;
    estado: boolean;
}

export interface ItemInputDTO {
    id_categoria: number;
    nombre: string;
    descripcion?: string | null;
    costo: number;
    precio: number;
    tipo_item: Tipo_Item;
    file?: File | null; // Para enviar mediante FormData
}

export interface ItemUpdateDTO {
    id_categoria?: number;
    nombre?: string;
    descripcion?: string | null;
    costo?: number;
    precio?: number;
    tipo_item?: Tipo_Item;
    file?: File | null;
}

export interface ItemResponse {
    success: boolean;
    item: Item;
    message?: string;
}

export interface ItemsListResponse {
    success: boolean;
    items: Item[];
    message?: string;
}

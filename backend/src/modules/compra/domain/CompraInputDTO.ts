import { Decimal } from "@prisma/client/runtime/library";

export interface CompraInputDTO{
    id_proveedor: number,
    id_usuario: number,
    id_empresa: number,
    id_periodo_contable: number,
    codigo_factura: string,
    total: Decimal,
    observacion?: string | null,
    imagen_url: string,
    imagen_public_id: string
}

export interface CompraCreateDTO{
    id_proveedor: number,
    id_usuario: number,
    id_empresa: number,
    id_periodo_contable: number,
    codigo_factura: string,
    imagen_url: string,
    imagen_public_id: string,
    total: Decimal,
    observacion?: string | null,
}
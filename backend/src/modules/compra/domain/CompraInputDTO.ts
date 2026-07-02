import { Decimal } from "@prisma/client/runtime/library";

export interface CompraInputDTO{
    id_proveedor: number,
    id_usuario: number,
    id_empresa: number,
    id_periodo_contable: number,
    total: Decimal,
    observacion?: string | null
}
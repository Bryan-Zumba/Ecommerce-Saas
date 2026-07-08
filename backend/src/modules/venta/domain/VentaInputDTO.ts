import { Decimal } from "@prisma/client/runtime/library";
import { Estado_venta } from "@prisma/client";
import { DetalleVentaInputDTO } from "./DetalleVentaInputDTO";

export interface VentaCreateDTO {
    id_turno_caja: number;
    id_cliente: number;
    id_usuario: number;
    id_empresa: number;
    id_periodo_contable: number;
    total: Decimal;
    observacion?: string | null;
    estado_venta: Estado_venta;
}

export interface SolicitudVentaDTO {
    id_cliente: number;
    id_usuario: number;
    id_empresa: number;
    observacion?: string | null;
    detalles: DetalleVentaInputDTO[];
}

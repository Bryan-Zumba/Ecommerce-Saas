import { Decimal } from "@prisma/client/runtime/library";
import { Estado_venta } from "@prisma/client";

export interface Venta {
    id_venta: number;
    id_turno_caja: number;
    id_cliente: number;
    id_usuario: number;
    id_empresa: number;
    id_periodo_contable: number;
    total: Decimal;
    observacion?: string | null;
    fecha: Date;
    estado_venta: Estado_venta;
    cliente?: {
        id_cliente: number;
        cedula: string;
        nombres: string;
        apellidos: string;
    };
}

import { Tipo_Movimiento_caja } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface Movimiento_cajaInputDTO{
    id_turno_caja:number;
    id_venta:number | null;
    id_compra:number | null;
    id_empresa:number;
    tipo_movimiento:Tipo_Movimiento_caja;
    monto:Decimal;
    referencia:string;
}
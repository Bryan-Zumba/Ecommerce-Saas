import { Estado_compra } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface Compra{
    id_compra:number;
    id_proveedor:number;
    id_usuario:number;
    id_empresa:number;
    id_periodo_contable:number;
    total:Decimal;
    fecha_compra:Date;
    observacion?:string|null;
    estado_compra: Estado_compra;
}
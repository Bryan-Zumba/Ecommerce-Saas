import { DBClient } from "../../../core/database/DBClient";
import { Movimiento_Caja } from "./Movimiento_caja";
import { Movimiento_cajaInputDTO } from "./Movimiento_cajaInputDTO";

export interface IRepositoryMovimiento_caja{
    crearMovimiento_caja(movimiento_caja: Movimiento_cajaInputDTO, client?: DBClient): Promise<Movimiento_Caja>;
    obtenerMovimientos_cajaPorEmpresa(id_empresa:number, client?: DBClient): Promise<Movimiento_Caja[]>;
    //obtenerMovimientos_cajaPorTurno(id_turno_caja:number, client?: DBClient): Promise<Movimiento_Caja[]>;
    obtenerMovimientos_cajaPorVenta(id_venta:number, client?: DBClient): Promise<Movimiento_Caja[]>;
    obtenerMovimientos_cajaPorCompra(id_compra:number, client?: DBClient): Promise<Movimiento_Caja[]>;
    obtenerMovimientos_cajaPorId(id_movimiento_caja:number, client?: DBClient): Promise<Movimiento_Caja | null>;
}
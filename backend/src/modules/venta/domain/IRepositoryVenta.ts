import { DBClient } from "../../../core/database/DBClient";
import { Venta } from "./Venta";
import { VentaCreateDTO } from "./VentaInputDTO";
import { CatalogoVentaDTO, CatalogoVentaRepositoryDTO } from "./CatalogoVentaDTO";
import { Estado_venta } from "@prisma/client";

export interface IRepositoryVenta {
    crearVenta(venta: VentaCreateDTO, client?: DBClient): Promise<Venta>;
    obtenerVentaPorId(id_venta: number, client?: DBClient): Promise<Venta | null>;
    obtenerVentasPorEmpresa(id_empresa: number, client?: DBClient): Promise<Venta[]>;
    actualizarEstadoVenta(id_venta: number, estado_venta: Estado_venta, client?: DBClient): Promise<Venta>;
    obtenerCatalogoVenta(id_empresa: number, id_bodega: number, client?: DBClient): Promise<CatalogoVentaRepositoryDTO[]>;
}
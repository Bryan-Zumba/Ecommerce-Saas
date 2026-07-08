import { DBClient } from "../../../core/database/DBClient";
import { DetalleVenta } from "./DetalleVenta";
import { DetalleVentaCreateDTO } from "./DetalleVentaInputDTO";

export interface IRepositoryDetalleVenta {
    crearDetalleVenta(detalle: DetalleVentaCreateDTO, client?: DBClient): Promise<DetalleVenta>;
    obtenerDetalleVentaPorIdVenta(id_venta: number, client?: DBClient): Promise<DetalleVenta[]>;
}

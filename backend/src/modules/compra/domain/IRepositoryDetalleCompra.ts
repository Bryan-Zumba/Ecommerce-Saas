import { DBClient } from "../../../core/database/DBClient";
import { DetalleCompraCreateDTO } from "./DetalleCompraInputDTO";
import { DetalleCompra } from "./DetalleCompra";

export interface IRepositoryDetalleCompra {
    crearDetalleCompra(detalleCompra: DetalleCompraCreateDTO, client?: DBClient): Promise<DetalleCompra>;
}
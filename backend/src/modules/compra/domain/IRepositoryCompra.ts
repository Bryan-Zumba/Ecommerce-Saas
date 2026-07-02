import { CompraInputDTO } from "./CompraInputDTO";
import { DBClient } from "../../../core/database/DBClient";
import { Compra } from "./Compra";

export interface IRepositoryCompra {
    crearSolicitudCompra(compra: CompraInputDTO, client?: DBClient): Promise<Compra>;
}
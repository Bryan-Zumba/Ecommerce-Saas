import { CompraInputDTO } from "./CompraInputDTO";
import { DBClient } from "../../../core/database/DBClient";
import { Compra } from "./Compra";
import { SolicitudCompraDTO } from "./SolicitudCompraDTO";

export interface IRepositoryCompra {
    crearCompra(compra: CompraInputDTO, client?: DBClient): Promise<Compra>;
}
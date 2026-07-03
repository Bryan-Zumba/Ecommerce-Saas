import { CompraCreateDTO } from "./CompraInputDTO";
import { DBClient } from "../../../core/database/DBClient";
import { Compra } from "./Compra";

export interface IRepositoryCompra {
    crearCompra(compra: CompraCreateDTO, client?: DBClient): Promise<Compra>;
}
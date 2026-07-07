import { CompraCreateDTO } from "./CompraInputDTO";
import { DBClient } from "../../../core/database/DBClient";
import { Compra } from "./Compra";

export interface IRepositoryCompra {
    crearCompra(compra: CompraCreateDTO, client?: DBClient) : Promise<Compra>;
    obtenerCompraPorId(id_compra: number, client?: DBClient) : Promise<Compra | null>;
    obtenerComprasPorEmpresa(id_empresa: number, client?: DBClient) : Promise<Compra[]>;
}
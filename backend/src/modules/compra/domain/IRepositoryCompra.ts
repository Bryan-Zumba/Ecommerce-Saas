import { CompraCreateDTO } from "./CompraInputDTO";
import { DBClient } from "../../../core/database/DBClient";
import { Compra } from "./Compra";
import { Estado_compra } from "@prisma/client";

export interface IRepositoryCompra {
    crearCompra(compra: CompraCreateDTO, client?: DBClient) : Promise<Compra>;
    obtenerCompraPorId(id_compra: number, client?: DBClient) : Promise<Compra | null>;
    obtenerComprasPorEmpresa(id_empresa: number, client?: DBClient) : Promise<Compra[]>;
    actualizarEstadoCompra(id_compra: number, estado_compra: Estado_compra, client?: DBClient) : Promise<Compra>;
}
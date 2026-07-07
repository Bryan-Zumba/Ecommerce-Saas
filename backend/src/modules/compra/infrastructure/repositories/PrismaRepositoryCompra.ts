import { DBClient } from "../../../../core/database/DBClient";
import { CompraCreateDTO } from "../../domain/CompraInputDTO";
import { IRepositoryCompra } from "../../domain/IRepositoryCompra";
import { prisma } from "../../../../core/database/prisma";
import { Compra } from "../../domain/Compra";

export class PrismaRepositoryCompra implements IRepositoryCompra {
    async crearCompra(compra: CompraCreateDTO, client: DBClient = prisma): Promise<Compra> {
        const data = await client.compra.create({
            data: compra
        })
        return data;
    }

    async obtenerCompraPorId(id_compra: number, client: DBClient = prisma): Promise<Compra | null> {
        const data = await client.compra.findUnique({
            where: {
                id_compra: id_compra
            }
        })
        return data;
    }

    async obtenerComprasPorEmpresa(id_empresa: number, client: DBClient = prisma): Promise<Compra[]> {
        const data = await client.compra.findMany({
            where: {
                id_empresa: id_empresa
            }
        })
        return data;
    }
}
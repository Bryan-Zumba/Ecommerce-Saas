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
        console.log(data)
        return data;
    }
}
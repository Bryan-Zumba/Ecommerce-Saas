import { DBClient } from "../../../../core/database/DBClient";
import { IRepositoryBodega } from "../../domain/IRepositoryBodega";
import { prisma } from "../../../../core/database/prisma";
import { BodegaInputDTO } from "../../domain/BodegaInputDTO";

export class PrismaRepositoryBodega implements IRepositoryBodega{
    async crearBodega(bodega: BodegaInputDTO, client: DBClient = prisma) {
        const data= await client.bodega.create({
            data: bodega
        })
        return data;
    }
}
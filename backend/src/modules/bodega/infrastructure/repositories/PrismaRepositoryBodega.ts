import { DBClient } from "@/core/database/DBClient";
import { IRepositoryBodega } from "../../domain/IRepositoryBodega";
import { prisma } from "../../../../core/database/prisma";

export class PrismaRepositoryBodega implements IRepositoryBodega{
    async crearBodega(bodega: any, client: DBClient = prisma) {
        const data= await client.bodega.create({
            data: bodega
        })
        return data;
    }
}
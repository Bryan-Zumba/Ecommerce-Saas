import { DBClient } from "../../../../core/database/DBClient";
import { Inventario } from "../../domain/Inventario";
import { IRepositoryInventario } from "../../domain/IRepositoryInventario";
import { prisma } from "../../../../core/database/prisma";

export class PrismaRepositoryInventario implements IRepositoryInventario{
    async obtenerInventarioBodega(id_bodega:number, client: DBClient = prisma): Promise<Inventario[]> {
        const data= await client.inventario.findMany({
            where: {
                id_bodega: id_bodega
            },
            include:{
                item:{
                    include:{
                        categoria:true
                    }
                }
            }
        })
        return data;
    }
}
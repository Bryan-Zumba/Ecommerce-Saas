import { DBClient } from "../../../../core/database/DBClient";
import { IRepositoryBodega } from "../../domain/IRepositoryBodega";
import { prisma } from "../../../../core/database/prisma";
import { BodegaInputDTO } from "../../domain/BodegaInputDTO";
import { Bodega } from "../../domain/Bodega";
import { BodegaUpdateDTO } from "../../domain/BodegaUpdateDTO";

export class PrismaRepositoryBodega implements IRepositoryBodega{
    async crearBodega(bodega: BodegaInputDTO, client: DBClient = prisma) {
        const data= await client.bodega.create({
            data: bodega
        })
        return data;
    }

    async obtenerBodegaEmpresa(id_empresa: number, client: DBClient = prisma) {
        const data= await client.bodega.findUnique({
            where: {
                id_empresa: id_empresa
            }
        })
        return data;
    }

    async obtenerBodegaId(id_bodega: number, client: DBClient = prisma): Promise<Bodega | null> {
        const data= await client.bodega.findUnique({
            where: {
                id_bodega: id_bodega
            }
        })
        return data;
    }

    async obtenerBodegaNombre(nombre:string, id_empresa:number, client: DBClient = prisma): Promise<Bodega | null>{
        const data= await client.bodega.findUnique({
            where: {
                nombre: nombre,
                id_empresa: id_empresa
            }
        })
        return data;
    }

    async actualizarInformacionBodega(id_bodega: number, bodega: BodegaUpdateDTO, client: DBClient = prisma): Promise<Bodega>{
        const data= await client.bodega.update({
            where: {
                id_bodega: id_bodega
            },
            data: bodega
        })
        return data;
    }
}
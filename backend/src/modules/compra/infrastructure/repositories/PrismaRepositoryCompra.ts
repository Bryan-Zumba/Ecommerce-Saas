import { DBClient } from "../../../../core/database/DBClient";
import { CompraCreateDTO } from "../../domain/CompraInputDTO";
import { IRepositoryCompra } from "../../domain/IRepositoryCompra";
import { prisma } from "../../../../core/database/prisma";
import { Compra } from "../../domain/Compra";
import { Estado_compra } from "@prisma/client";

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
            },
            include: {
                proveedor: {
                    select: {
                        id_proveedor: true,
                        nombre: true
                    }
                }
            }
        })
        return data;
    }

    async obtenerComprasPorEmpresa(id_empresa: number, client: DBClient = prisma): Promise<Compra[]> {
        const data = await client.compra.findMany({
            where: {
                id_empresa: id_empresa
            },
            include: {
                proveedor: {
                    select: {
                        id_proveedor: true,
                        nombre: true
                    }
                }
            }
        })
        return data;
    }

    async actualizarEstadoCompra(id_compra: number, estado_compra: Estado_compra, client: DBClient = prisma): Promise<Compra> {
        const data = await client.compra.update({
            where: {
                id_compra: id_compra
            },
            data: {
                estado_compra: estado_compra
            }
        })
        return data;
    }
}
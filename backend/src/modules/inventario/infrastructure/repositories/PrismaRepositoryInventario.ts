import { DBClient } from "../../../../core/database/DBClient";
import { IRepositoryInventario } from "../../domain/IRepositoryInventario";
import { prisma } from "../../../../core/database/prisma";
import { InventarioDetalleDTO } from "../../domain/InventarioDetalleDTO";
import { InventarioInputDTO, InventarioUpdateDTO } from "../../domain/InventarioInputDTO";
import { Inventario } from "@prisma/client";

export class PrismaRepositoryInventario implements IRepositoryInventario {
    async obtenerInventarioBodega(id_bodega: number, client: DBClient = prisma): Promise<InventarioDetalleDTO[]> {
        const data = await client.inventario.findMany({
            where: {
                id_bodega: id_bodega
            },
            select: {
                id_inventario: true,
                id_bodega:true,
                stock_actual: true,
                stock_disponible: true,
                stock_reservado: true,

                item: {
                    select: {
                        id_item: true,
                        nombre: true,
                        tipo_item: true,
                        costo: true,
                        precio: true,
                        imagen_url: true,
                        estado: true,

                        categoria: {
                            select: {
                                id_categoria: true,
                                nombre: true,
                                estado: true
                            }
                        }
                    }
                }
            }
        })
        return data;
    }

    async obtenerInventarioItem(id_item: number, id_bodega: number, client: DBClient = prisma): Promise<InventarioDetalleDTO|null> {
        const data = await client.inventario.findUnique({
            where: {
                id_item_id_bodega: { id_item, id_bodega }
            },
            select: {
                id_inventario: true,
                id_bodega:true,
                stock_actual: true,
                stock_disponible: true,
                stock_reservado: true,

                item: {
                    select: {
                        id_item: true,
                        nombre: true,
                        tipo_item: true,
                        costo: true,
                        precio: true,
                        imagen_url: true,
                        estado: true,

                        categoria: {
                            select: {
                                id_categoria: true,
                                nombre: true,
                                estado: true
                            }
                        }
                    }
                }
            }
        })
        return data;
    }

    async obtenerInventarioId(id_inventario:number,client:DBClient=prisma):Promise<Inventario | null>{
        const data = await client.inventario.findUnique({
            where:{
                id_inventario:id_inventario
            },
            include:{
                bodega:true
            }
        })
        return data;
    }

    async crearInventario(inventario: InventarioInputDTO, client: DBClient = prisma): Promise<Inventario> {
        const data = await client.inventario.create({
            data: inventario
        })
        return data;
    }

    async actualizarInventario(id_inventario: number, inventario: InventarioUpdateDTO, client: DBClient = prisma): Promise<Inventario> {
        const data = await client.inventario.update({
            where: {
                id_inventario: id_inventario
            },
            data: inventario
        })
        return data;
    }
}
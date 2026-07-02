import { DBClient } from "../../../../core/database/DBClient";
import { IRepositoryInventario } from "../../domain/IRepositoryInventario";
import { prisma } from "../../../../core/database/prisma";
import { InventarioDetalleDTO } from "../../domain/InventarioDetalleDTO";

export class PrismaRepositoryInventario implements IRepositoryInventario {
    async obtenerInventarioBodega(id_bodega: number, client: DBClient = prisma): Promise<InventarioDetalleDTO[]> {
        const data = await client.inventario.findMany({
            where: {
                id_bodega: id_bodega
            },
            select: {
                id_inventario: true,
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
}
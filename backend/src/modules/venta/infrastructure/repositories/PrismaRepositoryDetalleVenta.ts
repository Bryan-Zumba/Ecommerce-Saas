import { DBClient } from "../../../../core/database/DBClient";
import { prisma } from "../../../../core/database/prisma";
import { IRepositoryDetalleVenta } from "../../domain/IRepositoryDetalleVenta";
import { DetalleVenta } from "../../domain/DetalleVenta";
import { DetalleVentaCreateDTO } from "../../domain/DetalleVentaInputDTO";

export class PrismaRepositoryDetalleVenta implements IRepositoryDetalleVenta {
    async crearDetalleVenta(detalle: DetalleVentaCreateDTO, client: DBClient = prisma): Promise<DetalleVenta> {
        const data = await client.detalle_Venta.create({
            data: detalle
        });
        return data;
    }

    async obtenerDetalleVentaPorIdVenta(id_venta: number, client: DBClient = prisma): Promise<DetalleVenta[]> {
        const data = await client.detalle_Venta.findMany({
            where: {
                id_venta: id_venta
            },
            include: {
                item: {
                    select: {
                        nombre: true,
                        imagen_url: true
                    }
                }
            }
        });
        return data;
    }
}

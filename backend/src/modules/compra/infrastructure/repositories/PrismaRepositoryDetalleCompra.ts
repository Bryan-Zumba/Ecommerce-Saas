import { DBClient } from "../../../../core/database/DBClient";
import { DetalleCompraCreateDTO } from "../../domain/DetalleCompraInputDTO";
import { DetalleCompra } from "../../domain/DetalleCompra";
import { IRepositoryDetalleCompra } from "../../domain/IRepositoryDetalleCompra";
import { prisma } from "../../../../core/database/prisma";

export class PrismaRepositoryDetalleCompra implements IRepositoryDetalleCompra {
    async crearDetalleCompra(detalleCompra: DetalleCompraCreateDTO, client: DBClient = prisma): Promise<DetalleCompra> {
        const data = await client.detalle_Compra.create({
            data: detalleCompra
        })
        return data;
    }
}
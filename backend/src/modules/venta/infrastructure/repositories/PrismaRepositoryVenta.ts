import { DBClient } from "../../../../core/database/DBClient";
import { prisma } from "../../../../core/database/prisma";
import { IRepositoryVenta } from "../../domain/IRepositoryVenta";
import { Venta } from "../../domain/Venta";
import { VentaCreateDTO } from "../../domain/VentaInputDTO";
import { Estado_venta } from "@prisma/client";

export class PrismaRepositoryVenta implements IRepositoryVenta {
    async crearVenta(venta: VentaCreateDTO, client: DBClient = prisma): Promise<Venta> {
        const data = await client.venta.create({
            data: venta
        });
        return data;
    }

    async obtenerVentaPorId(id_venta: number, client: DBClient = prisma): Promise<Venta | null> {
        const data = await client.venta.findUnique({
            where: {
                id_venta: id_venta
            },
            include: {
                cliente: {
                    select: {
                        id_cliente: true,
                        cedula: true,
                        nombres: true,
                        apellidos: true
                    }
                }
            }
        });
        return data;
    }

    async obtenerVentasPorEmpresa(id_empresa: number, client: DBClient = prisma): Promise<Venta[]> {
        const data = await client.venta.findMany({
            where: {
                id_empresa: id_empresa
            },
            include: {
                cliente: {
                    select: {
                        id_cliente: true,
                        cedula: true,
                        nombres: true,
                        apellidos: true
                    }
                }
            },
            orderBy: {
                fecha: 'desc'
            }
        });
        return data;
    }

    async actualizarEstadoVenta(id_venta: number, estado_venta: Estado_venta, client: DBClient = prisma): Promise<Venta> {
        const data = await client.venta.update({
            where: {
                id_venta: id_venta
            },
            data: {
                estado_venta: estado_venta
            }
        });
        return data;
    }
}

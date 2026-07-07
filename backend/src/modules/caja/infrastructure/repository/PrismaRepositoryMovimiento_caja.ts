import { DBClient } from "../../../../core/database/DBClient";
import { Movimiento_Caja } from "../../domain/Movimiento_caja";
import { Movimiento_cajaInputDTO } from "../../domain/Movimiento_cajaInputDTO";
import { IRepositoryMovimiento_caja } from "../../domain/IRepositoryMovimiento_caja";
import { prisma } from "../../../../core/database/prisma";

export class PrismaRepositoryMovimiento_caja implements IRepositoryMovimiento_caja{
    async crearMovimiento_caja(movimiento_caja: Movimiento_cajaInputDTO, client: DBClient= prisma): Promise<Movimiento_Caja> {
        const data = await client.movimiento_caja.create({
            data: movimiento_caja
        });
        return data;
    }

    async obtenerMovimientos_cajaPorEmpresa(id_empresa: number, client: DBClient= prisma): Promise<Movimiento_Caja[]> {
        const data = await client.movimiento_caja.findMany({
            where: {
                id_empresa: id_empresa
            },
            include:{
                venta:{
                    select:{
                        id_venta:true,
                        total:true,
                        fecha:true,
                    }
                },
                compra:{
                    select:{
                        id_compra:true,
                        total:true,
                        fecha_compra:true,
                        proveedor:{
                            select:{
                                id_proveedor:true,
                                nombre:true
                            }
                        }
                    }
                },
                empresa:{
                    select:{
                        id_empresa:true,
                        nombre:true
                    }
                },
                turno_caja:{
                    include:{
                        usuario:{
                            select:{
                                nombres:true,
                                apellidos:true,
                                email:true
                            }
                        },
                        caja:{
                            select:{
                                nombre:true,
                                descripcion:true
                            }
                        },
                        periodo_contable:{
                            select:{
                                fecha_fin:true,
                                fecha_inicio:true,
                                
                            }
                        }
                    }
                }
            }
        });
        return data;
    }

    async obtenerMovimientos_cajaPorVenta(id_venta: number, client: DBClient= prisma): Promise<Movimiento_Caja[]> {
        const data = await client.movimiento_caja.findMany({
            where: {
                id_venta: id_venta
            }
        });
        return data;
    }

    async obtenerMovimientos_cajaPorCompra(id_compra: number, client: DBClient= prisma): Promise<Movimiento_Caja[]> {
        const data = await client.movimiento_caja.findMany({
            where: {
                id_compra: id_compra
            }
        });
        return data;
    }

    async obtenerMovimientos_cajaPorId(id_movimiento_caja: number, client: DBClient= prisma): Promise<Movimiento_Caja | null> {
        const data = await client.movimiento_caja.findUnique({
            where: {
                id_movimiento_caja: id_movimiento_caja
            }
        });
        return data;
    }
}
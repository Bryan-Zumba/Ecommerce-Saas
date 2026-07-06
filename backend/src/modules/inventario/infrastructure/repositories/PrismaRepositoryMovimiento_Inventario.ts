import { Movimiento_Inventario } from "../../domain/Movimiento_Inventario";
import { Movimiento_InventarioInputDTO } from "../../domain/Movimiento_InventarioInputDTO";
import { IRepositoryMovimiento_Inventario } from "../../domain/IRepositoryMovimiento_Inventario";
import { DBClient } from "../../../../core/database/DBClient";
import { prisma } from "../../../../core/database/prisma";

export class PrismaRepositoryMovimiento_Inventario implements IRepositoryMovimiento_Inventario {
    async crearMovimientoInventario(movimiento: Movimiento_InventarioInputDTO, client: DBClient = prisma): Promise<Movimiento_Inventario> {
        const movimientoInventario = await client.movimiento_Inventario.create({
            data: movimiento
        });
        return movimientoInventario;
    }

    async obtenerMovimientosInventarioPorBodega(id_bodega: number, client: DBClient = prisma): Promise<Movimiento_Inventario[]> {
        const movimientosInventario = await client.movimiento_Inventario.findMany({
            where: {
                id_bodega: id_bodega
            },
            include: {
                item: true,
                bodega: true
            },
            orderBy: {
                fecha_movimiento: 'desc'
            }
        });
        return movimientosInventario;
    }

    async obtenerMovimientoInventarioPorId(id_movimiento_inventario: number, client: DBClient = prisma): Promise<Movimiento_Inventario | null> {
        const movimientoInventario = await client.movimiento_Inventario.findUnique({
            where: {
                id_movimiento_inventario: id_movimiento_inventario
            },
            include: {
                item: true,
                bodega: true
            }
        });
        return movimientoInventario;
    }

    async obtenerMovimientosInventarioPorItem(id_item: number, client: DBClient = prisma): Promise<Movimiento_Inventario[]> {
        const movimientosInventario = await client.movimiento_Inventario.findMany({
            where: {
                id_item: id_item
            },
            include: {
                item: true,
                bodega: true
            },
            orderBy: {
                fecha_movimiento: 'desc'
            }
        });
        return movimientosInventario;
    }

    async obtenerMovimientosInventarioPorVenta(id_venta: number, client: DBClient = prisma): Promise<Movimiento_Inventario[]> {
        const movimientosInventario = await client.movimiento_Inventario.findMany({
            where: {
                id_venta: id_venta
            }
        });
        return movimientosInventario;
    }

    async obtenerMovimientosInventarioPorCompra(id_compra: number, client: DBClient = prisma): Promise<Movimiento_Inventario[]> {
        const movimientosInventario = await client.movimiento_Inventario.findMany({
            where: {
                id_compra: id_compra
            }
        });
        return movimientosInventario;
    }
}

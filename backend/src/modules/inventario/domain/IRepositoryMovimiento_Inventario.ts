import { Movimiento_InventarioInputDTO } from "./Movimiento_InventarioInputDTO";
import { Movimiento_Inventario } from "./Movimiento_Inventario";
import { DBClient } from "../../../core/database/DBClient";

export interface IRepositoryMovimiento_Inventario {
    crearMovimientoInventario(movimiento: Movimiento_InventarioInputDTO, client?: DBClient): Promise<Movimiento_Inventario>;
    obtenerMovimientosInventarioPorBodega(id_bodega: number, client?: DBClient): Promise<Movimiento_Inventario[]>;
    obtenerMovimientoInventarioPorId(id_movimiento_inventario: number, client?: DBClient): Promise<Movimiento_Inventario | null>;
    obtenerMovimientosInventarioPorItem(id_item: number, client?: DBClient): Promise<Movimiento_Inventario[]>;
    obtenerMovimientosInventarioPorVenta(id_venta: number, client?: DBClient): Promise<Movimiento_Inventario[]>;
    obtenerMovimientosInventarioPorCompra(id_compra: number, client?: DBClient): Promise<Movimiento_Inventario[]>;
}
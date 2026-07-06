import { Request, Response } from "express";
import { ServicesMovimiento_Inventario } from "../../application/ServicesMovimiento_Inventario";

export class ControllersMovimiento_Inventario{
    private service: ServicesMovimiento_Inventario

    constructor(service: ServicesMovimiento_Inventario){
        this.service = service;
    }

    obtenerMovimientoInventarioBodega=async (req: Request, res: Response) => {
        try {
            const id_empresa= Number(req.user?.id_empresa);
            const id_bodega = Number(req.params.id_bodega);
            const movimientosInventario = await this.service.obtenerMovimientosInventarioPorBodega(id_bodega,id_empresa);
            return res.status(200).json({ success: true, movimientosInventario });
        } catch (error:any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
   
    obtenerMovimientoInventarioId= async (req: Request, res: Response) => {
        try {
            const id_empresa= Number(req.user?.id_empresa);
            const id_movimiento_inventario = Number(req.params.id_movimiento_inventario);
            const movimientoInventario = await this.service.obtenerMovimientoInventarioPorId(id_movimiento_inventario,id_empresa);
            return res.status(200).json({ success: true, movimientoInventario });
        } catch (error:any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    obtenerMovimientoInventarioItem= async (req: Request, res: Response) => {
        try {
            const id_empresa= Number(req.user?.id_empresa);
            const id_item = Number(req.params.id_item);
            const movimientosInventario = await this.service.obtenerMovimientosInventarioPorItem(id_item,id_empresa);
            return res.status(200).json({ success: true, movimientosInventario });
        } catch (error:any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
    
}
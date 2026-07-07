import { ServicesMovimientoCaja } from "../../application/ServicesMovimientoCaja";
import { Request, Response } from "express";

export class ControllerMovimiento_caja{
    private service: ServicesMovimientoCaja;
    
    constructor(service: ServicesMovimientoCaja){
        this.service = service;
    }

    async obtenerMovimientos_cajaPorEmpresa(req: Request, res: Response){
        try{
            const id_empresa = Number(req.user?.id_empresa);
            const movimientos_caja = await this.service.obtenerMovimientos_cajaPorCompra(id_empresa);
            return res.status(200).json(movimientos_caja);
        }catch(error: any){
            return res.status(error.statusCode || 500).json({ message: error.message });
        }
    }

    async obtenerMovimiento_cajaPorId(req: Request, res: Response){
        try{
            const id_movimiento_caja = Number(req.params.id_movimiento_caja);
            const movimiento_caja = await this.service.obtenerMovimientos_cajaPorId(id_movimiento_caja);
            return res.status(200).json(movimiento_caja);
        }catch(error: any){
            return res.status(error.statusCode || 500).json({ message: error.message });
        }
    }
}
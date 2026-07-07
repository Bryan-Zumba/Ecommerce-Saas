import { ServicesDetalleCompra } from "../../application/ServicesDetalleCompra";
import { Request, Response } from "express";

export class ControllersDetalleCompra{
    private service: ServicesDetalleCompra;

    constructor(service: ServicesDetalleCompra){
        this.service = service;
    }

    obtenerDetalleCompraPorIdCompra = async(req: Request, res: Response): Promise<Response> => {
        try {
            const id_compra = Number(req.params.id_compra);
            const id_empresa = Number(req.user?.id_empresa);
            const detalleCompra = await this.service.obtenerDetalleCompraPorIdCompra(id_compra, id_empresa);
            return res.status(200).json({success:true,detalleCompra});
        } catch (error: any) {
            return res.status(error.statusCode || 500).json({success:false, message: error.message });
        }
    }
}
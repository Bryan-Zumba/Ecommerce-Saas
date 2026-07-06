import { ServicesCompra } from "../../application/ServicesCompra";
import { Request, Response } from "express";

export class ControllersCompra{
    private service: ServicesCompra;

    constructor(service: ServicesCompra){
        this.service = service;
    }

    crearSolicitudCompra = async(req: Request, res: Response): Promise<Response> => {
        try {
            const id_proveedor = Number(req.body.id_proveedor);
            const id_usuario = Number(req.user?.id_usuario);
            const id_empresa = Number(req.user?.id_empresa);
            const file = req.file;
            const {codigo_factura, observacion} = req.body;
            //console.log(req.body.detalles);
            const solitudCompra = await this.service.crearSolicitudCompra({
                id_proveedor,
                id_usuario,
                id_empresa,
                codigo_factura,
                observacion,
                file: file!,
                //detalles: []
                detalles: JSON.parse(req.body.detalles)
            })
            return res.status(201).json(solitudCompra);
        } catch (error: any) {
            return res.status(error.statusCode || 500).json({ message: error.message });
        }
    }
}
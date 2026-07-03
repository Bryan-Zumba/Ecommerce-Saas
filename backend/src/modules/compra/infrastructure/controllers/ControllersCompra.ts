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
            const id_periodo_contable = Number(req.body.id_periodo_contable);
            const {codigo_factura, total, observacion} = req.body;
            const compraCreada = await this.service.crearCompra({
                id_proveedor,
                id_usuario,
                id_empresa,
                id_periodo_contable,
                codigo_factura,
                total,
                observacion,
                file,
                imagen_url: "",
                imagen_public_id: ""
            });
            return res.status(201).json(compraCreada);
        } catch (error: any) {
            return res.status(error.statusCode || 500).json({ message: error.message });
        }
    }
}
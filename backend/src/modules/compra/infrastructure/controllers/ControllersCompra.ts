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
            return res.status(201).json({success:true,message:"Solicitud de compra creada exitosamente",solitudCompra});
        } catch (error: any) {
            return res.status(error.statusCode || 500).json({success:false,message: error.message });
        }
    }

    obtenerComprasEmpresa = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id_empresa = Number(req.user?.id_empresa);
            const compras = await this.service.obtenerCompraEmpresa(id_empresa);
            return res.status(200).json({success:true,message:"Compras obtenidas exitosamente",compras});
        } catch (error: any) {
            return res.status(error.statusCode || 500).json({success:false,message: error.message });
        }
    }

    aprobarCompra = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id_compra = Number(req.params.id_compra);
            const id_empresa = Number(req.user?.id_empresa);

            const compraAprobada = await this.service.aprobarCompra(id_compra, id_empresa);
            return res.status(200).json({ success: true, message: "Compra aprobada exitosamente", compra: compraAprobada });
        } catch (error: any) {
            return res.status(error.statusCode || 500).json({ success: false, message: error.message });
        }
    }

    rechazarCompra = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id_compra = Number(req.params.id_compra);
            const id_empresa = Number(req.user?.id_empresa);

            const compraRechazada = await this.service.rechazarCompra(id_compra, id_empresa);
            return res.status(200).json({ success: true, message: "Compra rechazada exitosamente", compra: compraRechazada });
        } catch (error: any) {
            return res.status(error.statusCode || 500).json({ success: false, message: error.message });
        }
    }
}
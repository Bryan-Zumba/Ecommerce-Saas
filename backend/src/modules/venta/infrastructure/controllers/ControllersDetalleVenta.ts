import { Request, Response } from "express";
import { ServicesDetalleVenta } from "../../application/ServicesDetalleVenta";

export class ControllersDetalleVenta {
    private service: ServicesDetalleVenta;

    constructor(service: ServicesDetalleVenta) {
        this.service = service;
    }

    obtenerDetalleVentaPorIdVenta = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id_venta = Number(req.params.id_venta);
            const id_empresa = Number(req.user?.id_empresa);

            const detalleVenta = await this.service.obtenerDetalleVentaPorIdVenta(id_venta, id_empresa);
            return res.status(200).json({ success: true, message: "Detalle de venta obtenido exitosamente", detalleVenta });
        } catch (error: any) {
            return res.status(error.statusCode || 500).json({ success: false, message: error.message });
        }
    }
}

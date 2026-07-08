import { Request, Response } from "express";
import { ServicesVenta } from "../../application/ServicesVenta";

export class ControllersVenta {
    private service: ServicesVenta;

    constructor(service: ServicesVenta) {
        this.service = service;
    }

    crearVenta = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id_usuario = Number(req.user?.id_usuario);
            const id_empresa = Number(req.user?.id_empresa);
            const id_cliente = Number(req.body.id_cliente);
            const {observacion, detalles } = req.body;

            const venta = await this.service.crearSolicitudVenta({
                id_cliente,
                id_usuario,
                id_empresa,
                observacion,
                detalles
            });

            return res.status(201).json({ success: true, message: "Venta registrada exitosamente", venta });
        } catch (error: any) {
            return res.status(error.statusCode || 500).json({ success: false, message: error.message });
        }
    }

    obtenerVentasEmpresa = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id_empresa = Number(req.user?.id_empresa);
            const ventas = await this.service.obtenerVentasEmpresa(id_empresa);
            return res.status(200).json({ success: true, message: "Ventas obtenidas exitosamente", ventas });
        } catch (error: any) {
            return res.status(error.statusCode || 500).json({ success: false, message: error.message });
        }
    }

    cancelarVenta = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id_venta = Number(req.params.id_venta);
            const id_empresa = Number(req.user?.id_empresa);

            const ventaCancelada = await this.service.cancelarVenta(id_venta, id_empresa);
            return res.status(200).json({ success: true, message: "Venta cancelada exitosamente", venta: ventaCancelada });
        } catch (error: any) {
            return res.status(error.statusCode || 500).json({ success: false, message: error.message });
        }
    }
}

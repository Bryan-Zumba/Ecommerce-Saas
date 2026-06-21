import { Request, Response } from "express";
import { ServicesAccessCode } from "../../application/services/ServicesAccessCode";

export class ControllerAccessCode {
    private service: ServicesAccessCode;

    constructor(service: ServicesAccessCode) {
        this.service = service;
    }

    validarCodigo = async (req: Request, res: Response) => {
        try {
            const { codigo } = req.body;
            const acceso = await this.service.buscarCodigo(codigo);
            return res.status(200).json({ success: true, message: "Acceso concedido", id_acceso_autorizado: acceso });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    incrementarIntentoAcceso = async (req: Request, res: Response) => {
        try {
            const { id_acceso_autorizado } = req.body;
            await this.service.incrementarIntentoAcceso(Number(id_acceso_autorizado));
            return res.status(200).json({ success: true, message: "Intento incrementado" });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    registrarUsoCodigo = async (req: Request, res: Response) => {
        try {
            const { id_acceso_autorizado, id_empresa } = req.body;
            await this.service.registrarUsoCodigo(Number(id_acceso_autorizado), Number(id_empresa));
            return res.status(200).json({ success: true, message: "Codigo usado" });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}
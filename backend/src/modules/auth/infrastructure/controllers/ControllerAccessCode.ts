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
}
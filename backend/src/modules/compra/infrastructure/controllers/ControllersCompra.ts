import { ServicesCompra } from "../../application/ServicesCompra";
import { Request, Response } from "express";
import { CompraInputDTO } from "../../domain/CompraInputDTO";

export class ControllersCompra{
    private service: ServicesCompra;

    constructor(service: ServicesCompra){
        this.service = service;
    }

    async crearSolicitudCompra(req: Request, res: Response): Promise<Response> {
        try {
            const compra = req.body as CompraInputDTO;
            const compraCreada = await this.service.crearSolicitudCompra(compra);
            return res.status(201).json(compraCreada);
        } catch (error: any) {
            return res.status(error.statusCode || 500).json({ message: error.message });
        }
    }
}
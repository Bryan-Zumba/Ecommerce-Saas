import { Request, Response } from "express";
import { ServicesBodega } from "../../application/ServicesBodega";

export class ControllersBodega {
    private service: ServicesBodega

    constructor(service: ServicesBodega) {
        this.service = service;
    }

    crearBodega = async (req: Request, res: Response) => {
        try {
            const id_empresa = Number(req.body.id_empresa);
            const { nombre, descripcion, ubicacion} = req.body
            const bodega = await this.service.crearBodega({
                id_empresa,
                nombre,
                descripcion,
                ubicacion
            });

            return res.status(200).json({ success: true, message: "Empresa creada exitosamente", bodega });
        } catch (error:any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}
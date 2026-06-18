import { ServicesEmpresa } from "../../application/ServicesEmpresa";
import { Request, Response } from "express";

export class ControllersEmpresa{
    private service : ServicesEmpresa;

    constructor(service: ServicesEmpresa){
        this.service = service;
    }

    crearEmpresa = async (req: Request, res: Response) => {
        try {
            const { nombre, descripcion, ruc, direccion, telefono, email, logo_url} = req.body;
            
            const empresa = await this.service.crearEmpresa({
                nombre,
                descripcion,
                ruc,
                direccion,
                telefono,
                email,
                logo_url,
            });
            
            return res.status(200).json({ success: true, message: "Empresa creada exitosamente", empresa });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    obtenerEmpresaPorId = async (req: Request, res: Response) => {
        try {
            const id_empresa = Number(req.params.id_empresa);
            const empresa = await this.service.obtenerEmpresaPorId(Number(id_empresa));
            return res.status(200).json({ success: true, message: "Empresa obtenida exitosamente", empresa });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}
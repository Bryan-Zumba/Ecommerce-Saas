import { ServicesRol } from "../../application/ServicesRol";
import { Request, Response } from "express";

export class ControllersRol{
    private service : ServicesRol;

    constructor(service: ServicesRol) {
        this.service = service;
    }

    obtenerRoles = async (req: Request, res: Response) => {
        try {
            const roles = await this.service.obtenerRoles();
            return res.status(200).json({ success: true, message: "Roles obtenidos exitosamente", roles });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    obtenerRolPorId = async (req: Request, res: Response) => {
        try {
            const id_rol = Number(req.params.id_rol);
            const rol = await this.service.obtenerRolPorId(id_rol);
            return res.status(200).json({ success: true, message: "Rol obtenido exitosamente", rol });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    obtenerRolPorNombre = async (req: Request, res: Response) => {
        try {
            const nombre = String(req.params.nombre);
            const rol = await this.service.obtenerRolPorNombre(nombre);
            return res.status(200).json({ success: true, message: "Rol obtenido exitosamente", rol });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}
    import { Request, Response } from "express";
    import { ServicesUsuarios } from "../../application/ServicesUsuarios";

    export class ControllersUsuario{
        private service: ServicesUsuarios;
        constructor(service: ServicesUsuarios) {
            this.service = service;
        }
        crearUsuario = async (req: Request, res: Response) => {
            try {
                const {id_empresa, id_rol} = req.body;
                const { nombre, apellido, telefono, email, password } = req.body;
                const usuario = await this.service.crearUsuario({
                        nombre,
                        apellido,
                        telefono,
                        email,
                        password,
                        id_empresa: Number(id_empresa),
                        id_rol: Number(id_rol)
                    });
                return res.status(200).json({ success: true, message: "Usuario creado exitosamente", usuario });
            } catch (error: any) {
                return res.status(400).json({ success: false, message: error.message });
            }
        }

    obtenerUsuarioEmail = async (req: Request, res: Response) => {
        try {
            const email = req.query.email as string;
            const usuario = await this.service.obtenerUsuarioEmail(email);
            return res.status(200).json({ success: true, message: "Usuario obtenido exitosamente", usuario });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    obtenerUsuarioId = async (req: Request, res: Response) => {
        try {
            const id_usuario = Number(req.params.id_usuario);
            const usuario = await this.service.obtenerUsuarioId(Number(id_usuario));
            return res.status(200).json({ success: true, message: "Usuario obtenido exitosamente", usuario });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}
import { Request, Response } from "express";
import { ServicesAuth } from "../../application/services/ServicesAuth";
import { ServicesUsuarios } from "../../../usuarios/application/ServicesUsuarios";

export class ControllersAuth {
    private service: ServicesAuth;
    private serviceUsuario: ServicesUsuarios;
    constructor(service: ServicesAuth, serviceUsuario: ServicesUsuarios){
        this.service = service;
        this.serviceUsuario = serviceUsuario;
    }

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const result = await this.service.login(email, password);
            return res.status(200).json({ success: true, message: "Login exitoso", data: result });
        } catch (error: any) {
            if(error.message==="Credenciales incorrectas"){
                return res.status(401).json({ success: false, message: error.message });
            }
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    me = async (req:any, res: Response) => {
        try {
            const user = req.user;
            const usuario = await this.serviceUsuario.obtenerUsuarioId(user.id_usuario);

            return res.status(200).json({ success: true, usuario });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}
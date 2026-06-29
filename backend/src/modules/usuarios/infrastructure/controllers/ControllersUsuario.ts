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
            const { nombres, apellidos, telefono, email, password } = req.body;
            const usuario = await this.service.crearUsuario({
                    nombres,
                    apellidos,
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

    actualizarInformacionUsuario = async (req: Request, res: Response) => {
        try {
            const {id_usuario} = req.params;
            const { nombres, apellidos, telefono, email } = req.body;
            const usuario = await this.service.actualizarInformacionUsuario(Number(id_usuario), {
                    nombres,
                    apellidos,
                    telefono,
                    email,
                });
            return res.status(200).json({ success: true, message: "Usuario actualizado exitosamente", usuario });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    actualizarRolUsuario = async (req: Request, res: Response) => {
        try {
            const {id_usuario} = req.params;
            const { id_rol } = req.body;
            await this.service.actualizarRolUsuario(Number(id_usuario), Number(id_rol));
            return res.status(200).json({ success: true, message: "Rol del usuario actualizado exitosamente" });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    desactivarUsuario = async (req: Request, res: Response) => {
        try {
            const {id_usuario} = req.params;
            await this.service.desactivarUsuario(Number(id_usuario));
            return res.status(200).json({ success: true, message: "Usuario desactivado exitosamente" });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    activarUsuario = async (req: Request, res: Response) => {
        try {
            const {id_usuario} = req.params;
            await this.service.activarUsuario(Number(id_usuario));
            return res.status(200).json({ success: true, message: "Usuario activado exitosamente" });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    obtenerUsuariosEmpresa = async (req: Request, res: Response) => {
        try {
            /*if (!req.user) {
                return res.status(401).json({ message: "No autenticado" });
            }
            const id_empresa = req.user.id_empresa;*/
            const id_empresa = Number(req.params.id_empresa);
            const usuarios = await this.service.obtenerUsuariosEmpresa(id_empresa);
            return res.status(200).json({ success: true, message: "Usuarios obtenidos exitosamente", usuarios });
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
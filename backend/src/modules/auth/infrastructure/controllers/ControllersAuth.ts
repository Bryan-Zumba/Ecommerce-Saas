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
            const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip;
            const user_agent = req.headers['user-agent'];

            const result = await this.service.login(email, password, ip, user_agent);
            
            res.cookie("access_token", result.accessToken, { 
                httpOnly: true, 
                secure: false, 
                sameSite: "lax",
                maxAge: 15 * 60 * 1000 // 15 minutes
            });
            res.cookie("refresh_token", result.refreshToken, { 
                httpOnly: true, 
                secure: false, 
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
            
            return res.status(200).json({ success: true, message: "Login exitoso", data: result });
        } catch (error: any) {
            if(error.message==="Credenciales incorrectas"){
                return res.status(401).json({ success: false, message: error.message });
            }
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    refreshToken = async (req: Request, res: Response) => {
        try {
            const refreshToken = req.cookies?.refresh_token || req.body?.refreshToken;
            const result = await this.service.refreshToken(refreshToken);
            
            res.cookie("access_token", result.accessToken, { 
                httpOnly: true, 
                secure: false, 
                sameSite: "lax",
                maxAge: 15 * 60 * 1000 // 15 minutes
            });
            
            return res.status(200).json({ success: true, message: "Refresh token exitoso", data: result });
            
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    logout = async (req:any, res: Response) => {
        try {
            const refreshToken = req.cookies?.refresh_token;

            if (refreshToken) {
                try {
                    await this.service.logout(refreshToken);
                } catch (error: any) {
                    const ignoredErrors = ["Sesion no encontrada", "Sesion inactiva"];
                    if (!ignoredErrors.includes(error.message)) {
                        throw error;
                    }
                }
            }

            res.clearCookie("access_token", { httpOnly: true, secure: false, sameSite: "lax" });
            res.clearCookie("refresh_token", { httpOnly: true, secure: false, sameSite: "lax" });
            return res.status(200).json({ success: true, message: "Logout exitoso" });
        } catch (error: any) {
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

    forgotPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const result = await this.service.forgotPassword(email);
            return res.status(200).json({ success: true, message: result.message });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    resetPassword = async (req: Request, res: Response) => {
        try {
            const { token, password } = req.body;
            await this.service.resetPassword(token, password);
            return res.status(200).json({ success: true, message: "Password reseteada exitosamente" });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}

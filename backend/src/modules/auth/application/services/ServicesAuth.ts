import { ServicesUsuarios } from "../../../usuarios/application/ServicesUsuarios";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto"
import { ServicesSesion } from "./ServicesSesion";
import { ServicesEmail } from "./ServicesEmail";

export class ServicesAuth{
    private serviceUsuario: ServicesUsuarios;
    private serviceSesion: ServicesSesion;
    private serviceEmail: ServicesEmail;
    
    constructor(serviceUsuario: ServicesUsuarios, serviceSesion: ServicesSesion, serviceEmail: ServicesEmail){
        this.serviceUsuario = serviceUsuario;
        this.serviceSesion = serviceSesion;
        this.serviceEmail = serviceEmail;
    }

    async login(email: string, password: string, ip?:string, user_agent?:string) {
        if(!email?.trim()){
            throw new Error("Email de usuario es requerido");
        }
        if(!password?.trim()){
            throw new Error("Password de usuario es requerido");
        }
        
        const usuario = await this.serviceUsuario.obtenerUsuarioEmailSec(email);
        if(!usuario){
            throw new Error("Credenciales incorrectas");
        }
        if(usuario.estado === false){
            throw new Error("Usuario inactivo");
        }
        const isMatch = await bcrypt.compare(password, usuario.password_hash);

        if(!isMatch){
            throw new Error("Credenciales incorrectas");
        }

        const accessToken = jwt.sign({ 
            id_usuario: usuario.id_usuario,
            id_empresa: usuario.id_empresa,
            id_rol: usuario.id_rol
        }, 
        process.env.JWT_SECRET!, { expiresIn: "15m" });

        const refreshToken = crypto.randomBytes(64).toString("hex");

        await this.serviceSesion.crearSesion({
            id_usuario: usuario.id_usuario,
            token: refreshToken,
            fecha_expiracion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            ip,
            user_agent
        });

        await this.serviceUsuario.actualizarUltimoAcceso(usuario.id_usuario);
        
        return { 
            accessToken,
            refreshToken,
            must_change_password: usuario.must_change_password,
            usuario:{
            id_usuario: usuario.id_usuario,
            id_empresa: usuario.id_empresa,
            id_rol: usuario.id_rol,
            nombres: usuario.nombres,
            apellidos: usuario.apellidos,
            email: usuario.email
        } };
    }

    async refreshToken(refreshToken: string){
        if(!refreshToken?.trim()){
            throw new Error("Refresh token es requerido");
        }

        const sesion = await this.serviceSesion.obtenerSesionToken(refreshToken);

        if(!sesion){
            throw new Error("Sesion no encontrada");
        }
        if(sesion.estado === false){
            throw new Error("Sesion inactiva");
        }
        if(sesion.revoked_at !== null){
            throw new Error("Sesion revocada");
        }
        if(sesion.fecha_expiracion < new Date()){
            await this.serviceSesion.desactivarSesion(sesion.id_sesion);
            throw new Error("Sesion expirada");
        }
        const usuario = await this.serviceUsuario.obtenerUsuarioId(sesion.id_usuario);
        if(!usuario){
            throw new Error("Usuario no encontrado");
        }
        if(usuario.estado === false){
            await this.serviceSesion.desactivarSesion(sesion.id_sesion);
            throw new Error("Usuario inactivo");
        }

        const newAccessToken = jwt.sign({ 
            id_usuario: usuario.id_usuario,
            id_empresa: usuario.id_empresa,
            id_rol: usuario.id_rol
        }, 
        process.env.JWT_SECRET!, { expiresIn: "15m" });

        return {
            accessToken: newAccessToken
        }
    }

    async logout(token: string){
        if(!token?.trim()){
            throw new Error("Token es requerido");
        }

        const sesion = await this.serviceSesion.obtenerSesionToken(token);
        if(!sesion){
            throw new Error("Sesion no encontrada");
        }
        if(sesion.estado === false){
            throw new Error("Sesion inactiva");
        }

        await this.serviceSesion.desactivarSesion(sesion.id_sesion);
    }

    async forgotPasswordSendEmail(email: string){
        if(!email?.trim()){
            throw new Error("Email de usuario es requerido");
        }
        const usuario = await this.serviceUsuario.obtenerUsuarioEmailSec(email);

        // seguridad: no revelar si existe o no
        if(!usuario){
            return { message: "Si el correo existe, se enviará un enlace" };
        }
        if(usuario.estado === false){
            throw new Error("Usuario inactivo");
        }

        const secret = process.env.JWT_SECRET + usuario.password_hash;

        const resetToken = jwt.sign(
            {
                id_usuario: usuario.id_usuario,
            },
            secret,
            { expiresIn: "15m" }
        );
        
        const link = `http://localhost:5173/reset-password?token=${resetToken}`;

        await this.serviceEmail.sendResetPasswordEmail(email, link);

        return {
            message: "Si el correo existe, se enviará un enlace"
        }
    }
    
    async resetPasswordOlvidada(token: string, password: string){
        if(!token?.trim()){
            throw new Error("Token es requerido");
        }

        const payload = jwt.decode(token) as{
            id_usuario: number
        };

        if(!payload?.id_usuario){
            throw new Error("Token invalido");
        }

        const usuario = await this.serviceUsuario.obtenerUsuarioId(payload.id_usuario);

        if(usuario?.estado === false){
            throw new Error("Usuario inactivo");
        }

        const secret = process.env.JWT_SECRET + usuario?.password_hash;
        
        try {
            jwt.verify(token,secret)
        } catch (error) {
            throw new Error("Token invalido o expirado");
        }

        await this.serviceUsuario.actualizarPassword(usuario.id_usuario, password);
    }
}
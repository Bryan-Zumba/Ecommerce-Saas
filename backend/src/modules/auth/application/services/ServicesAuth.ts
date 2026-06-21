import { ServicesUsuarios } from "../../../usuarios/application/ServicesUsuarios";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto"

export class ServicesAuth{
    private serviceUsuario: ServicesUsuarios;
    constructor(serviceUsuario: ServicesUsuarios){
        this.serviceUsuario = serviceUsuario;
    }

    async login(email: string, password: string) {
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

        const token = jwt.sign({ 
            id_usuario: usuario.id_usuario,
            id_empresa: usuario.id_empresa,
            id_rol: usuario.id_rol
        }, 
        process.env.JWT_SECRET!, { expiresIn: "1h" });

        //const refreshToken = crypto.randomBytes(64).toString("hex");

        return { token, usuario:{
            id_usuario: usuario.id_usuario,
            id_empresa: usuario.id_empresa,
            id_rol: usuario.id_rol,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email
        } };
    }
}
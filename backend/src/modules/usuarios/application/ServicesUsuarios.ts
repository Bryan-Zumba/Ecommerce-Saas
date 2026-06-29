import bcrypt from "bcrypt";
import { DBClient } from "@/core/database/DBClient";
import { IRepositoryUsuario } from "../domain/IRepositoryUsuario";
import { ServicesEmpresa } from "../../empresa/application/ServicesEmpresa";
import { ServicesRol } from "./ServicesRol";
import { UsuarioInputDTO } from "../domain/UsuarioInputDTO";
import { UsuarioCreateDTO } from "../domain/UsuarioCreateDB";
import { UsuarioUpdateDTO } from "../domain/UsuarioUpdateDTO";

export class ServicesUsuarios{
    private repository: IRepositoryUsuario;
    private serviceEmpresa: ServicesEmpresa;
    private serviceRol: ServicesRol;
    
    constructor(repository: IRepositoryUsuario, serviceEmpresa: ServicesEmpresa, serviceRol: ServicesRol){
        this.repository = repository;
        this.serviceEmpresa = serviceEmpresa;
        this.serviceRol = serviceRol;
    }

    async crearUsuario(usuario: UsuarioInputDTO, client?: DBClient, must_change_password: boolean = true) {
        
        if(!usuario.id_empresa){
            throw new Error("El usuario debe pertenecer a una empresa");
        }
        
        await this.serviceEmpresa.obtenerEmpresaPorId(usuario.id_empresa,client);

        if(!usuario.id_rol){
            throw new Error("El usuario debe tener un rol");
        }
        await this.serviceRol.obtenerRolPorId(usuario.id_rol,client);

        if(!usuario.nombres?.trim()){
            throw new Error("Nombre de usuario es requerido");
        }
        if(!usuario.apellidos?.trim()){
            throw new Error("Apellido de usuario es requerido");
        }
        if(!usuario.email?.trim()){
            throw new Error("Email de usuario es requerido");
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(usuario.email)){
            throw new Error("Correo electronico no valido");
        }

        const emailExist = await this.obtenerUsuarioEmailSec(usuario.email, client);
        if(emailExist){
            throw new Error("Correo electronico ya se encuentra registrado");
        }
        
        if(!usuario.password?.trim()){
            throw new Error("Password de usuario es requerido");
        }

        //Validaciones longitud variables
        if(usuario.password.length < 8){
            throw new Error("Password debe tener al menos 8 caracteres");
        }
        if(usuario.nombres.length>100){
            throw new Error("Nombre de usuario no puede exceder 100 caracteres");
        }
        if(usuario.apellidos.length>100){
            throw new Error("Apellido de usuario no puede exceder 100 caracteres");
        }
        if(usuario.telefono && usuario.telefono.length>20){
            throw new Error("Telefono de usuario no puede exceder 20 caracteres");
        }
        if(usuario.email.length>255){
            throw new Error("Correo electronico no puede exceder 255 caracteres");
        }
        const password_hash = await bcrypt.hash(usuario.password, 10);

        const entidadUsuario : UsuarioCreateDTO= {
            ...usuario,
            password_hash,
            must_change_password,
        }
        const data = await this.repository.crearUsuario(entidadUsuario, client);
        return data;
    }

    async actualizarInformacionUsuario(id_usuario: number, usuario: UsuarioUpdateDTO) {
        if(!id_usuario){
            throw new Error("ID de usuario es requerido");
        }
        await this.obtenerUsuarioId(id_usuario);
        
        if(usuario.nombres && usuario.nombres.length > 100){
            throw new Error("Nombre de usuario no puede exceder 100 caracteres");
        }
        if(usuario.apellidos && usuario.apellidos.length > 100){
            throw new Error("Apellido de usuario no puede exceder 100 caracteres");
        }
        if(usuario.telefono && usuario.telefono.length > 20){
            throw new Error("Telefono de usuario no puede exceder 20 caracteres");
        }
        if(usuario.email && usuario.email.length > 255){
            throw new Error("Correo electronico no puede exceder 255 caracteres");
        }
        
        if(usuario.email){
            const emailExist = await this.obtenerUsuarioEmailSec(usuario.email);
            if(emailExist && emailExist.id_usuario !== id_usuario){
                throw new Error("Correo electronico ya se encuentra registrado");
            }
        }

        const data = await this.repository.actualizarInformacionUsuario(id_usuario, usuario);
        return data;
    }

    async actualizarRolUsuario(id_usuario: number, id_rol: number){
        const usuarioEncontrado = await this.obtenerUsuarioId(id_usuario);
        if(usuarioEncontrado.id_rol === id_rol){
            throw new Error("El usuario ya tiene ese rol");
        }
        const nuevoRol = await this.serviceRol.obtenerRolPorId(id_rol);
        if(nuevoRol.nombre === "Administrador"){
            throw new Error("El rol de administrador no puede ser asignado a un usuario");
        }
        await this.repository.actualizarRolUsuario(id_usuario, id_rol);
    }

    async desactivarUsuario(id_usuario: number) {
        const usuarioEncontrado = await this.obtenerUsuarioId(id_usuario);
        const rol = await this.serviceRol.obtenerRolPorId(usuarioEncontrado.id_rol);
        if(rol.nombre === "Administrador"){
            throw new Error("El usuario administrador no puede ser desactivado");
        }
        if(usuarioEncontrado.estado === false){
            throw new Error("El usuario ya se encuentra desactivado");
        }
        await this.repository.desactivarUsuario(id_usuario);
    }

    async activarUsuario(id_usuario: number) {
        const usuarioEncontrado = await this.obtenerUsuarioId(id_usuario);
        if(usuarioEncontrado.estado === true){
            throw new Error("El usuario ya se encuentra activo");
        }
        await this.repository.activarUsuario(id_usuario);
    }

    async obtenerUsuariosEmpresa(id_empresa: number) {
        await this.serviceEmpresa.obtenerEmpresaPorId(id_empresa);

        const data = await this.repository.obtenerUsuariosEmpresa(id_empresa);
        return data;
    }

    async obtenerUsuarioEmail(email: string) {
        if(!email?.trim()){
            throw new Error("Email de usuario es requerido");
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            throw new Error("Correo electronico no valido");
        }
        const data = await this.repository.obtenerUsuarioEmail(email);
        if(!data){
            throw new Error("Usuario no encontrado");
        }
        return data;
    }

    async obtenerUsuarioId(id_usuario: number) {
        if(!id_usuario){
            throw new Error("ID de usuario es requerido");
        }
        const data = await this.repository.obtenerUsuarioId(id_usuario);
        if(!data){
            throw new Error("Usuario no encontrado");
        }
        return data;
    }

    async obtenerUsuarioEmailSec(email:string, client?: DBClient){
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            throw new Error("Correo electronico no valido");
        }
        const data = await this.repository.obtenerUsuarioEmail(email, client);
        return data;
    }

    async actualizarPassword(id_usuario: number, password: string){
        await this.obtenerUsuarioId(id_usuario);

        if(!password?.trim()){
            throw new Error("Password de usuario es requerido");
        }
        if(password.length < 8){
            throw new Error("Password debe tener al menos 8 caracteres");
        }
        const password_hash = await bcrypt.hash(password, 10);
        await this.repository.actualizarPassword(id_usuario, password_hash);
        await this.repository.actualizarMustChangePassword(id_usuario, false);
    }

    async cambiarPasswordUsuario(id_usuario: number, password_actual: string, password_nueva: string){
        const usuario= await this.obtenerUsuarioId(id_usuario);
        
        if(!password_actual?.trim()){
            throw new Error("La contraseña actual es requerida");
        }

        if(!password_nueva?.trim()){
            throw new Error("La contraseña nueva es requerida");
        }

        const coincidePassword = await bcrypt.compare(password_actual, usuario.password_hash);
        if(!coincidePassword){
            throw new Error("La contraseña actual es incorrecta");
        }

        const mismaPassword = await bcrypt.compare(password_nueva, usuario.password_hash);
        if(mismaPassword){
            throw new Error("La contraseña nueva debe ser diferente a la contraseña actual");
        }

        await this.actualizarPassword(id_usuario, password_nueva);
    }

    async actualizarUltimoAcceso(id_usuario: number) {
        await this.obtenerUsuarioId(id_usuario);
        
        await this.repository.actualizarUltimoAcceso(id_usuario);
    }
}
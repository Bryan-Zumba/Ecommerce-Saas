import { IRepositoryUsuario } from "../domain/IRepositoryUsuario";
import { ServicesEmpresa } from "../../empresa/application/ServicesEmpresa";
import { ServicesRol } from "../../rol/application/ServicesRol";

export class ServicesUsuarios{
    private repository: IRepositoryUsuario;
    private serviceEmpresa: ServicesEmpresa;
    private serviceRol: ServicesRol;
    constructor(repository: IRepositoryUsuario, serviceEmpresa: ServicesEmpresa, serviceRol: ServicesRol){
        this.repository = repository;
        this.serviceEmpresa = serviceEmpresa;
        this.serviceRol = serviceRol;
    }

    async crearUsuario(usuario: any) {
        
        if(!usuario.id_empresa){
            throw new Error("El usuario debe pertenecer a una empresa");
        }
        await this.serviceEmpresa.obtenerEmpresaPorId(usuario.id_empresa);

        if(!usuario.id_rol){
            throw new Error("El usuario debe tener un rol");
        }
        await this.serviceRol.obtenerRolPorId(usuario.id_rol);

        if(!usuario.nombre?.trim()){
            throw new Error("Nombre de usuario es requerido");
        }
        if(!usuario.apellido?.trim()){
            throw new Error("Apellido de usuario es requerido");
        }
        if(!usuario.telefono?.trim()){
            throw new Error("Telefono de usuario es requerido");
        }
        if(!usuario.email?.trim()){
            throw new Error("Email de usuario es requerido");
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(usuario.email)){
            throw new Error("Correo electronico no valido");
        }
        if(!usuario.password_hash?.trim()){
            throw new Error("Password de usuario es requerido");
        }
        //const hashPassword = await bcrypt.hash(usuario.password_hash, 10);

        const data = await this.repository.crearUsuario(usuario);
        return data;
    }
}
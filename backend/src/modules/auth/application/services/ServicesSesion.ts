import { SesionInputDTO } from "../../domain/entities/SesionInputDTO";
import { IRepositorySesion } from "../../domain/repositories/IRepositorySesion";

export class ServicesSesion {
    private repositorySesion: IRepositorySesion;

    constructor(repositorySesion: IRepositorySesion) {
        this.repositorySesion = repositorySesion;
    }

    async crearSesion(sesion: SesionInputDTO) {
        if(!sesion.id_usuario){
            throw new Error("El ID de usuario es requerido");
        }
        if(!sesion.token?.trim()){
            throw new Error("El token es requerido");
        }
        if(!sesion.fecha_expiracion){
            throw new Error("La fecha de expiracion es requerida");
        }
        if(sesion.ip && sesion.ip.length > 45){
            throw new Error("La IP es demasiado larga");
        }
        const result = await this.repositorySesion.crearSesion(sesion);
        
        return result;
    }

    async obtenerSesionToken(token: string) {
        if(!token?.trim()){
            throw new Error("El token es requerido");
        }
        const sesion = await this.repositorySesion.obtenerSesionToken(token);
        if(!sesion){
            throw new Error("Sesion no encontrada");
        }
        return sesion;
    }

    async desactivarSesion(id_sesion: number) {
        if(typeof id_sesion !== 'number' || isNaN(id_sesion)){
            throw new Error("El ID de sesion debe ser un numero");
        }
        if(id_sesion <= 0){
            throw new Error("El ID de sesion es invalido");
        }
        await this.repositorySesion.desactivarSesion(id_sesion);
    }
}
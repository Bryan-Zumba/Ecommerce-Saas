import { DBClient } from "../../../../core/database/DBClient";
import { Sesion } from "../entities/Sesion";
import { SesionInputDTO } from "../entities/SesionInputDTO";

export interface IRepositorySesion {
    crearSesion(sesion: SesionInputDTO, client?: DBClient): Promise<Sesion>;
    obtenerSesionToken(token: string, client?: DBClient): Promise<Sesion | null>;
    desactivarSesion(id_sesion: number, client?: DBClient): Promise<void>;
}
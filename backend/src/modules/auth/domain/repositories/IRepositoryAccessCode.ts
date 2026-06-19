import { DBClient } from "../../../../core/database/DBClient";
import { Acceso_Autorizado } from "../entities/AccesCode";

export interface IRepositoryAccessCode {
    findByCode(code: string, client?: DBClient): Promise<Acceso_Autorizado | null>;
    incrementarContador(id_acceso: number): Promise<{ count: number }>;
    registrarUsoCodigo(id_acceso: number,id_empresa: number, client?: DBClient): Promise<{ count: number }>;
}
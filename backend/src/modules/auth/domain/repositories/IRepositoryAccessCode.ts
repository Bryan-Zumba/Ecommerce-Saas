import { Acceso_Autorizado } from "../entities/AccesCode";

export interface IRepositoryAccessCode {
    findByCode(code: string): Promise<Acceso_Autorizado | null>;
}
import { DBClient } from "../../../core/database/DBClient";
import { Empresa } from "./Empresa";

export interface IRepositoryEmpresa {
    crearEmpresa(empresa: Empresa, client?: DBClient): Promise<Empresa>;
    obtenerEmpresaPorId(id_empresa: number, client?: DBClient): Promise<Empresa | null>;
}
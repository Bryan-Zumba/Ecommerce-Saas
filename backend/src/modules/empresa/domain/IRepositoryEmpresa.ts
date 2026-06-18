import { DBClient } from "../../../core/database/DBClient";
import { Empresa } from "./Empresa";
import { EmpresaInputDTO } from "./EmpresaInputDTO";

export interface IRepositoryEmpresa {
    crearEmpresa(empresa: EmpresaInputDTO, client?: DBClient): Promise<Empresa>;
    obtenerEmpresaPorId(id_empresa: number, client?: DBClient): Promise<Empresa | null>;
}
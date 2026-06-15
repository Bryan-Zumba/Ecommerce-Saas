import { Empresa } from "./Empresa";

export interface IRepositoryEmpresa{
    crearEmpresa(empresa: Empresa): Promise<Empresa>;
    obtenerEmpresaPorId(id_empresa: number): Promise<Empresa|null>;
}
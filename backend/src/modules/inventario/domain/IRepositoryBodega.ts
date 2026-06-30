import { DBClient } from "../../../core/database/DBClient";
import { Bodega } from "./Bodega";
import { BodegaInputDTO } from "./BodegaInputDTO";
import { BodegaUpdateDTO } from "./BodegaUpdateDTO";

export interface IRepositoryBodega {
    crearBodega(bodega: BodegaInputDTO, client?: DBClient): Promise<Bodega>;
    obtenerBodegaEmpresa(id_empresa: number, client?: DBClient): Promise<Bodega|null>;
    obtenerBodegaId(id_bodega: number, client?: DBClient): Promise<Bodega|null>;
    obtenerBodegaNombre(nombre:string, id_empresa:number, client?: DBClient): Promise<Bodega|null>;
    actualizarInformacionBodega(id_bodega: number, bodega: BodegaUpdateDTO, client?: DBClient): Promise<Bodega>;
}
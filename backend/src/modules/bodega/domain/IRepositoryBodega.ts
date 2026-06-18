import { DBClient } from "../../../core/database/DBClient";
import { Bodega } from "./Bodega";
import { BodegaInputDTO } from "./BodegaInputDTO";

export interface IRepositoryBodega{
    crearBodega(bodega: BodegaInputDTO, client?: DBClient): Promise<Bodega>;
}
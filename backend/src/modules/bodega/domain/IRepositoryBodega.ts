import { DBClient } from "@/core/database/DBClient";
import { Bodega } from "./Bodega";

export interface IRepositoryBodega{
    crearBodega(bodega: Bodega, client?: DBClient): Promise<Bodega>;
}
import { Router } from "express"
import { ControllersBodega } from "../controllers/ControllersBodega";
import { ServicesBodega } from "../../application/ServicesBodega";
import { PrismaRepositoryBodega } from "../repositories/PrismaRepositoryBodega";

const routerBodega = Router();

const repositoryBodega = new PrismaRepositoryBodega();
const serviceBodega = new ServicesBodega(repositoryBodega);
const controllersBodega = new ControllersBodega(serviceBodega);

routerBodega.post('/crear-bodega', controllersBodega.crearBodega);

export default routerBodega;
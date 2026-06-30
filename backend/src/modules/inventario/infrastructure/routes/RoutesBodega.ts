import { Router } from "express"
import { ControllersBodega } from "../controllers/ControllersBodega";
import { ServicesBodega } from "../../application/ServicesBodega";
import { PrismaRepositoryBodega } from "../repositories/PrismaRepositoryBodega";
import { ServicesEmpresa } from "../../../empresa/application/ServicesEmpresa";
import { PrismaRepositoryEmpresa } from "../../../empresa/infrastructure/repositories/PrismaRepositoryEmpresa";

const routerBodega = Router();

const repositoryBodega = new PrismaRepositoryBodega();
const repositoryEmpresa = new PrismaRepositoryEmpresa();

const serviceEmpresa = new ServicesEmpresa(repositoryEmpresa);
const serviceBodega = new ServicesBodega(repositoryBodega, serviceEmpresa);
const controllersBodega = new ControllersBodega(serviceBodega);

routerBodega.post('/crear-bodega', controllersBodega.crearBodega);

export default routerBodega;
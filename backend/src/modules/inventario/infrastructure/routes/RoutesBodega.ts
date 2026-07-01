import { Router } from "express"
import { ControllersBodega } from "../controllers/ControllersBodega";
import { ServicesBodega } from "../../application/ServicesBodega";
import { PrismaRepositoryBodega } from "../repositories/PrismaRepositoryBodega";
import { ServicesEmpresa } from "../../../empresa/application/ServicesEmpresa";
import { PrismaRepositoryEmpresa } from "../../../empresa/infrastructure/repositories/PrismaRepositoryEmpresa";
import authMiddleware from "../../../auth/infrastructure/middleware/AuthMiddleware";

const routerBodega = Router();

const repositoryBodega = new PrismaRepositoryBodega();
const repositoryEmpresa = new PrismaRepositoryEmpresa();

const serviceEmpresa = new ServicesEmpresa(repositoryEmpresa);
const serviceBodega = new ServicesBodega(repositoryBodega, serviceEmpresa);
const controllersBodega = new ControllersBodega(serviceBodega);

routerBodega.post('/crear-bodega', authMiddleware, controllersBodega.crearBodega);
routerBodega.get('/obtener-bodega-empresa', authMiddleware, controllersBodega.obtenerBodegaEmpresa);
routerBodega.put('/actualizar-bodega/:id_bodega', controllersBodega.actualizarBodega);

export default routerBodega;